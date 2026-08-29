import { Card, Row, Col, Checkbox, Button, Typography, Divider } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ACL_OPTIONS, togglePermission } from "../../utils/acl/Index";
import { ContainerWrapper } from "../../container";
import "./AddRole.css";
import { RoleSchema } from "./AddRoleValidations";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addEditRole } from "../../store/actions/ManageRoles.action";
import { readableText } from "../../utils/Methods";

const { Title, Text } = Typography;

const AddRole = () => {

    const reduxState = useSelector(({ manageRoles, auth }) => ({
        loading: manageRoles?.roleActionLoading,
        userPermissions: auth?.user?.permissions || [],
        user: auth.user
    }));

    const { loading, userPermissions, user } = reduxState

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { state } = useLocation();
    const role = state?.role

    const initialValues = {
        name: role?.name || "",
        description: role?.description || "",
        permissions: role?.permissions || []
    };

    const canAccess = (moduleKey, action) => {

        if (user?.isSuperAdmin || user.role === "SUPER_ADMIN") {
            return true;
        }

        const perm = userPermissions.find(p => p.key === moduleKey);
        return perm?.access.includes(action);
    };

    const callback = () => {
        navigate(-1)
    }

    const handleSubmit = (vals) => {
        const payload = {
            ...vals,
            ...(role?._id?.length && { roleId: role?._id })
        }
        dispatch(addEditRole(payload, callback))
    }

    const hasViewPermission = (permissions, moduleKey) => {
        return permissions
            .find(p => p.key === moduleKey)
            ?.access.includes("VIEW");
    };


    return (
        <ContainerWrapper pageHeaderProps={{ title: role ? "Edit Role" : "Add Role", renderBack: true }}>
            <Formik
                initialValues={initialValues}
                validationSchema={RoleSchema}
                onSubmit={(values) => {
                    handleSubmit(values)
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <Card className="margin-bottom-20" bordered={false}>
                            <Title level={5}>Role Information</Title>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Field name="name">
                                        {({ field }) => (
                                            <input
                                                {...field}
                                                disabled={loading}
                                                placeholder="Role Name"
                                                className="form-field"
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="name" component="div" style={{ color: "red", marginTop: 4 }} />
                                </Col>
                                <Col span={24}>
                                    <Field name="description">
                                        {({ field }) => (
                                            <textarea
                                                {...field}
                                                disabled={loading}
                                                placeholder="Role Description"
                                                rows={3}
                                                className="form-field"
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="description" component="div" style={{ color: "red", marginTop: 4 }} />
                                </Col>
                            </Row>
                        </Card>

                        <Title level={5}>Module Permissions</Title>
                        <Divider />
                        <Row gutter={[16, 16]}>
                            {ACL_OPTIONS
                                .filter(module => canAccess(module.key, "VIEW")) // show module only if user can VIEW
                                .map(module => {
                                    const modulePerm = values.permissions.find(p => p.key === module.key);
                                    const hasView = modulePerm?.access.includes("VIEW");

                                    return (
                                        <Col xs={24} sm={24} md={24} key={module.key}>
                                            <Card
                                                className="module-card"
                                                size="small"
                                                title={<Text strong>{module.key.replaceAll("_", " ")}</Text>}
                                                bordered={false}
                                                hoverable
                                            >
                                                <Row gutter={[12, 12]}>
                                                    {module.access.map(action => (
                                                        <Col key={action} xs={12} sm={8} md={6}>
                                                            <Checkbox
                                                                disabled={
                                                                    !canAccess(module.key, action) ||
                                                                    (action !== "VIEW" && !hasView)
                                                                }
                                                                checked={modulePerm?.access.includes(action) || false}
                                                                onChange={() => {
                                                                    if (!canAccess(module.key, action)) return;
                                                                    let updated;
                                                                    if (action === "VIEW") {
                                                                        if (hasView) {
                                                                            updated = values.permissions.filter(p => p.key !== module.key);
                                                                        } else {
                                                                            updated = togglePermission(values.permissions, module.key, action);
                                                                        }
                                                                    } else {
                                                                        updated = togglePermission(values.permissions, module.key, action);
                                                                    }
                                                                    setFieldValue("permissions", updated);
                                                                }}
                                                            >
                                                                {readableText(action.replaceAll("_", " "))}
                                                            </Checkbox>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card>
                                        </Col>
                                    );
                                })}
                        </Row>
                        <div className="permission-buttons">
                            <ErrorMessage name="permissions" component="div" style={{ color: "red", marginBottom: 8 }} />

                            <Button type="primary" htmlType="submit" shape="round" size="large" loading={loading} disabled={loading}>
                                {role ? "Update Role" : "Create Role"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </ContainerWrapper>
    );
};

export default AddRole;
