import React from "react";
import { Modal, Form as AntForm, Button } from "antd";
import { Formik } from "formik";
import { CInput } from "../../uiComponents";
import CSelect from "../../uiComponents/cSelect/CSelect";
import { validationSchema } from "./Validations";
import { useDispatch, useSelector } from "react-redux";
import { AddMembers, getMembers } from "../../store/actions/Members.action";
import "./AddMember.css";

const AddMember = ({ isAddMember, setIsAddMember }) => {
    const dispatch = useDispatch();

    const { loading, getDeparts } = useSelector(({ departments, members }) => ({
        loading: members?.addMembersLoading,
        getDeparts: departments?.getDepartmentsData || [],
    }));

    const departmentOptions = getDeparts.map((val) => ({
        label: val.title,
        key: val._id,
    }));

    const [form] = AntForm.useForm();

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        departments: [],
        isKamelPayMicrosoftUser: null,
    };

    const handleSubmit = (values) => {
        const payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            isKamelPayMicrosoftUser: values.isKamelPayMicrosoftUser,
            departments: values.departments,
        };


        dispatch(
            AddMembers(payload, () => {dispatch(getMembers()); setIsAddMember(false); })
        );

    };

    return (
        <Modal
            open={isAddMember}
            onCancel={() => !loading && setIsAddMember(false)}
            footer={null}
            width={436}
            destroyOnClose
        >
            <div className="form-wrapper">
                <div className="form-header">
                    <h1 className="form-title">Add Member</h1>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        values,
                        touched,
                        errors,
                        submitCount,
                    }) => (
                        <AntForm layout="vertical" onFinish={handleSubmit} form={form}>
                            <CInput
                                label="First Name"
                                name="firstName"
                                placeHolder="Enter your first name"
                                value={values.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                                error={submitCount ? errors.firstName : touched.firstName && errors.firstName}
                            />
                            <CInput
                                label="Last Name"
                                name="lastName"
                                placeHolder="Enter your last name"
                                value={values.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                                error={submitCount ? errors.lastName : touched.lastName && errors.lastName}
                            />
                            <CInput
                                label="Work Email"
                                name="email"
                                placeHolder="john@kamelpay.com"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                                error={submitCount ? errors.email : touched.email && errors.email}
                            />

                            <CSelect
                                name="isKamelPayMicrosoftUser"
                                label="Already a (KP) Microsoft User?"
                                placeholder="Is Microsoft user?"
                                value={values.isKamelPayMicrosoftUser ?? undefined}
                                disabled={loading}
                                onChange={(value) => setFieldValue("isKamelPayMicrosoftUser", value)}
                                onBlur={handleBlur}
                                data={[
                                    { key: true, label: "Yes" },
                                    { key: false, label: "No" },
                                ]}
                                error={
                                    submitCount
                                        ? errors.isKamelPayMicrosoftUser
                                        : touched.isKamelPayMicrosoftUser && errors.isKamelPayMicrosoftUser
                                }
                            />


                            <CSelect
                                name="departments"
                                label="Departments"
                                placeholder={"Select department"}
                                value={values.departments}
                                disabled={loading}
                                onChange={(value) => { setFieldValue("departments", [value]) }}
                                onBlur={handleBlur}
                                data={departmentOptions}
                                error={submitCount ? errors.departments : touched.departments && errors.departments}
                            />

                            <div className="form-actions">
                                <Button
                                    type="default"
                                    block
                                    size="large"
                                    htmlType="submit"
                                    loading={loading}
                                    disabled={loading}
                                    className="submit-button"
                                >
                                    Add Member
                                </Button>
                            </div>
                        </AntForm>
                    )}
                </Formik>
            </div>
        </Modal>
    );
};

export default AddMember;
