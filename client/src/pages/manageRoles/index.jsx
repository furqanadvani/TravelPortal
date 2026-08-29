import React, { useEffect, useState } from 'react'
import { Button, Popconfirm, Space, Table, Tag } from 'antd'
import { PageHeader, Profile } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { getMembers } from '../../store/actions/Members.action'
import { UserAvatar } from '../../components/userAvatar/UserAvatar'
import { ConditionalRendering, readableText, renderDate } from '../../utils/Methods'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import { updateStatus } from '../../store/actions/Users.action'
import ContainerWrapper from '../../container/containerWrapper/ContainerWrapper'
import { CTable } from '../../uiComponents'
import { useNavigate } from 'react-router-dom'
import { addEditRole, getRoles } from '../../store/actions/ManageRoles.action'
import { useACL } from '../../utils/acl/UseACL'
import { ACL_ACCESS_LIST, ACL_MODULES } from '../../utils/acl/Index'

const ManageRoles = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { can } = useACL()

    const { loading, data, actionLoading } = useSelector(({ manageRoles, auth }) => ({
        data: manageRoles.roles,
        loading: manageRoles.rolesLoading,
        actionLoading: manageRoles.roleActionLoading,
        userRole: auth?.user?.role
    }));

    const canEditRole = can(ACL_MODULES.MANAGE_ROLES, ACL_ACCESS_LIST.EDIT)
    const canTakeAction = can(ACL_MODULES.MANAGE_ROLES, ACL_ACCESS_LIST.ACTACTIVE_IN_ACTIVEION)

    useEffect(() => {
        dispatch(getRoles());
    }, []);

    const callBack = () => {
        dispatch(getRoles())
    }

    const updateUserStatusHandler = (record) => {
        let payload = {
            roleId: record._id,
            isActive: !record.isActive,
        };

        dispatch(addEditRole(payload, callBack));
    };

    const navigator = (record) => {
        navigate('/addEdit-role',
            { state: { role: record }, }
        )
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: val => val
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (val) => (renderDate(val))
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (val) => (
                <Tag color={val ? "green" : "red"} className="approval-tag">
                    {val ? "Active" : "Disabled"}
                </Tag>
            ),
        },
        ...(canTakeAction || canEditRole ? [{
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <ConditionalRendering
                        condition={canEditRole}
                        children={<Button
                            disabled={actionLoading || loading}
                            size="middle"
                            icon={<EditOutlined />}
                            onClick={() => navigator(record)}
                            className='view-btn'
                        >
                            Manage Access
                        </Button>} />

                    <ConditionalRendering
                        condition={canTakeAction}
                        children={<Popconfirm
                            title={record.isActive ? "Disable this role?" : "Activate this role?"}
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => updateUserStatusHandler(record)}
                        >
                            <Button
                                type="primary"
                                disabled={actionLoading || loading}
                                danger={record.isActive}
                                className={record.isActive ? "reject-btn" : "activate-btn"}
                                icon={record.isActive ? <CloseOutlined /> : <CheckOutlined />}
                            >
                                {record.isActive ? "Disable" : "Active"}
                            </Button>
                        </Popconfirm>
                        }
                    />
                </Space>
            ),
        }] : []),
    ];

    const pageHeaderProps = {
        title: "Manage Roles",
        renderRoleButton: true,
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
                            rowKey={(record) => record._id}
                        />
                    </div>
                </div>
            </ContainerWrapper >
        </>

    )
}

export default ManageRoles