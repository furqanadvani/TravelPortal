import departments from './Departments.reducer';
import auth from './Auth.reducer';
import task from './Task.reducer';
import notifications from './Notifications.reducer';
import users from './Users.reducer';
import members from "./Members.reducer"
import approvals from './Approvals.reducer'
import leaves from "./Leaves.reducer"
import adminApprovals from './AdminApprovals.reducer';
import manageRoles from './ManageRoles.reducer';
import appPolicy from './AppPolicy.reducer';

export default {
  auth,
  task,
  departments,
  notifications,
  users,
  members,
  approvals,
  leaves,
  adminApprovals,
  manageRoles,
  appPolicy
};