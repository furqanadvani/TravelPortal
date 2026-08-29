import React, { useEffect, useRef } from 'react';
import { Form, Formik } from 'formik';
import './Index.css'
import { Button, Col, Divider, Row } from 'antd';
import CSelect from '../../uiComponents/cSelect/CSelect';
import { useDispatch, useSelector } from 'react-redux';
import { accessSchema } from "../userPersonalDetailsModal/Validations";
import { getRoles } from '../../store/actions/ManageRoles.action';

const AccessRequestForm = ({ loading, data, onSelect }) => {
    const form = useRef(null);
    const dispatch = useDispatch()

    const { submitLoading, roles } = useSelector(({ users, manageRoles }) => ({
        submitLoading: users?.updateAccessRightsFormLoading,
        roles: manageRoles.roles,
    }));

    const initialValues = {
        role: "",
        microsoft365: "",
        teams: "",
        powerBI: "",
        msOfficeApps: "",
        portals: "",
        webOops: "",
        intelliconContegris: "",
        databaseAccess: "",
        gitRepository: "",
        jira: "",
        postman: "",
        awsIamRoles: "",
        serverAccess: "",
        datadog: "",
        ...data,
    };

    useEffect(() => {
        dispatch(getRoles())
    }, [])

    const submit = (values) => {
        onSelect({ formData: values }, 1);
    };

    return (
        <div className="form-wrapper">
            <Formik
                innerRef={form}
                validationSchema={accessSchema}
                validateOnChange
                validateOnBlur
                initialValues={initialValues}
                onSubmit={submit}
            >
                {({ errors, touched, handleChange, values, submitCount, setFieldValue }) => (
                    <Form>
                        <Divider orientation="left">Select Role</Divider>
                        <Row gutter={[16, 8]}>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <CSelect
                                    label="Select Role"
                                    placeholder="Select role"
                                    name="role"
                                    value={values.role || undefined}
                                    onChange={(value) => setFieldValue("role", value)}
                                    disabled={loading}
                                    data={roles}
                                    error={submitCount ? errors.role : touched.role && errors.role}
                                />
                            </Col>
                        </Row>
                        <Divider orientation="left">Standard System Access</Divider>
                        <Row gutter={[16, 8]}>

                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Microsoft 365"
                                    placeholder="Do you need Microsoft 365"
                                    name="microsoft365"
                                    value={values.microsoft365 || undefined}
                                    onChange={(value) => setFieldValue("microsoft365", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.microsoft365 : touched.microsoft365 && errors.microsoft365}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Teams"
                                    placeholder="Do you need Teams"
                                    name="teams"
                                    value={values.teams || undefined}
                                    onChange={(value) => setFieldValue("teams", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.teams : touched.teams && errors.teams}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Power BI"
                                    placeholder="Do you need Power BI"
                                    name="powerBI"
                                    value={values.powerBI || undefined}
                                    onChange={(value) => setFieldValue("powerBI", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.powerBI : touched.powerBI && errors.powerBI}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="MS Office (365 Apps)"
                                    placeholder="Do you need MS Office (365 Apps)"
                                    name="msOfficeApps"
                                    value={values.msOfficeApps || undefined}
                                    onChange={(value) => setFieldValue("msOfficeApps", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.msOfficeApps : touched.msOfficeApps && errors.msOfficeApps}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Admin / Employer portal"
                                    placeholder="Do you need Admin / Employer portal"
                                    name="portals"
                                    value={values.portals || undefined}
                                    onChange={(value) => setFieldValue("portals", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.portals : touched.portals && errors.portals}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Web Oops portal"
                                    placeholder="Do you need Web Oops portal"
                                    name="webOops"
                                    value={values.webOops || undefined}
                                    onChange={(value) => setFieldValue("webOops", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.webOops : touched.webOops && errors.webOops}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Intellicon/ Contegris"
                                    placeholder="Do you need Intellicon/ Contegris"
                                    name="intelliconContegris"
                                    value={values.intelliconContegris || undefined}
                                    onChange={(value) => setFieldValue("intelliconContegris", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.intelliconContegris : touched.intelliconContegris && errors.intelliconContegris}
                                />
                            </Col>
                        </Row>
                        <Divider orientation="left">Technical Access</Divider>
                        <Row gutter={[16, 8]}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Database Access (SQL/ MONGO/ Staging/ Prod"
                                    placeholder="Do you need Database Access"
                                    name="databaseAccess"
                                    value={values.databaseAccess || undefined}
                                    onChange={(value) => setFieldValue("databaseAccess", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.databaseAccess : touched.databaseAccess && errors.databaseAccess}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Git Repository"
                                    placeholder="Do you need Git Repository"
                                    name="gitRepository"
                                    value={values.gitRepository || undefined}
                                    onChange={(value) => setFieldValue("gitRepository", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.gitRepository : touched.gitRepository && errors.gitRepository}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Jira"
                                    placeholder="Do you need Jira"
                                    name="jira"
                                    value={values.jira || undefined}
                                    onChange={(value) => setFieldValue("jira", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.jira : touched.jira && errors.jira}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Postman"
                                    placeholder="Do you need Postman"
                                    name="postman"
                                    value={values.postman || undefined}
                                    onChange={(value) => setFieldValue("postman", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.postman : touched.postman && errors.postman}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="AWS (IAM Roles)"
                                    placeholder="Do you need AWS (IAM Roles)"
                                    name="awsIamRoles"
                                    value={values.awsIamRoles || undefined}
                                    onChange={(value) => setFieldValue("awsIamRoles", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.awsIamRoles : touched.awsIamRoles && errors.awsIamRoles}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Server Access (IP/ Role)"
                                    placeholder="Do you Server Access (IP/ Role)"
                                    name="serverAccess"
                                    value={values.serverAccess || undefined}
                                    onChange={(value) => setFieldValue("serverAccess", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.serverAccess : touched.serverAccess && errors.serverAccess}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <CSelect
                                    label="Datadog"
                                    placeholder="Do you need Datadog"
                                    name="datadog"
                                    value={values.datadog || undefined}
                                    onChange={(value) => setFieldValue("datadog", value)}
                                    disabled={loading}
                                    data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                                    error={submitCount ? errors.datadog : touched.datadog && errors.datadog}
                                />
                            </Col>
                        </Row>

                        <Button
                            className="user-details-form-btn"
                            type="primary"
                            htmlType="submit"
                            loading={loading || submitLoading}
                            disabled={loading || submitLoading}
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AccessRequestForm;
