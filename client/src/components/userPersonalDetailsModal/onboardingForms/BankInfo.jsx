import React, { useRef } from 'react'
import { CInput } from '../../../uiComponents'
import { Form, Formik } from 'formik'
import { Button, Divider, Row, Col } from 'antd'
import { useSelector } from 'react-redux'
import { bankInfoSchema } from "../Validations"

const BankInfo = ({ loading, data = {}, onSelect }) => {

    const form = useRef(null)

    const { submitLoading } = useSelector(({ users }) => ({
        submitLoading: users?.updateUserPersonalDetailsLoading,
    }))

    const initialValues = {
        bankName: '',
        bankBranch: '',
        iban: '',
        accountNumber: '',
        accountHolder: '',
    }

    const submit = (values) => {
        onSelect({ formData: { ...values } }, 3);
    };

    return (
        <div className='form-wrapper'>
            <Formik
                innerRef={form}
                validateOnChange
                validateOnBlur
                validationSchema={bankInfoSchema}
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
                                        label="Bank Name"
                                        placeHolder="Enter Your Bank Name"
                                        name="bankName"
                                        value={values.bankName}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.bankName : touched.bankName && errors.bankName}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label="Branch"
                                        placeHolder="Enter Your Branch"
                                        name="bankBranch"
                                        value={values.bankBranch}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.bankBranch : touched.bankBranch && errors.bankBranch}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label="Account Number"
                                        placeHolder="Enter Your Account Number"
                                        name="accountNumber"
                                        value={values.accountNumber}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.accountNumber : touched.accountNumber && errors.accountNumber}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label="IBAN"
                                        placeHolder="Enter Your IBAN"
                                        name="iban"
                                        value={values.iban}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.iban : touched.iban && errors.iban}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <CInput
                                        label="Account Holder Name"
                                        placeHolder="Enter Your Account Holder Name"
                                        name="accountHolder"
                                        value={values.accountHolder}
                                        onChange={handleChange}
                                        disabled={loading || submitLoading}
                                        error={submitCount ? errors.accountHolder : touched.accountHolder && errors.accountHolder}
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

export default BankInfo