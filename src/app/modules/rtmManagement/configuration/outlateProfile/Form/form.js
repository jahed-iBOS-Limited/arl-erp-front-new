import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// eslint-disable-next-line no-unused-vars
import FormikError from "./../../../../_helper/_formikError";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { getBusinessTypeDDL, getRouteNameDDL } from "../helper";
// eslint-disable-next-line no-unused-vars
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getBeatApiDDL } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  businessType: Yup.object().shape({
    label: Yup.string().required("Business Type is required"),
    value: Yup.number().required("Business Type is required"),
  }),
  routeName: Yup.object().shape({
    label: Yup.string().required("Route Name is required"),
    value: Yup.number().required("Route Name is required"),
  }),
  beatName: Yup.object().shape({
    label: Yup.string().required("Market Name is required"),
    value: Yup.number().required("Market Name is required"),
  }),
  outletName: Yup.string().required("Outlet Name is required"),
  outletAddress: Yup.string().required("Outlet Address is required"),
  ownerName: Yup.string().required("Ower Name is required"),
  mobileNumber: Yup.number().required("Mobile Number is required"),
  isColler: Yup.bool().required("Is Coller is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setBeatNameDDL,
  profileData,
  selectedBusinessUnit,
  beatNameDDL,
  latutude,
  longitude,
  state,
  collerCompanyDDL,
}) {
  // eslint-disable-next-line no-unused-vars

  const [businessTypeDDL, setBusinessDDL] = useState([]);
  const [routeNameDDL, setRouteNameDDL] = useState([]);

  useEffect(() => {
    if ((profileData?.accountId && selectedBusinessUnit?.value)) {
      getBusinessTypeDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setBusinessDDL
      );

      getRouteNameDDL(
        profileData.accountId,
        selectedBusinessUnit?.value,
        state?.territoryName?.value,
        setRouteNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit, state]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          routeName: state?.routeName,
          beatName: state?.beatName,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            // setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setValues,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-3">
                  {/* <label>Route Name</label> */}
                  <NewSelect
                    label="Route Name"
                    name="routeName"
                    options={routeNameDDL}
                    value={values?.routeName}
                    onChange={(valueOption) => {
                      setFieldValue("routeName", valueOption);
                      getBeatApiDDL(valueOption?.value, setBeatNameDDL);
                    }}
                    placeholder="Select Route Name"
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  {/* <label>Route Name</label> */}
                  <NewSelect
                    label="Market Name"
                    name="beatName"
                    options={beatNameDDL}
                    value={values?.beatName}
                    onChange={(valueOption) => {
                      setFieldValue("beatName", valueOption);
                    }}
                    placeholder="Select Market Name"
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Outlate Name</label>
                  <InputField
                    value={values?.outletName}
                    name="outletName"
                    placeholder="Outlate Name"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  {/* <label>Business Type</label> */}
                  <NewSelect
                    label="Outlet Type"
                    name="businessType"
                    options={businessTypeDDL}
                    value={values?.businessType}
                    onChange={(valueOption) => {
                      setFieldValue("businessType", valueOption);
                    }}
                    placeholder="Outlet Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Outlate Address</label>
                  <InputField
                    value={values?.outletAddress}
                    name="outletAddress"
                    placeholder="Outlate Address"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Owner Name</label>
                  <InputField
                    value={values?.ownerName}
                    name="ownerName"
                    placeholder="Owner Name"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Mobile Number</label>
                  <InputField
                    value={values?.mobileNumber}
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    type="number"
                    errors={errors}
                    touched={touched}
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Lattitude*</label>
                  <InputField
                    value={latutude}
                    name="lattitude"
                    placeholder="Lattitude"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Longitude*</label>
                  <InputField
                    value={longitude}
                    name="longitude"
                    placeholder="Longitude"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-1 d-flex" style={{ marginTop: "20px" }}>
                  <input
                    style={{
                      width: "15px",
                      height: "15px",
                      position: "relative",
                      top: "3px",
                    }}
                    name="isColler"
                    checked={values?.isColler}
                    className=" mr-2"
                    type="checkbox"
                    onChange={(e) => {
                      setFieldValue("collerCompany", "");
                      setFieldValue("isColler", e.target.checked);
                    }}
                  />
                  <label>Is Coller</label>
                </div>
                {values?.isColler === true && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="collerCompany"
                      options={collerCompanyDDL || []}
                      value={values?.collerCompany}
                      label="Coller Company"
                      onChange={(valueOption) => {
                        setFieldValue("collerCompany", valueOption);
                      }}
                      placeholder="Coller Company"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
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
