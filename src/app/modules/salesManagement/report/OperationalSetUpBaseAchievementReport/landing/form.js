import React from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IButton from "../../../../_helper/iButton";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";

const reportTypes = [
  { value: 1, label: "Customer Base" },
  { value: 2, label: "Territory Base" },
  { value: 3, label: "Area Base" },
  { value: 4, label: "Region Base" },
];

export default function Form({ obj }) {
  const { values, setFieldValue, setRowDto, getGridData } = obj;
  return (
    <>
      <form className="form form-label-right">
        <div className="form-group row global-form printSectionNone">
          <div className="col-lg-3">
            <NewSelect
              name="reportType"
              options={reportTypes}
              value={values?.reportType}
              label="Report Type"
              onChange={(valueOption) => {
                setRowDto([]);
                setFieldValue("reportType", valueOption);
              }}
              placeholder="Report Type"
            />
          </div>
          <div className="col-lg-2">
            <InputField
              value={values?.fromDate}
              label="From Date"
              name="fromDate"
              type="date"
              onChange={(e) => {
                setFieldValue("fromDate", e?.target?.value);
              }}
            />
          </div>
          <div className="col-lg-2">
            <InputField
              value={values?.toDate}
              label="To Date"
              name="toDate"
              type="date"
              onChange={(e) => {
                setFieldValue("toDate", e?.target?.value);
              }}
            />
          </div>
          <div className="col-lg-2">
            <InputField
              value={values?.certaindate}
              label="Certain Date"
              name="certaindate"
              type="date"
              onChange={(e) => {
                setFieldValue("certaindate", e?.target?.value);
              }}
            />
          </div>
          <RATForm
              obj={{
                values,
                setFieldValue,
              }}
            />
          <IButton
            onClick={() => {
              setRowDto([]);
              getGridData(values);
            }}
            disabled={!values?.reportType}
          />
        </div>
      </form>
    </>
  );
}
