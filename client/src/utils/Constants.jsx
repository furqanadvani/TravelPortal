export const TOKEN = "TOKEN";


export const TASK_STATUS = {
  ALL: 'all',
  PENDING: 'pending',
  IN_PROGRESS: 'inProgress',
  ASSIGNED: 'assigned',
  REVIEW: 'review',
  CLOSED: 'closed'
};

export const PRIORITY_OBJ = [
  { key: 'ALL', name: 'All' },
  { key: 'LOW', name: 'Low' },
  { key: 'HIGH', name: 'High' },
  { key: 'MEDIUM', name: 'Medium' },

]

export const STATUS_OBJ = [
  { key: 'all', name: 'All' },
  { key: 'TODO', name: 'Todo' },
  { key: 'PENDING', name: 'Pending' },
  { key: 'IN_PROGRESS', name: 'In Progress' },
  { key: 'REVIEW', name: 'Review' },
  { key: 'CLOSED', name: 'Closed' },
  { key: 'COMPLETED', name: 'Completed' },
]

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.ALL]: 'All',
  [TASK_STATUS.PENDING]: 'Pending',
  [TASK_STATUS.IN_PROGRESS]: 'inProgress',
  [TASK_STATUS.ASSIGNED]: 'Assigned',
  [TASK_STATUS.REVIEW]: 'Review',
  [TASK_STATUS.CLOSED]: 'Closed'
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'volcano',
  [TASK_STATUS.IN_PROGRESS]: 'geekblue',
  [TASK_STATUS.ASSIGNED]: 'blue',
  [TASK_STATUS.REVIEW]: 'purple',
  [TASK_STATUS.CLOSED]: 'green'
};

export const ONBOARDING_TASK_STEPS = {
  USER_PERSONAL_INFO_BY_HR: "USER_PERSONAL_INFO_BY_HR",
  USER_ROLE_AND_ACCESS_BY_HEAD: "USER_ROLE_AND_ACCESS_BY_HEAD",
  USER_CONFIG_BY_ADMIN: "USER_CONFIG_BY_ADMIN",
  SYSTEM_CONFIGED_FOR_USER: "SYSTEM_CONFIGED_FOR_USER"
}

export const OFFBOARDING_TASK_STEPS = {
  DEPARTMENT_REVIEW: 'DEPARTMENT_REVIEW',
  HR_REVIEW: 'HR_REVIEW',
  COUNTER_OFFER_SENT: 'COUNTER_OFFER_SENT',
  WAITING_USER_RESPONSE: 'WAITING_USER_RESPONSE',
  IT_ADMIN_REVIEW: 'IT_ADMIN_REVIEW',
};

export const BACKENDPATH = 'http://tms.kamelpay.tech'