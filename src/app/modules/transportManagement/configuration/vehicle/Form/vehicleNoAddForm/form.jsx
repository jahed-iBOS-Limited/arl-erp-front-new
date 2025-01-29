import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import InputField from "../../../../../_helper/_inputField";
import NewSelect from "../../../../../_helper/_select";

// Validation schema
const validationSchema = Yup.object().shape({
  vehicleCity: Yup.object().shape({
    label: Yup.string().required("Vehicle City is required"),
    value: Yup.string().required("Vehicle City is required"),
  }),
  vehicleRegistrationLetter: Yup.object().shape({
    label: Yup.string().required("Vehicle Registration Letter is required"),
    value: Yup.string().required("Vehicle Registration Letter is required"),
  }),
  vehicleRegistrationNumber: Yup.object().shape({
    label: Yup.string().required("Vehicle Registration Number is required"),
    value: Yup.string().required("Vehicle Registration Number is required"),
  }),
  vehicleManualNo: Yup.string()
    .min(0, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Vehicle Manual No is required"),
});

export default function _Form({
  initData,
  btnRef,
  disableHandler,
  setIsShowModal,
  saveVehicleNoDDL,
  profileData,
  selectedBusinessUnit,
  id,
}) {
  const [vehicleAddress, setVehicleAddress] = useState("");
  const [vehicheCityDDL,setVehicleCityDDL] = useState([]);
  const [vehicleRegistrationLetterDDL,setVehicleRegistrationLetterDDL] = useState([]);
  const [vehicleRegistrationNumberDDL,setVehicleRegistrationNumberDDL] = useState([]);

  useEffect(() => {
    getVehicleCityDDL();
    getVehicleRegistrationLetterDDL();
    getVehicleRegitrationNumberDDL();
  }, [selectedBusinessUnit, profileData]);

  const getVehicleCityDDL = async () => {
    try {
      const res = await Axios.get(
        `/tms/TransportMgtDDL/GetVehicleCityDDL`
      );
      setVehicleCityDDL(res.data);
    } catch (error) {
     
    }
  };
  const getVehicleRegistrationLetterDDL = async () => {
    try {
      const res = await Axios.get(
        `/tms/TransportMgtDDL/GetVehicleRegistrationLetterDDL`
      );
      setVehicleRegistrationLetterDDL(res.data);
    } catch (error) {
     
    }
  };
  const getVehicleRegitrationNumberDDL = async () => {
    try {
      const res = await Axios.get(
        `/tms/TransportMgtDDL/GetVehicleRegitrationNumberDDL`
      );
      setVehicleRegistrationNumberDDL(res.data);
    } catch (error) {
     
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          vehicleCity: {
            value: vehicheCityDDL[0]?.value,
            label: vehicheCityDDL[0]?.label,
          },
          vehicleRegistrationLetter: {
            value: vehicleRegistrationLetterDDL[0]?.value,
            label: vehicleRegistrationLetterDDL[0]?.label,
          },
          vehicleRegistrationNumber: {
            value: vehicleRegistrationNumberDDL[0]?.value,
            label: vehicleRegistrationNumberDDL[0]?.label,
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveVehicleNoDDL(values, () => {
            resetForm(initData);
          });
          setIsShowModal(false);
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
            <Form className="form form-label-right">
              <div className="form-group row align-items-center"></div>

              <div className="form-group row ">
                <div className="col-lg-12">
                  <div
                    className="row bank-journal bank-journal-custom bj-left"
                    style={{ paddingBottom: "0px" }}
                  >
                    <div className="col-lg-2 mb-2">
                      <NewSelect
                        name="vehicleCity"
                        options={vehicheCityDDL}
                        value={values?.vehicleCity || ""}
                        label="Vehicle City"
                        onChange={(valueOption) => {
                          setVehicleAddress(
                            `${valueOption?.label} ${values?.vehicleRegistrationLetter?.label} ${values?.vehicleRegistrationNumber?.label}-${values?.vehicleManualNo}`
                          );
                          setFieldValue("vehicleCity", valueOption);
                        }}
                        placeholder="Vehicle City"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 mb-2">
                      <NewSelect
                        name="vehicleRegistrationLetter"
                        options={vehicleRegistrationLetterDDL}
                        value={values?.vehicleRegistrationLetter}
                        label="Registration Letter"
                        onChange={(valueOption) => {
                          setVehicleAddress(
                            `${values?.vehicleCity?.label} ${valueOption?.label} ${values?.vehicleRegistrationNumber?.label}-${values?.vehicleManualNo}`
                          );
                          setFieldValue(
                            "vehicleRegistrationLetter",
                            valueOption
                          );
                        }}
                        placeholder="Registration Letter"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 mb-2">
                      <NewSelect
                        name="vehicleRegistrationNumber"
                        options={vehicleRegistrationNumberDDL}
                        value={values?.vehicleRegistrationNumber}
                        label="Registration Number"
                        onChange={(valueOption) => {
                          setVehicleAddress(
                            `${values?.vehicleCity?.label} ${values?.vehicleRegistrationLetter?.label} ${valueOption?.label}-${values?.vehicleManualNo}`
                          );
                          setFieldValue(
                            "vehicleRegistrationNumber",
                            valueOption
                          );
                        }}
                        placeholder="Registration Number"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 mb-2">
                      <label>Vehicle No</label>
                      <InputField
                        value={values?.vehicleManualNo || ""}
                        name="vehicleManualNo"
                        placeholder="Vehicle Number"
                        type="text"
                        onChange={(e) => {
                          setVehicleAddress(
                            `${values?.vehicleCity?.label} ${values?.vehicleRegistrationLetter?.label} ${values?.vehicleRegistrationNumber?.label}-${e?.target?.value}`
                          );
                          setFieldValue("vehicleManualNo", e?.target?.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2 mb-2">
                      <label>Vehicle Full No</label>
                      <InputField
                        value={
                          vehicleAddress || values?.vehicleManualFinalNo || ""
                        }
                        name="vehicleManualFinalNo"
                        placeholder="Vehicle Full No"
                        type="text"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
