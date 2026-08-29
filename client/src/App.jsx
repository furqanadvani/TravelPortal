import 'antd/dist/reset.css';
import { useEffect } from "react";
import AuthRoutes from "./routes/Auth";
import ProtectedRoutes from "./routes/Protected";
import { useSelector, useDispatch } from "react-redux";
import { getProfile } from "./store/actions/Auth.action";
import Loader from "./components/loader/Loader";
import { PageWrapper } from "./container";
import "./App.css";
import "../src/pages/dashboard/Dashboard.css";
import "./Media.css"

const renderAppRoutes = ({ isLoggedIn, loading }) => {

  if (loading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <AuthRoutes />;
  }

  if (isLoggedIn) {
    return (
      <PageWrapper>
        <ProtectedRoutes />
      </PageWrapper>
    );
  }

  return <Loader />;
};

function App() {
  const dispatch = useDispatch();

  const { isLoggedIn, loading } = useSelector(({ auth }) => ({
    isLoggedIn: auth?.isLoggedIn,
    loading: auth?.loginLoading || auth?.getProfileLoading,
  }));


  useEffect(() => {
    dispatch(getProfile());
  }, []);   

  return renderAppRoutes({ isLoggedIn, loading });
}

export default App;
