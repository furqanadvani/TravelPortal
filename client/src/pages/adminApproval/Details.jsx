import React, { useState } from "react";
import { Button, Drawer, Flex, Input, Modal } from "antd";
import "./Details.css";
import {
    adminApprovalRequestedFor,
    adminApprovalRequestedBy,
} from "./Helper";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { rejectApprovalSchema } from "./Validations";
import {
    adminApprovalAction,
    getAdminApprovals,
} from "../../store/actions/AdminApprovals.action";

const Details = ({ isOpen, setIsOpen, selected }) => {
    const dispatch = useDispatch();

    const { loading } = useSelector(({ adminApprovals }) => ({
        loading: adminApprovals?.adminApprovalsActionLoading,
    }));

    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

    const onCancel = () => {
        if (!loading) setIsOpen(false);
    };

    const callback = () => {
        setIsOpen(false)
        setIsReasonModalOpen(false);
        dispatch(getAdminApprovals());
    };

    const actionApproval = (action, values = {}) => {
        const payload = {
            approvalId: selected?._id,
            action: action,
            reason: values.reason,
        };

        dispatch(adminApprovalAction(payload, callback));
    };

    const footer = () => {
        if (selected?.status === "PENDING") {
            return (
                <Flex gap="small" style={{ width: "100%" }}>
                    <Button
                        danger
                        type="primary"
                        loading={loading}
                        disabled={loading}
                        style={{ flex: 1, background: "#f5222d", borderColor: "#f5222d" }}
                        onClick={() => setIsReasonModalOpen(true)}
                    >
                        Reject
                    </Button>

                    <Button
                        type="primary"
                        loading={loading}
                        disabled={loading}
                        style={{
                            flex: 1,
                            background: "#52b167",
                            borderColor: "#52b167",
                        }}
                        onClick={() => actionApproval("APPROVE")}
                    >
                        Accept
                    </Button>

                    <Modal
                        open={isReasonModalOpen}
                        onCancel={() => setIsReasonModalOpen(false)}
                        footer={null}
                    >
                        <div className="remarksModal">
                            <Formik
                                initialValues={{ reason: "" }}
                                validationSchema={rejectApprovalSchema}
                                onSubmit={(values) =>
                                    actionApproval("REJECT", values)
                                }
                            >
                                {({
                                    values,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    errors,
                                    touched,
                                    submitCount,
                                }) => (
                                    <>
                                        <h1 className="form-title margin-bottom-20">
                                            Reason
                                        </h1>

                                        <Input.TextArea
                                            name="reason"
                                            rows={4}
                                            value={values.reason}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Write reason for rejection"
                                            disabled={loading}
                                        />

                                        {submitCount > 0 && errors.reason && (
                                            <p className="error-text">
                                                {errors.reason}
                                            </p>
                                        )}

                                        <Button
                                            block
                                            htmlType="submit"
                                            className="submit-button"
                                            type="primary"
                                            style={{ marginTop: 15 }}
                                            onClick={handleSubmit}
                                            loading={loading}
                                            disabled={loading}
                                        >
                                            Submit
                                        </Button>
                                    </>
                                )}
                            </Formik>
                        </div>
                    </Modal>
                </Flex>
            );
        }
        return null;
    };

    return (
        <Drawer
            title="User Onboarding Approvals"
            className="approval-details"
            loading={loading}
            onClose={onCancel}
            open={isOpen}
            footer={footer()}
            width={620}
        >
            {adminApprovalRequestedBy(selected)}
            {adminApprovalRequestedFor(selected)}
        </Drawer>
    );
};

export default Details;
