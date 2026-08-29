import React, { Suspense, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DashBoard, DepartmentDetails, TaskDetails, TaskHistoryList, Members, Profile, AppPolicies} from '../pages';
import { LuFile } from 'react-icons/lu';
import { TbSmartHome } from 'react-icons/tb';
import { MdOutlinePeopleAlt, MdPolicy } from 'react-icons/md';
import { useSelector } from 'react-redux';
import ManageRoles from '../pages/manageRoles';
import AddRole from '../pages/manageRoles/Add';
import { ACL_MODULES } from '../utils/acl/Index';
import { RiUserSettingsLine } from 'react-icons/ri';
import AddEditAppPolicy from '../pages/appPolicy/addEditAppPolicy/AddEdit';
import { RouteFallback } from '../components';

export const appRoutes = [
  {
    key: ACL_MODULES.DASHBOARD,
    path: '/',
    element: <DashBoard />,
    menu: { key: 'dashboard', icon: <TbSmartHome style={{ fontSize: 24 }} />, label: 'Dashboard' },
  },
  {
    key: ACL_MODULES.TASK,
    path: '/task-history',
    element: <TaskHistoryList />,
    menu: { key: 'tasks', icon: <LuFile />, label: 'All Tasks' },
  },
  // {
  //   key: ACL_MODULES.APPROVALS,
  //   path: '/approvals',
  //   element: <Approvals />,
  //   menu: { key: 'approvals', icon: <FaCheck />, label: 'Approvals' },
  // },
  {
    path: '/task-details/:taskId',
    element: <TaskDetails />,
  },
  {
    key: ACL_MODULES.MEMBERS,
    path: '/members',
    element: <Members />,
    menu: { key: 'members', icon: <MdOutlinePeopleAlt style={{ fontSize: 24 }} />, label: 'Members' },
  },
  {
    key: ACL_MODULES.APP_POLICY,
    path: '/app-policies',
    element: <AppPolicies />,
    menu: {
      key: 'app_policies',
      icon: <MdPolicy style={{ fontSize: 24 }} />,
      label: 'App Policies'
    },
  },
  {
    path: "/add-edit-app-policy",
    element: <AddEditAppPolicy />,
  },
  {
    key: ACL_MODULES.MANAGE_ROLES,
    path: '/manage-roles',
    element: <ManageRoles />,
    menu: { key: 'manage_Roles', icon: <RiUserSettingsLine style={{ fontSize: 24 }} />, label: 'Manage Role' },
  },
  {
    path: '/addEdit-role',
    element: <AddRole />,
  },
  // {
  //   path: '/leave-approvals',
  //   element: <LeaveApprovals />,
  //   allowedRoles: ['SUPER_ADMIN', 'MANAGER', 'SUB_ADMIN', 'HOD', 'SUPERVISOR', 'EMPLOYEE', 'IT_ADMIN'],
  //   menu: { key: 'leave-approvals', icon: <HiArrowRightEndOnRectangle style={{ fontSize: 24 }} />, label: 'Leave Approvals' },
  // },
  // {
  //   path: '/admin-approval',
  //   element: <AdminApproval />,
  //   // allowedRoles: ['SUPER_ADMIN', 'IT_ADMIN', 'IT_ADMIN'],
  //   menu: { key: 'admin-approval', icon: <LiaCheckDoubleSolid style={{ fontSize: 24 }} />, label: 'Admin Approvals' },
  // },
  {
    // key: ACL_MODULES.DEPARTMENT,
    path: '/departments/:id',
    element: <DepartmentDetails />,
  },
  {
    path: '*',
    element: <DashBoard />,
  },
  {
    path: '/profile',
    element: <Profile />,
    // allowedRoles: ['SUPER_ADMIN', 'MANAGER', 'SUB_ADMIN', 'HOD', 'SUPERVISOR', 'EMPLOYEE', 'IT_ADMIN'],
  },
  // {
  //   path: '/access-request-form/:userId',
  //   element: <UserAccessRequestIndex />,
  //   // allowedRoles: ['SUPER_ADMIN', 'MANAGER', 'SUB_ADMIN', 'HOD', 'SUPERVISOR'],
  // },
];

const Unauthorized = () => (
  <div
    style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '2rem',
      textAlign: 'center',
    }}
  >
    <h1>🚫 Access Denied</h1>
    <p>You do not have permission to view this page.</p>
  </div>
);

const ProtectedRoute = ({ element }) => {
  return element;
};

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useSelector((state) => state.auth.user?.role);

  // ✅ Filter only allowed routes
  const filteredRoutes = useMemo(() => {
    return appRoutes.filter((route) => {
      if (!route.allowedRoles) return true; // routes without restrictions
      return route.allowedRoles.includes(userRole);
    });
  }, [userRole]);

  useEffect(() => {
    if (location) {
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: location.state,
      });
    }
  }, []);

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {filteredRoutes.map(({ path, element, allowedRoles = [] }, index) => (
          <Route
            key={index}
            path={path}
            element={
              allowedRoles.length === 0 || allowedRoles.includes(userRole)
                ? <ProtectedRoute element={element} />
                : <Unauthorized />
            }
          />
        ))}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Suspense>
  );
};

export default ProtectedRoutes;
