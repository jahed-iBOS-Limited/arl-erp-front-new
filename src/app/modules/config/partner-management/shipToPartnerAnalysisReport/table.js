import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../_helper/iButton";
import ICard from "../../../_helper/_card";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  channel: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  viewType: "",
};

function ShipToPartnerAnalysisReport() {
  const [showReport, setShowReport] = useState(false);

  // get user data from store
  const {
    profileData: { employeeId: empId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  const reportId = "4eb45ae7-7993-4b73-82c6-9901935114ac";

  const parameterValues = (values) => {
    return [
      { name: "ViewType", value: `${values?.viewType?.value}` },
      { name: "intunit", value: `${buId}` },
      { name: "intchannelid", value: `${values?.channel?.value}` },
      { name: "dteFromDateDaySales", value: `${values?.fromDate}` },
      { name: "dteToDateDaySales", value: `${values?.toDate}` },
      { name: "intEmployeeid", value: `${empId}` },
    ];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICard title="Ship to Partner Analysis Report">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <RATForm
                  obj={{
                    values,
                    setFieldValue,
                    region: false,
                    area: false,
                    territory: false,
                    onChange: () => {
                      setShowReport(false);
                    },
                    columnSize: "col-lg-2",
                  }}
                />
                <FromDateToDateForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                    },
                    colSize: "col-lg-2",
                  }}
                />
                <div className="col-lg-2">
                  <NewSelect
                    name="viewType"
                    label="View Type"
                    options={[
                      { value: 1, label: "Graph View" },
                      { value: 2, label: "Detail View" },
                    ]}
                    placeholder="View Type"
                    value={values?.viewType}
                    onChange={(e) => {
                      setFieldValue("viewType", e);
                      setShowReport(false);
                    }}
                  />
                </div>
                <IButton
                  colSize={"col-lg-4"}
                  onClick={() => {
                    setShowReport(true);
                  }}
                />
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
          </ICard>
        )}
      </Formik>
    </>
  );
}

export default ShipToPartnerAnalysisReport;
