import React, { useEffect, useState, useMemo, useRef } from 'react';
import { BellOutlined, LogoutOutlined, MenuUnfoldOutlined, PlusCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Dropdown, Layout, Menu, notification as antdNotification, theme } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import './PageWrapper.css';
import logo from '../../assets/Logo.png';
import { ConditionalRendering, getFullName } from '../../utils/Methods.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { appRoutes } from '../../routes/Protected.jsx';
import { UserAvatar } from '../../components/userAvatar/UserAvatar';
import Profile from '../../components/profile/Profile';
import { logout } from '../../store/actions/Auth.action';
import CreateDepartment from '../../components/createDepartment/CreateDepartment';
import Notification from '../../components/notifications/Notification';
import { fetchNotifications, receiveNotification, markAsRead } from '../../store/actions/Notifications.action';
import { upsertTaskFromSocket, removeTaskFromSocket } from '../../store/actions/Task.action';
import logo2 from "../../assets/kplogo.svg"
import { getAllowedRoutes } from '../../utils/acl/Helper.jsx';
import { useACL } from '../../utils/acl/UseACL';
import { ACL_ACCESS_LIST, ACL_MODULES } from '../../utils/acl/Index.jsx';
import { connectSocket, disconnectSocket } from '../../utils/Socket';
import { getMeta } from '../../utils/NotificationMeta';

const { Header, Sider, Content } = Layout;

