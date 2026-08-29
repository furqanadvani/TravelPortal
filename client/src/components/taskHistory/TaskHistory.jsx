import React from "react";
import { Steps, Button } from "antd";
import {
  PlusCircleOutlined,
  FileDoneOutlined,
  UserSwitchOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  UploadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { UserAvatar } from "../../components/userAvatar/UserAvatar";
import { fileBlog } from "../../pages/taskDescription/Helper";

const { Step } = Steps;

const getActionVisual = (action) => {
  switch (action.type) {
    case "created":
      return { icon: <PlusCircleOutlined />, color: "#1890ff" };
    case "submited":
      return { icon: <FileDoneOutlined />, color: "#722ed1" };
    case "assigned":
      return { icon: <UserSwitchOutlined />, color: "#13c2c2" };
    case "review":
      return { icon: <CheckCircleOutlined />, color: "#52c41a" };
    case "update_status":
      return { icon: <SyncOutlined />, color: "#fa8c16" };
    default:
      if (action.action?.includes("Work Submitted"))
        return { icon: <FileDoneOutlined />, color: "#722ed1" };
      if (action.action?.includes("Uploaded"))
        return { icon: <UploadOutlined />, color: "#eb2f96" };
      return { icon: <ClockCircleOutlined />, color: "#8c8c8c" };
  }
};

const TaskHistory = ({ actions }) => {
  if (!actions || actions.length === 0) return null;

  const sortedActions = [...actions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const getActionTitle = (action) => {
    switch (action.type) {
      case "created":
        return "Task Created";
      case "submited":
        return "Details Submited";
      case "assigned":
        return `Assigned to ${action.assignedTo?.username || "Unknown"}`;
      case "review":
        return "Task Closed";
      case "update_status":
        return `Status Updated → ${action.status || "Unknown"}`;
      default:
        if (action.action?.includes("Work Submitted")) return "Work Submitted";
        if (action.action?.includes("Uploaded")) return "File Uploaded";
        if (!action.type) return action.action;
        return "Action Taken";
    }
  };

  const getActionDescription = (action) => {
    let desc = "";

    if (action.type === "created") {
      desc = `${action.user?.username || "Someone"} created this task`;
    } else if (action.type === "assigned") {
      desc = `${action.user?.username || "Someone"} assigned task to ${
        action.assignedTo?.username || "Unknown"
      }`;
    } else if (action.type === "update_status") {
      desc = `${action.user?.username || "Someone"} changed status to "${action.status}"`;
    } else if (action.action?.includes("Work Submitted")) {
      desc = `${action.user?.username || "Someone"} submitted work`;
    } else if (action.action?.includes("Uploaded")) {
      desc = `${action.user?.username || "Someone"} uploaded a file`;
    } else if (!action.type || action.type === "submited") {
      desc = `${action?.user?.username || action?.user?.name || "Unknown"}`;
    }

    return desc;
  };

  return (
    <Steps direction="vertical" current={sortedActions.length}>
      {sortedActions.map((action, index) => {
        const { icon, color } = getActionVisual(action);
        return (
          <Step
            key={index}
            icon={
              <span className="history-step-icon" style={{ backgroundColor: color }}>
                {icon}
              </span>
            }
            title={
              <div className="history-step-header">
                <div className="history-step-title">
                  <strong>{getActionTitle(action)}</strong>
                  <span className="history-step-date">
                    {new Date(action.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {new Date(action.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="history-step-actions">
                  {action.files?.length > 0 && (
                    <Button
                      type="primary"
                      size="small"
                      shape="round"
                      className="view-file-btn"
                      onClick={() => fileBlog(action.files[0])}
                    >
                      View File
                    </Button>
                  )}
                  {action.link && (
                    <Button
                      type="link"
                      size="small"
                      href={action.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Link
                    </Button>
                  )}
                </div>
              </div>
            }
            description={
              <div className="history-step-description">
                <UserAvatar
                  size={24}
                  name={action.user?.username || action.user?.name || "Unknown"}
                />
                <span>{getActionDescription(action)}</span>
              </div>
            }
          />
        );
      })}
    </Steps>
  );
};

export default TaskHistory;