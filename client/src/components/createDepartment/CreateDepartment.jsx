import React from 'react';
import {
  Modal,
  Form as AntForm,
  Divider,
  Button,
} from 'antd';
import { Formik } from 'formik';
import './CreateDepartment.css';
import { useDispatch, useSelector } from 'react-redux';
import { createDepartment, getDepartments } from '../../store/actions/Departments.action';
import { validationSchema } from "./Validations"
import TextArea from 'antd/es/input/TextArea';
import { CInput } from '../../uiComponents';

const DESCRIPTION_MAX_LENGTH = 75;

const CreateDepartment = ({ isOpenAddModal, setIsOpenAddModal }) => {
  const dispatch = useDispatch();

  const { loading, userRole, userId } = useSelector(({ auth, departments }) => ({
    loading: departments?.createDepartmentLoading,
    userId: auth?.user?._id,
    userRole: auth?.user?.role
  }));

  const initialValues = {
    title: '',
    description: ""
  };

  const callBack = () => {
    if (!loading) {
      setIsOpenAddModal(false)
      const payload = { userId, role: userRole };
      dispatch(getDepartments(payload));
    }
  }

  const handleSubmit = (values) => {
    const payload = {
      title: values.title,
      description: values.description,
    };
    dispatch(createDepartment(payload, callBack));
  };

  return (
    <Modal
      open={isOpenAddModal}
      onCancel={() => setIsOpenAddModal(false)}
      footer={null}
      width={600}
      destroyOnClose
      className="create-team-modal"
    >
      <div className='form-wrapper'>

        <div className="form-header">
          <h1 className="form-title">Create New Department</h1>
          <p className="form-subtitle">Set up a new Department with a title, description</p>
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleSubmit, handleBlur, submitCount }) => {
            const descriptionError = submitCount ? errors.description : touched.description && errors.description;

            return (
              <AntForm layout="vertical" onFinish={handleSubmit} className="create-team-form">
                <CInput
                  label="Department Title"
                  name="title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  placeHolder="Enter Department name"
                  error={submitCount ? errors.title : touched.title && errors.title}
                />

                <AntForm.Item
                  label={<span className="form-label">Description</span>}
                  validateStatus={descriptionError ? "error" : ""}
                >
                  <TextArea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    placeholder="Describe your department's purpose..."
                    className="form-textarea"
                  />
                  <div className="form-textarea-footer">
                    <span className={`form-error ${!descriptionError ? 'form-error-hidden' : ''}`}>
                      {descriptionError || ''}
                    </span>
                    <span className="form-char-count">
                      {values.description.length}/{DESCRIPTION_MAX_LENGTH}
                    </span>
                  </div>
                </AntForm.Item>

                <Divider />

                <div className="form-actions">
                  <Button
                    className="cancel-button"
                    onClick={() => setIsOpenAddModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-button"
                    loading={loading}
                    disabled={loading}
                  >
                    Create Department
                  </Button>
                </div>
              </AntForm>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default CreateDepartment;