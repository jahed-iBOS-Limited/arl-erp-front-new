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

const initData = {
  order: "",
  purchaseOrderNo: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  contactPerson: "",
  contactNo: "",
  projectName: "",
  delivery: "",
  challanNo: "",
  channel: ""
};

function SalesInvoiceLanding() {
  const [disabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
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
              {disabled && <Loading />}
              <Form className="form form-label-right">
                <div className="row global-form global-form-custom">
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      region: false,
                      area: false,
                      territory: false,
                    }}
                  />
                  <FromDateToDateForm obj={{ values, setFieldValue }} />

                  <IButton
                    colSize={"col-lg-3"}
                    onClick={() => {
                      getGridData(values, pageNo, pageSize);
                    }}
                    disabled={!values?.fromDate || !values?.toDate}
                  />
                </div>
              </Form>
              <div className="col-lg-6 mt-5">
                <PaginationSearch
                  placeholder="Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              <SalesInvoiceGridData
                rowDto={rowDto}
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
