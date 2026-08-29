import React, { useEffect, useState } from 'react'
import { Popconfirm, Tag, Button, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { approvalAction, getApprovals } from '../../store/actions/Approvals.action';
import { ConditionalRendering, readableText, renderDate, TASK_PRIORITY_COLORS, TASK_TYPE_COLORS, getTaskQueryFilters } from '../../utils/Methods';
import { CheckOutlined, EyeOutlined } from '@ant-design/icons';
import Details from './Details';
import "./Approval.css"
import { ContainerWrapper } from '../../container';
import { CTable } from '../../uiComponents';
import { useACL } from '../../utils/acl/UseACL';
import { ACL_ACCESS_LIST, ACL_MODULES } from '../../utils/acl/Index';
import { useLocation, useNavigate } from 'react-router-dom';

const Approvals = () => {

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(null)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const { can } = useACL()

    const canTakeActions = can(ACL_MODULES.APPROVALS, ACL_ACCESS_LIST.ACTION)

    const { data, loading, userRole } = useSelector(({ approvals, auth }) => ({
        data: approvals.approvalsData || [],
        loading: approvals?.getApprovalsLoading,
        userRole: auth?.user?.role
    }))

    useEffect(() => {
        const filters = getTaskQueryFilters(location)
        if (filters.page) setPage(Number(filters.page))
        if (filters.limit) setLimit(Number(filters.limit))
    }, [location])

    useEffect(() => {
        dispatch(getApprovals({ page, limit }))
    }, [dispatch, page, limit])

    const handleDetails = (record) => {
        setSelected(record)
        setIsOpen(true)
    }

    const refreshData = () => {
        dispatch(getApprovals({ page, limit }))
    }

    const actionHandler = (val, record = {}) => {
        dispatch(
            approvalAction(
                { action: val, approvalId: record?._id },
                refreshData
            )
        )
    }

    const handlePageChange = (page, size) => {
        setPage(page)
        setLimit(size)
        navigate(`?page=${page}&limit=${size}`)
    }

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            render: (val, record) => (
                <div className="title-priority">
                    {val}
                    {TASK_PRIORITY_COLORS(record.priority)}
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: (val) => {
                const type = val?.toUpperCase()
                const colors = TASK_TYPE_COLORS[type] || {}
                return (
                    <Tag style={{ color: colors.color, backgroundColor: colors.background }} className='approval-tag'>
                        {readableText(type)}
                    </Tag>
                )
            }
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            render: val => renderDate(val) || '-'
        },
        {
            title: 'Create by',
            dataIndex: 'requestedBy',
            render: val => readableText(val?.username) || '-'
        },
        {
            title: 'Assign To',
            dataIndex: 'assignTo',
            render: val => readableText(val?.username) || '-'
        },
        {
            title: 'Approval Status',
            dataIndex: 'status',
            render: val => (
                <Tag className='approval-tag' color={val === 'PENDING' ? "red" : "green"}>
                    {readableText(val)}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: record => (
                <Space size="small">
                    <Button
                        size='middle'
                        icon={<EyeOutlined />}
                        onClick={() => handleDetails(record)}
                        className='view-btn'
                    >
                        View
                    </Button>
                    <ConditionalRendering
                        condition={canTakeActions && record?.status === 'PENDING'}
                        children={
                            <Popconfirm
                                title="Accept Task" onConfirm={() => actionHandler('APPROVE', record)}>
                                <Button
                                    type="primary"
                                    className='approve-btn'
                                    icon={<CheckOutlined />}
                                >
                                    Accept
                                </Button>
                            </Popconfirm>
                        }
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className={isOpen ? "blur-bg" : ""}>
            <ContainerWrapper pageHeaderProps={{ title: "Approvals" }}>
                <div className='department-detail-container'>
                    <div className="table-wrapper">
                        <CTable
                            columns={columns}
                            dataSource={data}
                            loading={loading}
                            rowKey={record => record._id}
                            pagination={{
                                total: data?.length,
                                pageSize: limit,
                                current: page,
                                onChange: handlePageChange,
                                showSizeChanger: false,
                            }}
                        />
                    </div>
                </div>
            </ContainerWrapper>

            <Details
                selected={selected}
                setSelected={setSelected}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    )
}

export default Approvals
