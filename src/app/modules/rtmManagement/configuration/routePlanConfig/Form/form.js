import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// eslint-disable-next-line no-unused-vars
import FormikError from "./../../../../_helper/_formikError";
import InputField from "./../../../../_helper/_inputField";
import {} from "../helper";
// eslint-disable-next-line no-unused-vars
import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  entryDay: Yup.number()
    .required("Entry Day is Required")
    .max(30),
  editedDay: Yup.number()
    .required("Edit Day is Required")
    .max(30),
  approvalStatus: Yup.boolean(),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,

  setRowDto,
  profileData,
  selectedBusinessUnit,
}) {
 

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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

          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-3 pl pr-1 mb-1">
                  <label>Last Route Plan Entry Day</label>
                  <InputField
                    value={values?.entryDay}
                    name="entryDay"
                    placeholder="Entry Day"
                    type="number"
                    min="0"
                    // disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3 pl pr-1 mb-1">
                  <label>Last Route Plan Edited Day</label>
                  <InputField
                    value={values?.editedDay}
                    name="editedDay"
                    placeholder="Edited Day"
                    type="number"
                    min="0"
                    // disabled={isEdit}
                  />
                </div>

                <div className="col-lg-2 pl pr-1 mb-1">
                  <label style={{ display: "block" }}>Approval Status</label>
                  <input
                    style={{ marginTop: "3px" }}
                    type="checkbox"
                    name="approvalStatus"
                    checked={values.approvalStatus}
                    onChange={(e) => {
                      setFieldValue(e.target.name, e.target.checked);
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
