import React from "react";
import {
    Modal, Form as AntForm, Button, Row, Col, Form
} from "antd";
import { Formik } from "formik";
import ReactQuill from "react-quill-new";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getEditValidationSchema } from "./validations.jsx";
import { editTask, getTaskDetails } from "../../../store/actions/Task.action.jsx";
import "react-quill/dist/quill.snow.css";
import "./EditModal.css";
import { CInput } from "../../../uiComponents/index.jsx";
import CSelect from "../../../uiComponents/cSelect/CSelect.jsx";
import { FileTextOutlined, TagsOutlined } from "@ant-design/icons";

const SectionLabel = ({ icon, children }) => (
    <div className="form-section-label">
        {icon}
        <span>{children}</span>
    </div>
);

// NOTE: CreateTaskModal ke "./Helper.jsx" se modules/formats/TASK_PRIORTIES/disablePreviousDates
// import karte the - us file ka exact path yahan pata nahi tha (alag folder mein hoga),
// isliye yahan same values inline define ki hain taake koi galat path guess na ho.
// Agar tumhare paas wo shared Helper.jsx hai to inko wahi se import karke replace kar dena.
const modules = {
    toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const formats = ["bold", "italic", "underline", "strike", "list", "bullet", "link"];

const TASK_PRIORTIES = [
    { key: "LOW", label: "Low" },
    { key: "MEDIUM", label: "Medium" },
    { key: "HIGH", label: "High" },
];

const disablePreviousDates = (current) => current && current < dayjs().startOf("day");

/**
 * task prop = "taskDetails" (GET_TASK_DETAIL se aata hai, shape raw Task
 * model se ALAG hai - taskTitle/id use hota hai, _id/title nahi).
 * Isliye edit success ke baad seedha field-merge nahi karte - getTaskDetails()
 * dobara call karte hain taake normalized shape wapas mil jaye.
 */
const EditTaskModal = ({ isOpenEditModal, setIsOpenEditModal, task }) => {
    const dispatch = useDispatch();

    const { editTaskLoading } = useSelector(({ task }) => ({
        editTaskLoading: task?.editTaskLoading,
    }));

    const isMemo = task?.type === "MEMO";

    const initialValues = {
        title: task?.taskTitle || task?.title || "",
        description: task?.description || "",
        priority: task?.priority || "",
        deadline: task?.deadline ? dayjs(task.deadline) : null,
    };

    const handleSubmit = (values) => {
        const taskId = task?.id || task?._id;

        const payload = {
            taskId,
            title: values.title,
            description: values.description,
            ...(!isMemo && { priority: values.priority }),
            ...(!isMemo && { deadline: values.deadline }),
        };

        dispatch(
            editTask(payload, () => {
                setIsOpenEditModal(false);
                dispatch(getTaskDetails(taskId));
            })
        );
    };

    return (
        <Modal
            open={isOpenEditModal}
            onCancel={() => setIsOpenEditModal(false)}
            footer={null}
            centered
            width={560}
            destroyOnClose
            className="edit-task-modal"
        >
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={getEditValidationSchema(isMemo)}
                onSubmit={handleSubmit}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    touched,
                    errors,
                    values,
                    submitCount
                }) => {
                    return (
                        <Form layout="vertical" onFinish={handleSubmit} className="create-task-form">
                            <div className="task-modal-header">
                                <h1 className="form-title">Edit Task</h1>
                                <p className="form-subtitle">Update the task details below</p>
                            </div>

                            <div className="task-modal-body">
                                <SectionLabel icon={<FileTextOutlined />}>Task Details</SectionLabel>

                                <CInput
                                    label="Title"
                                    name="title"
                                    placeHolder="Enter task title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                    error={submitCount ? errors.title : touched.title && errors.title}
                                />

                                <AntForm.Item
                                    label={<span className="form-label">Description</span>}
                                    validateStatus={touched.description && errors.description ? "error" : ""}
                                    help={touched.description && errors.description ? (
                                        <span className="error-message">{errors.description}</span>
                                    ) : null}
                                >
                                    <ReactQuill
                                        name="description"
                                        value={values.description}
                                        onChange={(value) => setFieldValue("description", value)}
                                        onBlur={() => handleBlur({ target: { name: "description" } })}
                                        modules={modules}
                                        formats={formats}
                                        theme="snow"
                                        className="quill-editor"
                                    />
                                </AntForm.Item>

                                {!isMemo && (
                                    <>
                                        <SectionLabel icon={<TagsOutlined />}>Classification</SectionLabel>

                                        <Row gutter={16}>
                                            <Col xs={24} md={12}>
                                                <CSelect
                                                    label="Priority"
                                                    name="priority"
                                                    placeholder="Select priority"
                                                    onChange={(value) => setFieldValue("priority", value)}
                                                    onBlur={handleBlur}
                                                    value={values.priority || undefined}
                                                    data={TASK_PRIORTIES}
                                                    error={submitCount ? errors.priority : touched.priority && errors.priority}
                                                />
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <CInput
                                                    label="Deadline"
                                                    name="deadline"
                                                    type='date'
                                                    placeHolder="Select Deadline"
                                                    onBlur={handleBlur}
                                                    value={values.deadline}
                                                    onChange={(val) => setFieldValue('deadline', val)}
                                                    format={"DD-MMM-YYYY"}
                                                    disableDate={disablePreviousDates}
                                                    error={submitCount ? errors.deadline : touched.deadline && errors.deadline}
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </div>

                            <div className="task-modal-footer">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="submit-button"
                                    block
                                    loading={editTaskLoading}
                                    disabled={editTaskLoading}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </Modal>
    );
};

export default EditTaskModal;