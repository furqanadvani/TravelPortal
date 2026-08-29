import React from "react";
import { Card, Row, Col, Button, Typography, Divider, } from "antd";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ContainerWrapper from "../../../container/containerWrapper/ContainerWrapper";
import { createAppPolicy, updateAppPolicy, } from "../../../store/actions/AppPolicy.action";
import CSelect from "../../../uiComponents/cSelect/CSelect";
import { CInput } from "../../../uiComponents";
import "../AppPolicy.css";
import { ConditionalRendering } from "../../../utils/Methods";
import { PlusOutlined } from "@ant-design/icons";
const { Title } = Typography;

const validationSchema = Yup.object({
    policyName: Yup.string().required("Policy Name is required"),
    resources: Yup.array().min(1, "At least 1 resource is required"),
});

const AddEditAppPolicy = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const { createLoading, updateLoading, } = useSelector(({ appPolicy }) => ({
        createLoading: appPolicy?.createPolicyLoading,
        updateLoading: appPolicy?.updatePolicyLoading,
    }));

    const isLoading = createLoading || updateLoading;

    const policy = state?.appPolicy;
    const isEdit = !!policy;

    const initialValues = {
        policyName: policy?.policyName || "",
        description: policy?.description || "",
        status: policy?.status || "active",
        resources: policy?.resources?.length ? policy.resources : [],
    };

    const pageHeaderProps = {
        title: isEdit ? "Edit App Policy" : "Add App Policy",
        renderBack: !isLoading && true,
    };

    const callback = () => {
        navigate("/app-policies");
    };

    const handleSubmit = (values) => {
        const cleanedResources = values.resources.map(({ _id, ...rest }) => rest);

        const payload = {
            policyName: values.policyName,
            description: values.description,
            ...(isEdit && { status: values?.status }),
            resources: cleanedResources,
        };

        if (isEdit) {
            dispatch(updateAppPolicy(policy._id, payload, callback));
        } else {
            dispatch(createAppPolicy(payload, callback));
        }
    };

    return (
        <ContainerWrapper pageHeaderProps={pageHeaderProps}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, setFieldValue, errors, touched, submitCount }) => (
                    <Form>

                        <Card className="module-card" bordered={false}>
                            <Title level={5}>Policy Information</Title>

                            <Row gutter={[16, 16]}>

                                <Col xs={24} md={12}>
                                    <CInput
                                        label="Policy Name *"
                                        placeHolder="Enter Policy Name"
                                        name="policyName"
                                        value={values.policyName}
                                        onChange={handleChange}
                                        error={
                                            submitCount
                                                ? errors.policyName
                                                : touched.policyName && errors.policyName
                                        }
                                    />
                                </Col>

                                <Col xs={24} md={12}>
                                    <ConditionalRendering
                                        condition={isEdit}
                                        children={<CSelect
                                            name="status"
                                            label="Status"
                                            disabled={isLoading}
                                            value={values.status}
                                            data={[
                                                { label: "Active", value: "active" },
                                                { label: "Inactive", value: "inactive" },
                                            ]}
                                            onChange={(val) => setFieldValue("status", val)}
                                        />} />
                                </Col>

                                <Col xs={24}>
                                    <CInput
                                        label="Description"
                                        placeHolder="Enter Description"
                                        name="description"
                                        disabled={isLoading}
                                        value={values.description}
                                        onChange={handleChange}
                                    />
                                </Col>

                            </Row>
                        </Card>

                        <Divider />

                        <div className="resource-header-main">
                            <Title level={5} className="resource-title">
                                Resources ({values.resources?.length || 0})
                            </Title>

                            <Button
                                shape="round"
                                type="primary"
                                disabled={isLoading}
                                icon={<PlusOutlined />}
                                onClick={() =>
                                    setFieldValue("resources", [
                                        ...values.resources,
                                        {
                                            type: "app",
                                            name: "",
                                            packageName: "",
                                            domain: "",
                                            category: "productive",
                                            status: "active",
                                        },
                                    ])
                                }
                            >
                                Add Resource
                            </Button>
                        </div>

                        <FieldArray name="resources">
                            {(arrayHelpers) => (
                                <>
                                    {values.resources?.length === 0 && (
                                        <div className="resource-empty">
                                            No resources added yet. Click <b>Add Resource</b>.
                                        </div>
                                    )}

                                    {values.resources?.map((item, index) => (
                                        <Card
                                            key={index}
                                            className="resource-card margin-bottom-20"
                                            size="small"
                                        >

                                            {/* HEADER */}
                                            <div className="resource-header">
                                                <div className="resource-meta">
                                                    <span className={`resource-badge ${item.type}`}>
                                                        {item.type?.toUpperCase()}
                                                    </span>

                                                    <span className="resource-index">
                                                        #{index + 1}
                                                    </span>
                                                </div>

                                                <Button
                                                    danger
                                                    size="small"
                                                    disabled={isLoading}
                                                    className="resource-remove-btn"
                                                    onClick={() => arrayHelpers.remove(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>

                                            {/* GRID */}
                                            <div className="resource-grid">

                                                <div className="resource-field">
                                                    <CSelect
                                                        name={`resources[${index}].type`}
                                                        label="Type"
                                                        disabled={isLoading}
                                                        value={item.type}
                                                        data={[
                                                            { label: "App", value: "app" },
                                                            { label: "Website", value: "website" },
                                                        ]}
                                                        onChange={(val) =>
                                                            setFieldValue(`resources[${index}].type`, val)
                                                        }
                                                    />
                                                </div>

                                                <div className="resource-field">
                                                    <CInput
                                                        label="Name"
                                                        placeHolder="Enter Name"
                                                        disabled={isLoading}
                                                        name={`resources[${index}].name`}
                                                        value={item.name}
                                                        onChange={(e) =>
                                                            setFieldValue(`resources[${index}].name`, e.target.value)
                                                        }
                                                    />
                                                </div>

                                                <div className="resource-field">
                                                    <CInput
                                                        label={item.type === "app" ? "Package Name" : "Domain"}
                                                        placeHolder="Enter Value"
                                                        disabled={isLoading}
                                                        name={
                                                            item.type === "app"
                                                                ? `resources[${index}].packageName`
                                                                : `resources[${index}].domain`
                                                        }
                                                        value={
                                                            item.type === "app"
                                                                ? item.packageName
                                                                : item.domain
                                                        }
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                item.type === "app"
                                                                    ? `resources[${index}].packageName`
                                                                    : `resources[${index}].domain`,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="resource-field">
                                                    <CSelect
                                                        name={`resources[${index}].category`}
                                                        label="Category"
                                                        value={item.category}
                                                        disabled={isLoading}
                                                        data={[
                                                            { label: "Productive", value: "productive" },
                                                            { label: "Unproductive", value: "unproductive" },
                                                            { label: "Neutral", value: "neutral" },
                                                        ]}
                                                        onChange={(val) =>
                                                            setFieldValue(`resources[${index}].category`, val)
                                                        }
                                                    />
                                                </div>

                                            </div>
                                        </Card>
                                    ))}
                                </>
                            )}
                        </FieldArray>

                        <div className="permission-buttons">
                            <Button
                                type="primary"
                                htmlType="submit"
                                shape="round"
                                size="large"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isEdit ? "Update Policy" : "Create Policy"}
                            </Button>
                        </div>

                    </Form>
                )}
            </Formik>
        </ContainerWrapper>
    );
};

export default AddEditAppPolicy;