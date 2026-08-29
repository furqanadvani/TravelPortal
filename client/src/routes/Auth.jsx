
import { Route, Routes } from 'react-router-dom';
import { Login, ChangePassword } from '../pages/auth';

const AuthRoutes = () => {
  const LoginComponent = Login;

  return (
    <Routes>
      <Route path="/" element={<LoginComponent />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="*" element={<LoginComponent />} />
    </Routes>
  );
};

export default AuthRoutes;