// src/components/utils/Input.js
import React from "react";
import PropTypes from "prop-types";
import theme from "../../theme/theme";

const Input = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  fullWidth = true,
  disabled = false,
  className = "",
  required = false,
  id,
  name,
  ...rest
}) => {
  // Generate a unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  const inputStyles = {
    width: fullWidth ? "100%" : "auto",
    ...theme.inputs.default,
    ...(error ? theme.inputs.error : {}),
    ...(disabled
      ? { backgroundColor: theme.colors.neutral.gray100, cursor: "not-allowed" }
      : {}),
  };

  const labelStyles = {
    display: "block",
    marginBottom: theme.spacing["2"],
    fontWeight: theme.fontWeight.medium,
    color: error ? theme.colors.danger.main : theme.colors.text.primary,
    fontSize: theme.fontSizes.sm,
  };

  const helperTextStyles = {
    marginTop: theme.spacing["1"],
    fontSize: theme.fontSizes.xs,
    color: error ? theme.colors.danger.main : theme.colors.text.secondary,
  };

  const containerStyles = {
    marginBottom: theme.spacing["4"],
    width: fullWidth ? "100%" : "auto",
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label htmlFor={inputId} style={labelStyles}>
          {label}{" "}
          {required && (
            <span style={{ color: theme.colors.danger.main }}>*</span>
          )}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        name={name || inputId}
        className="form-input"
        style={inputStyles}
        {...rest}
      />
      {helperText && <p style={helperTextStyles}>{helperText}</p>}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  required: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default Input;
