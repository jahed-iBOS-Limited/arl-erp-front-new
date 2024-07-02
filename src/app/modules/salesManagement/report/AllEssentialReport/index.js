import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../_helper/_customCard";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../_helper/iButton";

const initData = {
  reportType: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  channel: "",
  region: "",
  area: "",
  territory: "",
  customer: "",
};

const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
const getReportId = (typeId) =>{
  let id = `85ce10da-a0be-4efc-aa92-4f83efe10913`;
  if(typeId === 4){
    id = "25ab6f7e-d8a2-4071-a400-a434eb6e9c98";
  }
  return id;
}


const AllEssentialReport = () => {
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [showReport, setShowReport] = useState(false);

  const parameterValues = (values) => {
    return values?.reportType?.value === 4 ?  [
      { name: "BusinessUnitId", value: `${+buId}` },
      { name: "intchannelid", value: `${+values?.channel?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ] : [
      { name: "unitid", value: `${+buId}` },
      { name: "channelid", value: `${+values?.channel?.value}` },
      { name: "intRegionid", value: `${+values?.region?.value}` },
      { name: "ReportType", value: `${+values?.reportType?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];
  };

  useEffect(() => {}, [accId, buId]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="All Essential Report">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 1, label: "Daily Sales Order Summary" },
                      { value: 2, label: "Territory Item Sales" },
                      { value: 3, label: "Delivery Pending Report" },
                      { value: 4, label: "SKU Wise Monthly Report" },
                    ]}
                    label="Report Type"
                    value={values?.reportType}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("reportType", valueOption);
                    }}
                    placeholder="Report Type"
                  />
                </div>
                <RATForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                    },
                    region: false,
                    area: false,
                    territory: false,
                    zone: false,
                    allElement: false,
                  }}
                />

                {![3].includes(values?.reportType?.value) && (<FromDateToDateForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                    },
                    colSize: "col-lg-2",
                  }}
                />)}
                <IButton
                  colSize={"col-lg-1"}
                  onClick={() => {
                    setShowReport(false);
                    setShowReport(true);
                  }}
                  disabled={
                    !values?.reportType ||
                    !values?.channel 
                    // !values?.fromDate ||
                    // !values?.toDate
                  }
                />
              </div>
            </form>
            {showReport && (
              <PowerBIReport
                reportId={getReportId(values?.reportType?.value)}
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

export default AllEssentialReport;
