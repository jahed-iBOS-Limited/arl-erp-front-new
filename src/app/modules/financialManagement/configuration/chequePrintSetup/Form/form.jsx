import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import customStyles from "../../../../selectCustomStyle";
import { branchListAPiCaller, getBankAccountDDL } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  bank: Yup.object().shape({
    label: Yup.string().required("Bank is required"),
    value: Yup.string().required("Bank is required"),
  }),
  branch: Yup.object().shape({
    label: Yup.string().required("Branch is required"),
    value: Yup.string().required("Branch is required"),
  }),
  bankAccount: Yup.object().shape({
    label: Yup.string().required("Bank Account is required"),
    value: Yup.string().required("Bank Account is required"),
  }),
  accountNumber: Yup.string()
    .min(8, "Minimum 8 symbols")
    .max(1000, "Maximum 1000 symbols")
    .required("Account Number is required"),
  prefix: Yup.string().max(10, "Maximum 10 symbols"),
  startNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Start No is required"),
  endNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("End No is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  bankDDL,
  profileData,
  selectedBusinessUnit,
  isEdit,
}) {
  const [branchList, setBranchList] = useState([]);
  const [bankAccountDDL, setBankAccountDDL] = useState([]);

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
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <ISelect
                    label="Select Bank"
                    options={bankDDL || []}
                    value={values?.bank || []}
                    name="bank"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      branchListAPiCaller(valueOption?.value, setBranchList);
                      setFieldValue("branch", "");
                      setFieldValue("bank", valueOption);
                    }}
                    isSearchable={true}
                  />
                </div>
                <div className="col-lg-4">
                  <ISelect
                    isSearchable={true}
                    label="Select Branch"
                    options={branchList || []}
                    placeholder="Select Branch"
                    value={values?.branch || ""}
                    name="branch"
                    onChange={(valueOption) => {
                      getBankAccountDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.bank?.value,
                        valueOption?.value,
                        setBankAccountDDL
                      );
                      setFieldValue("bankAccount", "");
                      setFieldValue("branch", valueOption);
                    }}
                    isDisabled={!branchList}
                    style={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <ISelect
                    label="Select Bank Account"
                    options={bankAccountDDL || []}
                    placeholder="Select Bank Account"
                    value={values?.bankAccount || ""}
                    name="bankAccount"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue("accountNumber", valueOption?.label);
                      setFieldValue("bankAccount", valueOption);
                    }}
                    isSearchable={true}
                    style={customStyles}
                    isDisabled={!bankAccountDDL}
                  />
                </div>
                <div className="col-lg-4">
                  <IInput
                    type="text"
                    value={values?.accountNumber || ""}
                    label="Account Number"
                    name="accountNumber"
                    disabled
                  />
                </div>
                {/* <div className="col-lg-4">
                  <IInput
                    type="text"
                    value={values?.prefix || ""}
                    label="Prefix (Optional)"
                    name="prefix"
                    // disabled={isEdit}
                  />
                </div> */}
                <div className="col-lg-4">
                  <IInput
                    type="text"
                    value={values?.startNo || ""}
                    label="Start No"
                    name="startNo"
                    onChange={(e) => {
                      const validNumber = /^[0-9]+$/.test(e.target.value);
                      if (validNumber || e.target.value === "") {
                        setFieldValue("startNo", e.target.value);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-4">
                  <IInput
                    type="text"
                    value={values?.endNo || ""}
                    label="End No"
                    name="endNo"
                    onChange={(e) => {
                      const validNumber = /^[0-9]+$/.test(e.target.value);
                      if (validNumber || e.target.value === "") {
                        setFieldValue("endNo", e.target.value);
                      }
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
