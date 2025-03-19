import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../../../../../_helper/_select";
import InputField from "./../../../../../../../_helper/_inputField";

const validationSchema = Yup.object().shape({
  // firstName: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("First Name required"),
  // businessUnit: Yup.object().shape({
  //   label: Yup.string().required("Business Unit required"),
  //   value: Yup.string().required("Business Unit required"),
  // }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  singleProfileList,
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
              <div className="row global-form">
                {singleProfileList?.objAttrbt?.map((itm, indx) => {
                  //input type generator
                  const type =
                    itm?.controlerTypeName === "TextBox"
                      ? "text"
                      : itm?.controlerTypeName === "Number"
                      ? "number"
                      : "date";
                  return (
                    <>
                      {itm?.controlerTypeName === "DDL" ? (
                        <div className="col-lg-3">
                          <NewSelect
                            name={indx}
                            options={itm?.objDetailList?.map((itm) => ({
                              value: itm?.attributeValueId,
                              label: itm?.attributeValue,
                            })) || []}
                            value={values?.[indx]}
                            label={itm?.attributeName}
                            onChange={(valueOption) => {
                              setFieldValue(indx, valueOption);
                            }}
                            placeholder={itm?.attributeName}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      ) : (
                        <div className="col-lg-3">
                          <label>{itm?.attributeName}</label>
                          <InputField
                            value={values?.[indx]}
                            name={indx}
                            placeholder={itm?.attributeName}
                            type={type}
                            required={itm?.isMendatory}
                          />
                        </div>
                      )}
                    </>
                  );
                })}
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
                onClick={() => {
                  resetForm(initData);
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
