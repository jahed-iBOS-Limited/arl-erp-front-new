import React, { useState, useRef, useEffect } from "react";
import ICard from "./../../../_helper/_card";
import GridTable from "./table";
import { Formik, Form } from "formik";
import Loading from "./../../../_helper/_loading";
import InputField from "./../../../_helper/_inputField";
import { _todayDate } from "./../../../_helper/_todayDate";
import { CustomerDeliveryInquery_api } from "./helper";
import { useSelector, shallowEqual } from "react-redux";
import PaginationSearch from "../../../_helper/_search";
import { values } from "lodash-es";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function DeliveryInquiryReport() {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const commonGridFunc = ({ fromDate, toDate } = values, searchValue) => {
    CustomerDeliveryInquery_api(
      fromDate,
      toDate,
      searchValue || null,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRowDto,
      setLoading
    );
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      commonGridFunc(initData, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const paginationSearchHandler = (searchValue, values) => {
    commonGridFunc(values, searchValue);
  };

  return (
    <ICard
      title="Delivery Inquiry Report"
      printTitle="Print"
      isPrint={true}
      isShowPrintBtn={true}
      componentRef={printRef}
      isExcelBtn={true}
      excelFileNameWillbe="Delivery Inquiry Report"
    >
      <>
        {loading && <Loading />}
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            commonGridFunc(values);
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
            setValues,
          }) => (
            <>
              <Form className="form form-label-right Demand_Analysis_Wrapper">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-1 mt-5">
                    <button className="btn btn-primary" type="submit">
                      View
                    </button>
                  </div>
                </div>
                <div className="m-1">
                  <PaginationSearch
                    placeholder="Customer Name & Challan Num. Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
                <GridTable rowDto={rowDto} printRef={printRef} />
              </Form>
            </>
          )}
        </Formik>
      </>
    </ICard>
  );
}

export default DeliveryInquiryReport;
