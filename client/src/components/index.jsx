import { lazy } from "react";

// Genuinely heavy/rarely-mounted — keep lazy
const TaskKPIsChart = lazy(() => import("./chart/Chart"));
const OrganizationView = lazy(() => import("./dashboardDepartment/OrganizationView"));
const TasksTableView = lazy(() => import("./tasksTableView"));

// Small, frequently-used across every page — eager import (no lazy)
export { default as CountCards } from "./countCards/CountCards";
export { default as PageHeader } from "./pageHeaderWrapper/PageHeader";
export { default as ProgressBar } from "./progress/ProgressBar";
export { default as Departments } from "./dashboardDepartment/Departments";
export { default as EmployeesList } from "./dashboardDepartment/EmployeesList";
export { default as AddDepartmentMember } from "./addDepartmentMember/AddDepartmentMember";
export { default as Profile } from "./profile/Profile";
export { default as Notification } from "./notifications/Notification";
export { default as AssignTaskModal } from "./assignTaskModal/AssignTaskModal";
export { default as Comments } from "./comments/Comments";
export { default as CreateDepartment } from "./createDepartment/CreateDepartment";
export { default as CreateLeaveRequest } from "./createLeaveRequest/CreateLeaveRequest";
export { default as UpdateUserPersonalDetails } from "./userPersonalDetailsModal/Index";
export { default as RouteFallback } from "./loader/RouteFallback";

export {
  TaskKPIsChart,
  OrganizationView,
  TasksTableView,
};