import {
  ClockCircleOutlined,
  FileOutlined,
  CheckCircleOutlined,
  BellOutlined,
} from "@ant-design/icons";

export const NOTIFICATION_META = {
  task_assigned: { icon: <FileOutlined />, title: "Task assigned", tone: "blue" },
  task_reminder: { icon: <ClockCircleOutlined />, title: "Reminder", tone: "orange" },
  task_due: { icon: <ClockCircleOutlined />, title: "Task due soon", tone: "orange" },
  task_completed: { icon: <CheckCircleOutlined />, title: "Task completed", tone: "green" },
  onboarding: { icon: <FileOutlined />, title: "New User Onboarded", tone: "blue" },
  default: { icon: <BellOutlined />, title: "Notification", tone: "blue" },
};

export const getMeta = (type) => NOTIFICATION_META[type] || NOTIFICATION_META.default;