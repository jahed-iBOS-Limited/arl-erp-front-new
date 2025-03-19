import React from "react";
import { Input } from "../../../_metronic/_partials/controls";
import { Field } from "formik";

export function IInput(props) {
  const { value, name, label, disabled, placeholder, min, max, type } = props;
  return (
    <>
      <Field
        step={type === "number" ? "any" : ""}
        {...props}
        min={min}
        max={max}
        value={`${value}` || ""}
        name={name}
        component={Input}
        placeholder={label || placeholder}
        label={label}
        disabled={disabled}
        type={type}
      />
    </>
  );
}
