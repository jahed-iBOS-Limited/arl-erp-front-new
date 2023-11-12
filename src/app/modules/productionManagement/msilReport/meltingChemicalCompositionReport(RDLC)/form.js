import { Formik } from "formik";
import React, { useState } from "react";
import { _todayDate } from "../../../_helper/_todayDate";
import ICustomCard from "../../../_helper/_customCard";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import InputField from "../../../_helper/_inputField";
import { shallowEqual, useSelector } from "react-redux";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
const MeltingChemicalCompositionReportRDLC = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `f96e356c-6065-4de0-a2f0-293979fa64de`;

  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [showReport, setShowReport] = useState(false);

  const parameterValues = (values) => {
    return [
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "UnitId", value: `${selectedBusinessUnit?.value}` },
    ];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Melting Chemical Composition Report">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                    onChange={(e) => {
                      setShowReport(false);
                      setFieldValue("fromDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                    onChange={(e) => {
                      setShowReport(false);
                      setFieldValue("toDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    onClick={() => {
                      console.log("clicked");
                      setShowReport(true);
                    }}
                    style={{ marginTop: "19px" }}
                    className="btn btn-primary ml-2 mr-2"
                    type="button"
                  >
                    View
                  </button>
                </div>
              </div>
            </form>
            {showReport && (
              <PowerBIReport
                reportId={reportId}
                groupId={groupId}
                parameterValues={parameterValues(values)}
                parameterPanel={false}
              />
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default MeltingChemicalCompositionReportRDLC;
