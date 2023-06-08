import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { shallowEqual, useSelector } from "react-redux";

import { _todayDate } from "./../../../../_helper/_todayDate";
const initialValues = {
  shipPoint: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: "",
};
export function SearchForm(props) {
  const { onSubmit, setGridData, shipmentCostLading } = props;

  const ShippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initialValues,
          ...shipmentCostLading,
          reportType: shipmentCostLading?.reportType?.label
            ? shipmentCostLading?.reportType
            : {
                value: false,
                label: "Pending",
              } || "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values);
        }}
      >
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          values,
          handleSubmit,
        }) => (
          <Form>
            <div className="row global-form">
              <div className="col-lg-3">
                <NewSelect
                  name="shipPoint"
                  options={[{ value: 0, label: "All" }, ...ShippointDDL]}
                  value={values?.shipPoint}
                  label="Shippoint"
                  onChange={(valueOption) => {
                    setFieldValue("shipPoint", valueOption);
                    setGridData([]);
                  }}
                  placeholder="Shippoint"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="col-lg-3">
                <NewSelect
                  name="reportType"
                  options={[
                    {
                      value: false,
                      label: "Pending",
                    },
                    {
                      value: true,
                      label: "Bill Submit",
                    },
                  ]}
                  value={values?.reportType}
                  label="Select Report"
                  onChange={(valueOption) => {
                    setGridData([]);
                    setFieldValue("reportType", valueOption);
                  }}
                  placeholder="Report Type"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.fromDate}
                  label="From Date"
                  type="date"
                  name="fromDate"
                  placeholder="From Date"
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.toDate}
                  label="To Date"
                  type="date"
                  name="toDate"
                  placeholder="To Date"
                />
              </div>
              <div className="col-lg-3 offset-lg-9 text-right">
                <button
                  disabled={
                    !values?.reportType ||
                    !values?.toDate ||
                    !values?.fromDate ||
                    !values?.shipPoint
                  }
                  type="submit"
                  class="btn btn-primary "
                  style={{ marginTop: "18px" }}
                  onSubmit={() => handleSubmit()}
                >
                  View
                </button>
              </div>
            </div>
            {props?.children(values, setFieldValue)}
          </Form>
        )}
      </Formik>
    </>
  );
}
