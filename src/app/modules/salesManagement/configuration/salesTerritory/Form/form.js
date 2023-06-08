/*
 * Change: Last change assign by Ikbal Hossain
 * Des: Remove Country, District, Division, Thana from create, edit, view
 */

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// import Select from "react-select";
// import customStyles from "../../../../selectCustomStyle";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import { getParentTerritoryDDL } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  territoryTypeName: Yup.object().shape({
    label: Yup.string().required("Territory type name is required"),
    value: Yup.string().required("Territory type name is required"),
  }),
  parentTerritoryName: Yup.object().shape({
    label: Yup.string().required("Parent territory name is required"),
    value: Yup.string().required("Parent territory name is required"),
  }),

  // countryName: Yup.object().shape({
  //   label: Yup.string().required("Country name is required"),
  //   value: Yup.string().required("Country name is required"),
  // }),
  // divisionName: Yup.object().shape({
  //   label: Yup.string().required("Division is required"),
  //   value: Yup.string().required("Division is required"),
  // }),
  // distirctName: Yup.object().shape({
  //   label: Yup.string().required("District is required"),
  //   value: Yup.string().required("District is required"),
  // }),
  // thanaName: Yup.object().shape({
  //   label: Yup.string().required("Thana is required"),
  //   value: Yup.string().required("Thana is required"),
  // }),
  territoryName: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Territory name is required"),
  territoryCode: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Territory code is required"),
  address: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Address is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  territoryTypeDDL,
  parentTerritoryDDL,
  thanaDDL,
  districtDDL,
  divisionDDL,
  countryNameDDL,
  isEdit,
  // ddlCaller,
  parentTerritoryTypeDDL,
  accountId,
  selectedBusinessUnit,
  setParentTerritoryDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          territoryTypeName: {
            value: territoryTypeDDL[0]?.value,
            label: territoryTypeDDL[0]?.label,
          },
        }}
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <ISelect
                    label="Territory Type"
                    options={territoryTypeDDL}
                    value={values.territoryTypeName}
                    name="territoryTypeName"
                    setFieldValue={setFieldValue}
                    isDisabled={isEdit}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={values.territoryName}
                    label="Territory Name"
                    name="territoryName"
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={values.territoryCode}
                    label="Territory Code"
                    name="territoryCode"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <ISelect
                    label="Parent Territory Type"
                    options={parentTerritoryTypeDDL}
                    value={values.parentTerritoryTypeName}
                    name="parentTerritoryTypeName"
                    onChange={(valueOption) => {
                      setFieldValue("parentTerritoryName", "");
                      setFieldValue("parentTerritoryTypeName", valueOption);
                      getParentTerritoryDDL(
                        accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setParentTerritoryDDL
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <ISelect
                    label="Parent Territory Name"
                    options={parentTerritoryDDL}
                    value={values.parentTerritoryName}
                    name="parentTerritoryName"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={values.address}
                    label="Address"
                    name="address"
                  />
                </div>

                {/* <div className="col-lg-3">
                  <label>Select Country</label>
                  <Field
                    name="countryName"
                    placeholder="Select Country"
                    component={() => (
                      <Select
                        options={countryNameDDL}
                        placeholder="Select Country"
                        value={values.countryName}
                        onChange={(valueOption) => {
                          setFieldValue("countryName", valueOption);
                          ddlCaller("division", valueOption?.value);
                          setFieldValue("divisionName", {
                            value: "",
                            label: "",
                          });
                          setFieldValue("distirctName", {
                            value: "",
                            label: "",
                          });
                          setFieldValue("thanaName", {
                            value: "",
                            label: "",
                          });
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.countryName &&
                    touched &&
                    touched.countryName
                      ? errors.countryName.value
                      : ""}
                  </p>
                </div> */}

                {/* <div className="col-lg-3">
                  <label>Select Division</label>
                  <Field
                    name="divisionName"
                    placeholder="Select Division"
                    component={() => (
                      <Select
                        options={divisionDDL}
                        isDisabled={!values?.countryName}
                        placeholder="Select Division"
                        value={values.divisionName}
                        onChange={(valueOption) => {
                          setFieldValue("divisionName", valueOption);
                          ddlCaller(
                            "district",
                            values.countryName.value,
                            valueOption?.value
                          );
                          setFieldValue("distirctName", {
                            value: "",
                            label: "",
                          });
                          setFieldValue("thanaName", {
                            value: "",
                            label: "",
                          });
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.divisionName &&
                    touched &&
                    touched.divisionName
                      ? errors.divisionName.value
                      : ""}
                  </p>
                </div> */}

                {/* <div className="col-lg-3">
                  <label>Select District</label>
                  <Field
                    name="distirctName"
                    placeholder="Select District"
                    component={() => (
                      <Select
                        options={districtDDL}
                        isDisabled={
                          !values?.divisionName || !values?.countryName
                        }
                        placeholder="Select District"
                        value={values.distirctName}
                        onChange={(valueOption) => {
                          setFieldValue("distirctName", valueOption);
                          ddlCaller(
                            "thana",
                            values.countryName.value,
                            values.divisionName.value,
                            valueOption?.value
                          );
                          setFieldValue("thanaName", {
                            value: "",
                            label: "",
                          });
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.distirctName &&
                    touched &&
                    touched.distirctName
                      ? errors.distirctName.value
                      : ""}
                  </p>
                </div> */}

                {/* <div className="col-lg-3">
                  <ISelect
                    isDisabled={
                      !values?.divisionName ||
                      !values?.countryName ||
                      !values.countryName
                    }
                    label="Thana"
                    options={thanaDDL}
                    value={values.thanaName}
                    name="thanaName"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
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
