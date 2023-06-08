import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { ISelect } from "../../../../_helper/_inputDropDown";

// Validation schema
const validationSchema = Yup.object().shape({
  distributionChannelCode: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),
  distributionChannelName: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Channel Name is required"),
  SBU: Yup.object().shape({
    label: Yup.string().required("SBU Person is required"),
    value: Yup.string().required("SBU Person is required"),
  }),
});

export default function From({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  SBUListDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          SBU: { value: SBUListDDL[0]?.value, label: SBUListDDL[0]?.label },
        }}
        validationSchema={isEdit ? Yup.object().shape({}) : validationSchema}
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
                <div className="col-lg-4">
                  <ISelect
                    label="SBU"
                    options={SBUListDDL}
                    value={values.SBU}
                    name="SBU"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.distributionChannelName}
                    name="distributionChannelName"
                    component={Input}
                    placeholder="Channel Name"
                    label="Channel Name"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.distributionChannelCode}
                    name="distributionChannelCode"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                    disabled={isEdit}
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
