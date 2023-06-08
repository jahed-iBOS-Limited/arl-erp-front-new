import React, { useState } from "react";
import { Form, Formik } from "formik";
import { IInput } from "../../../../../_helper/_input";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import PowerBIReport from "../../../../../_helper/commonInputFieldsGroups/PowerBIReport";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
const reportId = `ea332e1f-1e5b-4595-ab55-a902b0cb72b2`;

export function PurchaseAndSalesInfo({ printRef, setLoading }) {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [isShow, setIsShow] = useState(false);

  const parameterValues = (values) => {
    return [
      {
        name: "IntBusinessUnitId",
        value: selectedBusinessUnit?.value?.toString(),
      },
      {
        name: "dteFromDate",
        value: values?.fromDate,
      },
      { name: "dteToDate", value: values?.toDate },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
                    setIsShow(false);
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
                    setIsShow(false);
                  }}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setIsShow(true);
                  }}
                  className="btn btn-primary mt-5"
                >
                  Show Report
                </button>
              </div>
            </div>
            {isShow ? (
              <PowerBIReport
                reportId={reportId}
                groupId={groupId}
                parameterValues={parameterValues(values)}
                parameterPanel={false}
              />
            ) : null}
          </Form>
        )}
      </Formik>
    </>
  );
}
