import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import "./SideBar.css";
import { Dropdown, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UserAvatar } from "../userAvatar/UserAvatar";
import { logout } from "../../store/actions/Auth.action";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "../profile/Profile";
import { useACL } from "../../utils/acl/UseACL";
import { ACL_ACCESS_LIST, ACL_MODULES } from "../../utils/acl/Index";
import { getFullName } from "../../utils/Methods";

const ProfileDropdown = ({ userName, onProfileClick, onLogout }) => {
  const items = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: onProfileClick,
    },
    {
      key: "2",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () => onLogout(),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()} aria-label="Profile menu">
        <div className="sidebar-profile-icon">
          <UserAvatar className="profile-img" name={userName || ""} />
        </div>
      </a>
    </Dropdown>
  );
};

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { can } = useACL();

  const { userName, profileData } = useSelector(({ auth }) => ({
    userName: auth?.user ?? getFullName(auth?.user),
    profileData: auth?.user,
  }));

  const canViewMembers = can(ACL_MODULES.MEMBERS, ACL_ACCESS_LIST.VIEW);

  const navIcons = [
    { key: "home", icon: <HomeOutlined />, label: "Home", path: "/" },
    { key: "history", icon: <ClockCircleOutlined />, label: "History", path: "/task-history" },
    ...(canViewMembers
      ? [{ key: "members", icon: <UsergroupAddOutlined />, label: "Members", path: "/members" }]
      : []),
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className={`sidebar ${isMobile ? "mobile-nav" : ""}`}>
      <div className="nav-items">
        {navIcons.map((item) => (
          <Tooltip key={item.key} title={item.label} placement="right">
            <button
              type="button"
              className={`nav-icon ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              aria-current={isActive(item.path) ? "page" : undefined}
            >
              <span className="icon">{item.icon}</span>
            </button>
          </Tooltip>
        ))}

        <ProfileDropdown
          userName={userName}
          onProfileClick={() => setProfileOpen(true)}
          onLogout={() => dispatch(logout())}
        />
      </div>

      <Profile
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={() => setProfileOpen(false)}
        userData={profileData}
      />
    </div>
  );
};

export default Sidebar;