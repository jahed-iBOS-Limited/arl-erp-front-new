import React from "react";
import { Formik, Form } from "formik";
// eslint-disable-next-line no-unused-vars
import * as Yup from "yup";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import { IInput } from "../../../../../_helper/_input";
import { useLocation } from "react-router-dom";

// // Validation schema
// const validationSchema = Yup.object().shape({
//   responsiblePerson: Yup.object().shape({
//     label: Yup.string().required("Responsible Person is required"),
//     value: Yup.string().required("Responsible Person is required"),
//   }),
// });
const initData = {
  referenceNo: "",
  item: "",
  deliveryDate: "",
};
export default function AssetPOCreateForm({
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  empDDL,
  isEdit,
  ty,
}) {
  const location = useLocation();
  console.log({ location });
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
            {console.log(values)}
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <ISelect
                    label="Select Reference No"
                    options={empDDL}
                    value={values.referenceNo}
                    name="item"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <ISelect
                    label="Select Item"
                    options={empDDL}
                    value={values.item}
                    name="item"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={values.deliveryDate}
                    label="Delivery Date"
                    name="deliveryDate"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <button type="button" className="btn btn-primary addBtn">
                    ADD
                  </button>
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
