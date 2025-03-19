import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  getShippointDDL,
  // getSoldToPartnerDDL,
  // getShipToPartnerDDL,
  getransportZoneDDL,
  getVehicleCapacityDDL,
} from "../helper";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { _numberValidation } from "./../../../../_helper/_numberValidation";

// Validation schema
const validationSchema = Yup.object().shape({
  shippoint: Yup.object().shape({
    label: Yup.string().required("Shippoint is required"),
    value: Yup.string().required("Shippoint is required"),
  }),
  // soldToPartner: Yup.object().shape({
  //   label: Yup.string().required("Sold to Partner is required"),
  //   value: Yup.string().required("Sold to Partner is required"),
  // }),
  // shipToPartner: Yup.object().shape({
  //   label: Yup.string().required("Ship to Partner is required"),
  //   value: Yup.string().required("Ship to Partner is required"),
  // }),
  transportZone: Yup.object().shape({
    label: Yup.string().required("Transport Zone is required"),
    value: Yup.string().required("Transport Zone is required"),
  }),
  vehicleCapacity: Yup.object().shape({
    label: Yup.string().required("Vehicle Capacity is required"),
    value: Yup.string().required("Vehicle Capacity is required"),
  }),
  rate: Yup.number()
    .min(0, "Minimum 0 range")
    .max(10000000000000, "Maximum 10000000000000 range")
    .required("Rate is required"),
  distanceKm: Yup.number()
    .min(0, "Minimum 0 range")
    .max(10000000000000, "Maximum 10000000000000 range")
    .required("Distance KM is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  profileData,
  selectedBusinessUnit,
  isEdit,
}) {
  const [shippointDDL, setShippointDDL] = useState([]);
  // const [partnerDDL, setPartnerDDL] = useState([]);
  // const [shipTopartnerDDL, setShipToPartnerDDL] = useState([]);
  const [transportZoneDDL, setTransportZoneDDL] = useState([]);
  const [vehicleCapacityDDL, setVehicleCapacityDDL] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getShippointDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShippointDDL
      );
      // getSoldToPartnerDDL(
      //   profileData?.accountId,
      //   selectedBusinessUnit?.value,
      //   setPartnerDDL
      // );
      getVehicleCapacityDDL(setVehicleCapacityDDL);
      getransportZoneDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTransportZoneDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          vehicleCapacity: initData?.vehicleCapacity?.value
            ? initData?.vehicleCapacity
            : vehicleCapacityDDL[0],
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    label="Select Shippoint"
                    options={shippointDDL}
                    value={values?.shippoint}
                    name="shippoint"
                    onChange={(valueOption) => {
                      setFieldValue("shippoint", valueOption);
                    }}
                    placeholder="Ship Point"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <NewSelect
                    label="Select Sold To Partner"
                    options={partnerDDL}
                    value={values?.soldToPartner}
                    name="soldToPartner"
                    onChange={(valueOption) => {
                      setFieldValue("soldToPartner", valueOption);
                      getShipToPartnerDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setShipToPartnerDDL
                      );
                    }}
                    placeholder="Sold To Partner"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div> */}
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="shipToPartner"
                    options={shipTopartnerDDL}
                    value={values?.shipToPartner}
                    label="Ship To Partner"
                    onChange={(valueOption) => {
                      setFieldValue("shipToPartner", valueOption);
                    }}
                    placeholder="Ship To Partner"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="transportZone"
                    options={transportZoneDDL}
                    value={values?.transportZone}
                    label="Select Transport Zone"
                    onChange={(valueOption) => {
                      setFieldValue("transportZone", valueOption);
                    }}
                    placeholder="Select Transport Zone"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                {console.log("Values", values)}
                <div className="col-lg-3">
                  <NewSelect
                    name="vehicleCapacity"
                    options={vehicleCapacityDDL || []}
                    value={values?.vehicleCapacity}
                    label="Vehicle Capacity"
                    onChange={(valueOption) => {
                      setFieldValue("vehicleCapacity", valueOption);
                    }}
                    placeholder="Vehicle Capacity"
                    errors={errors}
                    touched={touched}
                    // isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.distanceKm}
                    label="Distance Km"
                    placeholder="Distance Km"
                    required
                    type="tel"
                    name="distanceKm"
                    disabled={isEdit}
                    min="0"
                    onChange={(e) => {
                      setFieldValue("distanceKm", _numberValidation(e));
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.rate}
                    label="Rate"
                    placeholder="Rate"
                    required
                    type="tel"
                    name="rate"
                    min="0"
                    onChange={(e) => {
                      setFieldValue("rate", _numberValidation(e));
                    }}
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
