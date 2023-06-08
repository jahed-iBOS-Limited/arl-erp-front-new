import React from "react";
import { Field } from "formik";
import { Input } from "./fieldController"

export function IInput(props) {
  const { value, name, label, disabled, placeholder, min, max, type, } = props;
  return (
    <>
      <Field
        {...props}
        min={min}
        max={max}
        value={`${value}` || ""}
        component={Input}
        name={name}
        placeholder={label || placeholder}
        label={label}
        disabled={disabled}
        type={type}
      />
    </>
  );
}
