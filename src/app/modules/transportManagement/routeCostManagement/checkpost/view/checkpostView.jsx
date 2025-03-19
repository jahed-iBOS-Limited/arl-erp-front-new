import React, { useEffect, useState } from "react";
import { getcheckPostItemView } from "../helper";
import InputField from "../../../../_helper/_inputField";
import { Formik, Form } from "formik";

export default function CheckPostInOutView({ id }) {
  // SingleData to view
  const [singleData, setSingleData] = useState("");

  // Get BusinessUnitTaxInfo view data
  useEffect(() => {
    if (id) {
      getcheckPostItemView(id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={singleData}>
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setValues,
        }) => (
          <>
            <Form className="form form-label-right global-form">
              <div className="row">
                <div className="col-lg-3">
                  <label>Check Post Name</label>
                  <InputField
                    value={values?.checkPostName || ""}
                    name="checkPostName"
                    placeholder="Check Post Name"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Purpose Name</label>
                  <InputField
                    value={values?.purposeName || ""}
                    name="purposeName"
                    placeholder="Purpose Name"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Vehicle No</label>
                  <InputField
                    value={values?.vehicleNo || ""}
                    name="vehicleNo"
                    placeholder="Vehicle No"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Driver Contact</label>
                  <InputField
                    value={values?.driverContact || ""}
                    name="driverContact"
                    placeholder="Driver Contact"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Driver Name</label>
                  <InputField
                    value={values?.driverName || ""}
                    name="driverName"
                    placeholder="Driver Name"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Plant Name</label>
                  <InputField
                    value={values?.plantName || ""}
                    name="plantName"
                    placeholder="Plant Name"
                    type="text"
                    disabled={true}
                  />
                </div>

                {values?.purposeName === "Distribution" && (
                  <div className="col-lg-3">
                    <label>Shippoint Name</label>
                    <InputField
                      value={values?.shipPointName || ""}
                      name="shipPointName"
                      placeholder="Shippoint Name"
                      type="text"
                      disabled={true}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <label>Came From</label>
                  <InputField
                    value={values?.cameFrom || ""}
                    name="cameFrom"
                    placeholder="Came From"
                    type="text"
                    disabled={true}
                  />
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
