import React, { useState } from 'react'
import { CountCards, CreateLeaveRequest } from '../../components'
import { Button, Popconfirm } from 'antd'
import { getFullName, readableText } from '../../utils/Methods'
import { UserDeleteOutlined } from '@ant-design/icons'
import ErrorBoundary from '../dashboard/ErrorBoundary'
import "./Profile.css"
import { SlEnvolope } from 'react-icons/sl'
import { UserAvatar } from '../../components/userAvatar/UserAvatar'
import { useSelector } from 'react-redux'
import { renderPrimaryDetails, renderContactDetails, renderOnboardingDetails } from './Helper'
import OffboardingForm from '../../components/offboarding/OffboardingForm'

const Profile = () => {
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
    const [isOpenResignationModal, setIsOpenResignationModal] = useState(false)

    const { user } = useSelector(({ auth }) => ({
        user: auth?.user || {},
    }));

    return (
        <>
            <ErrorBoundary>
                <div className='dashboard-container'>
                    <div className="profile-bg"></div>
                    <div className="dashboard-wrapper">
                        <div className="dashboard-header">
                            <div className="header-title-name">
                                <h3>Account Settings</h3>
                            </div>
                        </div>

                        <div className="profile-card">
                            <div className="profile-card-data">
                                <div className="profile-card-avator">
                                   <UserAvatar name={getFullName(user)} />
                                </div>
                                <div className="profile-card-detail">
                                    <h3>{[user?.firstName, user?.lastName].filter(Boolean).join(" ")}</h3>
                                    <p>{readableText(user?.role)}</p>
                                    <h4><SlEnvolope />{user?.email}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-content">
                            <div className="dashboard-counts">
                                <CountCards stats={user?.leaveBalance} type={'leaveStats'} />
                            </div>
                        </div>

                        <div className="profile-sections">
                            {renderPrimaryDetails(user)}
                            {renderContactDetails(user)}
                            {renderOnboardingDetails(user)}
                        </div>

                        <Popconfirm
                            title="Start resignation process?"
                            description="This will begin your offboarding. You can't undo this from here."
                            okText="Yes, proceed"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => setIsOpenResignationModal(true)}
                        >
                            <Button
                                danger
                                shape="round"
                                icon={<UserDeleteOutlined />}
                                size="large"
                            >
                                <span className="btn-text">Resignation</span>
                            </Button>
                        </Popconfirm>
                    </div>
                </div>
            </ErrorBoundary>

            <CreateLeaveRequest
                open={isOpenCreateModal}
                close={setIsOpenCreateModal}
            />
            <OffboardingForm
                open={isOpenResignationModal}
                close={setIsOpenResignationModal}
            />
        </>
    )
}

export default Profile