import React, { useRef } from 'react';
import { Form, Formik } from 'formik';
import { Button, Col, Divider, Row } from 'antd';
import { assetsSchema } from "../userPersonalDetailsModal/Validations";
import { ConditionalRendering } from '../../utils/Methods';
import { CInput } from '../../uiComponents';
import CSelect from '../../uiComponents/cSelect/CSelect';

const AssetsForm = ({ loading, data = {}, onSelect }) => {
  const form = useRef(null);

  const initialValues = {
    laptop: "",
    brandName: "",
    headphone: "",
    headphoneBrand: "",
    welcomePack: "",
    other: "",
    ...data,
  };

  const submit = (values) => {
    onSelect({ formData: values }, 2);
  };

  return (
    <div className="form-wrapper">
      <Formik
        innerRef={form}
        validationSchema={assetsSchema}
        initialValues={initialValues}
        onSubmit={submit}
        enableReinitialize
      >
        {({ errors, touched, values, submitCount, handleChange, setFieldValue }) => (
          <Form>

            <Divider orientation="left">Assets Info</Divider>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={24} md={12}>
                <CSelect
                  label="Laptop *"
                  placeholder="Received Laptop"
                  name="laptop"
                  value={values.laptop || undefined}
                  onChange={(val) => {
                    setFieldValue("laptop", val)
                    if (val !== "YES") {
                      setFieldValue("brandName", "");
                    }
                  }}
                  disabled={loading}
                  data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                  error={submitCount ? errors.laptop : touched.laptop && errors.laptop}
                />
              </Col>

              <ConditionalRendering
                condition={values.laptop === "YES"}
                children={
                  <Col xs={24} sm={24} md={12}>
                    <CInput
                      label="Brand/ Model *"
                      placeHolder="Enter Laptop Brand Name"
                      name="brandName"
                      value={values.brandName}
                      onChange={handleChange}
                      disabled={loading}
                      error={submitCount ? errors.brandName : touched.brandName && errors.brandName}
                    />
                  </Col>
                }
              />

              <Col xs={24} sm={24} md={12}>
                <CSelect
                  label="Headphone *"
                  placeholder="Received Headphone"
                  name="headphone"
                  value={values.headphone || undefined}
                  onChange={(val) => {
                    setFieldValue("headphone", val)
                    if (val !== "YES") {
                      setFieldValue("headphoneBrand", "");
                    }
                  }}
                  disabled={loading}
                  data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                  error={submitCount ? errors.headphone : touched.headphone && errors.headphone}
                />
              </Col>

              <ConditionalRendering
                condition={values.headphone === "YES"}
                children={
                  <Col xs={24} sm={24} md={12}>
                    <CInput
                      label="Headphone Brand/Model *"
                      placeHolder="Enter Headphone Brand/Model"
                      name="headphoneBrand"
                      value={values.headphoneBrand}
                      onChange={handleChange}
                      disabled={loading}
                      error={submitCount ? errors.headphoneBrand : touched.headphoneBrand && errors.headphoneBrand}
                    />
                  </Col>
                }
              />

              <Col xs={24} sm={24} md={12}>
                <CSelect
                  label="Welcome Pack *"
                  placeholder="Received Welcome Pack"
                  name="welcomePack"
                  value={values.welcomePack || undefined}
                  onChange={(val) => setFieldValue("welcomePack", val)}
                  disabled={loading}
                  data={[{ key: "YES", label: "Yes" }, { key: "NO", label: "No" }]}
                  error={submitCount ? errors.welcomePack : touched.welcomePack && errors.welcomePack}
                />
              </Col>

              <Col xs={24} sm={24} md={12}>
                <CInput
                  label="Other"
                  placeHolder="Enter Anything Else"
                  name="other"
                  value={values.other}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Col>
            </Row>

            <Button
              className="user-details-form-btn"
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AssetsForm;
