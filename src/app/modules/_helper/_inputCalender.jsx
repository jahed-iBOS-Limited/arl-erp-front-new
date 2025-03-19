import React from "react";
import { Input } from "../../../_metronic/_partials/controls";
import { Field } from "formik";

function ICalendar(props) {
  const { value, name, label, disabled } = props;
  return (
    <>
      <Field
        value={value}
        {...props}
        name={name}
        type="date"
        component={Input}
        placeholder={label}
        label={label && label}
        disabled={disabled}
      />
    </>
  );
}

export default React.memo(ICalendar);

