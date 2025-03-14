// src/components/utils/Card.js
import React from "react";
import PropTypes from "prop-types";
import theme from "../../theme/theme";

const Card = ({
  children,
  variant = "default",
  className = "",
  onClick,
  hoverable = false,
  ...rest
}) => {
  const getCardStyles = () => {
    switch (variant) {
      case "flat":
        return theme.cards.flat;
      case "default":
      default:
        return theme.cards.default;
    }
  };

  const cardStyles = {
    ...getCardStyles(),
    ...(hoverable && { cursor: "pointer" }),
    ...(hoverable && { transition: "all 0.2s ease-in-out" }),
  };

  return (
    <div
      className={`card ${className}`}
      style={cardStyles}
      onClick={onClick}
      onMouseOver={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = theme.cards.hover.boxShadow;
        }
      }}
      onMouseOut={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = getCardStyles().boxShadow;
        }
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "flat"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  hoverable: PropTypes.bool,
};

export default Card;
