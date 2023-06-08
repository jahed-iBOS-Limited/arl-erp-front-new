import React from "react";
import { radioStyle } from "./helper";

export const BADCBCICForm = ({ values, setFieldValue, disabled, onChange }) => {
  return (
    <div className="col-12 mt-3 d-flex">
      <div className="d-flex align-items-center mr-5">
        <input
          style={radioStyle}
          type="radio"
          name="type"
          id="badc"
          value={values?.type}
          checked={values?.type === "badc"}
          onChange={() => {
            setFieldValue("type", "badc");
            onChange && onChange("type", values, "badc", setFieldValue);
          }}
          disabled={disabled || false}
        />
        <label htmlFor="badc" className="ml-1">
          <h3>BADC</h3>
        </label>
      </div>
      <div className="d-flex align-items-center ml-5">
        <input
          style={radioStyle}
          type="radio"
          name="type"
          id="bcic"
          value={values?.type}
          checked={values?.type === "bcic"}
          onChange={() => {
            setFieldValue("type", "bcic");
            onChange && onChange("type", values, "bcic", setFieldValue);
          }}
          disabled={disabled || false}
        />
        <label htmlFor="bcic" className="ml-1">
          <h3>BCIC</h3>
        </label>
      </div>
    </div>
  );
};
