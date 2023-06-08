import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

// Validation schema

export default function _Form({ initData, btnRef, saveHandler, resetBtnRef }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            <h4 className="mt-4">View Tax Item</h4>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="taxItemCategoryId"
                    value={values?.taxItemCategoryId}
                    label="Item Category"
                    placeholder="Item Category"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <InputField
                    value={values?.taxItemGroupName || ""}
                    name="taxItemGroupName"
                    placeholder="Item Name"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="uomName"
                    value={values?.uomName}
                    label="UOM"
                    placeholder="UOM"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="supplyTypeId"
                    value={values?.supplyTypeId}
                    label="Supply Type"
                    placeholder="Supply Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="hsCode"
                    value={values?.hsCode}
                    label="HS Code"
                    placeholder="HS Code"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="taxItemTypeId"
                    value={values?.itemTypeId}
                    label="Tax Item Type"
                    placeholder=" Tax Item Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
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
