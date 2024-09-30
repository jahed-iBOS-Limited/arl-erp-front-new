import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";

const reportTypes = [
  { value: 1, label: "Customer Base" },
  { value: 2, label: "Territory Base" },
  { value: 3, label: "Area Base" },
  { value: 4, label: "Region Base" },
  { value: 5, label: "Ship to Partner Order and Challan Info"},
];

export default function Form({ obj }) {
  const { values, setFieldValue, setRowDto, getGridData, setShowPowerBIReport } = obj;
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
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
                setShowPowerBIReport(false);
              }}
              placeholder="Report Type"
            />
          </div>
          {values?.reportType?.value === 5 && (
            <div className="col-lg-3">
            <NewSelect
              name="shipPoint"
              options={shipPointDDL}
              value={values?.shipPoint}
              label="Ship Point"
              onChange={(valueOption) => {
                setRowDto([]);
                setFieldValue("shipPoint", valueOption);
                setShowPowerBIReport(false);
              }}
              placeholder="Ship Point"
            />
          </div>
          )}
          <div className="col-lg-2">
            <InputField
              value={values?.fromDate}
              label="From Date"
              name="fromDate"
              type={values?.reportType?.value === 5 ? 'datetime-local': 'date'}
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
              type={values?.reportType?.value === 5 ? 'datetime-local': 'date'}
              onChange={(e) => {
                setFieldValue("toDate", e?.target?.value);
              }}
            />
          </div>
          {values?.reportType?.value !== 5 && (
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
          )}
          <RATForm
              obj={{
                values,
                setFieldValue,
                onChange: () => {
                  setShowPowerBIReport(false);
                },
              }}
            />
          <IButton
            onClick={() => {         
              if(values?.reportType?.value === 5){
                setShowPowerBIReport(true);
                setRowDto([]);
              } else {
                setRowDto([]);
                getGridData(values);
              }
            }}
            disabled={!values?.reportType}
          />
        </div>
      </form>
    </>
  );
}
