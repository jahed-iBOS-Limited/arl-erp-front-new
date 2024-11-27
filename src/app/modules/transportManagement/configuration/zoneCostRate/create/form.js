/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

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
  labourCostLess6Ton: Yup.string().required(
    "Labour Cost less 6 ton is required"
  ),
  // subsidiaryRate: Yup.string().required("Subsidiary Rate is required"),
  additionalAmount: Yup.string().required("Additional Amount is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isView,
  isEdit,
  buId,
  // DDL,
  zoneDDL,
  shipPointDDL,
  rows,
  isSubsidyRunning,
  addRows,
  remover,
  isAmountBase,
}) {
  const [valid, setValid] = useState(true);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          isAmountBase: isAmountBase,
          isAmountBase2: isAmountBase,
        }}
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
            {isSubsidyRunning && (
              <marquee
                direction="left"
                style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
              >
                Transport subsidiary is running....
              </marquee>
            )}
            <Form className="global-form from-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shipPointDDL}
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
                    options={zoneDDL}
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
                  <InputField
                    value={values?.num1TonRate}
                    label="1 Ton Rate"
                    name="num1TonRate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("num1TonRate", e.target.value);
                      }
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.num1point5TonRate}
                    label="1 Point 5 Ton Rate"
                    name="num1point5TonRate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("num1point5TonRate", e.target.value);
                      }
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values?.num2TonRate}
                    label="2 Ton Rate"
                    name="num2TonRate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("num2TonRate", e.target.value);
                      }
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.num3tonRate}
                    label="3 Ton Rate"
                    name="num3tonRate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("num3tonRate", e.target.value);
                      }
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values?.num5tonRate}
                    label="5 Ton Rate"
                    name="num5tonRate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("num5tonRate", e.target.value);
                      }
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.num7tonRate}
                    label="7 Ton Rate"
                    name="num7tonRate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("num7tonRate", e.target.value);
                      }
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values?.num14TonRate}
                    label="14 Ton Rate"
                    name="num14TonRate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("num14TonRate", e.target.value);
                      }
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values?.num20TonRate}
                    label="20 Ton Rate"
                    name="num20TonRate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("num20TonRate", e.target.value);
                      }
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.additionalAmount}
                    label="Additional Amount"
                    name="additionalAmount"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("additionalAmount", e.target.value);
                      }
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.distanceKm}
                    label="Distance (Km)"
                    name="distanceKm"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("distanceKm", e.target.value);
                      }
                    }}
                    disabled={
                      isView ||
                      (isEdit &&
                        values?.isSlabProgram &&
                        buId !== 94 &&
                        buId !== 175)
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.handlingCost}
                    label="Handling Cost"
                    name="handlingCost"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("handlingCost", e.target.value);
                      }
                    }}
                    disabled={
                      isView ||
                      (isEdit &&
                        values?.isSlabProgram &&
                        buId === 94 &&
                        buId === 175)
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.labourCost}
                    label="Labour Cost Greater 6 ton"
                    name="labourCost"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("labourCost", e.target.value);
                      }
                    }}
                    disabled={
                      isView ||
                      (isEdit &&
                        values?.isSlabProgram &&
                        buId === 94 &&
                        buId === 175)
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.labourCostLess6Ton}
                    label="Labour Cost Less 6Ton"
                    name="labourCostLess6Ton"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("labourCostLess6Ton", e.target.value);
                      }
                    }}
                    disabled={
                      isView
                      // || (isEdit && values?.isSlabProgram && buId === 94)
                    }
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    style={{ backgroundColor: "yellow" }}
                    value={values?.subsidiaryRate}
                    name="subsidiaryRate"
                    label="Subsidiary Rate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("subsidiaryRate", e.target.value);
                      }
                    }}
                    disabled={
                      isView ||
                      (isEdit &&
                        values?.isSlabProgram &&
                        buId !== 94 &&
                        buId !== 175)
                    }
                  />
                </div>
                <div className="col-lg-2 mt-5 d-flex align-items-center">
                  <input
                    value={values?.isAmountBase}
                    checked={values?.isAmountBase}
                    name="isAmountBase"
                    id="isAmountBase"
                    type="checkbox"
                    onChange={() => {
                      setFieldValue("isAmountBase", !values?.isAmountBase);
                      setFieldValue(
                        "isSlabProgram",
                        values?.isSlabProgram ? false : null
                      );
                    }}
                    disabled={true}
                    // disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                  <label htmlFor="isAmountBase" className="pl-2 pt-0">
                    Is Amount Base
                  </label>
                </div>
                <div className="col-lg-2 mt-5 d-flex align-items-center">
                  <input
                    value={values?.isSlabProgram}
                    checked={values?.isSlabProgram}
                    name="isSlabProgram"
                    id="isSlabProgram"
                    type="checkbox"
                    onChange={() => {
                      setFieldValue("isSlabProgram", !values?.isSlabProgram);
                      setFieldValue(
                        "isAmountBase",
                        values?.isAmountBase ? false : null
                      );
                    }}
                    disabled={isView || (isEdit && values?.isSlabProgram)}
                  />
                  <label htmlFor="isSlabProgram" className="pl-2 pt-0">
                    Is Slab Base
                  </label>
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
            {values?.isSlabProgram && (
              <>
                <Form className="global-form from-label-right">
                  <div className="form-group row">
                    <div className="col-lg-2">
                      <InputField
                        value={values?.rangeFrom}
                        label="Range From"
                        placeholder="Range From"
                        name="rangeFrom"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("rangeFrom", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.rangeTo}
                        label="Range To"
                        placeholder="Range To"
                        name="rangeTo"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("rangeTo", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.slabRate}
                        label="Slab Rate"
                        placeholder="Slab Rate"
                        name="slabRate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("slabRate", e.target.value);
                          }
                        }}
                        disabled={isView}
                      />
                    </div>
                    {buId === 171 || buId === 224 ? (
                      <div className="col-lg-2">
                        <NewSelect
                          name="categoryName"
                          options={[
                            { value: 1, label: "Straight" },
                            { value: 2, label: "Bend" },
                          ]}
                          value={values?.categoryName}
                          label="Select Category name"
                          onChange={(valueOption) => {
                            setFieldValue("categoryName", valueOption);
                          }}
                          placeholder="Select Category name"
                          errors={errors}
                          touched={touched}
                          isDisabled={isView}
                        />
                      </div>
                    ) : (
                      <div className="col-lg-2">
                        <InputField
                          value={values?.categoryName}
                          label="Category Name"
                          placeholder="Category Name"
                          name="categoryName"
                          type="text"
                          disabled={isView}
                        />
                      </div>
                    )}

                    <div className="col-lg-2 mt-5 d-flex align-items-center">
                      <input
                        value={values?.isAmountBase2}
                        checked={values?.isAmountBase2}
                        name="isAmountBase2"
                        id="isAmountBase2"
                        type="checkbox"
                        onChange={() => {
                          setFieldValue(
                            "isAmountBase2",
                            !values?.isAmountBase2
                          );
                        }}
                        disabled={true}
                        // disabled={isView}
                      />
                      <label htmlFor="isAmountBase2" className="pl-2 pt-0">
                        Is Amount Base
                      </label>
                    </div>
                    {!isView && (
                      <div className="col-lg-2 mt-5">
                        <button
                          type="button"
                          onClick={() => addRows(values, setFieldValue)}
                          className="btn btn-primary"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </Form>
                {rows?.length ? (
                  <div className="col-lg-12 pr-0 pl-0">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Range From</th>
                            <th>Range To</th>
                            <th>Slab Rate</th>
                            <th>Category Name</th>
                            <th>Is Amount Base</th>
                            <th style={{ width: "70px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows?.map((item, index) => (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-right">{item?.rangeFrom}</td>
                              <td className="text-right">{item?.rangeTo}</td>
                              <td className="text-right">{item?.slabRate}</td>
                              <td>{item?.categoryName}</td>
                              <td>{item?.isAmountBase ? "True" : "False"}</td>
                              <td className="text-center">
                                <IDelete remover={remover} id={index} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </Formik>
    </>
  );
}