const PageWrapper = ({ children }) => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenCreateTeamModal, setIsOpenCreateTeamModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const { userName, profileData, userId, unreadCount, userRole, user } = useSelector(({ auth, notifications }) => ({
    userName: auth?.user?.firstName,
    profileData: auth?.user,
    userId: auth?.user?._id || null,
    unreadCount: (notifications.notifications || []).filter(n => !n.read).length,
    userRole: auth?.user?.role,
    user: auth.user,
  }), shallowEqual);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { can } = useACL();

  const canAddDepartment = can(ACL_MODULES.DEPARTMENT, ACL_ACCESS_LIST.ADD)

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications({ userId }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();
    if (!socket) return;

    const handleNewNotification = (data) => {
      dispatch(receiveNotification(data));

      const audio = new Audio("/pristine-609.mp3");
      audio.play().catch((err) => console.log("Autoplay blocked:", err));

      const meta = getMeta(data.type);
      antdNotification.open({
        message: meta.title,
        description: data.message,
        icon: meta.icon,
        placement: 'topRight',
        duration: 4.5,
        onClick: () => {
          if (!data.read) dispatch(markAsRead(data._id));
          if (data?.taskId?._id) {
            navigate(`/task-details/${data.taskId._id}`);
          } else if (data?.taskId) {
            navigate(`/task-details/${data.taskId}`);
          }
        },
      });
    };

    const handleReconnect = () => {
      dispatch(fetchNotifications({ userId }));
    };

    const handleTaskCreated = (task) => {
      dispatch(upsertTaskFromSocket(task));
    };

    const handleTaskUpdated = (task) => {
      const assignedToIds = (task.assignedTo || []).map((u) => (u?._id ? u._id : u));
      const assignedById = task.assignedBy?._id ? task.assignedBy._id : task.assignedBy;
      const createdById = task.createdBy?._id ? task.createdBy._id : task.createdBy;

      const isStillRelevant =
        assignedToIds.some((id) => String(id) === String(userId)) ||
        String(assignedById) === String(userId) ||
        String(createdById) === String(userId);

      if (isStillRelevant) {
        dispatch(upsertTaskFromSocket(task));
      } else {
        dispatch(removeTaskFromSocket(task._id));
      }
    };

    socket.on('new_notification', handleNewNotification);
    socket.on('connect', handleReconnect);
    socket.on('task_created', handleTaskCreated);
    socket.on('task_updated', handleTaskUpdated);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('connect', handleReconnect);
      socket.off('task_created', handleTaskCreated);
      socket.off('task_updated', handleTaskUpdated);
    };
  }, [userId]);

  const allowedMenuItems = useMemo(() => {
    return getAllowedRoutes(appRoutes, user)
      .filter(route => route.menu);
  }, [user]);

  const menuItems = useMemo(() => {
    return allowedMenuItems?.map((r) => {
      if (r.menu.key === 'add-dept') {
        return {
          ...r.menu,
          key: r.path.replace(/^\//, '') || 'dashboard',
          onClick: () => setIsOpenCreateTeamModal(true),
        };
      }
      return {
        ...r.menu,
        key: r.path.replace(/^\//, '') || 'dashboard',
        onClick: () => navigate(r.path),
      };
    });
  }, [allowedMenuItems]);

  const activeKey = menuItems?.find(m =>
    location.pathname.startsWith(`/${m.key}`)
  )?.key;

  const profileMenu = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate("/profile"),
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => dispatch(logout()),
    },
  ];

  return (
    <div className="page-container">
      <Layout hasSider>
        <Sider width={90} className='sidebar'>
          <div className="sidebar-logo">
            <img src={logo} alt="logo" />
          </div>

          <Menu
            mode="inline"
            selectedKeys={activeKey ? [activeKey] : []}
            style={{ borderRight: 0, textAlign: 'center', fontSize: 10 }}
            items={menuItems}
          />

          <ConditionalRendering
            condition={canAddDepartment}
            children={
              <div className="addDept" onClick={() => setIsOpenCreateTeamModal(true)}>
                <div className="addDept-icon-container">
                  <PlusCircleOutlined className='addDept-icon' />
                </div>
                <div className="addDept-data">
                  <p>Add Dept.</p>
                </div>
              </div>
            }
          />
        </Sider>

        {/* Content */}
        <Layout className='page-wrapper-layout'>
          <Header className='header-main'>
            <div className="page-header-container">
              <div className="page-header-left">
                <div className="mobile-menu">
                  <Button
                    icon={<MenuUnfoldOutlined />}
                    onClick={() => setIsMenuOpen(true)}
                    className='mobile-nav-button'>
                  </Button>

                  <Drawer
                    title={
                      <span>
                        <div className='sidebar-logo'>
                          <img src={logo2} />
                        </div>
                      </span>
                    }
                    placement='left'
                    closable={{ 'aria-label': 'Close Button' }}
                    onClose={() => setIsMenuOpen(false)}
                    open={isMenuOpen}
                    className='custom-mobile-drawer'
                  >
                    <Menu
                      onClick={() => setIsMenuOpen(false)}
                      className='custom-mobile-menu'
                      items={menuItems}
                    >
                    </Menu>
                    <ConditionalRendering
                      condition={canAddDepartment}
                      children={
                        <div className="addDept" onClick={() => setIsOpenCreateTeamModal(true)}>
                          <div className="addDept-icon-container">
                            <PlusCircleOutlined className='addDept-icon' />
                          </div>
                          <div className="addDept-data">
                            <p>Add Dept.</p>
                          </div>
                        </div>
                      }
                    />
                  </Drawer>

                </div>
                <h3>Welcome back <span className='dashboard-userName'>{[user?.firstName, user?.lastName].filter(Boolean).join(" ")}</span></h3>
              </div>
              <div className="page-header-right">
                <ConditionalRendering
                  condition={true}
                  children={
                    <div className='dashboard-notification-container' onClick={() => setNotificationOpen(true)}>
                      <Badge size="small" count={unreadCount}>
                        <BellOutlined className="dashboard-notification-icon" />
                      </Badge>
                    </div>
                  }
                />
                <Dropdown menu={{ items: profileMenu }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <div className="sidebar-profile-icon">
                      <UserAvatar className="profile-img" name={getFullName(user) || ''} />
                    </div>
                  </a>
                </Dropdown>
              </div>
            </div>
          </Header>

          <Content style={{ marginTop: 82, color: 'white', minHeight: 'max-content' }}>
            <Profile
              isProfileOpen={isProfileOpen}
              setIsProfileOpen={() => setIsProfileOpen(false)}
              userData={profileData}
            />

            <Notification
              open={isNotificationOpen}
              userId={userId}
              onCancel={() => setNotificationOpen(false)}
            />

            <CreateDepartment
              isOpenAddModal={isOpenCreateTeamModal}
              setIsOpenAddModal={setIsOpenCreateTeamModal}
            />

            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default PageWrapper;