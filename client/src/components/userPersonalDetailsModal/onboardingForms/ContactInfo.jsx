import React, { useRef } from 'react'
import { CInput } from '../../../uiComponents'
import { Form, Formik } from 'formik'
import { Button, Divider, Row, Col } from 'antd'
import { useSelector } from 'react-redux'
import { contactSchema } from "../Validations"


const ContactInfo = ({ loading, data = {}, onSelect }) => {

    const form = useRef(null)

    const { submitLoading } = useSelector(({ users }) => ({
        submitLoading: users?.updateUserPersonalDetailsLoading,
    }))

    const initialValues = {
        currentAddress: '',
        permanentAddress: '',
        personalMobile: '',
        personalEmail: '',
        emergencyContactName: '',
        emergencyContactNo: '',
        relationship: '',
        alternateContactNo: '',
    }

    const submit = (values) => {
        onSelect({ formData: { ...values } }, 1);
    };

    return (
        <div className='form-wrapper'>
            <Formik
                innerRef={form}
                validationSchema={contactSchema}
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
                                    <CInput
                                        label={<> Current Address <span className='required-field'>*</span> </>}
                                        placeHolder="Enter Your Current Address"
                                        name="currentAddress"
                                        value={values.currentAddress}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.currentAddress : touched.currentAddress && errors.currentAddress}
                                    />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label={<> Permanent Address <span className='required-field'>*</span> </>}
                                        placeHolder="Enter Your Permenent Address"
                                        name="permanentAddress"
                                        value={values.permanentAddress}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.permanentAddress : touched.permanentAddress && errors.permanentAddress}
                                    />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label={<> Personal Mobile Number <span className='required-field'>*</span> </>}
                                        placeHolder="Enter Your Personal Mobile"
                                        name="personalMobile"
                                        value={values.personalMobile}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.personalMobile : touched.personalMobile && errors.personalMobile}
                                    />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label={<> Personal Email <span className='required-field'>*</span> </>}
                                        placeHolder="Enter Your Personal Email"
                                        name="personalEmail"
                                        value={values.personalEmail}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.personalEmail : touched.personalEmail && errors.personalEmail}
                                    />
                                </Col>
                            </Row>

                            <Divider size="middle" />

                            <Divider orientation="left">Emergency Contact Info</Divider>
                            <Row gutter={[16, 8]}>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label={<> Emergency Contact Name <span className='required-field'>*</span> </>}
                                        placeHolder="Enter Your Emergency Contact Name"
                                        name="emergencyContactName"
                                        value={values.emergencyContactName}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.emergencyContactName : touched.emergencyContactName && errors.emergencyContactName}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label={<> Emergency Contact No <span className='required-field'>*</span> </>}
                                        placeHolder="Enter Your Emergency Contact No"
                                        name="emergencyContactNo"
                                        value={values.emergencyContactNo}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.emergencyContactNo : touched.emergencyContactNo && errors.emergencyContactNo}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label={<> Emergency Contact Relation <span className='required-field'>*</span> </>}
                                        placeHolder="Enter Your Emergency Contact Relationship"
                                        name="relationship"
                                        value={values.relationship}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.relationship : touched.relationship && errors.relationship}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label="Alternate Contact No"
                                        placeHolder="Enter Your Alternate Contact No"
                                        name="alternateContactNo"
                                        value={values.alternateContactNo}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.alternateContactNo : touched.alternateContactNo && errors.alternateContactNo}
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

export default ContactInfo