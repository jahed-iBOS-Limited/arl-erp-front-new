import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";

const validationSchema = Yup.object().shape({
  millageComponent: Yup.object().shape({
    label: Yup.string().required("Millage Component is required"),
    value: Yup.string().required("MillageMComponent is required"),
  }),
  millage: Yup.number()
    .min(1, "Minimum 1 range")
    .max(100000, "Maximum 100000 range")
    .required("Millage is required"),
  minimumamount: Yup.number()
    .min(0, "Minimum 0 range")
    .max(100000, "Maximum 100000 range")
    .required("Minimum Amount is required"),
  maximumamount: Yup.number()
    .min(0, "Minimum 0 range")
    .max(100000, "Maximum 100000 range")
    .required("Maximum Amount is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  millageComponent,
  singleData,
  setRowDto,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          millageComponent: {
            value: singleData[0]?.millageCostComponentId,
            label: singleData[0]?.millageCostComponentName,
          },
          millage: singleData[0]?.millage,
          minimumamount: singleData[0]?.minimumAmount,
          maximumamount: singleData[0]?.maximumAmount,
        }}
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
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
          handleBlur,
          handleChange,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-8">
                  {/* Table Header input */}
                  <div className={"row bank-journal-custom bj-right"}>
                    <div className="col-lg-6 pl pr-1 mb-1">
                      <label>Millage Allowance Component</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("millageComponent", valueOption);
                        }}
                        value={values?.millageComponent || ""}
                        isSearchable={true}
                        options={millageComponent || []}
                        styles={customStyles}
                        name="millageComponent"
                        placeholder="Vahicle Capacity"
                      />
                      <FormikError
                        errors={errors}
                        name="millageComponent"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Millage </label>
                      <InputField
                        value={values?.millage || ""}
                        name="millage"
                        placeholder="Millage"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Minimum Amount </label>
                      <InputField
                        value={values?.minimumamount || ""}
                        name="minimumamount"
                        placeholder="Minimum Amount"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Maximum Amount </label>
                      <InputField
                        value={values?.maximumamount || ""}
                        name="maximumamount"
                        placeholder="Maximum Amount"
                        type="text"
                      />
                    </div>
                  </div>
                  {/* Table Header input end */}
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
