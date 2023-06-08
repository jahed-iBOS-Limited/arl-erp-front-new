import React from "react";
import { Field } from "formik";
import { Input } from "./fieldController"

const InputField = (props) => {
  const { placeholder, value, name, type } = props;
  return (
    <>
      <Field
        {...props}
        value={value}
        name={name}
        component={Input}
        placeholder={placeholder}
        feedback={false}
        type={type}
      />
    </>
  );
};

export default InputField;