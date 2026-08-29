export const ACL_MODULES = {
  DASHBOARD: "DASHBOARD",
  MANAGE_ROLES: "MANAGE_ROLES",
  MEMBERS: "MEMBERS",
  TASK: "TASK",
  DEPARTMENT: "DEPARTMENT",
  APPROVALS: "APPROVALS",
  ACCESS_REQUEST: "ACCESS_REQUEST",
  PROFILE: 'PROFILE',
  APP_POLICY: "APP_POLICY",
};

export const ACL_ACCESS_LIST = {
  VIEW: "VIEW",
  ADD: "ADD",
  CREATE: "CREATE",
  EDIT: "EDIT",
  ADD_DEPARTMENT_MEMBERS: "ADD_DEPARTMENT_MEMBERS",
  EDIT_DEPARTMENT_MEMBERS: "EDIT_DEPARTMENT_MEMBERS",
  ACTION: "ACTION",
  ACTIVE_IN_ACTIVE: 'ACTIVE_IN_ACTIVE',

  VIEW_ALL_TASKS: "VIEW_ALL_TASKS",
  VIEW_DEPARTMENT_TASKS: "VIEW_DEPARTMENT_TASKS",
  ONBOARDING_TASK_VIEW: "ONBOARDING_TASK_VIEW",
  ONBOARDING_TASK_ASSIGNEE: "ONBOARDING_TASK_ASSIGNEE",
  CREATE_CROSS_DEPARTMENT_TASK: 'CREATE_CROSS_DEPARTMENT_TASK',
  APPROVE_CROSS_DEPARTMENT_TASK: 'APPROVE_CROSS_DEPARTMENT_TASK',
  PROCESS_ONBOARDING_TASK: 'PROCESS_ONBOARDING_TASK',
  TASK_ASSIGNEE: 'TASK_ASSIGNEE',
  REASSIGN_TASK : 'REASSIGN_TASK',
  EDIT_TASK: 'EDIT_TASK',

  VIEW_ALL_DEPARTMENTS: 'VIEW_ALL_DEPARTMENTS',
  VIEW_DEPARTMENT_MEMBERS: 'VIEW_DEPARTMENT_MEMBERS',

  VIEW_PERSONAL_DETAILS: 'VIEW_PERSONAL_DETAILS',
  OFF_BOARDING_TASK_ASSIGNEE: 'OFF_BOARDING_TASK_ASSIGNEE',
  OFF_BOARDING_TASK_VIEW: 'OFF_BOARDING_TASK_VIEW',

  VIEW_MEMBER_PERSONAL_DETAILS : 'VIEW_MEMBER_PERSONAL_DETAILS',

  OFF_BOARD_MEMBERS : "OFF_BOARD_MEMBERS"

};

export const ACL_OPTIONS = [
  {
    key: ACL_MODULES.DASHBOARD,
    access: [ACL_ACCESS_LIST.VIEW]
  },
  {
    key: ACL_MODULES.MANAGE_ROLES,
    access: [
      ACL_ACCESS_LIST.VIEW,
      ACL_ACCESS_LIST.CREATE,
      ACL_ACCESS_LIST.EDIT,
      ACL_ACCESS_LIST.ACTIVE_IN_ACTIVE
    ]
  },
  {
    key: ACL_MODULES.APP_POLICY,
    access: [
      ACL_ACCESS_LIST.VIEW,
      ACL_ACCESS_LIST.CREATE,
      ACL_ACCESS_LIST.EDIT,
      ACL_ACCESS_LIST.ACTIVE_IN_ACTIVE
    ]
  },
  {
    key: ACL_MODULES.TASK,
    access: [
      ACL_ACCESS_LIST.VIEW,
      ACL_ACCESS_LIST.CREATE,
      ACL_ACCESS_LIST.EDIT_TASK,
      ACL_ACCESS_LIST.TASK_ASSIGNEE,
      ACL_ACCESS_LIST.REASSIGN_TASK,
      ACL_ACCESS_LIST.ONBOARDING_TASK_VIEW,
      ACL_ACCESS_LIST.ONBOARDING_TASK_ASSIGNEE,
      ACL_ACCESS_LIST.CREATE_CROSS_DEPARTMENT_TASK,
      ACL_ACCESS_LIST.APPROVE_CROSS_DEPARTMENT_TASK,
      ACL_ACCESS_LIST.OFF_BOARDING_TASK_ASSIGNEE,
      ACL_ACCESS_LIST.OFF_BOARDING_TASK_VIEW,
    ]
  },
  // {
  //   key: ACL_MODULES.APPROVALS,
  //   access: [
  //     ACL_ACCESS_LIST.VIEW,
  //     ACL_ACCESS_LIST.ACTION
  //   ]
  // },
  {
    key: ACL_MODULES.MEMBERS,
    access: [
      ACL_ACCESS_LIST.VIEW,
      ACL_ACCESS_LIST.ADD,
      ACL_ACCESS_LIST.VIEW_MEMBER_PERSONAL_DETAILS,
      ACL_ACCESS_LIST.OFF_BOARD_MEMBERS,
      ACL_ACCESS_LIST.ACTIVE_IN_ACTIVE,
    ]
  },
  {
    key: ACL_MODULES.DEPARTMENT,
    access: [
      ACL_ACCESS_LIST.VIEW,
      ACL_ACCESS_LIST.ADD,
      // ACL_ACCESS_LIST.EDIT,
      ACL_ACCESS_LIST.VIEW_ALL_DEPARTMENTS,
      ACL_ACCESS_LIST.VIEW_DEPARTMENT_MEMBERS,
    ],
  },
];

export const parseAccessRights = (accessRights) => {
  try {
    return Array.isArray(accessRights) ? accessRights : JSON.parse(accessRights || "[]");
  } catch {
    return [];
  }
};

export const IsAllowedOption = (user, moduleKey, action = ACL_ACCESS_LIST.VIEW) => {
  if (!user) return false;
  if (user.isSuperAdmin || user.role === "SUPER_ADMIN") return true;

  const permissions = Array.isArray(user.accessRights)
    ? user.accessRights
    : parseAccessRights(user.accessRights);

  const mod = permissions.find((p) => p.key === moduleKey);
  return !!mod?.access?.includes(action);
};


export const togglePermission = (permissions, module, action) => {
  const updated = structuredClone(permissions || []);
  const index = updated.findIndex(p => p.key === module);

  if (index === -1) {
    updated.push({ key: module, access: [action] });
    return updated;
  }

  const access = updated[index].access;

  if (access.includes(action)) {
    const filtered = access.filter(a => a !== action);
    if (filtered.length === 0) {
      updated.splice(index, 1);
    } else {
      updated[index].access = filtered;
    }
  } else {
    updated[index].access.push(action);
  }

  return updated;
};