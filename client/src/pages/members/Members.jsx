import React, { useEffect, useState, useCallback } from 'react'
import { Button, Popconfirm, Space, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { UserAvatar } from '../../components/userAvatar/UserAvatar'
import { ConditionalRendering, readableText, getTaskQueryFilters, getFullName } from '../../utils/Methods'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { fetchNonHRUsers, updateStatus } from '../../store/actions/Users.action'
import ContainerWrapper from '../../container/containerWrapper/ContainerWrapper'
import { CTable } from '../../uiComponents'
import { useLocation, useNavigate } from 'react-router-dom'
import { Profile } from '../../components'
import { ACL_ACCESS_LIST, ACL_MODULES } from '../../utils/acl/Index';
import { useACL } from '../../utils/acl/UseACL';
import { getDepartments } from '../../store/actions/Departments.action'

const Members = () => {
    const [isAddMember, setIsAddMember] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false)
    const [statusUpdatingId, setStatusUpdatingId] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const { loading, data, total } = useSelector(({ auth, users }) => ({
        data: users?.getNonHrUsers || [],
        loading: users?.getNonHrUsersLoading,
        total: users?.getNonHrUsersTotal ?? users?.getNonHrUsers?.length ?? 0,
    }))

    const { can } = useACL()

    const canAllowViewFullProfile = can(ACL_MODULES.MEMBERS, ACL_ACCESS_LIST.VIEW_MEMBER_PERSONAL_DETAILS)
    const canAllowToDisableUser = can(ACL_MODULES.MEMBERS, ACL_ACCESS_LIST.ACTIVE_IN_ACTIVE)

    useEffect(() => {
        const filters = getTaskQueryFilters(location)
        if (filters.page) setPage(Number(filters.page))
        if (filters.limit) setLimit(Number(filters.limit))
    }, [location])

    const fetchMembers = useCallback(() => {
        const payload = { page, limit }
        dispatch(fetchNonHRUsers(payload))
    }, [dispatch, page, limit])

    useEffect(() => {
        fetchMembers()
    }, [fetchMembers, refresh])

    useEffect(() => { dispatch(getDepartments()) }, [])

    const callBack = () => fetchMembers()

    const handleViewProfile = (record) => {
        setSelectedUser(record)
        setIsProfileOpen(true)
    }

    const updateUserStatusHandler = async (record) => {
        setStatusUpdatingId(record._id)
        const payload = { id: record._id, isActive: !record.isActive }
        dispatch(updateStatus(payload, () => {
            setStatusUpdatingId(null)
            callBack()
        }))
    }

    const handlePageChange = (page, size) => {
        setPage(page)
        setLimit(size)
        navigate(`?page=${page}&limit=${size}`, { replace: true })
    }

    const handleViewProfileDrawer = (record) => {
        setSelectedUser(record);
        setIsProfileDrawerOpen(true);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'firstName',
            render: (firstName, record) => {
                const fullName = getFullName(record);
                return (
                    <div className='d-flex gap-10 align-item-center'>
                        <UserAvatar name={fullName} /> {fullName}
                    </div>
                );
            },
        },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Role', dataIndex: 'role', render: val => readableText(val) || '-' },
        { title: 'Department', dataIndex: 'department', render: val => readableText(val?.[0]?.title) || '-' },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: val => (
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
                        condition={canAllowViewFullProfile}
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
                                    loading={statusUpdatingId === record._id}
                                    disabled={statusUpdatingId === record._id}
                                    className={record.isActive ? 'reject-btn' : 'activate-btn'}
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
    ]

    const pageHeaderProps = {
        isAddMember,
        setIsAddMember,
        title: "Members",
        renderAddMemberButton: true,
        onMemberAdded: () => setRefresh(!refresh),
    }

    return (
        <>
            <ContainerWrapper pageHeaderProps={pageHeaderProps}>
                <div className='department-detail-container'>
                    <div className="table-wrapper">
                        <CTable
                            columns={columns}
                            dataSource={data}
                            loading={loading}
                            rowKey={record => record._id || record.email}
                            pagination={{
                                total,
                                pageSize: limit,
                                current: page,
                                onChange: handlePageChange,
                                showSizeChanger: false,
                            }}
                        />
                    </div>
                </div>
            </ContainerWrapper>
            <Profile
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                userData={selectedUser}
                onDeleteSuccess={() => setRefresh(!refresh)}
                setIsProfileDrawerOpen={setIsProfileDrawerOpen}
                isProfileDrawerOpen={isProfileDrawerOpen}
            />
        </>
    )
}

export default Members