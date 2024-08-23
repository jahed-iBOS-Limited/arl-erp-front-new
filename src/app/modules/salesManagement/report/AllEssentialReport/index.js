import { Formik } from "formik";
import React, { useState } from "react";
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
const getReportId = (typeId) => {
  const id = [1, 2, 3].includes(typeId)
    ? `85ce10da-a0be-4efc-aa92-4f83efe10913`
    : typeId === 4
    ? "25ab6f7e-d8a2-4071-a400-a434eb6e9c98"
    : typeId === 5
    ? `5c3d293d-384b-496c-9d8e-7a748c2abd2d`
    : typeId === 6
    ? `b2056a60-946e-446c-9988-c0decfe5b285`
    : "";
  return id;
};

const AllEssentialReport = () => {
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [showReport, setShowReport] = useState(false);

  const parameterValues = (values) => {
    const id = values?.reportType?.value;

    const commonParams = [
      { name: "unitid", value: `${+buId}` },
      { name: "channelid", value: `${+values?.channel?.value}` },
      { name: "intRegionid", value: `${+values?.region?.value}` },
      { name: "ReportType", value: `${+values?.reportType?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];

    const skuWiseMonthlyReport = [
      { name: "BusinessUnitId", value: `${+buId}` },
      { name: "intchannelid", value: `${+values?.channel?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];

    const skuWiseSummary = [
      { name: "intBusinessUnitid", value: `${+buId}` },
      { name: "intDistributionChannelId", value: `${+values?.channel?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "ViewType", value: `${values?.viewType?.value}` },
    ];

    const skuTerritoryReport = [
      { name: "intBusinessUnitid", value: `${+buId}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "intDistributionChannelId", value: `${+values?.channel?.value}` },
      { name: "intRegion", value: `${+values?.region?.value}` },
      { name: "intArea", value: `${+values?.area?.value}` },
    ];

    const params = [1, 2, 3].includes(id)
      ? commonParams
      : id === 4
      ? skuWiseMonthlyReport
      : id === 5
      ? skuWiseSummary
      : id === 6
      ? skuTerritoryReport
      : [];

    return params;
  };

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
                      { value: 5, label: "SKU Wise Summary" },
                      { value: 6, label: "SKU Territory Info" },
                    ]}
                    label="Report Type"
                    value={values?.reportType}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("reportType", valueOption);
                      setFieldValue("channel", "");
                      setFieldValue("region", "");
                      setFieldValue("area", "");
                      setFieldValue("territory", "");
                      setFieldValue("viewType", "");
                    }}
                    placeholder="Report Type"
                  />
                </div>
                {values?.reportType?.value === 5 && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="viewType"
                      options={[
                        { value: 1, label: "By Quantity" },
                        { value: 2, label: "By Amount" },
                      ]}
                      label="View Type"
                      value={values?.viewType}
                      onChange={(valueOption) => {
                        setShowReport(false);
                        setFieldValue("viewType", valueOption);
                      }}
                      placeholder="View Type"
                    />
                  </div>
                )}
                <RATForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                    },
                    region: [6].includes(values?.reportType?.value),
                    area: [6].includes(values?.reportType?.value),
                    territory: false,
                    allElement: [6].includes(values?.reportType?.value),
                  }}
                />

                {![3].includes(values?.reportType?.value) && (
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: () => {
                        setShowReport(false);
                      },
                    }}
                  />
                )}
                <IButton
                  onClick={() => {
                    setShowReport(false);
                    setShowReport(true);
                  }}
                  disabled={!values?.reportType || !values?.channel}
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
