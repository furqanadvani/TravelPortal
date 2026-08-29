import React, { useEffect, useState, useMemo } from 'react'; // useMemo import karo
import { Button, Popconfirm, Space, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import "./DepartmentMembers.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { Profile } from '../../components';
import { UserAvatar } from '../../components/userAvatar/UserAvatar';
import { ConditionalRendering, readableText, getTaskQueryFilters } from '../../utils/Methods';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { CTable } from '../../uiComponents';
import { updateStatus } from '../../store/actions/Users.action';
import { getDepartmentMembers } from '../../store/actions/Departments.action';
import ContainerWrapper from '../../container/containerWrapper/ContainerWrapper';
import { ACL_ACCESS_LIST, ACL_MODULES } from '../../utils/acl/Index';
import { useACL } from '../../utils/acl/UseACL';

const DepartmentDetails = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });

  const location = useLocation();
  const { state } = location;
  const dispatch = useDispatch();
  let department = state;
  const navigate = useNavigate();
  const { can } = useACL()
  const { departmentMembers, loading, userRole, totalCount } = useSelector(({ departments, auth }) => ({
    departmentMembers: departments?.departmentMembers || [],
    loading: departments?.departmentMembersLoading,
    userRole: auth?.user?.role,
    totalCount: departments?.departmentMembersTotal || 0,
  }));

  const canAllowViewProfile = can(ACL_MODULES.PROFILE, ACL_ACCESS_LIST.VIEW_PERSONAL_DETAILS)
  const canAllowToDisableUser = can(ACL_MODULES.MEMBERS, ACL_ACCESS_LIST.ACTIVE_IN_ACTIVE)

  useEffect(() => {
    const urlFilters = getTaskQueryFilters(location);
    setFilters(prev => ({
      ...prev,
      page: Number(urlFilters.page) || 1,
      limit: Number(urlFilters.limit) || 10
    }));
  }, [location]);

  const payload = useMemo(() => {
    if (!department?._id) return null;
    return {
      page: filters.page,
      limit: filters.limit,
      departmentId: department._id
    };
  }, [department?._id, filters.page, filters.limit]);

  useEffect(() => {
    if (payload) {
      dispatch(getDepartmentMembers(payload));
    }
  }, [dispatch, payload, refresh]);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  const callBack = () => {
    if (!department?._id) return;
    dispatch(getDepartmentMembers({ ...filters, departmentId: department._id }));
  };

  const handleViewProfile = (record) => {
    setSelectedUser(record);
    setIsProfileOpen(true);
  };

  const handleViewProfileDrawer = (record) => {
    setSelectedUser(record);
    setIsProfileDrawerOpen(true);
  };

  const updateUserStatusHandler = (record) => {
    const payload = { id: record._id, isActive: !record.isActive };
    dispatch(updateStatus(payload, callBack));
  };

  const handlePageChange = (newPage, newLimit) => {
    const updatedFilters = {
      ...filters,
      page: newPage,
      limit: newLimit
    };

    setFilters(updatedFilters);
    navigate(`?page=${newPage}&limit=${newLimit}`, {
      state: department,
      replace: true
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      render: (firstName, record) => {
        const lastName = record.lastName || '';
        const fullName = `${firstName || ''} ${lastName}`.trim();

        return (
          <div className='d-flex gap-10 align-item-center'>
            <UserAvatar name={fullName} /> {fullName}
          </div>
        );
      },
    },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role', render: (val) => readableText(val) || '-' },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (val) => (
        <Tag color={val ? "green" : "red"} className="approval-tag">
          {val ? "Active" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <ConditionalRendering
            condition={canAllowViewProfile}
            children={
              <Button className="view-btn" icon={<EyeOutlined />} onClick={() => handleViewProfileDrawer(record)} >
                View Complete Profile
              </Button>
            }
            elseChildren={
              <Button size="middle" icon={<EyeOutlined />} onClick={() => handleViewProfile(record)} className='view-btn'>
                View
              </Button>
            }
          />
          <ConditionalRendering
            condition={canAllowToDisableUser}
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

  const pageHeaderProps = {
    setIsOpenAddModal,
    isOpenAddModal,
    title: department?.title || 'Department Details',
    subtitle: department?.description || '',
    departmentId: department?._id,
    teamId: department?._id,
    onMemberAdded: () => setRefresh(true),
  };

  return (
    <ContainerWrapper pageHeaderProps={pageHeaderProps}>
      <div className='department-detail-container'>
        <div className="table-wrapper">
          <CTable
            columns={columns}
            dataSource={departmentMembers}
            loading={loading}
            pagination={{
              total: totalCount,
              current: filters.page,
              pageSize: filters.limit,
              onChange: handlePageChange,
              showSizeChanger: false,
            }}
          />
        </div>
      </div>
      <Profile
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        userData={selectedUser}
        onDeleteSuccess={() => setRefresh(true)}
        setIsProfileDrawerOpen={setIsProfileDrawerOpen}
        isProfileDrawerOpen={isProfileDrawerOpen}
      />
    </ContainerWrapper>
  );
};

export default DepartmentDetails;