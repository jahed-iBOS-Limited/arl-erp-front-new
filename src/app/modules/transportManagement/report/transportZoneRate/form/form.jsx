/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { useHistory } from "react-router";

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  shipPoint: Yup.object().shape({
    value: Yup.string().required("Ship Point is required"),
    label: Yup.string().required("Ship Point is required"),
  }),
  zone: Yup.object().shape({
    value: Yup.string().required("Zone is required"),
    label: Yup.string().required("Zone is required"),
  }),

  num3tonRate: Yup.string().required("3 Ton Rate is required"),
  num5tonRate: Yup.string().required("5 Ton Rate is required"),
  num7tonRate: Yup.string().required("7 Ton Rate is required"),
  num1point5TonRate: Yup.string().required("1 Point 5 Ton Rate is required"),
  num1TonRate: Yup.string().required("1 Ton Rate is required"),
  num14TonRate: Yup.string().required("14 Ton Rate is required"),
  num2TonRate: Yup.string().required("2 Ton Rate is required"),
  num20TonRate: Yup.string().required("20 Ton Rate is required"),
  distanceKm: Yup.string().required("Distance (Km) is required"),
  handlingCost: Yup.string().required("Handling Cost is required"),
  labourCost: Yup.string().required("Labour Cost is required"),
  additionalAmount: Yup.string().required("Additional Amount is required"),
});

export default function _Form({
  initData,
  saveHandler,
  isView,
  isEdit,
  loading,
}) {
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
            {loading && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Edit Transport Zone Rate">
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-light"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    // disabled={gridData?.length < 1}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="global-form from-label-right">
                  <div className="form-group row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        // options={shipPointDDL}
                        value={values?.shipPoint}
                        label="Select Shippoint"
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                        }}
                        placeholder="Select Shippoint"
                        errors={errors}
                        touched={touched}
                        isDisabled={isView || isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="zone"
                        // options={zoneDDL}
                        value={values?.zone}
                        label="Select Transport Zone"
                        onChange={(valueOption) => {
                          setFieldValue("zone", valueOption);
                        }}
                        placeholder="Select Transport Zone"
                        errors={errors}
                        touched={touched}
                        isDisabled={isView || isEdit}
                      />
                    </div>

                    <div className="col-lg-2">
                      <IInput
                        value={values?.num1TonRate}
                        label="1 Ton Rate"
                        name="num1TonRate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("num1TonRate", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2">
                      <IInput
                        value={values?.num1point5TonRate}
                        label="1 Point 5 Ton Rate"
                        name="num1point5TonRate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("num1point5TonRate", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>

                    <div className="col-lg-2">
                      <IInput
                        value={values?.num2TonRate}
                        label="2 Ton Rate"
                        name="num2TonRate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("num2TonRate", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2">
                      <IInput
                        value={values?.num3tonRate}
                        label="3 Ton Rate"
                        name="num3tonRate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("num3tonRate", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>

                    <div className="col-lg-2">
                      <IInput
                        value={values?.num5tonRate}
                        label="5 Ton Rate"
                        name="num5tonRate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("num5tonRate", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2">
                      <IInput
                        value={values?.num7tonRate}
                        label="7 Ton Rate"
                        name="num7tonRate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("num7tonRate", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>

                    <div className="col-lg-2">
                      <IInput
                        value={values?.num14TonRate}
                        label="14 Ton Rate"
                        name="num14TonRate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("num14TonRate", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>

                    <div className="col-lg-2">
                      <IInput
                        value={values?.num20TonRate}
                        label="20 Ton Rate"
                        name="num20TonRate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("num20TonRate", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2">
                      <IInput
                        value={values?.additionalAmount}
                        label="Additional Amount"
                        name="additionalAmount"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("additionalAmount", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2">
                      <IInput
                        value={values?.distanceKm}
                        label="Distance (Km)"
                        name="distanceKm"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value > 0) {
                            setFieldValue("distanceKm", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2">
                      <IInput
                        value={values?.handlingCost}
                        label="Handling Cost"
                        name="handlingCost"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("handlingCost", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2">
                      <IInput
                        value={values?.labourCost}
                        label="Labour Cost"
                        name="labourCost"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("labourCost", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2 mt-5 d-flex align-items-center">
                      <input
                        value={values?.isAmountBase}
                        checked={values?.isAmountBase}
                        name="isAmountBase"
                        id="isAmountBase"
                        type="checkbox"
                        onChange={(e) => {
                          setFieldValue("isAmountBase", e?.target?.checked);
                        }}
                        disabled={isView}
                      />
                      <label htmlFor="isAmountBase" className="pl-2">
                        Is Amount Base
                      </label>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
