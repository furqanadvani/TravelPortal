import React, { useState } from "react";
import { DatePicker } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./CInput.css";

const CInput = ({
  placeHolder = "",
  name,
  label,
  type = "text",
  value = "",
  className = "",
  error,
  onChange = () => null,
  onBlur = () => null,
  disabled = false,
  min,
  max,
  format = "DD/MM/YYYY",
  showTime = false,
  picker,
  allowClear = true,
  disableDate,
  hideInputPlaceholder = false,
  clear = false,
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const renderDatePicker = () => {
    return !clear ? (
      <DatePicker
        showTime={showTime}
        id={name}
        disabled={disabled || loading}
        value={value ? dayjs(value) : null}
        onChange={(date) => onChange(date)}
        disabledDate={disableDate}
        {...(!hideInputPlaceholder && { placeholder: placeHolder })}
        name={name}
        {...(picker && { picker: picker })}
        allowClear={allowClear}
        format={format}
        className={`cinput-field ${error ? "cinput-error-border" : ""}`}
      />
    ) : (
      <div className="clear-text">
        {value ? dayjs(value).format("DD-MMM-YYYY") : "-"}
      </div>
    );
  };

  const renderPasswordInput = () => {
    return (
      <div className="password-wrapper">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled || loading}
          autoComplete={name === "password" ? "current-password" : "off"}
          className={`cinput-field password-input ${error ? "cinput-error-border" : ""}`}
        />

        <button
          type="button"
          className="password-eye"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={0}
        >
          {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      </div>
    );
  };

  return (
    <div className={`cinput-container ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}

      {type === "date" ? (
        renderDatePicker()
      ) : type === "password" ? (
        renderPasswordInput()
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled || loading}
          min={min}
          max={max}
          autoComplete={type === "email" ? "email" : "off"}
          className={`cinput-field ${error ? "cinput-error-border" : ""}`}
        />
      )}

      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default CInput;
