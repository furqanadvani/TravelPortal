import React from "react";
import { Button, Col, Modal, Row } from "antd";
import { Formik, Form } from "formik";
import CTextarea from "../../uiComponents/cTextarea/CTextarea";
import { buildExitInterviewSchema } from "./Validations";

const ExitInterview = ({ open, close }) => {
    const exitQuestions = [
        { name: "q1", label: "Why are you leaving?", validationKey: "required|min:10" },
        { name: "q2", label: "Was salary an issue?", validationKey: "required|min:10" },
        { name: "q3", label: "Do you feel you were fairly compensated for the position you held?", validationKey: "required|min:10" },
        { name: "q4", label: "Did you like/enjoy your job?", validationKey: "required|min:10" },
        { name: "q5", label: "Was your job what you expected it to be? If not, how did it differ?", validationKey: "required|min:10" },
        { name: "q6", label: "Do you feel you were placed in a position compatible with your skills? If not, explain.", validationKey: "required|min:10" },
        { name: "q7", label: "Do you feel that there was the possibility for advancement in your position?", validationKey: "required|min:10" },
        { name: "q8", label: "Do you think you should have been offered more training/development within the position you held?", validationKey: "required|min:10" },
        { name: "q9", label: "What was the greatest challenge you faced in your position?", validationKey: "required|min:10" },
        { name: "q10", label: "What function(s) of your position did you enjoy the most? Why?", validationKey: "required|min:10" },
        { name: "q11", label: "What function(s) of your position did you enjoy the least? Why?", validationKey: "required|min:10" },
        { name: "q12", label: "Did you feel a sense of security in your position?", validationKey: "required|min:10" },
        { name: "q13", label: "How did you find the morale within your department?", validationKey: "required|min:10" },
        { name: "q14", label: "Was there anything the company could have done to improve morale?" },
        { name: "q15", label: "What was your supervisor like to work for?", validationKey: "required|min:10" },
        { name: "q16", label: "Were the working conditions suitable?", validationKey: "required|min:10" },
        { name: "q17", label: "Was the benefits package satisfactory to you?", },
        { name: "q18", label: "Did you feel you were well informed regarding the company’s policies and procedures" },
        { name: "q19", label: "Is there anything we could have done differently that may have affected your decision to leave?" },
        { name: "q20", label: "Would you re-consider employment with this company?" },
        { name: "q21", label: "Additional comments." }
    ];

    const initialValues = exitQuestions.reduce((acc, q) => {
        acc[q.name] = "";
        return acc;
    }, {});

    const handleSubmit = (values) => {
    };

    return (
        <Modal open={open} onCancel={() => close(false)} footer={null} width={600} destroyOnClose>
            <div className="form-wrapper">
                <div className="form-header">
                    <h1 className="form-title">Exit Interview</h1>
                </div>

                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={buildExitInterviewSchema(exitQuestions)}
                >
                    {({ handleChange, handleBlur, values, submitCount, touched, errors }) => (
                        <Form>
                            <Row gutter={[16, 16]}>
                                {exitQuestions.map((q, index) => (
                                    <Col xs={24} key={q.name}>
                                        <CTextarea
                                            label={`${index + 1}. ${q.label}`}
                                            name={q.name}
                                            placeHolder="Enter your answer"
                                            value={values[q.name]}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            rows={2}
                                            error={submitCount > 0 ? errors[q.name] : touched[q.name] && errors[q.name]}
                                        />
                                    </Col>
                                ))}
                            </Row>

                            <Button type="primary" htmlType="submit" className="submit-button" block>
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
};

export default ExitInterview;
