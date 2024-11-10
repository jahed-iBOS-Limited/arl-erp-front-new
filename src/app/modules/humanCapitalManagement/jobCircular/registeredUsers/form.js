import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import IDelete from "../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../_helper/_input";
import NewSelect from "../../../_helper/_select";
import { getEmployeeNameDDL, getLoanTypeDDL } from "./helper";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";

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

export default function LoanAppForm({
  initData,
  disableHandler,
  btnRef,
  profileData,
  selectedBusinessUnit,
  rowDto,
  saveLoanApplication,
  setter,
}) {
 
  const [employeeNameDDl, setemployeeNameDDl] = useState([]);
  const [loanTypeDDl, setLoanTypeDDl] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getEmployeeNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setemployeeNameDDl
      );
      getLoanTypeDDL(setLoanTypeDDl);
    }
  }, [profileData, selectedBusinessUnit]);

  console.log("rowDto", rowDto);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={LoanApplicationSchema}
        onSubmit={(values, { resetForm }) => {
          saveLoanApplication(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ values, errors, setFieldValue, isValid, touched }) => (
          <>
            {disableHandler(!errors)}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-8">
                  <div
                    className="global-form"
                    style={{ paddingBottom: "10px" }}
                  >
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <label>Employee Name</label>
                        <NewSelect
                          name="employeeName"
                          options={employeeNameDDl || []}
                          value={values?.employeeName}
                          onChange={(valueOption) => {
                            setFieldValue("employeeName", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
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
                          min="0"
                        />
                      </div>
                      <div className="col-lg-4">
                        <IInput
                          value={values?.installmentAmount}
                          label="Installment Amount"
                          name="installmentAmount"
                          type="number"
                          min="0"
                        />
                      </div>
                      <div className="col-lg-4" style={{ marginTop: "27px" }}>
                        <button
                          onClick={() => {
                            const obj = {
                              employee: values?.employeeName,
                              loanApplicationId: 0,
                              loanType: values?.loanType?.label,
                              loanTypeInfo: values?.loanType,
                              loanAmount: values?.loanAmount,
                              remainingLoanAmount: 0,
                              remainingInstallment: 0,
                              dteApplicationDate: _todayDate(),
                              approveStatus: "Pending",
                              loanInstallment: "Not Complete"
                            };
                            setter(obj);
                          }}
                          className="btn btn-primary"
                          disabled={
                            !values?.employeeName ||
                            !values?.loanType ||
                            !values?.loanAmount ||
                            !values?.numberOfInstallment ||
                            !values?.installmentAmount
                          }
                          type="button"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {rowDto?.length >= 0 && (
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th style={{ width: "35px" }}>SL</th>
                      <th>Application Id</th>
                      <th>Loan Type</th>
                      <th>Total Loan Amount</th>
                      <th>Remaining Loan Amount</th>
                      <th>Remaining Installment</th>
                      <th>Application Date</th>
                      <th>Approve Status</th>
                      <th>Loan Installment Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((td, index) => (
                      <tr key={index}>
                        <td> {index + 1} </td>
                        <td>
                          <div className="text-right pr-2">
                            {td?.loanApplicationId}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">{td?.loanType}</div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {td?.loanAmount}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">{td?.remainingLoanAmount || 0}</div>
                        </td>
                        <td>
                          <div className="pl-2">{td?.remainingInstallment || 0}</div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {_dateFormatter(td?.dteApplicationDate) || _todayDate()}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">{td?.approveStatus || "Pending"}</div>
                        </td>
                        <td>
                          <div className="pl-2">{td?.loanInstallment || "Not Complete"}</div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <IDelete />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
