import React from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Loading from "./../../../../_helper/_loading";
import InputField from "./../../../../_helper/_inputField";

const initData = {
  isComplete: false,
  remarks: "",
};

const validationSchema = Yup.object().shape({
  isComplete: Yup.bool().required("Is Complete is required"),
});

export default function CompleteModal({
  completeModalInfo,
  saveCompleteModel,
  loading,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveCompleteModel(values, () => {
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
          setValues,
        }) => (
          <>
            {loading && <Loading />}
            <FormikForm>
              <div className="form-card">
                <div
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                    padding: "10px 0",
                  }}
                >
                  <p></p>
                  <div>
                    <button
                      type="submit"
                      className="btn btn-primary save-btn"
                      disabled={!values?.isComplete}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              <div className="form form-label-right my-2">
                <div className="form-group row global-form">
                  <div className="col-lg-12">
                    <div className="d-flex">
                      <h6
                        className="font-weight-bold mr-2"
                        style={{ fontSize: "13px" }}
                      >
                        Total Order Quantity: {completeModalInfo?.orderQty}
                      </h6>
                      <h6
                        className="font-weight-bold"
                        style={{ fontSize: "13px" }}
                      >
                        Total Deliver Quantity:{" "}
                        {completeModalInfo?.deliveredQty}
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div
                      style={{
                        position: "relative",
                        top: "10px",
                      }}
                    >
                      <input
                        className="mr-2"
                        style={{
                          position: "relative",
                          top: "2px",
                        }}
                        checked={values?.isComplete}
                        type="checkbox"
                        name="isComplete"
                        onChange={(e) => {
                          setFieldValue("isComplete", e.target.checked);
                        }}
                        required
                      />
                      <label>Is Close</label>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.remarks}
                      label={"Remarks"}
                      placeholder={"Remarks"}
                      type="text"
                      name="remarks"
                      required={completeModalInfo?.commentRequired}
                    />
                  </div>
                </div>
              </div>
            </FormikForm>
          </>
        )}
      </Formik>
    </>
  );
}
