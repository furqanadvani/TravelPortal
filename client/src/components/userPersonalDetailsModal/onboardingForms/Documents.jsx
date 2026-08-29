import React, { useRef } from 'react'
import { Form, Formik } from 'formik'
import { Button, Divider, Row, Col } from 'antd'
import { useSelector } from 'react-redux'
import { documentsSchema } from "../Validations"
import CUpload from '../../../uiComponents/cUpload/CUpload'
import { ConditionalRendering } from '../../../utils/Methods'


const Documents = ({ loading, data = {}, onSelect }) => {

    const form = useRef(null)

    const { submitLoading } = useSelector(({ users }) => ({
        submitLoading: users?.updateUserPersonalDetailsLoading,
    }))

    const initialValues = {
        cnic: [],
        emiratesId: [],
        passportSizePhoto: [],
        educationalCertificates: [],
        visaCopy: [],
        experienceLetter: [],
        payslip: [],
        policeCharacter: [],
        passportCopy: [],
    }

    const submit = (values) => {
        onSelect({ formData: { ...values } }, 4);
    };

    return (
        <div className='form-wrapper'>
            <Formik
                innerRef={form}
                validationSchema={documentsSchema}
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
                                <ConditionalRendering
                                    condition={values?.workLocation === "KARACHI"}
                                    children={
                                        <>
                                            <Col xs={24} sm={24} md={12} lg={12}>
                                                <CUpload
                                                    label="CNIC (Front/ Back)"
                                                    name="cnic"
                                                    value={values.cnic}
                                                    onChange={(fileList) => setFieldValue("cnic", fileList)}
                                                    maxFiles={2}
                                                    error={submitCount ? errors.cnic : touched.cnic && errors.cnic}
                                                />
                                            </Col>

                                            <Col xs={24} sm={24} md={12} lg={12}>
                                                <CUpload
                                                    label="Police Character Certificate"
                                                    name="policeCharacter"
                                                    value={values.policeCharacter}
                                                    onChange={(fileList) => setFieldValue("policeCharacter", fileList)}
                                                    maxFiles={1}
                                                    error={submitCount ? errors.policeCharacter : touched.policeCharacter && errors.policeCharacter}
                                                />
                                            </Col>
                                        </>
                                    }
                                />
                                <ConditionalRendering
                                    condition={values?.workLocation === "DUBAI"}
                                    children={
                                        <>
                                            <Col xs={24} sm={24} md={12} lg={12}>
                                                <CUpload
                                                    label="Emirates ID (Front/ Back)"
                                                    name="emiratesId"
                                                    value={values.emiratesId}
                                                    onChange={(fileList) => setFieldValue("emiratesId", fileList)}
                                                    maxFiles={2}
                                                    error={submitCount ? errors.emiratesId : touched.emiratesId && errors.emiratesId}
                                                />
                                            </Col>

                                            <Col xs={24} sm={24} md={12} lg={12}>
                                                <CUpload
                                                    label="Visa Copy"
                                                    name="visaCopy"
                                                    value={values.visaCopy}
                                                    onChange={(fileList) => setFieldValue("visaCopy", fileList)}
                                                    maxFiles={1}
                                                    error={submitCount ? errors.visaCopy : touched.visaCopy && errors.visaCopy}
                                                />
                                            </Col>

                                            <Col xs={24} sm={24} md={12} lg={12}>
                                                <CUpload
                                                    label="Passport Copy"
                                                    name="passportCopy"
                                                    value={values.passportCopy}
                                                    onChange={(fileList) => setFieldValue("passportCopy", fileList)}
                                                    maxFiles={1}
                                                    error={submitCount ? errors.passportCopy : touched.passportCopy && errors.passportCopy}
                                                />
                                            </Col>
                                        </>
                                    }
                                />

                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CUpload
                                        label="Passport Size Photo"
                                        name="passportSizePhoto"
                                        value={values.passportSizePhoto}
                                        onChange={(fileList) => setFieldValue("passportSizePhoto", fileList)}
                                        maxFiles={1}
                                        error={submitCount ? errors.passportSizePhoto : touched.passportSizePhoto && errors.passportSizePhoto}
                                    />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CUpload
                                        label="Educational Certificates"
                                        name="educationalCertificates"
                                        value={values.educationalCertificates}
                                        onChange={(fileList) => setFieldValue("educationalCertificates", fileList)}
                                        maxFiles={5}
                                        error={submitCount ? errors.educationalCertificates : touched.educationalCertificates && errors.educationalCertificates}
                                    />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CUpload
                                        label="Experience Letter"
                                        name="experienceLetter"
                                        value={values.experienceLetter}
                                        onChange={(fileList) => setFieldValue("experienceLetter", fileList)}
                                        maxFiles={1}
                                        error={submitCount ? errors.experienceLetter : touched.experienceLetter && errors.experienceLetter}
                                    />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CUpload
                                        label="Payslip"
                                        name="payslip"
                                        value={values.payslip}
                                        onChange={(fileList) => setFieldValue("payslip", fileList)}
                                        maxFiles={1}
                                        error={submitCount ? errors.payslip : touched.payslip && errors.payslip}
                                    />
                                </Col>
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

export default Documents