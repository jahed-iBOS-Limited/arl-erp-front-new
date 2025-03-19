import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { shallowEqual, useSelector } from "react-redux";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";
export function SearchForm(props) {
  const { onSubmit, setGridData, setIsBillSubmit, shipmentCostLading } = props;
  const ShippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...shipmentCostLading,
          fromTime: _todaysStartTime(),
          toTime: _todaysEndTime(),
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
              <div className="col-lg-2">
                <NewSelect
                  name="shipPoint"
                  options={ShippointDDL}
                  value={values?.shipPoint}
                  label="Shippoint"
                  onChange={(valueOption) => {
                    setFieldValue("shipPoint", valueOption);
                  }}
                  placeholder="Shippoint"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="col-lg-2">
                <NewSelect
                  name="reportType"
                  options={[
                    {
                      value: false,
                      label: "Pending",
                    },
                    {
                      value: true,
                      label: "Complete",
                    },
                    {
                      value: 2,
                      label: "Bill Submit",
                    },
                  ]}
                  value={values?.reportType}
                  label="Select Report"
                  onChange={(valueOption) => {
                    setGridData([]);
                    setFieldValue("reportType", valueOption);
                    if (valueOption?.value === true) {
                      setIsBillSubmit(true);
                    } else {
                      setIsBillSubmit(false);
                    }
                  }}
                  placeholder="Report Type"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="col-lg-3">
                <label>From Date and Time</label>
                <div className="d-flex">
                  <InputField
                    value={values?.fromDate}
                    type="date"
                    name="fromDate"
                  />
                  <InputField
                    value={values?.fromTime}
                    type="time"
                    name="fromTime"
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <label>To Date and Time</label>
                <div className="d-flex">
                  <InputField
                    value={values?.toDate}
                    type="date"
                    name="toDate"
                  />
                  <InputField
                    value={values?.toTime}
                    type="time"
                    name="toTime"
                  />
                </div>
              </div>

              <div className="col-lg-1">
                <button
                  disabled={
                    !values?.reportType || !values?.toDate || !values?.fromDate
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
