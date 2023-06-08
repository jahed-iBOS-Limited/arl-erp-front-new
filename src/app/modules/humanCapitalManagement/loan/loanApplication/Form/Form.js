import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import NewSelect from "../../../../_helper/_select";
import { getLoanTypeDDL } from "../helper";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";

// Validation schema
const LoanApplicationSchema = Yup.object().shape({
  employeeName: Yup.object().shape({
    label: Yup.string().required("Employee Name is required"),
    value: Yup.string().required("Employee Name is required"),
  }),
  loanType: Yup.object().shape({
    label: Yup.string().required("Loan Type is required"),
    value: Yup.string().required("Loan Type is required"),
  }),
  loanAmount: Yup.number()
    .min(0, "Minimum 0 range")
    .required("Loan Amount is required"),
  numberOfInstallment: Yup.number()
    .min(0, "Minimum 0 range")
    .required("Number Of Installmentis required"),
  installmentAmount: Yup.number()
    .min(0, "Minimum 0 range")
    .required("Installment Amountis required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  isEdit,
}) {
 
  const [loanTypeDDl, setLoanTypeDDl] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // getEmployeeNameDDL(
      //   profileData?.accountId,
      //   selectedBusinessUnit?.value,
      //   setemployeeNameDDl
      // );
      getLoanTypeDDL(setLoanTypeDDl);
    }
  }, [profileData, selectedBusinessUnit]);

  const loadEmp = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={LoanApplicationSchema}
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
            {console.log("Values =>", values)}
            <div className="row">
              <div className="col-lg-8">
                <div className="global-form" style={{ paddingBottom: "10px" }}>
                  <Form className="form form-label-right">
                    <div className="form-group row">
                      <div className="col-lg-4">
                        {/* <label>Employee Name</label>
                        <NewSelect
                          name="employeeName"
                          // options={employeeNameDDl || []}
                          options={
                            employeeNameDDl.length > 0
                              ? employeeNameDDl
                              : [
                                  {
                                    value: "",
                                    label: "Loading...",
                                    isDisabled: true,
                                  },
                                ]
                          }
                          value={values?.employeeName}
                          onChange={(valueOption) => {
                            setFieldValue("employeeName", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        /> */}
                        <>
                          <label>Employee Name</label>
                          <SearchAsyncSelect
                            selectedValue={values?.employeeName}
                            isDisabled={isEdit}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {
                              setFieldValue("employeeName", valueOption);
                            }}
                            loadOptions={loadEmp}
                          />
                        </>
                      </div>
                      <div className="col-lg-4">
                        <label>Loan Type</label>
                        <NewSelect
                          name="loanType"
                          options={loanTypeDDl || []}
                          value={values?.loanType}
                          onChange={(valueOption) => {
                            setFieldValue("loanType", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4">
                        <IInput
                          value={values?.loanAmount}
                          label="Loan Amount"
                          name="loanAmount"
                          onChange={(e) => {
                            setFieldValue("numberOfInstallment", "");
                            setFieldValue("installmentAmount", "");
                            setFieldValue("loanAmount", e.target.value);
                          }}
                          type="number"
                          min="0"
                        />
                      </div>
                      <div className="col-lg-4 mt-2">
                        <span style={{ fontWeight: "bold" }}>
                          Designation:
                          {values?.employeeName?.employeeInfoDesignation}
                        </span>
                      </div>
                      <div className="col-lg-4 mt-2">
                        <span style={{ fontWeight: "bold" }}>
                          Department:{" "}
                          {values?.employeeName?.employeeInfoDepartment}
                        </span>
                      </div>
                      <div className="col-lg-4 mt-2">
                        <span style={{ fontWeight: "bold" }}>
                          Unit:{values?.employeeName?.employeeBusinessUnit}
                        </span>
                      </div>
                      <div className="col-lg-4">
                        <IInput
                          value={values?.numberOfInstallment}
                          label="Number of Installment"
                          name="numberOfInstallment"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "numberOfInstallment",
                              e.target.value
                            );
                            setFieldValue(
                              "installmentAmount",
                              Math.ceil(+values?.loanAmount / e.target.value)
                            );
                          }}
                          min="0"
                        />
                      </div>
                      <div className="col-lg-4">
                        <IInput
                          value={values?.installmentAmount}
                          label="Installment Amount"
                          name="installmentAmount"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("installmentAmount", e.target.value);
                            setFieldValue(
                              "numberOfInstallment",
                              Math.ceil(+values?.loanAmount / e.target.value)
                            );
                          }}
                          min="0"
                          disabled={isEdit}
                        />
                      </div>
                      {values?.loanType?.value === 4 && (
                        <div className="col-lg-4">
                          <IInput
                            value={values?.strReferenceNo}
                            label="Reference No"
                            name="strReferenceNo"
                            type="text"
                          />
                        </div>
                      )}
                      {values?.loanType?.value === 7 && (
                        <div className="col-lg-4">
                          <IInput
                            value={values?.strReferenceNo}
                            label="Reference No"
                            name="strReferenceNo"
                            type="text"
                          />
                        </div>
                      )}
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
                </div>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
