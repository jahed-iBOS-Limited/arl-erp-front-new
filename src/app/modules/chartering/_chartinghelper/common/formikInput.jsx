import { Field } from "formik";
import React from "react";
import FormikError from "./formikError";

const FormikInput = (props) => {
  const {
    placeholder,
    value,
    name,
    type,
    errors,
    touched,
    disabled,
    label,
  } = props;
  return (
    <>
      {label && <label>{label}</label>}
      <Field
        {...props}
        value={value}
        name={name}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        style={{
          border: "1px solid hsl(0,0%,80%)",
          borderRadius: "5px",
          padding: "3px 8px",
          width: "100%",
        }}
      />
      <FormikError errors={errors} touched={touched} name={name} />
    </>
  );
};

export default FormikInput;

// usage
/* 
<div className="col-lg-3">
  <label>Delivery Address</label>
  <FormikInput
    value={values?.deliveryAddress}
    name="deliveryAddress"
    placeholder="Delivery Address"
    type="text"
    errors={errors}
    touched={touched}
    />
</div>
*/
