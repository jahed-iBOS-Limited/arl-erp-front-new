/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getDivisionDDL_api } from "../helper";
import {
  getDistrictDDL_api,
  getPoliceStationDDL_api,
  getPostcodeDDL_api,
} from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  businessPartnerTypeId: Yup.object().shape({
    label: Yup.string().required("Partner Type is required"),
    value: Yup.string().required("Partner Type is required"),
  }),
  country: Yup.object().shape({
    label: Yup.string().required("country is required"),
    value: Yup.string().required("country is required"),
  }),
  state: Yup.object().shape({
    label: Yup.string().required("state is required"),
    value: Yup.string().required("state is required"),
  }),
  city: Yup.object().shape({
    label: Yup.string().required("city is required"),
    value: Yup.string().required("city is required"),
  }),
  policeStation: Yup.object().shape({
    label: Yup.string().required("police Station is required"),
    value: Yup.string().required("police Station is required"),
  }),
  postCode: Yup.object().shape({
    label: Yup.string().required("post code is required"),
    value: Yup.string().required("post code is required"),
  }),
  taxBracket: Yup.object().shape({
    label: Yup.string().required("Tax Bracket is required"),
    value: Yup.string().required("Tax Bracket is required"),
  }),
  businessPartnerCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),
  nid: Yup.number().required("NID is required"),
  businessPartnerAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Address is required"),
  contactNumber: Yup.string()
    .min(11, "Minimum 11 symbols")
    .max(11, "Maximum 11 symbols")
    .required("Contact number is required"),
  businessPartnerName: Yup.string()
    .required("Partner name is required")
    .min(2, "Minimum 2 number")
    .max(1000, "Maximum 1000 number"),
  partnerName: Yup.string()
    .min(1, "Minimum 1 number")
    .max(1000, "Maximum 100 number"),
  address: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(1000, "Maximum 100 symbols"),
});

