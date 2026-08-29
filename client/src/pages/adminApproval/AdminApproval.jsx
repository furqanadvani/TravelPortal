import React, { useEffect, useState } from 'react'
import { ContainerWrapper } from '../../container'
import { CTable } from '../../uiComponents';
import "./AdminApproval.css"
import { useDispatch, useSelector } from 'react-redux';
import { ConditionalRendering, readableText, renderDate } from '../../utils/Methods';
import { Button, Popconfirm, Space, Tag } from 'antd';
import { adminApprovalAction, getAdminApprovals } from '../../store/actions/AdminApprovals.action';
import { EyeOutlined } from '@ant-design/icons';
import Details from './Details';

const AdminApproval = () => {

    const dispatch = useDispatch();
    const [selected, setSelected] = useState({})
    const [isOpen, setIsOpen] = useState(false);

    const { data, loading, actionsLoading } = useSelector(({ adminApprovals }) => ({
        data: adminApprovals?.adminApprovalsData || [],
        loading: adminApprovals?.getAdminApprovalsLoading,
        actionsLoading: adminApprovals?.adminApprovalsActionLoading,
    }));

    const pageHeaderProps = {
        title: 'Admin / Onboarding Approval ',
    };

    const fetApprovals = () => {
        dispatch(getAdminApprovals())
    }

    useEffect(() => {
        fetApprovals()
    }, [])

    const handleDetails = (obj) => {
        setIsOpen(true);
        setSelected(obj)
    };

    const callback = () => {
        dispatch(getAdminApprovals());
    };

    const actionApproval = (action, values = {}) => {
        const payload = {
            approvalId: values?._id,
            action: action,
            reason: values.reason,
        };

        dispatch(adminApprovalAction(payload, callback));
    };


    const columns = [
        {
            title: "Full Name",
            dataIndex: "username",
            render: (val, obj) => obj?.userId?.username || "-",
        },
        {
            title: "Email",
            dataIndex: "email",
            render: (val, obj) => obj?.userId?.email || "-",
        },
        {
            title: "Role",
            dataIndex: "role",
            render: (val, obj) => readableText(obj?.userId?.role) || "-",
        },
        {
            title: "Created By Name",
            render: (_, record) =>
                record?.createdBy?.username || "-",
        },
        {
            title: "Created By Email",
            render: (_, record) =>
                record?.createdBy?.email || "-",
        },
        {
            title: "Requested At",
            dataIndex: "createdAt",
            render: (val) => renderDate(val) || "-",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (val) => (
                <Tag
                    className="approval-tag"
                    color={
                        val === "PENDING" || val === "REJECTED"
                            ? "red"
                            : "green"
                    }
                >
                    {readableText(val)}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <>
                    <Space size="small">
                        <Button size="middle" icon={<EyeOutlined />} onClick={() => handleDetails(record)} >
                            View
                        </Button>
                        <ConditionalRendering
                            condition={record?.status === "PENDING"}
                            children={<Popconfirm
                                title={"Approved this member?"}
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => actionApproval("APPROVE", record)}
                            >

                                <Button
                                    type="primary"
                                    // loading={actionsLoading}
                                    disabled={actionsLoading}
                                    style={{
                                        flex: 1,
                                        background: "#52b167",
                                        borderColor: "#52b167",
                                    }}
                                >
                                    Accept
                                </Button>
                            </Popconfirm>
                            }
                        />

                    </Space>
                </>
            ),
        },

    ]

    return (
        <div className={`${isOpen ? "blur-bg" : ""}`}>
            <ContainerWrapper pageHeaderProps={pageHeaderProps}>
                <div className='department-detail-container'>
                    <div className="table-wrapper">
                        <CTable columns={columns} data={data} loading={loading} />
                    </div>
                </div>
            </ContainerWrapper>
            <Details selected={selected} setSelected={setSelected} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
};

export default AdminApproval;
