import { Modal, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import './Index.css';
import { updateUserPersonalDetails } from '../../store/actions/Users.action';
import { useDispatch, useSelector } from 'react-redux';
import { buildFormData } from './hepler';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import OnboardingForm from './onboardingForms/OnboardingForm';
import ContactInfo from './onboardingForms/ContactInfo';
import MedicalInfo from './onboardingForms/MedicalInfo';
import BankInfo from './onboardingForms/BankInfo';
import Documents from './onboardingForms/Documents';
import { FaLongArrowAltLeft } from 'react-icons/fa';

const STEP_INDICATOR_ITEMS = [
  { title: 'Basic Info' },
  { title: 'Contact' },
  { title: 'Medical' },
  { title: 'Bank' },
  { title: 'Documents' },
];

const UserPersonalDetailsForm = ({ isOpen = true, setIsOpen, loading, }) => {
  const [formData, setFormData] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const { selecterId } = useSelector(({ auth }) => ({
    selecterId: auth?.user?._id,
  }));

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpen) {
      setFormData({});
      setActiveStep(0);
    }
  }, [isOpen]);

  const location = useLocation()
  const navigate = useNavigate()

  const callBack = () => {
    if (location?.pathname?.split('/')[1] === 'form') {
      navigate('/')
    } else {
      setIsOpen(false);
    }
  };

  const steps = [
    OnboardingForm,
    ContactInfo,
    MedicalInfo,
    BankInfo,
    Documents,
  ];

  const getStepTitle = () => {
    switch (activeStep) {
      case 0:
        return "Basic Information";
      case 1:
        return "Contact Information";
      case 2:
        return "Medical Information (Optional)";
      case 3:
        return "Bank And Salary Information (Optional)";
      case 4:
        return "Document Submission (Optional)";
      default:
        return "";
    }
  };

  const CurrentStepComponent = steps[activeStep];

  const handleStepSubmit = (stepPayload) => {
    const mergedData = {
      ...formData,
      ...stepPayload.formData,
      token,
    };

    setFormData(mergedData);

    if (activeStep === steps.length - 1) {
      const finalFormData = buildFormData(mergedData);
      dispatch(updateUserPersonalDetails(finalFormData, callBack));
      return;
    }

    setActiveStep(prev => prev + 1);
  };

  const renderBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  return (
    <Modal
      open={isOpen}
      footer={null}
      centered
      width={700}
      maskClosable={false}
      closable={false}
      destroyOnClose
      keyboard={false}
    >
      <div className="step-header">
        {activeStep > 0 && (
          <div className="render-back" onClick={renderBack}>
            <FaLongArrowAltLeft />
          </div>
        )}

        <div className="form-title">
          {getStepTitle()}
        </div>
      </div>

      <div className="form-steps-indicator">
        <Steps current={activeStep} items={STEP_INDICATOR_ITEMS} size="small" />
      </div>

      <div className="form-step-body" key={activeStep}>
        {CurrentStepComponent && (
          <CurrentStepComponent
            onBack={renderBack}
            loading={loading}
            data={formData}
            onSelect={handleStepSubmit}
          />
        )}
      </div>
    </Modal>
  );
};

export default UserPersonalDetailsForm;