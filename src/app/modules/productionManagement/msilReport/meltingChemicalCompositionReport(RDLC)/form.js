import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../_helper/_customCard";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  testName:"",
};
const MeltingChemicalCompositionReportRDLC = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `f96e356c-6065-4de0-a2f0-293979fa64de`;

  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [showReport, setShowReport] = useState(false);
  const [testNameList, getTestNameList] = useAxiosGet();

  useEffect(() => {
    getTestNameList(`/mes/MesDDL/GetTestNameDDL?BusinessUnitId=${selectedBusinessUnit?.value}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const parameterValues = (values) => {
    return [
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "UnitId", value: `${selectedBusinessUnit?.value}` },
      { name: "TestName", value: `${values?.testName?.label || ""}` },
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
                  <NewSelect
                    name="testName"
                    options={testNameList || []}
                    value={values?.testName}
                    label="Test Name"
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("testName", valueOption);
                    }}
                  />
                </div>
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
