// src/components/utils/Button.js
import React from "react";
import PropTypes from "prop-types";
import theme from "../../theme/theme";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  className = "",
  type = "button",
  startIcon,
  endIcon,
  ...rest
}) => {
  const getVariantStyles = () => {
    if (disabled) {
      return theme.buttons.disabled;
    }

    switch (variant) {
      case "secondary":
        return theme.buttons.secondary;
      case "outline":
        return theme.buttons.outline;
      case "text":
        return theme.buttons.text;
      case "danger":
        return theme.buttons.danger;
      case "primary":
      default:
        return theme.buttons.primary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          padding: `${theme.spacing["2"]} ${theme.spacing["4"]}`,
          fontSize: theme.fontSizes.sm,
        };
      case "large":
        return {
          padding: `${theme.spacing["4"]} ${theme.spacing["8"]}`,
          fontSize: theme.fontSizes.lg,
        };
      case "medium":
      default:
        return {
          padding: `${theme.spacing["3"]} ${theme.spacing["6"]}`,
          fontSize: theme.fontSizes.base,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.fontWeight.medium,
    transition: "all 0.2s ease-in-out",
    cursor: disabled ? "not-allowed" : "pointer",
    width: fullWidth ? "100%" : "auto",
    ...variantStyles,
    ...sizeStyles,
  };

  const iconStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const startIconStyles = {
    ...iconStyles,
    marginRight: theme.spacing["2"],
  };

  const endIconStyles = {
    ...iconStyles,
    marginLeft: theme.spacing["2"],
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={buttonStyles}
      {...rest}
    >
      {startIcon && <span style={startIconStyles}>{startIcon}</span>}
      {children}
      {endIcon && <span style={endIconStyles}>{endIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "text",
    "danger",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
};

export default Button;
