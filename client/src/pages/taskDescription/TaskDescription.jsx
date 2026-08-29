import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Upload, Input, message, Divider, Tag, Dropdown, Space, Collapse, Popconfirm } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillFileExcel } from 'react-icons/ai';
import Loader from '../../components/loader/Loader';
import { getTaskDetails, submitForReview, setStatus, forwardOnboardingTask, forwardOffboardingTask } from '../../store/actions/Task.action';
import { ConditionalRendering, readableText, renderDate, TASK_PRIORITY_COLORS, TASK_STATUS_COLORS, TASK_TYPE_COLORS, TOPICS } from '../../utils/Methods';
import { AssignTaskModal } from '../../components';
import { handleUpload, handleRemoveFile, generateTaskPDF, renderPrimaryDetails, renderEmploymentDetails, renderDocs, renderRoleAndAccess, offBoardingData, counterOfferData } from './Helper';
import './TaskDescription.css';
import TaskComments from '../../components/taskComments/TaskComments';
import { fetchNotifications } from '../../store/actions/Notifications.action';
import EmploymentDetails from '../../components/userPersonalDetailsModal/onboardingForms/EmploymentDetails';
import { useACL } from '../../utils/acl/UseACL';
import { ACL_ACCESS_LIST, ACL_MODULES } from '../../utils/acl/Index';
import UserAccessRequestIndex from '../../components/accessAndAssetsForm/Index';
import { OFFBOARDING_TASK_STEPS, ONBOARDING_TASK_STEPS } from '../../utils/Constants';
import CounterOfferModal from '../../components/counterOfferModal/CounterOfferModal';
import EditTaskModal from './edit/EditModal';


