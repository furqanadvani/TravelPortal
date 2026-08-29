import { ACL_ACCESS_LIST } from "./Index";

export const parseAccessRights = (accessRights) => {
  try {
    return Array.isArray(accessRights)
      ? accessRights
      : JSON.parse(accessRights || "[]");
  } catch {
    return [];
  }
};

export const hasPermission = (
  permissions = [],
  module,
  action
) => {
  const mod = permissions.find(p => p.key === module);
  return !!mod?.access?.includes(action);
};


export const getAllowedRoutes = (routes = [], user) => {
  if (!user) return [];

  if (user.isSuperAdmin || user.role === "SUPER_ADMIN") {
    return routes;
  }

  const permissions = parseAccessRights(user?.permissions);

  return routes.filter(route => {
    if (route.allowedRoles && !route.allowedRoles.includes(user.role)) {
      return false;
    }

    if (!route.key) return true;

    const mod = permissions.find(p => p.key === route.key);
    return mod?.access?.includes(ACL_ACCESS_LIST.VIEW);
  });
};