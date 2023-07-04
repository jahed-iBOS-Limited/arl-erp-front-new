import React from "react";

const IButton = ({ onClick, className, type, children, disabled, colSize }) => {
  return (
    <div className={`${colSize ? colSize : "col-12"} mt-5 text-right`}>
      <button
        className={`btn ${className ? className : "btn-primary"}`}
        type={type ? type : "button"}
        onClick={onClick}
        disabled={disabled}
      >
        {children ? children : "View"}
      </button>
    </div>
  );
};

export default IButton;
