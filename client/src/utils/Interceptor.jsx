import axios from "axios";
import { store } from "../store";
import { logout } from "../store/actions/Auth.action";
import { TOKEN } from "./Constants";

const BASE_URL = 'http://localhost:8080/api'
// const BASE_URL = 'https://tms.kamelpay.tech/api'


const SOCKET_URL = "http://localhost:8080";
// const SOCKET_URL = "https://tms.kamelpay.tech";

const setupInterceptor = () => {
  axios.defaults.baseURL = BASE_URL;

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(TOKEN);

      if (!token) {
        store.dispatch(logout())
      } else {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => {
      const newToken = response?.data?.token;
      if (!response?.data?.isFirstLogin && newToken) {
        localStorage.setItem(TOKEN, newToken);
      }
      return response;
    },
    (error) => {
      const isUnauthorized =
        error?.response?.status === 401 ||
        error?.response?.data?.data?.message === 'Session expired.';

      if (isUnauthorized) {
        localStorage.removeItem(TOKEN);
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};

export { setupInterceptor, SOCKET_URL };
