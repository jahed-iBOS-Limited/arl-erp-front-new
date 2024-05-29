import React from "react";
import { Field } from "formik";
import { Input } from "../../../_metronic/_partials/controls";
import FormikError from "./_formikError";

const InputField = (props) => {
  const {
    placeholder,
    value,
    name,
    type,
    errors,
    touched,
    resetFieldValue,
    style
  } = props;
  return (
    <div className="position-relative" style={style}>
      <Field
        step={type === "number" ? "any" : ""}
        {...props}
        value={value}
        name={name}
        component={Input}
        placeholder={placeholder}
        // feedback={false}
        type={type}
      />
      {errors && touched && (
        <FormikError errors={errors} touched={touched} name={name} />
      )}
      {resetFieldValue && (
        <button
          style={{
            position: "absolute",
            top: "18px",
            right: "15px",
            width: "10px",
          }}
          className="btn pointer"
          onClick={(e) => {
            resetFieldValue();
          }}
        >
          <i class="fa fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default InputField;

// usage
/*
<div className="col-lg-3">
  <label>Delivery Address</label>
  <InputField
    value={values?.deliveryAddress}
    name="deliveryAddress"
    placeholder="Delivery Address"
    type="text"
   />
</div>
*/
