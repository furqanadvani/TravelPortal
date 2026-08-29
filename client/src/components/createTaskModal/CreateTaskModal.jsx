import React, { useEffect } from "react";
import {
    Modal, Form as AntForm, Button,
    Row, Col, Form
} from "antd";
import { Formik } from "formik";
import ReactQuill from "react-quill-new";
import { useDispatch, useSelector } from "react-redux";
import { validationSchema } from "./Validations.jsx";
import { createTask, getAllTask } from "../../store/actions/Task.action.jsx";
import { getUserStats } from "../../store/actions/Users.action.jsx";
import { clearHod, clearHodEmployees, getHodEmployees, getHods } from "../../store/actions/Departments.action.jsx";
import "react-quill/dist/quill.snow.css";
import "./CreateTaskModal.css";
import { readableText } from "../../utils/Methods";
import { CInput } from "../../uiComponents/index.jsx";
import CSelect from "../../uiComponents/cSelect/CSelect.jsx";
import { DEPARTMENT_TYPES, disablePreviousDates, formats, modules, TASK_PRIORTIES, TASK_TYPES } from "./Helper.jsx";
import { useACL } from '../../utils/acl/UseACL'
import { ACL_ACCESS_LIST, ACL_MODULES } from "../../utils/acl/Index.jsx";
import { FileTextOutlined, UsergroupAddOutlined, TagsOutlined } from "@ant-design/icons";

const SectionLabel = ({ icon, children }) => (
    <div className="form-section-label">
        {icon}
        <span>{children}</span>
    </div>
);

const CreateTaskModal = ({ isOpenAddModal, setIsOpenAddModal }) => {
    const dispatch = useDispatch();
    const { can } = useACL()

    const canCreateCrossDepartTask = can(ACL_MODULES.TASK, ACL_ACCESS_LIST.CREATE_CROSS_DEPARTMENT_TASK)

    const { createTaskLoading, userRole, userId, hodEmployees, hods, getHodsLoading, getHodEmployeesLoading } = useSelector(({ task, auth, departments }) => ({
        createTaskLoading: task?.createTaskLoading,
        userRole: auth?.user?.role,
        userId: auth?.user?._id,
        hodEmployees: departments.hodEmployees,
        hods: departments?.hods,
        getHodsLoading: departments.getHodsLoading,
        getHodEmployeesLoading: departments.getHodEmployeesLoading
    }));

    const hodsList = userRole === "HOD" ? hods?.filter(item => item?._id !== userId) : hods

    const initialValues = {
        title: "",
        description: "",
        type: "",
        assignToDepartment: "",
        assignee: "",
        priority: "",
        deadline: null,
    };

    const handleDepartmentChange = (value, setFieldValue) => {
        setFieldValue("assignToDepartment", value);
        setFieldValue("assignee", undefined);
        dispatch(clearHodEmployees());
        dispatch(clearHod());

        if (value === DEPARTMENT_TYPES.OWN_DEPARTMENT) {
            dispatch(getHodEmployees());
        }
        if (value === DEPARTMENT_TYPES.OTHER_DEPARTMENT && canCreateCrossDepartTask) {
            dispatch(getHods());
        }
    };

    useEffect(() => {
        return () => {
            dispatch(clearHodEmployees());
            dispatch(clearHod());
        };
    }, [])

    const callback = () => {
        setIsOpenAddModal(false);
        dispatch(getAllTask({ role: userRole }));
        dispatch(getUserStats());
    }

    const handleSubmit = (values) => {
        const payload = {
            title: values.title,
            type: values.type,
            description: values.description,
            assignedBy: userId,
            assignTo: values.assignee,
            ...(values.type !== "MEMO" && { priority: values.priority }),
            ...(values.type !== "MEMO" && { deadline: values.deadline }),
        };
        dispatch(createTask(payload, callback));
    };

    const departmentOptions = [
        { key: DEPARTMENT_TYPES.OWN_DEPARTMENT, label: "Own Department" },
        ...(canCreateCrossDepartTask
            ? [{ key: DEPARTMENT_TYPES.OTHER_DEPARTMENT, label: "Other Departments" }]
            : [])
    ];

    const buildAssigneeOptions = (assignToDepartment) => {
        if (assignToDepartment === DEPARTMENT_TYPES.OWN_DEPARTMENT) {
            // Own-department employees come back as { id, username, role }
            return (hodEmployees || []).map((u) => ({
                key: u.id,
                label: u.id === userId
                    ? "Assign To Me"
                    : `${u.username} • ${readableText(u.role)}`,
            }));
        }
        // Other-department HODs come back as { _id, firstName, lastName, department }
        return (hodsList || []).map((h) => ({
            key: h._id,
            label: `${h.firstName} ${h.lastName} • ${readableText(h.department[0]?.title)}`,
        }));
    };

    return (
        <Modal
            open={isOpenAddModal}
            onCancel={() => setIsOpenAddModal(false)}
            footer={null}
            centered
            width={560}
            destroyOnClose
            className="create-task-modal"
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
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
                    const assigneeError = submitCount ? errors.assignee : touched.assignee && errors.assignee;
                    const assigneeOptions = buildAssigneeOptions(values.assignToDepartment);

                    return (
                        <Form layout="vertical" onFinish={handleSubmit} className="create-task-form">
                            <div className="task-modal-header">
                                <h1 className="form-title">Create New Task</h1>
                                <p className="form-subtitle">Fill in the details to assign a new task</p>
                            </div>

                            <div className="task-modal-body">
                                {/* Section: Task Details */}
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

                                {/* Section: Assignment */}
                                <SectionLabel icon={<UsergroupAddOutlined />}>Assignment</SectionLabel>

                                <CSelect
                                    label="Select Department"
                                    placeholder="Select Department"
                                    name="assignToDepartment"
                                    value={values.assignToDepartment || undefined}
                                    data={departmentOptions}
                                    onChange={(value) => handleDepartmentChange(value, setFieldValue)}
                                    error={
                                        submitCount
                                            ? errors.assignToDepartment
                                            : touched.assignToDepartment && errors.assignToDepartment
                                    }
                                />

                                <CSelect
                                    label={values.assignToDepartment === DEPARTMENT_TYPES.OWN_DEPARTMENT
                                        ? "Select Employee"
                                        : "Assign To Head"}
                                    name="assignee"
                                    placeholder={!values.assignToDepartment ? "Select department first" : "Select assignee"}
                                    disabled={!values.assignToDepartment}
                                    loading={getHodsLoading || getHodEmployeesLoading}
                                    value={values.assignee || undefined}
                                    data={assigneeOptions}
                                    onChange={(val) => setFieldValue("assignee", val)}
                                    onBlur={handleBlur}
                                    error={assigneeError}
                                />

                                {/* Section: Classification */}
                                <SectionLabel icon={<TagsOutlined />}>Classification</SectionLabel>

                                <CSelect
                                    label="Type"
                                    name="type"
                                    placeholder="Select Type"
                                    onChange={(value) => {
                                        setFieldValue("type", value)
                                        if (value === "MEMO") {
                                            setFieldValue("priority", "");
                                            setFieldValue("deadline", null);
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    value={values.type || undefined}
                                    data={TASK_TYPES}
                                    error={submitCount ? errors.type : touched.type && errors.type}
                                />

                                {values.type !== "MEMO" && (
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
                                )}
                            </div>

                            <div className="task-modal-footer">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="submit-button"
                                    block
                                    loading={createTaskLoading}
                                    disabled={createTaskLoading}
                                >
                                    Create Task
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </Modal>
    );
};

export default CreateTaskModal;