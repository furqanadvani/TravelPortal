import { useSelector } from "react-redux";
import { hasPermission } from "./Helper";

export const useACL = () => {
  const user = useSelector(state => state.auth.user);

  const permissions = Array.isArray(user?.permissions)
    ? user?.permissions
    : [];

  const can = (module, action) => {
    if (user?.isSuperAdmin || user?.role === 'SUPER_ADMIN') return true;
    return hasPermission(permissions, module, action);
  };

  return { can, permissions };
};
