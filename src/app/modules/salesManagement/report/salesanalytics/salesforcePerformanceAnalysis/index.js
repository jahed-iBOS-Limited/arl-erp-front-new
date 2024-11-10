import React from "react";
import NewSelect from "./../../../../_helper/_select";
import { monthDDL } from "./../utils";
import { YearDDL } from "./../../../../_helper/_yearDDL";

function SalesforcePerformanceAnalysisForm({ obj }) {
  const { setFieldValue, values, setGridData } = obj;
  return (
    <>
      <div className="col-lg-3">
        <NewSelect
          name="month"
          options={monthDDL}
          value={values?.month}
          label="Month"
          onChange={(valueOption) => {
            setFieldValue("month", valueOption);
            setGridData([]);
          }}
          placeholder="Month"
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="year"
          options={YearDDL()}
          value={values?.year}
          label="Year"
          onChange={(valueOption) => {
            setFieldValue("year", valueOption);
            setGridData([]);
          }}
          placeholder="Year"
        />
      </div>
    </>
  );
}

export default SalesforcePerformanceAnalysisForm;
