import React from "react";
import InputField from "../_inputField";

function FromDateToDateForm({ obj }) {
  const {
    setFieldValue,
    values,
    setGridData,
    onChange,
    colSize,
    time,
    type,
    disabled,
  } = obj;

  const col = colSize ? colSize : `col-lg-3`;
  return (
    <>
      <div className={`${col} ${time && "d-flex"}`}>
        <InputField
          label="From Date"
          value={values?.fromDate}
          name="fromDate"
          placeholder="Date"
          type={`${type ? type : "date"}`}
          onChange={(e) => {
            setGridData && setGridData([]);
            setFieldValue("fromDate", e.target.value);
            onChange &&
              onChange({ ...values, fromDate: e?.target?.value }, "fromDate");
          }}
          disabled={disabled}
        />
        {time && (
          <InputField
            value={values?.fromTime}
            type="time"
            name="fromTime"
            label="From Time"
            onChange={(e) => {
              setFieldValue("fromTime", e.target.value);
              onChange &&
                onChange({ ...values, fromTime: e?.target?.value }, "fromTime");
            }}
            disabled={disabled}
          />
        )}
      </div>
      <div className={`${col} ${time && "d-flex"}`}>
        <InputField
          label="To Date"
          value={values?.toDate}
          name="toDate"
          placeholder="Date"
          type={`${type ? type : "date"}`}
          onChange={(e) => {
            setGridData && setGridData([]);
            setFieldValue("toDate", e.target.value);
            onChange &&
              onChange({ ...values, toDate: e?.target?.value }, "toDate");
          }}
          disabled={disabled}
        />
        {time && (
          <InputField
            value={values?.toTime}
            type="time"
            name="toTime"
            label="To Time"
            onChange={(e) => {
              setFieldValue("toTime", e.target.value);
              onChange &&
                onChange({ ...values, toTime: e?.target?.value }, "toTime");
            }}
            disabled={disabled}
          />
        )}
      </div>
    </>
  );
}

export default FromDateToDateForm;
