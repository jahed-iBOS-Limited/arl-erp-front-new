import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { _numberValidation } from "../../../../_helper/_numberValidation";

// Validation schema
const validationSchema = Yup.object().shape({
  territoryTypeName: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Territory type name is required"),
  levelPosition: Yup.number().required("Level position is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  ty,
}) {
  console.log(ty);
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-6">
                  <IInput
                    value={values.territoryTypeName}
                    label="Territory Type Name"
                    name="territoryTypeName"
                  />
                </div>

                <div className="col-lg-6">
                  <IInput
                    type="tel"
                    value={values.levelPosition}
                    label="Level Position"
                    name="levelPosition"
                    onChange={(e) => {
                      setFieldValue("levelPosition", _numberValidation(e));
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
