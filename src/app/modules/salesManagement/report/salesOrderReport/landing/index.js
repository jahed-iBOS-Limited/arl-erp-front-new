/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getSalesOrderReportData, getSummaryReportData } from "../helper";
import "../style.css";

// React Pivote Table module Import
import "react-pivottable/pivottable.css";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import SalesOrderReportModal from "./salesOrderReportModal";
import TableOne from "./tableOne";
import Form from "./form";
import TableTwo from "./tableTwo";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" },
  reportType: { value: 0, label: "Details" },
  channel: "",
  customer: "",
};

function SalesOrderReportLanding() {
  const [details, setDetails] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowData, getRowData, loader] = useAxiosGet();
  const[isShow, setIsShow] = useState(false);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const getReportView = (values) => {
    const typeId = values?.reportType?.value;
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      [0, 1].includes(typeId)
    ) {
      getSalesOrderReportData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.shipPoint?.value,
        values?.channel?.value,
        values?.reportType?.value,
        setGridData,
        setLoading
      );
    } else if ([2].includes(typeId)) {
      getRowData(
        `/oms/SalesInformation/GetDataBySalesOrdeByApps?buisnessUnitId=${
          selectedBusinessUnit?.value
        }&channelId=${values?.channel?.value}&shipPointId=${
          values?.shipPoint?.value
        }&customerId=${values?.customer?.value || 0}&fromDate=${
          values?.fromDate
        }&toDate=${values?.toDate}&isApproved=true`
      );
    }
  };

  const parameterValues = (values) => {
    return values?.reportType?.value === 3
      ? [
          { name: "unit", value: selectedBusinessUnit?.value?.toString() },
          { name: "FromDate", value: values?.fromDate },
          { name: "ToDate", value: values?.toDate },
          {
            name: "ChannelID",
            value: values?.channel?.value?.toString() || "0",
          },
          {
            name: "ViewType",
            value: values?.salesContractInfoReportType?.value?.toString(),
          },
        ]
      : values?.reportType?.value === 4
      ? [
          { name: "unitid", value: selectedBusinessUnit?.value?.toString() },
          { name: "FromDate", value: values?.fromDate },
          { name: "ToDate", value: values?.toDate },
        ]
      : [];
  };

  const setReportId = (reportTypeId) => {
    let reportId = "";
    if (reportTypeId === 3) {
      reportId = "1da48866-a10e-4646-a15c-84607b344c20";
    } else if (reportTypeId === 4) {
      reportId = "765ae8bb-92dc-471e-986d-0fd7805470da";
    }

    return reportId;
  };

  return (
    <>
      <ICustomCard title="Sales Order Report">
        {(loading || loader) && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form
                obj={{
                  buId: selectedBusinessUnit?.value,
                  accId: profileData?.accountId,
                  values,
                  errors,
                  touched,
                  setGridData,
                  shipPointDDL,
                  setFieldValue,
                  getReportView,
                  setIsShow,
                }}
              />

              {/* Top sheet or Details */}
              {[0, 1].includes(values?.reportType?.value) && (
                <TableOne
                  obj={{
                    values,
                    gridData,
                    setDetails,
                    setModalShow,
                    getSummaryReportData,
                  }}
                />
              )}

              {/* App's order list */}
              {[2].includes(values?.reportType?.value) && (
                <TableTwo obj={{ rowData }} />
              )}
              {([3,4].includes(values?.reportType?.value) && isShow) && (
                 <PowerBIReport
                 reportId={setReportId(values?.reportType?.value)}
                 groupId={"e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a"}
                 parameterValues={parameterValues(values)}
                 parameterPanel={false}
               />
              )}
            </>
          )}
        </Formik>
        <SalesOrderReportModal
          data={details}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </ICustomCard>
    </>
  );
}

export default SalesOrderReportLanding;
