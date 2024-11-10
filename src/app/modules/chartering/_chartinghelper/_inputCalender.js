import React from "react";
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
        placeholder={label}
        label={label && label}
        disabled={disabled}
      />
    </>
  );
}

export default React.memo(ICalendar);

