import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useDispatch } from "react-redux";
import { getParentDivisionTypeDDLAction } from "../_redux/Actions";

// Validation schema
const validationSchema = Yup.object().shape({
  productDivisionName: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Parent Division is required"),
  productDivisionCode: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Middle Name 100 symbols")
    .required("Product Division Code required"),
  productDivisionType: Yup.object().shape({
    label: Yup.string().required("product Division Type is required"),
    value: Yup.string().required("product Division Type is required"),
  }),
  parentDivisionName: Yup.object().shape({
    label: Yup.string().required("parent Division is required"),
    value: Yup.string().required("parent Division is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  ProductDivisionTypeDDL,
  ParentDivisionTypeDDLAc,
  isEdit,
  profileData,
  selectedBusinessUnit,
  ty,
}) {
  const dispatch = useDispatch();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          productDivisionType: {
            value: ProductDivisionTypeDDL[0]?.value,
            label: ProductDivisionTypeDDL[0]?.label,
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            dispatch(
              getParentDivisionTypeDDLAction(
                profileData.accountId,
                selectedBusinessUnit.value
              )
            );
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
                <div className="col-lg-3">
                  <label>Product Division Type</label>
                  <Field
                    name="productDivisionType"
                    placeholder="Select Product Division Type"
                    component={() => (
                      <Select
                        options={ProductDivisionTypeDDL}
                        placeholder="Select Product Division Type"
                        defaultValue={values.productDivisionType}
                        onChange={(valueOption) => {
                          setFieldValue("productDivisionType", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        isDisabled={isEdit}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.productDivisionType &&
                    touched &&
                    touched.productDivisionType
                      ? errors.productDivisionType.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.productDivisionName || ""}
                    name="productDivisionName"
                    component={Input}
                    placeholder="product Division Name"
                    label="product Division Name"
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.productDivisionCode || ""}
                    name="productDivisionCode"
                    component={Input}
                    disabled={isEdit}
                    placeholder="product Division Code"
                    label="Product Division Code"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Parent Product Division</label>
                  <Field
                    name="parentDivisionName"
                    placeholder="Parent Product Division"
                    component={() => (
                      <Select
                        options={ParentDivisionTypeDDLAc}
                        placeholder="Parent Product Division"
                        defaultValue={values.parentDivisionName}
                        onChange={(valueOption) => {
                          setFieldValue("parentDivisionName", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.parentDivisionName &&
                    touched &&
                    touched.parentDivisionName
                      ? errors.parentDivisionName.value
                      : ""}
                  </p>
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
