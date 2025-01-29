import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getGetProfitCenterGroupNameDDL_api } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  controllingUnitName: Yup.object().shape({
    label: Yup.string().required("Controlling Unit is required"),
    value: Yup.string().required("Controlling Unit is required"),
  }),
  profitCenterName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Profit Center Name is required"),
  profitCenterCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100000, "Maximum 100 symbols")
    .required("Code is required"),
  profitCenterGroupName: Yup.object().shape({
    label: Yup.string().required("Group Name  is required"),
    value: Yup.string().required("Group Name is required"),
  }),
  responsiblePersonName: Yup.object().shape({
    label: Yup.string().required("Responsible Person is required"),
    value: Yup.string().required("Responsible Person is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  accountId,
  selectedBusinessUnit,
  disableHandler,
  controllingUnitDDL,
  responsiblePersonDDL,
  profitCenterGroupNameDDL,
  setProfitCenterGroupNameDDL,
  disabled,
  isEdit,
  isDisabled,
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
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <label>Profit Center Name</label>
                  <InputField
                    value={values?.profitCenterName || ""}
                    name="profitCenterName"
                    placeholder="Profit Center Name"
                    type="text"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Code</label>
                  <InputField
                    value={values?.profitCenterCode || ""}
                    name="profitCenterCode"
                    placeholder="Code"
                    type="text"
                    disabled={isEdit}
                  />
                </div>
              </div>
              <div className="form-group row ">
                <div className="col-lg-3 mb-2">
                  <NewSelect
                    name="controllingUnitName"
                    options={controllingUnitDDL || []}
                    value={values?.controllingUnitName}
                    label="Controlling Unit"
                    onChange={(valueOption) => {
                      setFieldValue("controllingUnitName", valueOption);
                      getGetProfitCenterGroupNameDDL_api(
                        accountId,
                        selectedBusinessUnit,
                        valueOption?.value,
                        setProfitCenterGroupNameDDL
                      );
                    }}
                    placeholder="Controlling Unit"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="profitCenterGroupName"
                    options={profitCenterGroupNameDDL || []}
                    value={values?.profitCenterGroupName}
                    label="
                    Group Name"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenterGroupName", valueOption);
                    }}
                    placeholder="
                    Group Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="responsiblePersonName"
                    options={responsiblePersonDDL || []}
                    value={values?.responsiblePersonName}
                    label="Responsible Person"
                    onChange={(valueOption) => {
                      setFieldValue("responsiblePersonName", valueOption);
                    }}
                    placeholder="Responsible Person"
                    errors={errors}
                    touched={touched}
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
