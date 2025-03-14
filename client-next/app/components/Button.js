import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  icon = null,
  fullWidth = false,
}) => {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const iconClass = icon ? "flex items-center justify-center gap-2" : "";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${iconClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
