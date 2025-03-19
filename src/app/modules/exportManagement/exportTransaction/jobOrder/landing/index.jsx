import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { JobOrderLandingForm } from "./form";
import { JobOrderLandingTable } from "./table";

const initData = {
  status: { value: false, label: "Quotation Open" },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function JobOrderLanding() {
  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId: accId },
  } = useSelector((state) => state.authData, shallowEqual);

  const getLandingData = (
    values,
    _pageNo = 0,
    _pageSize = 15,
    searchValue = ""
  ) => {
    const search = searchValue ? `&searchTerm=${searchValue}` : "";

    getRowData(
      `/oms/SalesQuotation/GetSalesQuotationSearchLandingPagination?AccountId=${accId}&BUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&QuotationStatus=${values?.status?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}${search}`,
      (data) => {
        setRowData(data?.data);
      }
    );
  };
  useEffect(() => {
    getLandingData(initData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => (
        <>
          {rowDataLoader && <Loading />}
          <IForm title="Job Order" isHiddenReset isHiddenBack isHiddenSave>
            <JobOrderLandingForm
              obj={{
                buId,
                accId,
                values,
                pageNo,
                pageSize,
                setRowData,
                setFieldValue,
                getLandingData,
              }}
            />
            <JobOrderLandingTable
              obj={{
                values,
                pageNo,
                rowData,
                pageSize,
                setPageNo,
                setPageSize,
                setPositionHandler,
                paginationSearchHandler,
              }}
            />
          </IForm>
        </>
      )}
    </Formik>
  );
}
