import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/index.js'

// lib css
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "antd/dist/reset.css";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  // <Provider store={store}>
  <App />
  // </Provider>
  // </StrictMode>,
)
