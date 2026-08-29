import React, { useEffect } from "react";
import { Button, Popconfirm, Space, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CheckOutlined, CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ContainerWrapper from "../../container/containerWrapper/ContainerWrapper";
import { CTable } from "../../uiComponents";
import { ConditionalRendering, renderDate } from "../../utils/Methods";
import { getAppPolicies, deactivateAppPolicy, } from "../../store/actions/AppPolicy.action";
import { useACL } from "../../utils/acl/UseACL";
import { ACL_ACCESS_LIST, ACL_MODULES } from "../../utils/acl/Index";

const AppPolicies = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { can } = useACL();

    const { appPolicies, loading, deactivateLoading, } = useSelector(({ appPolicy }) => ({
        appPolicies: appPolicy?.appPolicies?.data || [],
        loading: appPolicy?.appPolicies?.loading,
        deactivateLoading: appPolicy?.deactivatePolicyLoading,
    }));

    const canEdit = can(ACL_MODULES.APP_POLICY, ACL_ACCESS_LIST.EDIT);
    const canAdd = can(ACL_MODULES.APP_POLICY, ACL_ACCESS_LIST.CREATE);

    const canTakeAction = can(ACL_MODULES.APP_POLICY, ACL_ACCESS_LIST.ACTIVE_IN_ACTIVE);

    useEffect(() => {
        dispatch(getAppPolicies());
    }, []);

    const callback = () => {
        dispatch(getAppPolicies());
    };

    const handleStatusChange = (record) => {
        dispatch(
            deactivateAppPolicy(record._id, callback)
        );
    };

    const handleAddEdit = (record) => {
        if (record) {
            navigate("/add-edit-app-policy", { state: { appPolicy: record, }, });
        } else {
            navigate("/add-edit-app-policy");
        }
    };

    const columns = [
        {
            title: "Policy Name",
            dataIndex: "policyName",
            key: "policyName",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (val) => val || "-",
        },
        {
            title: "Resources",
            key: "resources",
            render: (_, record) => record?.resources?.length || 0,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (val) => renderDate(val),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (val) => (
                <Tag color={val === "active" ? "green" : "red"}>
                    {val === "active" ? "Active" : "Inactive"}
                </Tag>
            ),
        },

        ...(canEdit || canTakeAction
            ? [
                {
                    title: "Action",
                    key: "action",
                    render: (_, record) => (
                        <Space size="small">

                            <ConditionalRendering
                                condition={canEdit}
                                children={
                                    <Button
                                        icon={<EditOutlined />}
                                        className="view-btn"
                                        onClick={() => handleAddEdit(record)}
                                    >
                                        Edit
                                    </Button>
                                }
                            />

                            <ConditionalRendering
                                condition={canTakeAction}
                                children={
                                    <Popconfirm
                                        title={
                                            record.status === "active"
                                                ? "Deactivate this policy?"
                                                : "Activate this policy?"
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() =>
                                            handleStatusChange(record)
                                        }
                                    >

                                        <Button
                                            type="primary"
                                            danger={record.status === "active"}
                                            loading={deactivateLoading}
                                            className={record.status === "active" ? "activate-btn" : "reject-btn" }
                                            icon={
                                                record.status === "active"
                                                    ? <CloseOutlined />
                                                    : <CheckOutlined />
                                            }
                                        >
                                            {record.status === "active"
                                                ? "Deactivate"
                                                : "Activate"}
                                        </Button>
                                    </Popconfirm>
                                }
                            />

                        </Space>
                    ),
                },
            ]
            : []),
    ];

    const renderButton = () => {
        return (
            <ConditionalRendering
                condition={canAdd}
                children={
                    <Button
                        shape="round"
                        size="large"
                        type="primary"
                        onClick={() => handleAddEdit()}
                        icon={<PlusOutlined />}
                    >
                        <span className="btn-text">Add App Policy</span>
                    </Button>
                }
            />
        );
    };

    const pageHeaderProps = {
        title: "App Policies",
        renderButtonDynamicly: renderButton,
    };



    return (
        <ContainerWrapper pageHeaderProps={pageHeaderProps}>
            <div className="department-detail-container">
                <div className="table-wrapper">
                    <CTable
                        columns={columns}
                        dataSource={appPolicies}
                        loading={loading}
                        rowKey={(record) => record._id}
                    />
                </div>
            </div>
        </ContainerWrapper>
    );
};

export default AppPolicies;