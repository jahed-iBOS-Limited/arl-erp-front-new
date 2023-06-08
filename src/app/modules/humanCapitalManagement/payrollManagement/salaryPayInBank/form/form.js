import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

const validationSchema = Yup.object().shape({
  employeeName: Yup.string().required("Employee Name is required"),
  amount: Yup.number()
    .min(0, "Amount must be positive")
    .required("Amount is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  employeeDDL,
  profileData,
  selectedBusinessUnit,
}) {
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };
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
            <Form className="global-form form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <label>Employee Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.employeeName}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("employeeName", valueOption);
                    }}
                    loadOptions={loadUserList}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Amount</label>
                  <InputField
                    value={values?.amount}
                    name="amount"
                    placeholder="Amount"
                    type="number"
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
