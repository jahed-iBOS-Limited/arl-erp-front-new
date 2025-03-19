import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import ICustomTable from "../../../../_helper/_customTable";

const validationSchema = Yup.object().shape({});

export default function _Form({ initData, btnRef, saveHandler, resetBtnRef }) {
  let ths = [
    "SL",
    "Transaction Code",
    "Reference Type",
    "Reference No.",
    "Transaction Type",
    "Action",
  ];
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
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    label="Date"
                    name="date"
                    value={values?.date}
                    type="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mt-5">
                  <label className="checkbox-inline mr-2">
                    <input
                      type="radio"
                      name="type"
                      checked={values.type === "Group By"}
                      onChange={(e) => setFieldValue("type", "Group By")}
                      className="mr-2"
                    />
                    Group By
                  </label>

                  <label className="checkbox-inline">
                    <input
                      type="radio"
                      name=""
                      checked={values.type === "Single"}
                      onChange={(e) => setFieldValue("type", "Single")}
                      className="mr-2"
                    />
                    Single
                  </label>
                </div>

                <div style={{ marginTop: "18px" }} className="col-lg-4">
                  <button
                    className="btn btn-primary"
                    onClick={(action) => alert("Item Already added")}
                  >
                    View
                  </button>
                </div>
              </div>
              <ICustomTable ths={ths} />

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
