/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../_helper/iButton";
import ICard from "../../../_helper/_card";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import { _todayDate } from "../../../_helper/_todayDate";
import SalesInvoiceGridData from "./grid";
import { getSalesInvoiceLanding } from "./helper";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";

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

function SalesInvoiceLanding() {
  const [disabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [pendingData, getPendingData, loader] = useAxiosGet();
  const [
    topSheetData,
    getTopSheetData,
    loading,
    setTopSheetData,
  ] = useAxiosGet();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const history = useHistory();

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getGridData = (values, pageNo = 0, pageSize = 20, search = "") => {
    if (values?.status?.value === 1) {
      if (buId === 4 && values?.type?.value === 2) {
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
          setDisabled,
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
    }
  };

  useEffect(() => {
    getGridData(initData, pageNo, pageSize);
  }, [accId, buId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize);
  };

  const paginationSearchHandler = (search, values) => {
    getGridData(values, pageNo, pageSize, search);
  };

  const rowData = (values) => {
    if (buId === 4 && values?.type?.value === 2) {
      return topSheetData;
    } else {
      return values?.status?.value === 1
        ? rowDto
        : values?.status?.value === 2
        ? pendingData
        : [];
    }
  };

  const isLoading = disabled || loading || loader;

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
              <Form className="form form-label-right">
                <div className="row global-form global-form-custom">
                  {buId === 4 && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="type"
                        value={values?.type}
                        label="Type"
                        placeholder="Type"
                        options={[
                          { value: 1, label: "Details" },
                          { value: 2, label: "Top Sheet" },
                        ]}
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                          setRowDto([]);
                          setTopSheetData([]);
                        }}
                      />
                    </div>
                  )}
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      region: false,
                      area: false,
                      territory: false,
                      onChange: () => {
                        setRowDto([]);
                        setTopSheetData([]);
                      },
                    }}
                  />
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: () => {
                        setRowDto([]);
                        setTopSheetData([]);
                      },
                    }}
                  />
                  {values?.type?.value !== 2 && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="status"
                        value={values?.status}
                        label="Status"
                        placeholder="Status"
                        options={[
                          { value: 1, label: "Complete" },
                          { value: 2, label: "Pending" },
                        ]}
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption);
                          setRowDto([]);
                          setTopSheetData([]);
                        }}
                      />
                    </div>
                  )}
                  <IButton
                    onClick={() => {
                      getGridData(values, pageNo, pageSize);
                    }}
                    disabled={
                      !values?.fromDate ||
                      !values?.toDate ||
                      !values?.channel ||
                      !values?.status
                    }
                  />
                </div>
              </Form>
              {/* {values?.type?.value !== 2 && ( */}
              <div className="col-lg-6 mt-5">
                <PaginationSearch
                  placeholder="Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              {/* )} */}
              <SalesInvoiceGridData
                rowDto={rowData(values)}
                values={values}
                accId={accId}
                buId={buId}
                pageNo={pageNo}
                setPageNo={setPageNo}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setLoading={setDisabled}
                setPositionHandler={setPositionHandler}
                getGridData={getGridData}
                // cb={cb}
              />
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}

export default SalesInvoiceLanding;
