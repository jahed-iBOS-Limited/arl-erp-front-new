import React, { useState } from "react";
import { Form, Formik } from "formik";
import { IInput } from "../../../../../_helper/_input";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import { ministryReportLanding } from "../../helper";
import FertilizerInfoTable from "./fertilizerInfo";
import MokamOrWarehouseInfoTable from "./mokamOrWarehouseInfo";
import DistrictSpecifySalesInfoTable from "./districtSpecifySalesInfo";
import UnsoldInfoTable from "./unsoldStock";
// import CurrentStockMokamOrWarehouseInfoTable from "./currentStockMokamOrWarehouseInfo";
// import SalesInfoTable from "./salesInfo";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export function MinistryReport({ printRef, setLoading }) {
  const [gridData, setGridData] = useState("");

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const viewHandler = async (values, setter) => {
    ministryReportLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      setLoading,
      setter
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          viewHandler(values, setGridData);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="form form-label-right">
            <div className="form-group row global-form printSectionNone">
              <div className="col-lg-3">
                <IInput
                  value={values?.fromDate}
                  label="From Date"
                  name="fromDate"
                  type="date"
                  onChange={(e) => {
                    setFieldValue("fromDate", e?.target?.value);
                    setGridData("");
                  }}
                />
              </div>

              <div className="col-lg-3">
                <IInput
                  value={values?.toDate}
                  label="To Date"
                  name="toDate"
                  type="date"
                  onChange={(e) => {
                    setFieldValue("toDate", e?.target?.value);
                    setGridData("");
                  }}
                />
              </div>

              <div className="col-lg-1">
                <button type="submit" className="btn btn-primary mt-5">
                  View
                </button>
              </div>
            </div>

            {gridData ? (
              <div ref={printRef}>
                <FertilizerInfoTable rowData={gridData?.fartilizerInfo || []} />

                {gridData?.mokamWarehouseInfo?.length > 0 ? (
                  <MokamOrWarehouseInfoTable
                    rowData={gridData?.mokamWarehouseInfo || []}
                  />
                ) : null}

                <DistrictSpecifySalesInfoTable
                  rowData={gridData?.districtSpecificSalesInfo || []}
                />

                {/* <SalesInfoTable rowData={gridData?.salesInfo || []} /> */}

                <UnsoldInfoTable rowData={gridData?.unsoldStockInfo || []} />

                {/* <CurrentStockMokamOrWarehouseInfoTable
                    rowData={[]}
                  /> */}
              </div>
            ) : null}
          </Form>
        )}
      </Formik>
    </>
  );
}
