import React, { useEffect, useState, useCallback } from 'react';
import { Button, Popconfirm, Space, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNonHRUsers, updateStatus } from '../../store/actions/Users.action';
import { UserAvatar } from '../userAvatar/UserAvatar';
import { ConditionalRendering, readableText } from '../../utils/Methods';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import Profile from '../profile/Profile';
import "./Departments.css"
import { CTable } from '../../uiComponents';

const EmployeesList = () => {

  const dispatch = useDispatch();

  const { user, userLoading, userRole } = useSelector(({ users, auth }) => ({
    user: users?.getNonHrUsers || [],
    userLoading: users?.getNonHrUsersLoading,
    userRole: auth?.user?.role,
  }));

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch users with pagination
  const fetchUsers = useCallback(() => {
    dispatch(fetchNonHRUsers({ page, limit }));
  }, [dispatch, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewProfile = (record) => {
    setSelectedUser(record);
    setIsProfileOpen(true);
  };

  const callBack = () => fetchUsers();

  const updateUserStatusHandler = (record) => {
    const payload = {
      id: record._id,
      isActive: !record.isActive,
    };
    dispatch(updateStatus(payload, callBack));
  };

  const handlePageChange = (newPage, pageSize) => {
    setPage(newPage);
    setLimit(pageSize);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'username',
      render: (val, obj) => (
        <div className="d-flex align-item-center justify-center gap-10">
          <UserAvatar name={val || ''} />
          {readableText(`${val} ${obj.lastName}`)}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (val) => readableText(val[0]?.title) || '-',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (val) => readableText(val) || '-',
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (val) => (
        <Tag color={val ? "green" : "red"} className='approval-tag'>
          {val ? "Active" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="middle"
            icon={<EyeOutlined />}
            onClick={() => handleViewProfile(record)}
            className='view-btn'
          >
            View
          </Button>
          <ConditionalRendering
            condition={['SUPER_ADMIN', 'MANAGER', 'SUB_ADMIN'].includes(userRole)}
            children={
              <Popconfirm
                title={record.isActive ? "Disable this member?" : "Activate this member?"}
                okText="Yes"
                cancelText="No"
                onConfirm={() => updateUserStatusHandler(record)}
              >
                <Button
                  type="primary"
                  danger={record.isActive}
                  className={record.isActive ? "reject-btn" : "activate-btn"}
                  icon={record.isActive ? <CloseOutlined /> : <CheckOutlined />}
                >
                  {record.isActive ? "Disable" : "Activate"}
                </Button>
              </Popconfirm>
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="employees-list-main">
      <CTable
        columns={columns}
        dataSource={user.length ? user.map((item, idx) => ({ ...item, key: item._id || idx })) : []}
        loading={userLoading}
        pagination={{
          total: user.length,
          pageSize: limit,
          current: page,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
      />

      <Profile
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        userData={selectedUser}
      />
    </div>
  );
};

export default EmployeesList;