// Validation schema Edit
const validationSchemaEdit = Yup.object().shape({
  businessPartnerTypeId: Yup.object().shape({
    label: Yup.string().required("Partner Type is required"),
    value: Yup.string().required("Partner Type is required"),
  }),
  taxBracket: Yup.object().shape({
    label: Yup.string().required("Tax Bracket is required"),
    value: Yup.string().required("Tax Bracket is required"),
  }),
  businessPartnerCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),
  nid: Yup.number().required("NID is required"),
  businessPartnerAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Address is required"),
  contactNumber: Yup.string().required("Contact number is required"),
  businessPartnerName: Yup.string()
    .required("Partner name is required")
    .min(2, "Minimum 2 number")
    .max(1000, "Maximum 1000 number"),
  partnerName: Yup.string()
    .min(1, "Minimum 1 number")
    .max(1000, "Maximum 100 number"),
  address: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(1000, "Maximum 100 symbols"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  taxBracketDDL,
  countryDDL,
  divisionDDL,
  partnerTypeDDL,
  districtDDL,
  policeStationDDL,
  SetPoliceStationDDL,
  SetDistrictDDL,
  postCodeDDL,
  setPostCodeDDL,
  isEdit,
  setter,
  remover,
  setRowDto,
  rowDto,
  setDivisionDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? validationSchemaEdit : validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
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
            {/* {disableHandler(!isValid)} */}

            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="businessPartnerTypeId"
                          options={partnerTypeDDL || []}
                          value={values?.businessPartnerTypeId}
                          label="Partner Type"
                          onChange={(valueOption) => {
                            setFieldValue("businessPartnerTypeId", valueOption);
                          }}
                          placeholder="Partner Type"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.businessPartnerName}
                          placeholder="Partner Name"
                          label="Partner Name"
                          name="businessPartnerName"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.businessPartnerCode}
                          label="Code"
                          placeholder="Code"
                          name="businessPartnerCode"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.businessPartnerAddress}
                          label="Holding & Street"
                          placeholder="Holding, Street"
                          name="businessPartnerAddress"
                        />
                      </div>
                      {!isEdit && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="country"
                            options={countryDDL || []}
                            value={values?.country}
                            label="Country"
                            onChange={(valueOption) => {
                              setFieldValue("country", valueOption);
                              setFieldValue("state", "");
                              getDivisionDDL_api(
                                valueOption?.value,
                                setDivisionDDL
                              );
                            }}
                            placeholder="Country"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      {!isEdit && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="state"
                            options={divisionDDL || []}
                            value={values?.state}
                            label="State/Division"
                            onChange={(valueOption) => {
                              setFieldValue("state", valueOption);
                              setFieldValue("city", "");
                              getDistrictDDL_api(
                                values?.country.value,
                                valueOption?.value,
                                SetDistrictDDL
                              );
                            }}
                            placeholder="State/Division"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      {!isEdit && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="city"
                            options={districtDDL || []}
                            value={values?.city}
                            label=" City/District"
                            onChange={(valueOption) => {
                              setFieldValue("city", valueOption);
                              setFieldValue("policeStation", "");
                              getPoliceStationDDL_api(
                                values?.country?.value,
                                values?.state?.value,
                                valueOption?.value,
                                SetPoliceStationDDL
                              );
                            }}
                            placeholder=" City/District"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      {!isEdit && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="policeStation"
                            options={policeStationDDL || []}
                            value={values?.policeStation}
                            label=" Police Station"
                            onChange={(valueOption) => {
                              setFieldValue("policeStation", valueOption);
                              setFieldValue("postCode", {
                                value: 1,
                                label: valueOption?.code,
                              });
                              getPostcodeDDL_api(
                                +valueOption?.value,
                                setPostCodeDDL
                              );
                            }}
                            placeholder="  Police Station"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      {!isEdit && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="Post Code"
                            options={postCodeDDL || []}
                            value={values?.postCode}
                            label=" Post Code"
                            onChange={(valueOption) => {
                              setFieldValue("postCode", valueOption);
                            }}
                            placeholder="PostCode"
                            errors={errors}
                            touched={touched}
                            isDisabled={true}
                          />
                        </div>
                      )}

                      <div className="col-lg-3">
                        <NewSelect
                          name="taxBracket"
                          options={taxBracketDDL || []}
                          value={values?.taxBracket}
                          label="Tax Bracket"
                          onChange={(valueOption) => {
                            setFieldValue("taxBracket", valueOption);
                          }}
                          placeholder=" Tax Bracket"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.contactNumber}
                          label="
                          Contact Number"
                          placeholder="
                          Contact Number"
                          name="contactNumber"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.email}
                          label="
                          Email (Optional)"
                          placeholder="
                          Email (Optional)"
                          name="email"
                          type="email"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.nid}
                          label="NID Number"
                          placeholder="NID Number"
                          name="nid"
                          type="number"
                          min="0"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="BIN Number (Optional)"
                          placeholder="BIN Number"
                          name="bin"
                          type="text"
                          value={values?.bin}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="License No. (Optional)"
                          placeholder="License No"
                          name="licenseNo"
                          type="text"
                          value={values?.licenseNo}
                        />
                      </div>

                      <div className="col-lg-3 my-5 d-flex align-items-center">
                        {values?.businessPartnerTypeId?.value === 2 && (
                          <>
                            <Field
                              type="checkbox"
                              name="addShipToParty"
                              className="mr-3"
                            />
                            <label
                              style={{
                                textAlign: "center",
                              }}
                            >
                              Add Ship To Party
                            </label>
                          </>
                        )}
                      </div>
                    </>
                  </div>
                </div>
              </div>
              {values?.addShipToParty && (
                <>
                  {values?.businessPartnerTypeId?.value === 2 && (
                    <>
                      <div className="row global-form m-0">
                        <div className="col-lg-3">
                          <InputField
                            value={values?.partnerName}
                            label="Ship To Party"
                            placeholder="Ship To Party"
                            name="partnerName"
                            type="text"
                            style={{ width: "220px" }}
                          />
                        </div>
                        <div className="col-lg-3 ml-n2">
                          <InputField
                            value={values?.shippingContactNumber}
                            label="Contact Number"
                            placeholder="Contact Number"
                            name="shippingContactNumber"
                            type="text"
                            style={{ width: "200px" }}
                          />
                        </div>
                        <div className="col-lg-3 ml-n5">
                          <InputField
                            value={values?.address}
                            label=" Address"
                            placeholder=" Address"
                            name="address"
                            type="text"
                            style={{ width: "200px" }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <button
                            onClick={() => {
                              const obj = {
                                businessPartnerId:
                                  values?.businessPartnerId || 0,
                                partnerName: values?.partnerName,
                                contactNumber: values?.shippingContactNumber,
                                address: values?.address,
                              };
                              setter(obj);
                            }}
                            disabled={
                              !values?.address ||
                              !values?.shippingContactNumber ||
                              !values?.partnerName
                            }
                            className="btn btn-primary mt-5"
                            type="button"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      {/* Shipping Address table */}
                      <div className="row global-table m-0">
                        <div className="col-lg-6 pr-0 pl-0">
                          {rowDto?.length > 0 && (
                            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                              <thead>
                                <tr>
                                  <th style={{ width: "35px" }}>SL</th>
                                  <th>Partner Name</th>
                                  <th>Contact Number</th>
                                  <th>Address</th>
                                  {/* <th>Action</th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {rowDto?.map((itm, index) => (
                                  <tr key={index} style={{ width: "100%" }}>
                                    <td className="text-center">{++index}</td>
                                    <td
                                      className="pl-5 text-center"
                                      style={{ width: "35px" }}
                                    >
                                      {itm?.partnerName}
                                    </td>
                                    <td
                                      className="text-left pr-2"
                                      style={{ width: "50px" }}
                                    >
                                      {itm?.contactNumber}
                                    </td>
                                    <td
                                      className="text-center pr-2"
                                      style={{ width: "50px" }}
                                    >
                                      {itm?.address}
                                    </td>
                                    {/* <td
                            className="text-center"
                            style={{ width: "50px" }}
                          >
                            <i
                              className="fa fa-trash"
                              onClick={() => remover(index)}
                            ></i>
                          </td> */}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

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
