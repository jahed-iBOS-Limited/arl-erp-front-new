// Dont touch this file
import React from "react";

const FormikError = ({ errors, name, touched }) => {
  return (
    <p
      style={{
        fontSize: "12px",
        fontWeight: 400,
        width: "100%",
        marginTop: "0",
        marginBottom: "0",
      }}
      className={errors[name] ? "text-danger" : "d-none"}
    >
      {(errors && errors[name]) || (touched && touched[name])
        ? errors[name]?.value || errors[name]
        : ""}
    </p>
  );
};

export default FormikError;
