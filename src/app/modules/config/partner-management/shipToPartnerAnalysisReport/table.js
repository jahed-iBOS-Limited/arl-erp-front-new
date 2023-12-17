/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../_helper/iButton";
import ICard from "../../../_helper/_card";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";
import { getShipPoint_Action } from "../../../salesManagement/orderManagement/salesOrder/_redux/Actions";

const initData = {
  channel: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  viewType: "",
  reportName: "",
  customer: "",
  shipPoint: "",
  reportType: {
    value: 1,
    label: "Profit/Non-Profit",
  },
};

function ShipToPartnerAnalysisReport() {
  const dispatch = useDispatch();
  const [showReport, setShowReport] = useState(false);

  // get user data from store
  const {
    profileData: { employeeId: empId, accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { shipPointDDL } = useSelector((state) => state.salesOrder, {
    shallowEqual,
  });

  useEffect(() => {
    dispatch(getShipPoint_Action(userId, accId, buId));
  }, [buId, accId, userId]);

  const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  const reportId = (values) => {
    const reportNameId = values?.reportName?.value;

    const shipToPartner = "4eb45ae7-7993-4b73-82c6-9901935114ac";
    const netToCompany = "d5f5b275-0364-45c1-ad74-2331a7de6390";

    return reportNameId === 1
      ? shipToPartner
      : reportNameId === 2
      ? netToCompany
      : "";
  };

  const parameterValues = (values) => {
    const reportNameId = values?.reportName?.value;

    const shipToPartnerParams = [
      { name: "ViewType", value: `${values?.viewType?.value}` },
      { name: "intunit", value: `${buId}` },
      { name: "intchannelid", value: `${values?.channel?.value}` },
      { name: "dteFromDateDaySales", value: `${values?.fromDate}` },
      { name: "dteToDateDaySales", value: `${values?.toDate}` },
      { name: "intEmployeeid", value: `${empId}` },
    ];

    const netToCompanyParams = [
      { name: "intpartid", value: `${values?.viewType?.value}` },
      { name: "ShipPointId", value: `${values?.shipPoint?.value}` },
      { name: "BusinessUnitId", value: `${buId}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "intDistributionChannel", value: `${values?.channel?.value}` },
      { name: "intCustomerid", value: `${values?.customer?.value}` },
      { name: "intReportTypeid", value: `${values?.reportType?.value}` },
    ];

    return reportNameId === 1
      ? shipToPartnerParams
      : reportNameId === 2
      ? netToCompanyParams
      : [];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICard title="Ship to Partner Analysis Report">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <NewSelect
                    name="reportName"
                    label="Report Name"
                    options={[
                      { value: 1, label: "Ship to Partner Analysis" },
                      { value: 2, label: "Net to Company" },
                    ]}
                    placeholder="Report Name"
                    value={values?.reportName}
                    onChange={(e) => {
                      setFieldValue("reportName", e);
                      setShowReport(false);
                    }}
                  />
                </div>
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
                {values?.reportName?.value === 2 && (
                  <>
                    <div className="col-lg-2">
                      <NewSelect
                        name="reportType"
                        label="Report Type"
                        options={[
                          {
                            value: 1,
                            label: "Profit/Non-Profit",
                          },
                        ]}
                        placeholder="Report Type"
                        value={values?.reportType}
                        onChange={(e) => {
                          setFieldValue("reportType", e);
                          setShowReport(false);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="shipPoint"
                        label="ShipPoint"
                        options={
                          [
                            {
                              value: 0,
                              label: "All",
                            },
                            ...shipPointDDL,
                          ] || []
                        }
                        placeholder="ShipPoint"
                        value={values?.shipPoint}
                        onChange={(e) => {
                          setFieldValue("shipPoint", e);
                          setShowReport(false);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Customer</label>
                      <SearchAsyncSelect
                        selectedValue={values?.customer}
                        handleChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                          setShowReport(false);
                        }}
                        isDisabled={!values?.channel}
                        placeholder="Search Customer"
                        loadOptions={async (v) => {
                          const searchValue = v.trim();
                          if (searchValue?.length < 3 || !searchValue)
                            return [
                              {
                                value: 0,
                                label: "All",
                              },
                            ];
                          return axios
                            .get(
                              `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                            )
                            .then((res) => [
                              {
                                value: 0,
                                label: "All",
                              },
                              ...res?.data,
                            ]);
                        }}
                      />
                    </div>
                  </>
                )}
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
                  colSize={"col-lg-2"}
                  onClick={() => {
                    setShowReport(true);
                  }}
                />
              </div>
            </form>
            {showReport && (
              <PowerBIReport
                reportId={reportId(values)}
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
