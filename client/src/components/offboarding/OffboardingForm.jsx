import React, { useRef } from 'react'
import { Form, Formik } from 'formik'
import { Button, Col, Modal, Row } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { CInput } from '../../uiComponents'
import { resignationSchema } from './Validations'
import "./OffboardingForm.css"
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import CUpload from '../../uiComponents/cUpload/CUpload'
import { creteResignationRequest } from '../../store/actions/Task.action'

const OffboardingForm = ({ open, close, selected }) => {

    const dispatch = useDispatch()

    const initialValues = {
        resignationReason: "",
        resignationStartDate: "",
        resignationDetails: "",
        resignationFile: [],
    }

    const callBack = () => {
        close(false)
    }

    const { loading } = useSelector(({ task }) => ({
        loading: task?.resignationRequestLoading,
    }));

    const handleSubmit = (values) => {
        const formData = new FormData();

        formData.append("resignationReason", values.resignationReason);
        formData.append("resignationStartDate", values.resignationStartDate);
        formData.append("resignationDetails", values.resignationDetails);
        if (selected?.length) {
            formData.append("userId", selected)
        }
        if (values.resignationFile && values.resignationFile.length > 0) {
            formData.append("resignationFile", values.resignationFile[0].originFileObj || values.resignationFile[0]);
        }

        // console.log(values)
        dispatch(creteResignationRequest(formData, callBack))
    }

    return (
        <Modal
            open={open}
            footer={null}
            centered
            width={600}
            destroyOnClose
            onCancel={() => close(false)}
            className='offboarding-form'
        >
            <Formik
                initialValues={initialValues}
                validationSchema={resignationSchema}
                onSubmit={handleSubmit}
            >
                {({
                    handleSubmit,
                    handleChange,
                    setFieldValue,
                    values,
                    touched,
                    errors,
                    submitCount
                }) => (
                    <Form>
                        <div className='form-wrapper'>
                            <div className="form-header">
                                <h1 className="form-title">Resignation Letter</h1>
                            </div>
                            <Row gutter={[16, 8]}>
                                <Col xs={24}>
                                    <CInput
                                        label="Reason for Resignation *"
                                        placeHolder="Enter Your Reason"
                                        name="resignationReason"
                                        value={values.resignationReason}
                                        onChange={handleChange}
                                        error={submitCount ? errors.resignationReason : touched.resignationReason && errors.resignationReason}
                                        disabled={loading}
                                    />
                                </Col>
                                <Col xs={24}>
                                    <CInput
                                        label="Resignation Start Date *"
                                        name="resignationStartDate"
                                        placeHolder="Enter Resignation Start Date"
                                        type='date'
                                        value={values.resignationStartDate}
                                        onChange={(val) => setFieldValue('resignationStartDate', val)}
                                        format={"DD-MMM-YYYY"}
                                        disableDate={(currentDate) => { return currentDate && currentDate < dayjs().startOf("day"); }}
                                        error={submitCount ? errors.resignationStartDate : touched.resignationStartDate && errors.resignationStartDate}
                                        disabled={loading}
                                    />
                                </Col>
                                <Col xs={24}>
                                    <label className='form-label'>Additional Details / Notes</label>
                                    <ReactQuill
                                        className='offboarding-editor'
                                        theme="snow"
                                        value={values.resignationDetails}
                                        onChange={(content) => setFieldValue('resignationDetails', content)}
                                    />
                                    {(submitCount > 0) && errors.resignationDetails && (
                                        <div className="form-error">{errors.resignationDetails}</div>
                                    )}
                                </Col>
                                <Col xs={24}>
                                    <CUpload
                                        label="Upload File"
                                        name="resignationFile"
                                        value={values.resignationFile}
                                        onChange={(fileList) => setFieldValue("resignationFile", fileList)}
                                        maxFiles={1}
                                        error={submitCount ? errors.resignationFile : touched.resignationFile && errors.resignationFile}

                                    />
                                </Col>
                            </Row>
                            <Button block type="primary" htmlType="submit" className="submit-button margin-top_20" loading={loading} disabled={loading} >
                                Submit
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default OffboardingForm
