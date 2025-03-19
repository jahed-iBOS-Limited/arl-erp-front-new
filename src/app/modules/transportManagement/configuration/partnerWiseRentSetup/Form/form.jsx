import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getDDL } from "../helper";

// Validation schema
// const validationSchema = Yup.object().shape({
//   shipPoint: Yup.object().shape({
//     label: Yup.string().required("Shippoint is required"),
//     value: Yup.string().required("Shippoint is required"),
//   }),
//   vehicle: Yup.object().shape({
//     label: Yup.string().required("Vehicle is required"),
//     value: Yup.string().required("Vehicle is required"),
//   }),
//   rent: Yup.number()
//     .min(0, "Minimum 0 number")
//     .required("Rent is required"),
//   additionalRent: Yup.number()
//     .min(0, "Minimum 0 number")
//     .required("Additional Rent is required"),
//   reason: Yup.string()
//     .min(1, "Minimum 1 Character")
//     .required("Reason is required"),
// });

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
  // All DDL State
  const [shippointDDL, setShippointDDL] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      // Get Shippoint DDL
      getDDL(
        `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
        setShippointDDL
      );
      // Get Vehicle DDL
      getDDL(
        `/tms/Vehicle/GetVehicleDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
        setVehicleDDL
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
              <div className="">
                <div className="form-group row global-form">
                  <div className="col-lg-4">
                    <NewSelect
                      name="shipPoint"
                      options={shippointDDL || []}
                      value={values?.shipPoint}
                      label="Shippoint"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                      }}
                      placeholder="Shippoint"
                      errors={errors}
                      touched={touched}
                      // isDisabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-4">
                    <NewSelect
                      name="vehicle"
                      options={vehicleDDL || []}
                      value={values?.vehicle}
                      label="Vehicle"
                      onChange={(valueOption) => {
                        setFieldValue("vehicle", valueOption);
                      }}
                      placeholder="vehicle"
                      errors={errors}
                      touched={touched}
                      // isDisabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>Rent</label>
                    <InputField
                      name="rent"
                      value={values?.rent}
                      placeholder="Rent"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>Additional Rent</label>
                    <InputField
                      name="additionalRent"
                      value={values?.additionalRent}
                      placeholder="Additional Rent"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>Reason</label>
                    <InputField
                      name="reason"
                      value={values?.reason}
                      placeholder="Reason"
                      type="text"
                    />
                  </div>
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

// [
//   {
//     intRowId: 0,
//     intAccountId: 2,
//     intBusinessUnitid: 164,
//     intPartnerId: 1,
//     intshippointId: 47,
//     intVehicleId: 112,
//     numRentAmount: 3,
//     numAditionalRentAmount: 4,
//     strReason: "test",
//     dteLastActionDateTime: "2021-04-26T04:46:00.991Z",
//     dteServerDateTime: "2021-04-26T04:46:00.991Z",
//     isActive: true,
//   },
// ];
