import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AccessRequestForm from './AccessRequestForm';
import AssetsForm from './AssetsForm';
import { updateUserAccessReqForm } from '../../store/actions/Users.action';

const UserAccessRequestIndex = ({ userId, isOpen, setIsOpen }) => {

    const [activeStep, setActiveStep] = useState(1);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();

    const { loading } = useSelector(({ users }) => ({
        loading: users?.updateAccessRightsFormLoading
    }));


    useEffect(() => {
        if (!isOpen) { setActiveStep(1); setFormData({}); }
    }, [isOpen]);

    const callBack = () => {
        setIsOpen(false)
    }

    const handleStepSubmit = (payload, step) => {
        const merged = { ...formData, ...payload.formData };
        setFormData(merged);

        if (step === 1) {
            setActiveStep(2);
            return;
        }

        if (step === 2) {

            const finalPayload = {
                refUserId: userId,
                role: merged.role,
                accessRights: {
                    refUserId: userId,

                    microsoft365: merged.microsoft365,
                    teams: merged.teams,
                    powerBI: merged.powerBI,
                    msOfficeApps: merged.msOfficeApps,
                    portals: merged.portals,
                    webOops: merged.webOops,
                    intelliconContegris: merged.intelliconContegris,

                    databaseAccess: merged.databaseAccess,
                    gitRepository: merged.gitRepository,
                    jira: merged.jira,
                    postman: merged.postman,
                    awsIamRoles: merged.awsIamRoles,
                    serverAccess: merged.serverAccess,
                    datadog: merged.datadog,
                    laptop: merged.laptop,
                    brandName: merged.brandName,
                    headphone: merged.headphone,
                    headphoneBrand: merged.headphoneBrand,
                    welcomePack: merged.welcomePack,
                    other: merged.other,
                }
            };

            dispatch(updateUserAccessReqForm(finalPayload, callBack));
        }
    };

    return (
        <Modal
            open={isOpen}
            footer={null}
            centered
            width={700}
            onCancel={() => setIsOpen(false)}
            destroyOnClose
        >
            {activeStep === 1 && (
                <AccessRequestForm
                    loading={loading}
                    data={formData}
                    onSelect={(data) => handleStepSubmit(data, 1)}
                />
            )}

            {activeStep === 2 && (
                <AssetsForm
                    loading={loading}
                    data={formData}
                    onSelect={(data) => handleStepSubmit(data, 2)}
                />
            )}
        </Modal>
    );
};

export default UserAccessRequestIndex;
