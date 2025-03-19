import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";
import ICustomCard from "../../../_helper/_customCard";
import NewSelect from "../../../_helper/_select";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../_helper/iButton";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";

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
const reportId = `75038104-951d-4927-be6a-90f095cc601b`;

const CustomerYearlyAchievement = () => {
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [showReport, setShowReport] = useState(false);

  const parameterValues = (values) => {
    return [
      { name: "intUnitid", value: `${+buId}` },
      { name: "intChannelid", value: `${+values?.channel?.value}` },
      { name: "intRegionid", value: `${+values?.region?.value}` },
      { name: "intAreaid", value: `${+values?.area?.value}` },
      { name: "intTerritoryid", value: `${+values?.territory?.value}` },
      { name: "intCustomerid", value: `${+values?.customer?.value}` },
      { name: "ReportType", value: `${+values?.reportType?.value}` },
      { name: "fromDate", value: `${values?.fromDate}` },
      { name: "toDate", value: `${values?.toDate}` },
    ];
  };

  useEffect(() => {}, [accId, buId]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Customer Yearly Achievement">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <RATForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                    },
                  }}
                />
                <div className="col-lg-3">
                  <label>Customer</label>
                  <SearchAsyncSelect
                    selectedValue={values?.customer}
                    handleChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Search Customer"
                    loadOptions={async (v) => {
                      await [{ value: 0, label: "All" }];
                      if (v?.length > 2) {
                        return axios
                          .get(
                            `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${v}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                          )
                          .then((res) => [
                            { value: 0, label: "All" },
                            ...res?.data,
                          ]);
                      } else {
                        return [{ value: 0, label: "All" }];
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 1, label: "Graph View" },
                      { value: 2, label: "Details View" },
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
                <IButton
                  colSize={"col-lg-1"}
                  onClick={() => {
                    setShowReport(false);
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
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default CustomerYearlyAchievement;