const TaskDetails = () => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const { taskId } = useParams()
  const navigate = useNavigate();
  const { can } = useACL()

  const { taskDetails, getTaskDetailsLoading, userRole, userId, userName, statusLoading, submitForReviewLoading, latestStatus, employmentDetailsloading, onboardingForwandTaskLoading, offboardingForwandTaskLoading } = useSelector(({ task, auth }) => ({
    taskDetails: task?.getTaskDetails,
    getTaskDetailsLoading: task?.getTaskDetailsLoading,
    userRole: auth?.user?.role,
    userId: auth?.user?._id,
    userName: auth?.user?.username,
    statusLoading: task?.getStatusLoading,
    submitForReviewLoading: task?.submitForReviewLoading,
    latestStatus: task?.updatedStatus,
    employmentDetailsloading: auth?.getProfileLoading,
    onboardingForwandTaskLoading: task?.onboardingForwandTaskLoading,
    offboardingForwandTaskLoading: task?.offboardingForwandTaskLoading
  }));


  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [link, setLink] = useState('');
  const [isOpenAssignModal, setIsOpenAssignModal] = useState(false);
  const [isOpenEmploymentDetailsForm, setIsOpenEmploymentDetailsForm] = useState(false)
  const [isOpenAccessForm, setIsOpenAccessForm] = useState(false)
  const [isOpenCounterOfferModal, setIsOpenCounterOfferModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)

  const canAllowToProcess = can(ACL_MODULES.TASK, ACL_ACCESS_LIST.ONBOARDING_TASK_ASSIGNEE)
  const canAllowToProcessOffboarding = can(ACL_MODULES.TASK, ACL_ACCESS_LIST.OFF_BOARDING_TASK_ASSIGNEE)
  const canReAssignTask = can(ACL_MODULES.TASK, ACL_ACCESS_LIST.REASSIGN_TASK)
  const canEditTask = can(ACL_MODULES.TASK, ACL_ACCESS_LIST.EDIT_TASK)


  const canShowEditButton =
    taskDetails?.type !== TOPICS.USER_ONBOARDING &&
    taskDetails?.type !== TOPICS.USER_OFF_BOARDING && canEditTask ;

  const handleAssignTo = () => {
    if ([TOPICS.USER_ONBOARDING, TOPICS.USER_OFF_BOARDING].includes(taskDetails?.type)) {
      if (!taskDetails?.assignTo?.length) return '-';

      return taskDetails.assignTo
        .map(user =>
          user?.personalDetails?.firstName
            ? `${user.personalDetails.firstName} ${user.personalDetails.lastName || ''}`
            : `${user.firstName || ''} ${user.lastName || ''}`
        )
        .join(', ');
    }
    const assignedActions = taskDetails?.actions?.filter(a => a?.assignedTo) || [];
    const lastAssigned = assignedActions.at(-1)?.assignedTo || null;
    const isUserAssigned = assignedActions.some(a => a?.assignedTo?.id == userId);

    if (taskDetails?.type === 'MEMO') {
      return 'To Department'
    }

    if (canReAssignTask) {
      return (
        <>
          <span>{lastAssigned?.username ? lastAssigned?.username : 'Not assigned to you'}</span>
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => setIsOpenAssignModal(true)}
          >
            Reassign
          </Button>
        </>
      )
    }
    if (['EMPLOYEE'].includes(userRole)) {
      return (
        <>
          <span>{isUserAssigned ? 'Assigned You' : 'Not assigned to you'}</span>
        </>
      )
    }
    if (['SUPER_ADMIN', 'SUB_ADMIN', 'MANAGER'].includes(userRole)) {
      return (
        <>
          <span>{lastAssigned?.username ? lastAssigned?.username : 'Not assigned to you'}</span>
        </>
      )
    }
  }

  useEffect(() => {
    if (taskId) {
      dispatch(getTaskDetails(taskId));
    }
  }, [taskId]);

  const handleSubmitForReview = async () => {
    if (uploadedFiles.length === 0 && !link.trim()) {
      return message.error('Please upload at least one file or provide a link');
    }
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('taskId', taskId);
      uploadedFiles.forEach((file) => formData.append('files', file));
      if (link.trim()) formData.append('link', link.trim());
      await dispatch(submitForReview(formData));
      setUploadedFiles([]);
      setLink('');
      dispatch(getTaskDetails(taskId));
    } catch (error) {
      message.error('Failed to submit work for review');
    }
  };

  if (getTaskDetailsLoading) return <Loader />;

  const isHistoryView =
    taskDetails?.type === "MEMO" ||
    taskDetails?.assignTo?.some(a => a?._id !== userId);

  const items = [
    { key: "TODO", label: "ToDo" },
    { key: "PENDING", label: "Pending" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "REVIEW", label: "Review" },
    { key: "COMPLETED", label: "Completed" },
  ];

  const callBack = () => {
    if (userId) {
      dispatch(fetchNotifications({ userId }));
    }
  }

  const changeStatus = ({ key }) => {
    const payload = {
      taskId: taskDetails.id,
      status: key,
    };
    dispatch(setStatus(payload, callBack));
  };

  const getLabelByKey = (key) => {
    const found = items.find((item) => item.key === key);
    return found ? found.label : key;
  };

  const ONBOARDING_STEP_TITLES = {
    USER_PERSONAL_INFO_BY_HR: "Onboarding Form Link",
    USER_ROLE_AND_ACCESS_BY_HEAD: "Fill Role/ Assets/ Access Form",
    USER_CONFIG_BY_ADMIN: "Provide Appropriate Access to user",
  };

  const getCardTitle = (val) => {
    if (val.type !== TOPICS.USER_ONBOARDING) return "Description";
    return ONBOARDING_STEP_TITLES[val.step] || "-";
  };

  const ONBOARDING_STEP_CONTENT = {
    USER_PERSONAL_INFO_BY_HR: () => (
      <>
        <div className="onboarding-description">
          <div className="onboarding-link">
            <a href={taskDetails?.link || "#"} target="_blank" rel="noopener noreferrer">
              {taskDetails?.link?.length > 70 ? taskDetails?.link?.slice(0, 70) + "..." : taskDetails?.link}
            </a>
          </div>
          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(taskDetails?.link);
            }}>
            Copy
          </Button>
        </div>
        <div className="form-actions">
          <Button type="primary" block shape="round" onClick={() => setIsOpenEmploymentDetailsForm(true)} disabled={!!taskDetails?.employmentDetails}>
            <span className="btn-text">Add Employment Details</span>
          </Button>
        </div>
      </>
    ),
    USER_ROLE_AND_ACCESS_BY_HEAD: () => (
      <div className="access-assets-form">
        <Button type="primary" block shape="round" onClick={() => setIsOpenAccessForm(true)} disabled={!!taskDetails?.accessRightsAndAssets?.accessRights}>
          <span className="btn-text">Add Access Assets Details</span>
        </Button>
      </div>
    ),
    USER_CONFIG_BY_ADMIN: () => (
      <div className="user-system-config">

      </div>
    ),
    DEFAULT: () => <div>Step not configured yet</div>,
  };

  const renderOnboardingStepContent = (task) => {
    if (task.type !== TOPICS.USER_ONBOARDING) {
      return <div className="description-paragraph" dangerouslySetInnerHTML={{ __html: data?.description || "" }} />;
    }
    const stepRenderer = ONBOARDING_STEP_CONTENT[task.step] || ONBOARDING_STEP_CONTENT.DEFAULT;
    return stepRenderer();
  };

  const onboardingForwardHandler = (step) => {
    let nextStep = ''
    switch (step) {

      case ONBOARDING_TASK_STEPS.USER_PERSONAL_INFO_BY_HR:
        return nextStep = ONBOARDING_TASK_STEPS.USER_ROLE_AND_ACCESS_BY_HEAD

      case ONBOARDING_TASK_STEPS.USER_ROLE_AND_ACCESS_BY_HEAD:
        return nextStep = ONBOARDING_TASK_STEPS.USER_CONFIG_BY_ADMIN

      case ONBOARDING_TASK_STEPS.USER_CONFIG_BY_ADMIN:
        return nextStep = ONBOARDING_TASK_STEPS.SYSTEM_CONFIGED_FOR_USER

      default:
        return nextStep = ONBOARDING_TASK_STEPS.USER_PERSONAL_INFO_BY_HR
    }
  }

  const offboardingForwardHandler = (step) => {
    let nextStep = "";

    switch (step) {

      case OFFBOARDING_TASK_STEPS.DEPARTMENT_REVIEW:
        return nextStep = OFFBOARDING_TASK_STEPS.HR_REVIEW

      case OFFBOARDING_TASK_STEPS.HR_REVIEW:
        return nextStep = OFFBOARDING_TASK_STEPS.COUNTER_OFFER_SENT

      case OFFBOARDING_TASK_STEPS.COUNTER_OFFER_SENT:
        return nextStep = OFFBOARDING_TASK_STEPS.WAITING_USER_RESPONSE

      case OFFBOARDING_TASK_STEPS.WAITING_USER_RESPONSE:
        return nextStep = OFFBOARDING_TASK_STEPS.IT_ADMIN_REVIEW

      default:
        return OFFBOARDING_TASK_STEPS.DEPARTMENT;
    }
  };

  const forwardHandlerCallback = () => {
    dispatch(getTaskDetails(taskDetails?.id))
  }

  const forwardHandler = (id = '', nextStep = '') => {
    const payload = {
      taskId: id,
      nextStep: nextStep,
      refUserId: taskDetails?.referenceUser
    }
    dispatch(forwardOnboardingTask(payload, forwardHandlerCallback))
  }

  const handleForwardOffboarding = (id = '') => {
    const payload = {
      taskId: id,
      action: "approved"
    }
    dispatch(forwardOffboardingTask(payload, forwardHandlerCallback))
  }

  const handleRejectOffboarding = (id = '') => {
    const payload = {
      taskId: id,
      action: "rejected"
    }
    dispatch(forwardOffboardingTask(payload, forwardHandlerCallback))
  }

  const OFFBOARDING_STEP_CONTENT = {
    DEPARTMENT_REVIEW: () => (
      <></>
    ),
    HR_REVIEW: () => (
      <div className="access-assets-form">
        <Button type="primary" block shape="round" onClick={() => setIsOpenCounterOfferModal(true)} disabled={taskDetails?.counterOfferData?.counterOfferData?.amount}>
          <span className="btn-text">Make Counter Offer</span>
        </Button>
      </div>
    ),
    COUNTER_OFFER_SENT: () => (
      <div className="user-system-config">

      </div>
    ),
    WAITING_USER_RESPONSE: () => (
      <div className="user-system-config">

      </div>
    ),
    IT_ADMIN_REVIEW: () => (
      <div className="user-system-config">

      </div>
    ),
    DEFAULT: () => <div>Step not configured yet</div>,
  };

  const renderOffboardingStepContent = (task) => {
    if (task.type !== TOPICS.USER_OFF_BOARDING) {
      return <div className="description-paragraph" dangerouslySetInnerHTML={{ __html: data?.description || "" }} />;
    }
    const stepRenderer = OFFBOARDING_STEP_CONTENT[task.step] || OFFBOARDING_STEP_CONTENT.DEFAULT;
    return stepRenderer();
  };

  return (
    <div className="description-history-wrapper">

      <Card className="description-history-card">
        <div className="description-header">
          <div className="description-header-left">
            <div className="header-wrapper-icon">
              <button className="back-button" onClick={() => navigate('/task-history')}>
                <FaArrowLeftLong />
              </button>
            </div>
            <h1 className="form-title">{taskDetails?.taskTitle || 'Task Details'}</h1>
          </div>

          <div className="description-header-right">

            <ConditionalRendering
              condition={canShowEditButton}
              children={
                <Button
                  shape="round"
                  icon={<EditOutlined />}
                  onClick={() => setIsOpenEditModal(true)}
                >
                  <span className="btn-text">Edit</span>
                </Button>
              }
            />

            <ConditionalRendering
              condition={
                canAllowToProcessOffboarding &&
                taskDetails?.type === TOPICS.USER_OFF_BOARDING &&
                taskDetails?.step === "DEPARTMENT_REVIEW" &&
                taskDetails?.status === "PENDING"
              }
              children={
                <Popconfirm
                  title="Are you sure you want to reject this offboarding?"
                  onConfirm={() => handleRejectOffboarding(taskDetails?.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    disabled={offboardingForwandTaskLoading}
                    className="reject-btn"
                  >
                    Reject
                  </Button>
                </Popconfirm>
              }
            />
            <ConditionalRendering
              condition={
                canAllowToProcess &&
                taskDetails?.status === "PENDING" &&
                ["USER_PERSONAL_INFO_BY_HR", "USER_ROLE_AND_ACCESS_BY_HEAD", "USER_CONFIG_BY_ADMIN",].includes(taskDetails?.step)
              }
              children={
                <Button
                  loading={onboardingForwandTaskLoading}
                  type="primary"
                  shape="round"
                  onClick={() => {
                    const nextStep = onboardingForwardHandler(taskDetails?.step);
                    forwardHandler(taskDetails?.id, nextStep);
                  }
                  }
                >
                  <span className="btn-text">
                    {taskDetails?.step === "USER_PERSONAL_INFO_BY_HR"
                      ? "Pass To Head"
                      : taskDetails?.step === "USER_ROLE_AND_ACCESS_BY_HEAD"
                        ? "Pass to IT-Admin"
                        : taskDetails?.step === "USER_CONFIG_BY_ADMIN"
                          ? "User System Config"
                          : ""}
                  </span>
                </Button>
              }
            />
            <ConditionalRendering
              condition={
                canAllowToProcessOffboarding &&
                taskDetails?.type === TOPICS.USER_OFF_BOARDING &&
                taskDetails?.status === "PENDING" &&
                ["DEPARTMENT_REVIEW", "HR_REVIEW", "COUNTER_OFFER_SENT", "WAITING_USER_RESPONSE", "IT_ADMIN_REVIEW"].includes(taskDetails?.step)
              }
              children={
                <Button
                  disabled={offboardingForwandTaskLoading}
                  type="primary"
                  shape="round"
                  onClick={() => {
                    const nextStep = offboardingForwardHandler(taskDetails?.step);
                    handleForwardOffboarding(taskDetails?.id, nextStep);
                  }}
                >
                  <span className="btn-text">
                    {taskDetails?.step === "DEPARTMENT_REVIEW"
                      ? "Forward To HR"
                      : taskDetails?.step === "HR_REVIEW"
                        ? "Forward to IT-Admin"
                        : taskDetails?.step === "COUNTER_OFFER_SENT"
                          ? "Proceed Exit"
                          : taskDetails?.step === "WAITING_USER_RESPONSE"
                            ? "Send To IT"
                            : taskDetails?.step === "IT_ADMIN_REVIEW"
                              ? "Disable User"
                              : ""}
                  </span>
                </Button>
              }
            />
            <Button type="primary" shape="round" onClick={() => generateTaskPDF(taskDetails, userName, userRole)} icon={<AiFillFileExcel />}>
              <span className="btn-text">Export</span>
            </Button>
          </div>
        </div>

        <div className="description-content">
          <Card title={getCardTitle(taskDetails)} className="description-section">
            {taskDetails?.type === TOPICS.USER_ONBOARDING ? (
              renderOnboardingStepContent(taskDetails)
            ) : taskDetails?.type === TOPICS.USER_OFF_BOARDING ? (
              renderOffboardingStepContent(taskDetails)
            ) : (
              <div className="description-paragraph" dangerouslySetInnerHTML={{ __html: taskDetails?.description || "" }} />
            )}
          </Card>

          <Descriptions column={1} bordered>
            <Descriptions.Item label="Status">
              <ConditionalRendering
                condition={taskDetails?.type === TOPICS.USER_OFF_BOARDING || taskDetails?.type === TOPICS.USER_ONBOARDING}
                children={getLabelByKey(latestStatus?.task?.status || taskDetails?.status)}
                elseChildren={
                  <ConditionalRendering
                    condition={taskDetails?.type === 'MEMO'}
                    children={
                      <Space>
                        <span>Alert</span>
                        {TASK_PRIORITY_COLORS(taskDetails.priority)}
                      </Space>
                    }
                    elseChildren={
                      <Dropdown menu={{ items, onClick: changeStatus }} trigger={['click']}>
                        <Button loading={statusLoading}>
                          <Space color={TASK_STATUS_COLORS[taskDetails?.task?.status?.toLowerCase()] || 'default'}>
                            {getLabelByKey(latestStatus?.task?.status || taskDetails?.status)}
                            <DownOutlined />
                          </Space>
                        </Button>
                      </Dropdown>
                    }
                  />
                }
              />

            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Space>
                {TASK_PRIORITY_COLORS(taskDetails.priority)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Space>
                {taskDetails?.type && (() => {
                  const type = taskDetails.type.toUpperCase();
                  const colors = TASK_TYPE_COLORS[type] || {};

                  return (
                    <Tag
                      className="approval-tag"
                      style={{
                        color: colors.color,
                        backgroundColor: colors.background,
                      }}
                    >
                      {readableText(type)}
                    </Tag>
                  );
                })()}
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Assigned">{handleAssignTo()}</Descriptions.Item>
            <Descriptions.Item label="Assigned Department">{taskDetails.assignToDepart || '-'}</Descriptions.Item>

            <Descriptions.Item label="Deadline">
              {taskDetails?.deadline ? renderDate(taskDetails.deadline).toLocaleString() : 'No deadline'}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* onboarding 1st step data (onboarding data) */}
        {
          (taskDetails?.type === TOPICS.USER_ONBOARDING && taskDetails?.step === 'USER_PERSONAL_INFO_BY_HR' || taskDetails?.step === 'USER_ROLE_AND_ACCESS_BY_HEAD' || taskDetails?.step === 'USER_CONFIG_BY_ADMIN') && taskDetails?.userPersonalDetails ? (
            <div className="profile-sections" style={{ marginTop: 24 }}>
              <Collapse>
                <Panel header="Primary Information" key="1">
                  {renderPrimaryDetails(taskDetails?.userPersonalDetails)}
                </Panel>
                <Panel header="Documents" key="3">
                  {renderDocs(taskDetails?.userPersonalDetails)}
                </Panel>
              </Collapse>
            </div>
          ) : null
        }
        {
          (taskDetails?.type === TOPICS.USER_ONBOARDING) && taskDetails?.employmentDetails ? (
            <div className="profile-sections" style={{ marginTop: 24 }}>
              <Collapse>
                <Panel header="Employment Details" key="2">
                  {renderEmploymentDetails(taskDetails?.employmentDetails)}
                </Panel>
              </Collapse>
            </div>
          ) : null
        }
        {/* onboarding 2nd step (access and assets after form data after form filled)  */}
        {
          (taskDetails?.type === TOPICS.USER_ONBOARDING && taskDetails?.step === 'USER_ROLE_AND_ACCESS_BY_HEAD' && taskDetails?.accessRightsAndAssets?.accessRights) ? (
            <div className="profile-sections" style={{ marginTop: 24 }}>
              <Collapse>
                <Panel header="Access And Assets Details" key="1">
                  {renderRoleAndAccess(taskDetails?.accessRightsAndAssets)}
                </Panel>
              </Collapse>
            </div>
          ) : null
        }
        {/* 3rd step onboarding (taking access) */}
        {
          taskDetails?.type === TOPICS.USER_ONBOARDING && taskDetails?.step === 'USER_CONFIG_BY_ADMIN' && taskDetails?.accessRightsAndAssets?.accessRights ? (
            <div className="profile-sections" style={{ marginTop: 24 }}>
              <Collapse>
                <Panel header="Access And Assets Details" key="1">
                  {renderRoleAndAccess(taskDetails?.accessRightsAndAssets)}
                </Panel>
              </Collapse>
            </div>
          ) : null
        }


        {/* offboarding 1st step data (offboarding data) */}
        {
          taskDetails?.type === TOPICS.USER_OFF_BOARDING && (taskDetails?.step === 'DEPARTMENT_REVIEW' || taskDetails?.step === 'HR_REVIEW') && taskDetails?.offBoardingData ? (
            <div className="profile-sections" style={{ marginTop: 24 }}>
              <Collapse>
                <Panel header="Offboarding Request Data" key="1">
                  {offBoardingData(taskDetails?.offBoardingData)}
                </Panel>
                <Panel header="Primary Information" key="2">
                  {renderPrimaryDetails(taskDetails?.userPersonalDetails)}
                </Panel>
              </Collapse>
            </div>
          ) : null
        }
        {/* offboarding 2nd step data (counter Offer data) */}
        {
          taskDetails?.type === TOPICS.USER_OFF_BOARDING && taskDetails?.step === 'HR_REVIEW' && taskDetails?.counterOfferData?.counterOfferData?.amount ? (
            <div className="profile-sections" style={{ marginTop: 24 }}>
              <Collapse>
                <Panel header="Counter Offer Data" key="1">
                  {counterOfferData(taskDetails?.counterOfferData?.counterOfferData)}
                </Panel>
                <Panel header="Primary Information" key="2">
                  {renderPrimaryDetails(taskDetails?.userPersonalDetails)}
                </Panel>
              </Collapse>
            </div>
          ) : null
        }
        {/* offboarding 3rd step data (access and assets after form data after form filled and primary detailsS) */}
        {
          (taskDetails?.type === TOPICS.USER_OFF_BOARDING && taskDetails?.step === 'IT_ADMIN_REVIEW') ? (
            <div className="profile-sections" style={{ marginTop: 24 }}>
              <Collapse>
                <Panel header="Access And Assets Details" key="1">
                  {renderRoleAndAccess(taskDetails?.accessRightsAndAssets)}
                </Panel>
                <Panel header="Primary Information" key="2">
                  {renderPrimaryDetails(taskDetails?.userPersonalDetails)}
                </Panel>
              </Collapse>
            </div>
          ) : null
        }
        {
          !isHistoryView &&
          taskDetails?.type !== "USER_ONBOARDING" && taskDetails?.type !== "USER_OFF_BOARDING" && (
            <Card
              title={
                <div className='submit-header'>
                  <span>Upload File</span>
                  <Button
                    type="primary"
                    shape="round"
                    className="mt-2"
                    onClick={handleSubmitForReview}
                    loading={submitForReviewLoading}
                    disabled={submitForReviewLoading || (uploadedFiles.length === 0 && !link.trim())}
                  >
                    Upload File
                  </Button>
                </div>
              }
              className="history-section"
              style={{ marginTop: 50 }}
            >
              <Upload.Dragger
                multiple
                beforeUpload={(file) => {
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error(`${file.name} is larger than 5MB!`);
                    return Upload.LIST_IGNORE;
                  }
                  return false;
                }}
                showUploadList={false}
                onChange={(info) => handleUpload(info, setUploadedFiles)}
                className="upload-dragger"
              >
                <p className="upload-icon"><UploadOutlined /></p>
                <p className="upload-text">Click or drag files to upload (up to 5 MB)</p>
              </Upload.Dragger>

              {uploadedFiles.length > 0 && uploadedFiles.map((file, idx) => (
                <div key={idx} className="uploaded-file-item">
                  <span>{file.name || `File ${idx + 1}`}</span>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFile(idx, uploadedFiles, setUploadedFiles)}
                  />
                </div>
              ))}
              <Divider plain>OR</Divider>

              <Input
                addonBefore="Paste Link"
                placeholder="https://example.com/work-submission"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Card>
          )
        }

      </Card >

      <AssignTaskModal
        isOpenAssignModal={isOpenAssignModal}
        setIsOpenAssignModal={setIsOpenAssignModal}
        userId={userId}
        taskId={taskId}
      />

      <TaskComments />

      <EmploymentDetails
        selected={taskDetails?.employmentDetails}
        userId={taskDetails?.referenceUser}
        open={isOpenEmploymentDetailsForm}
        close={setIsOpenEmploymentDetailsForm}
        loading={employmentDetailsloading}
        taskId={taskDetails?.id}
      />

      <UserAccessRequestIndex
        isOpen={isOpenAccessForm}
        setIsOpen={setIsOpenAccessForm}
        userId={taskDetails?.referenceUser}
      />

      <CounterOfferModal
        isOpen={isOpenCounterOfferModal}
        close={setIsOpenCounterOfferModal}
        taskId={taskDetails?.id}
      />

      <EditTaskModal
        isOpenEditModal={isOpenEditModal}
        setIsOpenEditModal={setIsOpenEditModal}
        task={taskDetails}
      />
    </div >
  );
};

export default TaskDetails;