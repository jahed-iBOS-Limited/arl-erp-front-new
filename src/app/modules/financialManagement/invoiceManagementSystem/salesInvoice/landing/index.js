/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getSalesInvoiceLanding } from "../helper";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import SalesInvoiceLandingForm from "./form";
import PaginationSearch from "../../../../_helper/_search";
import SalesInvoiceLandingTable from "./table";

const initData = {
  order: "",
  purchaseOrderNo: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  contactPerson: "",
  contactNo: "",
  projectName: "",
  delivery: "",
  challanNo: "",
  channel: "",
  type: { value: 1, label: "Details" },
  status: { value: 1, label: "Complete" },
};

function SalesInvoiceLandingNew() {
  const [load, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [pendingData, getPendingData, loader] = useAxiosGet();
  const[cancelData, getCancelData, cancelLoader] = useAxiosGet()
  const [
    topSheetData,
    getTopSheetData,
    loading,
    setTopSheetData,
  ] = useAxiosGet();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [permitted, getPermission] = useAxiosGet();
  const history = useHistory();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getGridData = (values, pageNo = 0, pageSize = 20, search = "") => {
    if (values?.status?.value === 1) {
      if (values?.type?.value === 2) {
        const searchTerm = search ? `&search=${search}` : "";
        getTopSheetData(
          `/oms/OManagementReport/GetSalesInvoiceLandingTopSheet?BusinessunitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${searchTerm}`
        );
      } else {
        getSalesInvoiceLanding(
          accId,
          buId,
          values?.fromDate,
          values?.toDate,
          values?.channel?.value || 0,
          pageNo,
          pageSize,
          search,
          setLoading,
          setRowDto
        );
      }
    } else if (values?.status?.value === 2) {
      getPendingData(
        `/oms/OManagementReport/GetPendingSalesInvoiceLanding?businessunitId=${buId}&channelId=${values
          ?.channel?.value || 0}&fromDate=${values?.fromDate}&toDate=${
          values?.toDate
        }&pageNo=${pageNo}&pageSize=${pageSize}`
      );
    }else if (values?.status?.value === 3) {
      getCancelData(
        `/oms/OManagementReport/GetDeletedSalesInvoiceLanding?BusinessunitId=${buId}&ChannelId=${values
          ?.channel?.value || 0}&FromDate=${values?.fromDate}&ToDate=${
            values?.toDate
          }&PageNo=${pageNo}&PageSize=${pageSize}`
      );
    }
  };

  useEffect(() => {
    getGridData(initData, pageNo, pageSize);
    getPermission(
      `/wms/FertilizerOperation/GetAllModificationPermission?UserEnroll=${userId}&BusinessUnitId=${buId}&Type=YsnSaalesInvoice`
    );
  }, [accId, buId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize);
  };

  const paginationSearchHandler = (search, values) => {
    getGridData(values, pageNo, pageSize, search);
  };

  const rowData = (values) => {
    if (values?.type?.value === 2) {
      return topSheetData;
    } else {
      return values?.status?.value === 1
        ? rowDto
        : values?.status?.value === 2
        ? pendingData
        : values?.status?.value === 3
        ? cancelData
        : [];
    }
  };

  const isLoading = load || loading || loader || cancelLoader;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICard
              title="Sales Invoice"
              createHandler={() => {
                history.push({
                  pathname: `/financial-management/invoicemanagement-system/salesInvoice/create`,
                  state: values,
                });
              }}
            >
              {isLoading && <Loading />}
              <SalesInvoiceLandingForm
                obj={{
                  pageNo,
                  values,
                  pageSize,
                  setRowDto,
                  getGridData,
                  setFieldValue,
                  setTopSheetData,
                }}
              />

              <div className="col-lg-6 mt-5">
                <PaginationSearch
                  placeholder="Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              <SalesInvoiceLandingTable
                obj={{
                  buId,
                  accId,
                  values,
                  pageNo,
                  loading,
                  pageSize,
                  setPageNo,
                  permitted,
                  setLoading,
                  setPageSize,
                  getGridData,
                  setPositionHandler,
                  rowDto: rowData(values),
                }}
              />
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}

export default SalesInvoiceLandingNew;
