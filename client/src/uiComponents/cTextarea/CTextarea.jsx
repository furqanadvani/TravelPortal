import React from "react";
import "./CTextarea.css"; // same CSS file reuse kar sakte ho

const CTextarea = ({
    label,
    name,
    value = "",
    placeHolder = "",
    className = "",
    error,
    onChange = () => null,
    onBlur = () => null,
    disabled = false,
    rows = 4,
    maxLength,
}) => {
    return (
        <div className={`cinput-container ${className}`}>
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                </label>
            )}

            <textarea
                id={name}
                name={name}
                rows={rows}
                placeholder={placeHolder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                maxLength={maxLength}
                className={`cinput-textarea ${error ? "cinput-error-border" : ""}`}
            />

            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export default CTextarea;