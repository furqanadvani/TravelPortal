import React from "react";
import logo from "../../assets/Logo.png";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="ant-loading-page">
      <div className="loader-badge">
        <span className="loader-ring" />
        <img src={logo} alt="" className="loader-logo" />
      </div>

      <span className="loader-text">
        Loading
        <span className="loader-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </span>
      </span>

      <div className="loader-progress">
        <span className="loader-progress-bar" />
      </div>
    </div>
  );
};

export default Loader;