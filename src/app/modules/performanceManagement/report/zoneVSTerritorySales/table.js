import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../_helper/iButton";
import ICustomCard from "../../../_helper/_customCard";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  type: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  zone: "",
  partner: "",
};

const typeList = [
  { value: 1, label: "Both Type Zone" },
  { value: 2, label: "Mismatch Zone" },
  { value: 3, label: "Sold but Zone not Tag" },
  { value: 4, label: "Territory Base Zone Tag Pending" },
  { value: 5, label: "Partner Base Zone Tag Pending Detail" },
  { value: 6, label: "Partner Base zone Tag Pending Top sheet" },
];

const ZoneVSTerritorySalesReport = () => {
  const [showReport, setShowReport] = useState(false);
  const [soldToPartnerDDL, getSoldToPartnerDDL] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId, employeeId: empId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getSoldToPartnerDDL(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  const reportId = "fcdcb718-e9f2-4b78-b554-262464090e3f";

  const parameterValues = (values) => {
    const paramsForTopThree = [
      { name: "intPartid", value: `${values?.type?.value}` },
      { name: "intunit", value: `${buId}` },
      { name: "Channelid", value: `${values?.channel?.value}` },
      { name: "fromdate", value: `${values?.fromDate}` },
      { name: "todate", value: `${values?.toDate}` },
      { name: "intEmployeeid", value: `${empId}` },
      { name: "regionid", value: `${values?.region?.value}` },
      { name: "areaid", value: `${values?.area?.value}` },
      { name: "territoryid", value: `${values?.territory?.value}` },
      { name: "zoneid", value: `${values?.zone?.value}` },
    ];

    const paramsForNumberFourAndSix = [
      { name: "intPartid", value: `${values?.type?.value}` },
      { name: "intunit", value: `${buId}` },
      { name: "Channelid", value: `${values?.channel?.value}` },
    ];

    const paramsForNumberFive = [
      { name: "intPartid", value: `${values?.type?.value}` },
      { name: "intunit", value: `${buId}` },
      { name: "Channelid", value: `${values?.channel?.value}` },
      { name: "intbusinesspartnerid", value: `${values?.partner?.value}` },
    ];

    return [1, 2, 3].includes(values?.type?.value)
      ? paramsForTopThree
      : [4, 6].includes(values?.type?.value)
      ? paramsForNumberFourAndSix
      : [5].includes(values?.type?.value)
      ? paramsForNumberFive
      : [];
  };

  return (
    <Formik enableReinitialize={true} initialValues={initData}>
      {({ values, setFieldValue }) => (
        <ICustomCard title="Zone VS Territory Sales">
          <form className="form form-label-right">
            <div className="form-group row global-form">
              <div className="col-lg-2">
                <NewSelect
                  name="type"
                  options={typeList}
                  value={values?.type}
                  label="Type"
                  onChange={(valueOption) => {
                    setFieldValue("type", valueOption);
                    setShowReport(false);
                  }}
                  placeholder="Type"
                />
              </div>
              <RATForm
                obj={{
                  values,
                  setFieldValue,
                  columnSize: "col-lg-2",
                  region: [1, 2, 3].includes(values?.type?.value),
                  area: [1, 2, 3].includes(values?.type?.value),
                  territory: [1, 2, 3].includes(values?.type?.value),
                  zone: [1, 2, 3].includes(values?.type?.value),
                  onChange: () => {
                    setShowReport(false);
                  },
                }}
              />
              {[5].includes(values?.type?.value) && (
                <div className="col-lg-2">
                  <NewSelect
                    name="partner"
                    options={[{ value: 0, label: "All" }, ...soldToPartnerDDL]}
                    value={values?.partner}
                    label="Sold to Partner"
                    onChange={(valueOption) => {
                      setFieldValue("partner", valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Sold to Partner"
                  />
                </div>
              )}
              {[1, 2, 3].includes(values?.type?.value) && (
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
              )}
              <IButton
                colSize={"col-lg-1"}
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
        </ICustomCard>
      )}
    </Formik>
  );
};

export default ZoneVSTerritorySalesReport;
