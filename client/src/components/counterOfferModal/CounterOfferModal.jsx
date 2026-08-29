import React, { useRef } from 'react'
import { Form, Formik } from 'formik'
import { Button, Col, Flex, Modal, Popconfirm, Row } from 'antd'
import 'react-quill/dist/quill.snow.css'
import { CInput } from '../../uiComponents'
import "./CounterOfferModal.css"
import CTextarea from '../../uiComponents/cTextarea/CTextarea'
import { counterOfferSchema } from './Validations'
import { useDispatch } from 'react-redux'
import { counterOffer, getTaskDetails, respondCounterOffer } from '../../store/actions/Task.action'
import { ConditionalRendering } from '../../utils/Methods'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

const CounterOfferModal = ({ isOpen, close, taskId, from = '', selectedData }) => {

    const dispatch = useDispatch()

    const initialValues = {
        revisedSalary: selectedData?.data?.revisedSalary || "",
        newDesignation: selectedData?.data?.newDesignation || "",
        additionalBenefits: selectedData?.data?.additionalBenefits || "",
    }

    const callBack = () => {
        dispatch(getTaskDetails(taskId))
        close(false)
    }

    const handleSubmit = (values) => {
        let payload = {
            taskId: taskId,
            revisedSalary: values.revisedSalary,
            newDesignation: values.newDesignation,
            additionalBenefits: values.additionalBenefits,
        }
        dispatch(counterOffer(payload, callBack))
    }

    const forwardHandlerCallback = () => {
        close(false)
    }


    const handleResponseCounter = (val = '') => {
        const payload = {
            taskId: selectedData?.taskId?._id,
            action: val
        }
        dispatch(respondCounterOffer(payload, forwardHandlerCallback))
    }



    return (
        <Modal
            open={isOpen}
            footer={null}
            centered
            width={600}
            destroyOnClose
            onCancel={() => close(false)}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={counterOfferSchema}
                onSubmit={handleSubmit}
            >
                {({
                    handleSubmit,
                    handleChange,
                    setFieldValue,
                    values,
                    touched,
                    errors,
                    submitCount,
                    handleBlur
                }) => (
                    <Form>
                        <div className='form-wrapper'>
                            <div className="form-header">
                                <h1 className="form-title">Counter Offer Modal</h1>
                            </div>
                            <Row gutter={[16, 8]}>
                                <Col xs={24}>
                                    <CInput
                                        label="Revised Salary"
                                        placeHolder="Enter Revised Salary"
                                        name="revisedSalary"
                                        value={values.revisedSalary}
                                        onChange={handleChange}
                                        disabled={selectedData}
                                        type='number'
                                        error={submitCount ? errors.revisedSalary : touched.revisedSalary && errors.revisedSalary}
                                    />
                                </Col>
                                <Col xs={24}>
                                    <CInput
                                        label="New Designation"
                                        placeHolder="Enter Designation"
                                        name="newDesignation"
                                        disabled={selectedData}
                                        value={values.newDesignation}
                                        onChange={handleChange}
                                        error={submitCount ? errors.newDesignation : touched.newDesignation && errors.newDesignation}
                                    />
                                </Col>
                                <Col xs={24}>
                                    <CTextarea
                                        label="Additional Benefits"
                                        name="additionalBenefits"
                                        placeHolder="Enter Additional Benefits"
                                        value={values.additionalBenefits}
                                        onChange={handleChange}
                                        disabled={selectedData}
                                        onBlur={handleBlur}
                                        rows={2}
                                    // error={submitCount ? errors.resignationStartDate : touched.resignationStartDate && errors.resignationStartDate}
                                    />
                                </Col>
                            </Row>

                            <ConditionalRendering
                                condition={from !== 'notification'}
                                children={<Button block type="primary" htmlType="submit" className="submit-button margin-top_20" >
                                    Submit
                                </Button>} />
                            <ConditionalRendering
                                condition={from === 'notification'}
                                children={
                                    <Flex className='accept-reject-btns' gap="small" style={{ width: "100%" }}>
                                        <Popconfirm
                                            title="Reject Task"
                                            description="Are you sure you want to reject this offer?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => handleResponseCounter("REJECTED")}
                                        >
                                            <Button
                                                danger
                                                type="primary"
                                                className='reject-btn'
                                                icon={<CloseOutlined />}
                                            >
                                                Reject
                                            </Button>
                                        </Popconfirm>

                                        <Popconfirm
                                            title="Accept Task"
                                            description="Are you sure you want to accept this offer?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => handleResponseCounter("ACCEPTED")}
                                        >
                                            <Button
                                                type="primary"
                                                className='approve-btn'
                                                icon={<CheckOutlined />}
                                            >
                                                Accept
                                            </Button>
                                        </Popconfirm>
                                    </Flex>
                                }
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default CounterOfferModal
