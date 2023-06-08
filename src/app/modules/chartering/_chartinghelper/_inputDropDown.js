import React from "react";
import customStyles from "../helper/common/selectCustomStyle";
import { Field } from "formik";
import Select from "react-select";
import { isArray } from "lodash";

export function ISelect(props) {
  const {
    label,
    name,
    setFieldValue,
    errors,
    touched,
    dependencyFunc,
    values,
    disabledFields,
    prevDependencyFunc,
    labelHidden,
  } = props;
  let isDisabled = false;
  if (isArray(disabledFields)) {
    if (disabledFields.length > 1) {
      const length = disabledFields.length;
      for (var i = 0; i < length - 1; i++) {
        const firstEle = disabledFields[i];
        for (var j = 1; j < length; j++) {
          const secondEle = disabledFields[j];
          isDisabled = !values[firstEle] || !values[secondEle];
        }
      }
    } else {
      for (let i = 0; i < disabledFields.length; i++) {
        const ele = disabledFields[i];
        isDisabled = !values[ele];
      }
    }
  }
  /*
   **** When use iselect via a LOOP then we don't need to pass isDisabled props (Must not pass)
   */
  const placeholder = labelHidden ? "" : label;
  return (
    <>
      <label>{label}</label>
      <Field
        component={() => (
          <Select
            onChange={(valueOption) => {
              setFieldValue(name, valueOption);
              prevDependencyFunc && prevDependencyFunc(values.year);
              dependencyFunc &&
                dependencyFunc(valueOption.value, values, setFieldValue, valueOption.label);
            }}
            isDisabled={isDisabled}
            isSearchable={true}
            styles={customStyles}
            placeholder={placeholder}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
            })}
            {...props}
          />
        )}
      />

      <p
        style={{
          fontSize: "0.9rem",
          fontWeight: 400,
          width: "100%",
          marginTop: "0.25rem",
        }}
        className="text-danger"
      >
        {errors && errors[name] && touched && touched[name]
          ? errors[name].value
          : ""}
      </p>
    </>
  );
}
