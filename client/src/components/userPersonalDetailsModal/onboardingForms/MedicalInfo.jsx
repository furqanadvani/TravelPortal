import React, { useRef } from 'react'
import { CInput } from '../../../uiComponents'
import { Form, Formik } from 'formik'
import { Button, Divider, Row, Col } from 'antd'
import CSelect from '../../../uiComponents/cSelect/CSelect'
import { useSelector } from 'react-redux'
import { medicalInfoSchema } from "../Validations"
import { ConditionalRendering } from '../../../utils/Methods'


const MedicalInfo = ({ loading, data = {}, onSelect }) => {

    const form = useRef(null)

    const { submitLoading } = useSelector(({ users }) => ({
        submitLoading: users?.updateUserPersonalDetailsLoading,
    }))

    const initialValues = {
        medicalCondition: '',
        specifyCondition: '',
        allergies: '',
        specifyAllergies: '',
    }

    const submit = (values) => {
        onSelect({ formData: { ...values } }, 2);
    };

    return (
        <div className='form-wrapper'>
            <Formik
                innerRef={form}
                validationSchema={medicalInfoSchema}
                validateOnChange
                validateOnBlur
                initialValues={{
                    ...initialValues,
                    ...data,
                }}
                onSubmit={submit}
            >
                {(formikProps) => {
                    const {
                        errors,
                        touched,
                        handleSubmit,
                        values,
                        submitCount,
                        handleChange,
                        setFieldValue,
                        handleBlur,
                    } = formikProps;
                    return (

                        <Form>
                            <Row gutter={[16, 8]}>

                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CSelect
                                        label="Medical Condition"
                                        placeholder="Enter Your Medical Condition"
                                        name="medicalCondition"
                                        value={values.medicalCondition || undefined}
                                        onChange={(value) => {
                                            setFieldValue("medicalCondition", value)
                                            if (value !== "YES") {
                                                setFieldValue("specifyCondition", "");
                                            }
                                        }}
                                        disabled={loading}
                                        data={[
                                            { key: "YES", label: "Yes" },
                                            { key: "NO", label: "No" },
                                        ]}
                                        error={submitCount ? errors.medicalCondition : touched.medicalCondition && errors.medicalCondition}
                                    />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CSelect
                                        label="Any Allergies"
                                        placeholder="Enter Your Allergies"
                                        name="allergies"
                                        value={values.allergies || undefined}
                                        onChange={(value) => {
                                            setFieldValue("allergies", value)
                                            if (value !== "YES") {
                                                setFieldValue("specifyAllergies", "");
                                            }
                                        }}
                                        disabled={loading}
                                        data={[
                                            { key: "YES", label: "Yes" },
                                            { key: "NO", label: "No" },
                                        ]}
                                        error={submitCount ? errors.allergies : touched.allergies && errors.allergies}
                                    />
                                </Col>

                                <ConditionalRendering
                                    condition={values?.medicalCondition === "YES"}
                                    children={
                                        <Col xs={24} sm={24} md={12} lg={12}>
                                            <CInput
                                                label="Specify Your Medical Condition"
                                                placeHolder="Specify Your Medical Condition"
                                                name="specifyCondition"
                                                value={values.specifyCondition}
                                                onChange={handleChange}
                                                disabled={loading || submitLoading}
                                                error={submitCount ? errors.specifyCondition : touched.specifyCondition && errors.specifyCondition}
                                            />
                                        </Col>
                                    }
                                />
                                <ConditionalRendering
                                    condition={values?.allergies === "YES"}
                                    children={
                                        <Col xs={24} sm={24} md={12} lg={12}>
                                            <CInput
                                                label="Specify Your Allergies"
                                                placeHolder="Specify your Allergies"
                                                name="specifyAllergies"
                                                value={values.specifyAllergies}
                                                onChange={handleChange}
                                                disabled={loading || submitLoading}
                                                error={submitCount ? errors.specifyAllergies : touched.specifyAllergies && errors.specifyAllergies}
                                            />
                                        </Col>
                                    }
                                />
                            </Row>

                            <Divider size="middle" />

                            <Button
                                className="user-details-form-btn"
                                type="primary"
                                htmlType="submit"
                                onClick={handleSubmit}
                                loading={loading || submitLoading}
                                disabled={loading || submitLoading}
                            >
                                Submit
                            </Button>
                        </Form>
                    )
                }}
            </Formik >
        </div>
    )
}

export default MedicalInfo