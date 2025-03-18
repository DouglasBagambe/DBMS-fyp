// app/components/Button.js

import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  fullWidth = false,
  ...props
}) {
  // Base classes
  let buttonClasses =
    "relative overflow-hidden inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500";

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-glow transform hover:-translate-y-1",
    secondary:
      "bg-secondary-600 hover:bg-secondary-700 text-white shadow-md transform hover:-translate-y-1",
    outline:
      "bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-700 hover:text-primary-700 transform hover:-translate-y-1",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-800 dark:text-gray-200",
    success:
      "bg-success hover:bg-success/90 text-white shadow-md hover:shadow-glow-success transform hover:-translate-y-1",
    danger:
      "bg-alert hover:bg-alert/90 text-white shadow-md hover:shadow-glow-alert transform hover:-translate-y-1",
  };

  // Disabled state
  if (disabled) {
    buttonClasses +=
      " opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none";
  }

  // Full width
  if (fullWidth) {
    buttonClasses += " w-full";
  }

  return (
    <button
      type={type}
      className={`${buttonClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {/* Optional ripple effect */}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className="absolute inset-0 -translate-x-full hover:translate-x-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out"></span>
      </span>

      {/* Button content */}
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
