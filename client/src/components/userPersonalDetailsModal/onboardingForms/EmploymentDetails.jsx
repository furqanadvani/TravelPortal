import React, { useRef, useEffect } from 'react'
import { CInput } from '../../../uiComponents'
import { Form, Formik } from 'formik'
import { Button, Divider, Row, Col, Modal } from 'antd'
import CSelect from '../../../uiComponents/cSelect/CSelect'
import { useDispatch, useSelector } from 'react-redux'
import { employmentDetailsSchema } from "../Validations"
import { saveEmployementDetails } from '../../../store/actions/Users.action'
import dayjs from 'dayjs'
import { getTaskDetails } from '../../../store/actions/Task.action'

const EmploymentDetails = ({ userId, open, close, loading, selected, taskId }) => {
    const form = useRef(null)
    const dispatch = useDispatch()

    const { submitLoading } = useSelector(({ users }) => ({
        submitLoading: users?.saveEmployementDetailsLoading,
    }))

    // Extract values safely from `selected`
    const initialValues = {
        designation: selected?.designation || '',
        joiningDate: selected?.joiningDate ? dayjs(selected.joiningDate) : null,
        employmentType: selected?.employmentType || '',
        probation: selected?.probation || '',
    }

    const isAlreadySubmitted = Boolean(selected)


    const callBack = () => {
        dispatch(getTaskDetails(taskId))
        close(false)
    }

    const submit = (values) => {
        if (isAlreadySubmitted) return

        const payload = {
            refUserId: userId,
            ...values
        }

        dispatch(saveEmployementDetails(payload, callBack))
    }

    return (
        <Modal
            open={open}
            onCancel={() => close(false)}
            footer={null}
            centered
            width={700}
            destroyOnClose
        >
            <div className='form-wrapper'>
                <div className="form-header">
                    <h1 className="form-title">Employment Details</h1>
                </div>

                <Formik
                    innerRef={form}
                    validationSchema={employmentDetailsSchema}
                    validateOnChange
                    validateOnBlur
                    initialValues={initialValues}
                    onSubmit={submit}
                    enableReinitialize
                >
                    {formikProps => {
                        const {
                            errors,
                            touched,
                            handleSubmit,
                            values,
                            submitCount,
                            handleChange,
                            setFieldValue,
                        } = formikProps;

                        return (
                            <Form>
                                <Row gutter={[16, 8]}>
                                    <Col xs={24} sm={24} md={12} lg={12}>
                                        <CInput
                                            label="Designation/ Job title"
                                            placeHolder="Enter Your Designation"
                                            name="designation"
                                            value={values.designation}
                                            onChange={handleChange}
                                            disabled={loading || submitLoading || isAlreadySubmitted}
                                            error={submitCount ? errors.designation : touched.designation && errors.designation}
                                        />
                                    </Col>

                                    <Col xs={24} sm={24} md={12} lg={12}>
                                        <CInput
                                            label="Date of Joining"
                                            name="joiningDate"
                                            placeHolder="Date Of Joining"
                                            type="date"
                                            value={values.joiningDate}
                                            onChange={(val) => setFieldValue('joiningDate', val)}
                                            error={submitCount ? errors.joiningDate : touched.joiningDate && errors.joiningDate}
                                            format={"DD-MMM-YYYY"}
                                            max={new Date().toISOString().split("T")[0]}
                                            disabled={loading || submitLoading || isAlreadySubmitted}
                                            disableDate={(current) => {
                                                const minDate = new Date(2020, 0, 1);
                                                const maxDate = new Date();
                                                maxDate.setMonth(maxDate.getMonth() + 3);
                                                return current < minDate || current > maxDate;
                                            }}
                                        />
                                    </Col>

                                    <Col xs={24} sm={24} md={12} lg={12}>
                                        <CSelect
                                            label="Employment Type"
                                            placeholder="Select Employment Type"
                                            name="employmentType"
                                            value={values.employmentType || undefined}
                                            onChange={(value) => setFieldValue("employmentType", value)}
                                            disabled={loading || isAlreadySubmitted}
                                            data={[
                                                { key: "FULL_TIME", label: "Full Time" },
                                                { key: "PART_TIME", label: "Part Time" },
                                                { key: "CONTRACT", label: "Contract" },
                                            ]}
                                            error={submitCount ? errors.employmentType : touched.employmentType && errors.employmentType}
                                        />
                                    </Col>

                                    <Col xs={24} sm={24} md={12} lg={12}>
                                        <CSelect
                                            label="Probation"
                                            name="probation"
                                            placeholder="Select Probation Time"
                                            value={values.probation || undefined}
                                            onChange={(value) => setFieldValue("probation", value)}
                                            disabled={loading || isAlreadySubmitted}
                                            data={[
                                                { key: "3_MONTHS", label: "3 Months" },
                                                { key: "6_MONTHS", label: "6 Months" },
                                            ]}
                                            error={submitCount ? errors.probation : touched.probation && errors.probation}
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
                                    disabled={loading || submitLoading || isAlreadySubmitted}
                                >
                                    {isAlreadySubmitted ? "Already Submitted" : "Submit"}
                                </Button>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </Modal>
    )
}

export default EmploymentDetails
