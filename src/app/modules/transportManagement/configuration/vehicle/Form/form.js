import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import { NegetiveCheck } from "../../../../_helper/_negitiveCheck";
import IViewModal from "../../../../_helper/_viewModal";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import NewSelect from "./../../../../_helper/_select";
import VehicleNoAddForm from "./vehicleNoAddForm/vehicleNoAddForm";

// Validation schema
const validationSchema = Yup.object().shape({
  vehicleNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Vehicle No is required"),
  weight: Yup.number()
    .min(0, "Minimum 0 range")
    .max(100000, "Maximum 100000 range")
    .required("Weight is required"),
  volume: Yup.number()
    .min(0, "Minimum 0 range")
    .max(100000, "Maximum 100000 range")
    .required("Volume is required"),
  vehicleType: Yup.object().shape({
    label: Yup.string().required("Vehicle is required"),
    value: Yup.string().required("Vehicle is required"),
  }),
  ownerType: Yup.object().shape({
    label: Yup.string().required("Owner is required"),
    value: Yup.string().required("Owner is required"),
  }),
  contact: Yup.string()
    .max(11, "Invalid Contact Number")
    .min(11, "Invalid Contact Number")
    .required("Contact is Required"),
  transportmode: Yup.object().shape({
    label: Yup.string().required("Transport mode required"),
    value: Yup.string().required("Transport mode required"),
  }),
  vehicleUsePurpose: Yup.object().shape({
    label: Yup.string().required("Vehicle use purpose required"),
    value: Yup.string().required("Vehicle use purpose required"),
  }),
  fuelType: Yup.object().shape({
    label: Yup.string().required("Fuel Type required"),
    value: Yup.string().required("Fuel Type required"),
  }),
  vehicleCapacity: Yup.object().shape({
    label: Yup.string().required("Vehicle Capacity required"),
    value: Yup.string().required("Vehicle Capacity required"),
  }),
  costPerKM: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Vehicle No is required"),
  //   fuelAllowanceLocalKM: Yup.string()
  //   .when('vehicleType', {
  //     is: { label: 'Company' },
  //     then: Yup.string()
  //       .min(0, "Minimum 0 symbols")
  //       .required("Local KM is required"),
  //     // You can add an else clause if needed
  //   }),
  // fuelAllowanceOuterKM: Yup.string()
  //   .when('vehicleType', {
  //     is: { label: 'Company' },
  //     then: Yup.string()
  //       .min(0, "Minimum 0 symbols")
  //       .required("Outer KM is required"),
  //     // You can add an else clause if needed
  //   }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  vehicleTypeDDL,
  employeeListDDL,
  TransportModeDDL,
  vehicleUsePurposeDDL,
  vehicleFuelTypeDDL,
  vehicleCapacityDDL,
  accountId,
  id,
  shipPointDDL,
}) {
  const [isShowModal, setIsShowModal] = useState(false);
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearch?AccountId=${accountId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };
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
          setValues,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shipPointDDL || []}
                    value={values?.shipPoint}
                    label="Ship Point"
                    onChange={(valueOption) => {
                      setFieldValue("shipPoint", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="vehicleType"
                    options={vehicleTypeDDL}
                    value={values?.vehicleType}
                    label="Vehicle Type"
                    onChange={(valueOption) => {
                      setFieldValue("vehicleType", valueOption);
                      setFieldValue("vehicleNo", "");
                    }}
                    placeholder="Vehicle Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 d-flex">
                  <div style={{ width: "100%" }}>
                    <label className="d-block">Vehicle No</label>
                    <InputField
                      value={values?.vehicleNo || ""}
                      name="vehicleNo"
                      placeholder="Vehicle No"
                      type="text"
                      disabled={
                        ![10, 11, 12, 13, 14, 15]?.includes(
                          values?.vehicleType?.value
                        )
                      }
                    />
                  </div>
                  {![10, 11, 12, 13, 14, 15]?.includes(
                    values?.vehicleType?.value
                  ) && (
                    <div
                      className="mt-8 pl-2"
                      onClick={() => {
                        setIsShowModal(true);
                      }}
                    >
                      <i
                        style={{ fontSize: "15px", color: "#3699FF" }}
                        className="fa pointer fa-plus-circle"
                        aria-hidden="true"
                      ></i>
                    </div>
                  )}
                </div>

                <div className="col-lg-3">
                  <IInput
                    type="number"
                    value={values?.weight}
                    label="Weight Capacity(KG)"
                    name="weight"
                    onChange={(e) => {
                      NegetiveCheck(e.target.value, setFieldValue, "weight");
                    }}
                    // disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    type="number"
                    value={values?.volume}
                    label="Volume(KG)"
                    name="volume"
                    onChange={(e) => {
                      NegetiveCheck(e.target.value, setFieldValue, "volume");
                    }}
                    // disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <ISelect
                    label="Owner Type"
                    options={[
                      { value: 1, label: "Company" },
                      { value: 2, label: "Rental" },
                      { value: 3, label: "Customer" },
                    ]}
                    value={values?.ownerType}
                    name="ownerType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* {values.ownerType.label === "Company" && (
                  <div className="col-lg-3">
                    <ISelect
                      label="Driver Name"
                      options={employeeListDDL}
                      value={values?.employeeName}
                      name="employeeName"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )} */}
                {values.ownerType.label === "Company" && (
                  <div className="col-md-3">
                    <label>Driver Name</label>
                    <SearchAsyncSelect
                      selectedValue={values?.employeeName}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("employeeName", valueOption);
                      }}
                      loadOptions={loadUserList}
                    />
                  </div>
                )}

                {(values.ownerType.label === "Rental" ||
                  values.ownerType.label === "Customer") && (
                  <div className="col-lg-3">
                    <IInput
                      type="text"
                      value={values?.driverName}
                      label="Driver Name"
                      name="driverName"
                      // disabled={isEdit}
                    />
                  </div>
                )}

                {values.ownerType && (
                  <div className="col-lg-3">
                    <IInput
                      type="text"
                      value={values?.contact}
                      label="Driver Contact Number"
                      name="contact"
                      // disabled={isEdit}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <ISelect
                    label="Transport Mode"
                    options={TransportModeDDL}
                    value={values?.transportmode}
                    name="transportmode"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Vehicle Use Purpose"
                    options={vehicleUsePurposeDDL}
                    value={values?.vehicleUsePurpose}
                    name="vehicleUsePurpose"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {["Office", "Standby"].includes(values?.vehicleUsePurpose?.label) && (
                  <div className="col-md-3">
                    <label>User Enroll & Name</label>
                    <SearchAsyncSelect
                      selectedValue={values?.user}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("user", valueOption);
                      }}
                      loadOptions={loadUserList}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <ISelect
                    label="Fuel Type"
                    options={vehicleFuelTypeDDL}
                    value={values?.fuelType}
                    name="fuelType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Vehicle Capacity"
                    options={vehicleCapacityDDL}
                    value={values?.vehicleCapacity}
                    name="vehicleCapacity"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    type="text"
                    value={values?.costPerKM}
                    label="Cost Per KM"
                    name="costPerKM"
                    // disabled={isEdit}
                  />
                </div>
                {values.ownerType.label === "Company" && (
                  <>
                    <div className="col-lg-3">
                      <IInput
                        type="text"
                        value={values?.fuelAllowanceLocalKM ?? ""}
                        label="Fuel Allowance (Local KM)"
                        name="fuelAllowanceLocalKM"
                        // disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <IInput
                        type="text"
                        value={values?.fuelAllowanceOuterKM ?? ""}
                        label="Fuel Allowance (Outer KM)"
                        name="fuelAllowanceOuterKM"
                        // disabled={isEdit}
                      />
                    </div>
                  </>
                )}
                <div className="col-lg-3">
                  <IInput
                    type="number"
                    value={values?.capacityInBag ?? ""}
                    label="Capacity In Bag"
                    name="capacityInBag"
                    // disabled={isEdit}
                  />
                </div>
              </div>

              <IViewModal
                show={isShowModal}
                onHide={() => {
                  setIsShowModal(false);
                }}
              >
                <VehicleNoAddForm
                  setIsShowModal={setIsShowModal}
                  setPrevValues={setValues}
                  prevValues={values}
                  id={id}
                />
              </IViewModal>

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
