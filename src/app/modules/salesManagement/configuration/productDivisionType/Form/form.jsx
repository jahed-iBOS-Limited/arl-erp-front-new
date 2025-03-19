import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { _numberValidation } from './../../../../_helper/_numberValidation';

// Validation schema
const validationSchema = Yup.object().shape({
  productDivisionTypeName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Name is required"),
  levelPosition: Yup.number()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Level position is required"),
});

export default function _Form({ initData, btnRef, saveHandler, resetBtnRef }) {
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
        {({ handleSubmit, resetForm, values, isValid, setFieldValue }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <IInput
                    name="productDivisionTypeName"
                    value={values.productDivisionTypeName}
                    label="Type Name "
                    disabled={false}
                  />
                </div>

                <div className="col-lg-4">
                  <IInput
                    name="levelPosition"
                    value={values.levelPosition}
                    label="Level Position"
                    disabled={false}
                    type="tel"
                    min={0}
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
