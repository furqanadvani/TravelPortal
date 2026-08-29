import React, { useMemo, useRef, useState } from 'react'
import { CInput } from '../../../uiComponents'
import { Form, Formik } from 'formik'
import { Button, Divider, Row, Col } from 'antd'
import CSelect from '../../../uiComponents/cSelect/CSelect'
import { useSelector } from 'react-redux'
import { basicFormSchema } from "../Validations"
import { ConditionalRendering } from '../../../utils/Methods'
import dayjs from 'dayjs'
import { NATIONALITIES, sortNationalitiesBySearch } from '../hepler'


const OnboardingForm = ({ loading, data = {}, onSelect }) => {
  const [nationalitySearch, setNationalitySearch] = useState("");

  const form = useRef(null)

  const { submitLoading } = useSelector(({ users }) => ({
    submitLoading: users?.updateUserPersonalDetailsLoading,
  }))

  const initialValues = {
    firstName: '',
    lastName: '',
    fatherName: '',
    nationality: '',
    gender: '',
    maritalStatus: '',
    passportExpiry: '',
    emiratesIdExpiry: '',
    dateOfBirth: '',
    governmentId: '',
  }

  const submit = (values) => {
    onSelect({ formData: { ...values } }, 0);
  };

  const filteredNationalities = useMemo(() => {
    return sortNationalitiesBySearch(NATIONALITIES, nationalitySearch);
  }, [nationalitySearch]);

  return (
    <div className='form-wrapper'>
      <Formik
        innerRef={form}
        validationSchema={basicFormSchema}
        validateOnChange
        validateOnBlur
        initialValues={{
          ...initialValues,
          ...data,
        }}
        onSubmit={submit}
      >
        {(formikProps) => {
          const {
            errors,
            touched,
            handleSubmit,
            values,
            submitCount,
            handleChange,
            setFieldValue,
            handleBlur,
          } = formikProps;
          return (

            <Form>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <CInput
                    label={<> First Name <span className='required-field'>*</span> </>}
                    placeHolder="Enter Your First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    disabled={loading || submitLoading}
                    error={submitCount ? errors.firstName : touched.firstName && errors.firstName}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <CInput
                    label={<> Last Name <span className='required-field'>*</span> </>}
                    placeHolder="Enter Your Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    disabled={loading || submitLoading}
                    error={submitCount ? errors.lastName : touched.lastName && errors.lastName}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <CInput
                    label={<> Father Name <span className='required-field'>*</span> </>}
                    placeHolder="Enter Your Father Name"
                    name="fatherName"
                    value={values.fatherName}
                    onChange={handleChange}
                    disabled={loading || submitLoading}
                    error={submitCount ? errors.fatherName : touched.fatherName && errors.fatherName}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <CSelect
                    label={<> Work Location <span className='required-field'>*</span> </>}
                    placeholder="Select Your Work Location"
                    name="workLocation"
                    value={values.workLocation || undefined}
                    onChange={(value) => {
                      setFieldValue("workLocation", value)
                      if (value !== "DUBAI") {
                        setFieldValue("passportExpiry", "");
                        setFieldValue("emiratesIdExpiry", "");
                      }
                    }}
                    disabled={loading || submitLoading}
                    data={[
                      { key: "KARACHI", label: "Karachi" },
                      { key: "DUBAI", label: "Dubai" },
                    ]}
                    error={submitCount ? errors.workLocation : touched.workLocation && errors.workLocation}
                  />
                </Col>

                <ConditionalRendering
                  condition={values?.workLocation === "DUBAI"}
                  children={
                    <>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <CInput
                          label={<> Passport Expiry <span className='required-field'>*</span> </>}
                          name="passportExpiry"
                          placeHolder="Passport Expiry"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={values.passportExpiry}
                          error={submitCount ? errors.passportExpiry : touched.passportExpiry && errors.passportExpiry}
                          onChange={(val) => setFieldValue('passportExpiry', val)}
                          format={"DD-MMM-YYYY"}
                          disabled={loading || submitLoading}
                          disableDate={(current) => {
                            if (!current) return false;
                            return current.valueOf() < dayjs().startOf("day").valueOf();
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <CInput
                          label={<> Emirates ID Expiry <span className='required-field'>*</span> </>}
                          name="emiratesIdExpiry"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={values.emiratesIdExpiry}
                          error={submitCount ? errors.emiratesIdExpiry : touched.emiratesIdExpiry && errors.emiratesIdExpiry}
                          onChange={(val) => setFieldValue('emiratesIdExpiry', val)}
                          format={"DD-MMM-YYYY"}
                          disabled={loading || submitLoading}
                          placeHolder="Emirates ID Expiry"
                          disableDate={(current) => {
                            if (!current) return false;
                            return current.valueOf() < dayjs().startOf("day").valueOf();
                          }}
                        />
                      </Col>
                    </>
                  }
                />

                <Col xs={24} sm={24} md={12} lg={12}>
                  <CSelect
                    label={<> Select Gender <span className='required-field'>*</span> </>}
                    placeholder="Select Your Gender"
                    name="gender"
                    value={values.gender || undefined}
                    onChange={(value) => setFieldValue("gender", value)}
                    disabled={loading || submitLoading}
                    data={[
                      { key: "MALE", label: "Male" },
                      { key: "FEMALE", label: "Female" },
                      { key: "OTHER", label: "Other" },
                    ]}
                    error={submitCount ? errors.gender : touched.gender && errors.gender}
                  />
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                  <CInput
                    label={<> Date of Birth <span className='required-field'>*</span> </>}
                    name='dateOfBirth'
                    type="date"
                    placeHolder="Date Of Birth"
                    onChange={(val) => setFieldValue('dateOfBirth', val)}
                    value={values.dateOfBirth}
                    disabled={loading || submitLoading}
                    error={submitCount ? errors.dateOfBirth : touched.dateOfBirth && errors.dateOfBirth}
                    format={"DD-MMM-YYYY"}
                    disableDate={(current) => {
                      const minDate = dayjs("1950-01-01");
                      const minAgeDate = dayjs().subtract(18, "year");

                      return (
                        current &&
                        (
                          current.isBefore(minDate.startOf("day")) ||
                          current.isAfter(minAgeDate.endOf("day"))
                        )
                      );
                    }}
                  />
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                  <CInput
                    label={<> CNIC No / Emirates ID No <span className='required-field'>*</span> </>}
                    name="governmentId"
                    placeHolder="Enter Your CNIC Or Emirates Id No"
                    value={values.governmentId}
                    onChange={handleChange}
                    disabled={loading || submitLoading}
                    error={submitCount ? errors.governmentId : touched.governmentId && errors.governmentId}
                  />
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                  <CSelect
                    label={<> Select Nationality <span className='required-field'>*</span> </>}
                    placeholder="Select Your nationality"
                    name="nationality"
                    value={values.nationality || undefined}
                    onChange={(value) => setFieldValue("nationality", value)}
                    disabled={loading || submitLoading}
                    data={filteredNationalities}
                    error={submitCount ? errors.nationality : touched.nationality && errors.nationality}
                    onSearch={(value) => setNationalitySearch(value)}
                    filterOption={false}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <CSelect
                    label={<> Select Marital Status <span className='required-field'>*</span> </>}
                    placeholder="Select Your Marital Status"
                    name="maritalStatus"
                    value={values.maritalStatus || undefined}
                    onChange={(value) => setFieldValue("maritalStatus", value)}
                    disabled={loading || submitLoading}
                    data={[
                      { key: "SINGLE", label: "Single" },
                      { key: "MARRIED", label: "Married" },
                      { key: "DIVORCED", label: "Divorced" },
                      { key: "WIDOWED", label: "Widowed" },
                    ]}
                    error={submitCount ? errors.maritalStatus : touched.maritalStatus && errors.maritalStatus}
                  />
                </Col>
              </Row>

              <Divider size="middle" />

              <Button
                className="user-details-form-btn"
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
                loading={loading || submitLoading}
                disabled={loading || submitLoading}
              >
                Submit
              </Button>
            </Form>
          )
        }}
      </Formik >
    </div>
  )
}

export default OnboardingForm