import { useEffect, useState } from "react";
import { Modal, Badge, Button, Spin } from "antd";
import {
  CheckOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "./Notification.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../../store/actions/Notifications.action";
import { useNavigate } from 'react-router-dom'
import CounterOfferModal from "../counterOfferModal/CounterOfferModal";
import { getMeta } from "../../utils/NotificationMeta";

const formatRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
};

const Notification = ({ open, onCancel }) => {
  const dispatch = useDispatch();

  const { userId, notificationList, loading } = useSelector(
    ({ auth, notifications }) => ({
      userId: auth.user?._id,
      notificationList: notifications?.notifications,
      loading: notifications?.notificationsLoading,
    })
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  useEffect(() => {
    if (open && userId) {
      dispatch(fetchNotifications({ userId }));
    }
  }, [open, userId, dispatch]);


  const navigate = useNavigate();

  const markAsReadFunc = (id) => {
    dispatch(markAsRead(id));
  };

  const handleNotificationClick = (obj) => {
    if (obj?.type === "counter_offer" && obj?.data) {
      setSelectedData(obj);
      setIsOpen(true);
      onCancel(false);
      if (!obj.read) markAsReadFunc(obj._id);
      return;
    }

    if (obj?.taskId?._id) {
      navigate(`/task-details/${obj.taskId._id}`);
      onCancel(false);
      if (!obj.read) markAsReadFunc(obj._id);
      return;
    }
  };

  const handleMarkAsReadClick = (e, id) => {
    e.stopPropagation();
    markAsReadFunc(id);
  };

  const unreadCount = notificationList?.filter((n) => !n.read).length ?? 0;
  const allRead = !notificationList?.length || notificationList.every((n) => n.read);

  return (
    <>
      <Modal
        title={
          <div className="notification-header">
            <span>Notifications</span>
            {unreadCount > 0 && <Badge count={unreadCount} />}
          </div>
        }
        open={open}
        onCancel={onCancel}
        centered
        footer={
          <div className="notification-footer">
            <Button
              type="link"
              onClick={() => dispatch(markAllAsRead(userId))}
              disabled={allRead}
            >
              Mark all as read
            </Button>
          </div>
        }
        className="notification-modal"
        width={420}
      >
        <div className="notification-body">
          {loading ? (
            <div className="loading-notifications">
              <Spin size="large" />
            </div>
          ) : !notificationList?.length ? (
            <div className="no-notifications">
              <BellOutlined className="no-notifications-icon" />
              <p>No new notifications</p>
            </div>
          ) : (
            notificationList.map((notification) => {
              const meta = getMeta(notification.type);
              return (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.read ? "read" : "unread"}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNotificationClick(notification)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNotificationClick(notification);
                    }
                  }}
                >
                  <div className={`notification-icon-wrapper tone-${meta.tone}`}>
                    {meta.icon}
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">{meta.title}</p>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-footer-row">
                      <span className="notification-time">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <Button
                          type="text"
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={(e) => handleMarkAsReadClick(e, notification._id)}
                          className="mark-read-btn"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal>

      <CounterOfferModal
        selectedData={selectedData}
        from="notification"
        isOpen={isOpen}
        close={setIsOpen}
      />
    </>
  );
};

export default Notification;