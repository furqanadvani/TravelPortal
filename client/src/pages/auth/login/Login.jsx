import { Form, Formik } from "formik";
import { Button } from "antd";
import "../Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/actions/Auth.action";
import { useNavigate } from "react-router-dom";
import { validationSchema } from "./Validations"
import { CInput } from "../../../uiComponents";
import logo from '../../../assets/Logo.png'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const { loading } = useSelector(({ auth }) => ({
    loading: auth?.loginLoading,
  }));

  const initialValues = {
    email: "",
    password: "",
  };

  const loginCallBack = (changePasswordToken) => {
    navigate(`/change-password?token=${changePasswordToken}`);
  }

  const handleSubmit = async (values) => {
    let payload = { email: values.email, password: values.password }
    dispatch(login(payload, loginCallBack));
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-animated">
        <div className="auth-header">
          <img className="auth-logo" src={logo} alt="TMS" />
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-para">Sign in to your account and manage your task effortlessly!</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            submitCount,
          }) => (
            <Form>
              <CInput
                label="Email"
                placeHolder="john@email.com"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={submitCount ? errors.email : touched.email && errors.email}
                disabled={loading}
              />

              <CInput
                name="password"
                label="Password"
                placeHolder="Enter your password"
                value={values.password}
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                error={submitCount ? errors.password : touched.password && errors.password}
              />

              {/* <div className="forgot-password">
                <p onClick={() => navigate("/forgotpassword")}>Forgot Password?</p>
              </div> */}

              <Button
                htmlType="submit"
                block
                className="auth-btn auth-btn-primary"
                loading={loading}
                disabled={loading}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;