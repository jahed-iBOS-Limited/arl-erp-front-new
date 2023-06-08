import React from "react";

let btnStyle = {
  fontSize: "14px",
  padding: "4px 16px",
};

const ButtonStyleOne = ({ label, renderProps, className, ...rest }) => {
  return (
    <button
      style={btnStyle}
      className={className || "btn btn-primary"}
      {...rest}
    >
      {renderProps ? renderProps() : label}
    </button>
  );
};

export default ButtonStyleOne;
