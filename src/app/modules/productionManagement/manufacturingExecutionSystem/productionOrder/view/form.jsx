/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import customStyles from "../../../../selectCustomStyle";
import { IInput } from "../../../../_helper/_input";
import { useEffect } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { GetPlantDDL } from "../helper";
import Select from "react-select";
import FormikError from "../../../../_helper/_formikError";

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  transportRouteCostComponent: Yup.string().required("Component Name required"),
  businessTransaction: Yup.object().shape({
    label: Yup.string().required("business Transaction required"),
    value: Yup.string().required("business Transaction required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  profileData,
  selectedBusinessUnit,
}) {
  const [valid, setValid] = useState(true);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
          });
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
        }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="global-form from-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <label>Plant</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("plantName", valueOption);
                    }}
                    value={values?.plantName || ""}
                    styles={customStyles}
                    name="plantName"
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);
                    }}
                    value={values?.itemName || ""}
                    styles={customStyles}
                    name="itemName"
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Work Center</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("workCenter", valueOption);
                    }}
                    value={values?.workCenter || ""}
                    isSearchable={true}
                    styles={customStyles}
                    name="workCenter"
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Bill Of Material</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("bomName", valueOption);
                    }}
                    value={values?.bomName || ""}
                    isSearchable={true}
                    styles={customStyles}
                    name="bomName"
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                <IInput
                    value={values?.bomVersion}
                    label="BOM Version"
                    name="bomVersion"
                    type="string"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                <IInput
                    value={values?.uomName}
                    label="UOM"
                    name="uomName"
                    type="string"
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={values?.startDate}
                    label="Start Date"
                    name="startDate"
                    type="date"
                    disabled={true}
                  />
                             
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.startTime}
                    label="Start Time"
                    name="startTime"
                    type="time"
                    disabled={true}
                  />
                       
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.endDateTime}
                    label="End Date"
                    name="endDateTime"
                    type="date"
                    disabled={true}
                  />
                          
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.endTime}
                    label="End Time"
                    name="endTime"
                    type="time"
                    disabled={true}
                  />
                           
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.salesOrderId}
                    label="Sales Order ID"
                    name="salesOrderId"
                    type="number"
                    disabled={true}
                    min="0"

                  />
                             
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.numOrderQty}
                    label="Quantity"
                    name="numOrderQty"
                    type="number"
                    disabled={true}
                    min="0"
                  />
                             
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
