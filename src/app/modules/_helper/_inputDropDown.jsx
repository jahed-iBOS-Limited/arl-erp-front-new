import React, { useRef, useState } from "react";
import customStyles from "../selectCustomStyle";
// import { Field } from "formik";
import Select from "react-select";
import { isArray } from "lodash";
import { Overlay, Tooltip } from "react-bootstrap";
export function ISelect(props) {
  const [show, setShow] = useState(false);
  const target = useRef(null);
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
    value,
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
      <div
        ref={target}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <Overlay
          target={target.current}
          show={ value?.value && show}
          placement="top-start"
        >
          {(props) => (
            <Tooltip id="overlay-example" {...props}>
           {value?.label}
            </Tooltip>
          )}
        </Overlay>
        <label>{label}</label>
        {/* <Field
          component={() => ( */}
            <Select
              onChange={(valueOption) => {
                setFieldValue(name, valueOption || "");
                prevDependencyFunc && prevDependencyFunc(values?.year);
                dependencyFunc &&
                  dependencyFunc(
                    valueOption?.value,
                    values,
                    setFieldValue,
                    valueOption?.label,
                    valueOption
                  );
              }}
              onBlur={() => setShow(false)}
              isDisabled={isDisabled}
              isSearchable={true}
              styles={customStyles}
              placeholder={placeholder}
              {...props}
              isClearable={true}
            />
          {/* )}
        /> */}

        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: 400,
            width: "100%",
            marginTop: "0.25rem",
          }}
          className={errors && errors[name] && touched && touched[name] ? "text-danger" : "d-none"} // Change for disabled extra space in ddl bottom
        >
          {errors && errors[name] && touched && touched[name]
            ? errors[name].value
            : ""}
        </p>
      </div>
    </>
  );
}
