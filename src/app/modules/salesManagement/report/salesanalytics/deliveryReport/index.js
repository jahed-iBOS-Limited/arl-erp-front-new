import React from "react";
import InputField from "./../../../../_helper/_inputField";

function DeliveryReportForm({ obj }) {
  const { setFieldValue, values, setGridData } = obj;
  return (
    <>
      <div className="col-lg-3">
        <label>From Date</label>
        <InputField
          value={values?.fromDate}
          name="fromDate"
          placeholder="Date"
          type="date"
          onChange={(e) => {
            setGridData([]);
            setFieldValue("fromDate", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <label>To Date</label>
        <InputField
          value={values?.toDate}
          name="toDate"
          placeholder="Date"
          type="date"
          onChange={(e) => {
            setGridData([]);
            setFieldValue("toDate", e.target.value);
          }}
        />
      </div>
    </>
  );
}

export default DeliveryReportForm;
