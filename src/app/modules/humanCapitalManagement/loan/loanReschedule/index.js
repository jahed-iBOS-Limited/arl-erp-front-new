import React, { useState } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { getLoanData, loanApproveAction } from "./helper";
import { _todayDate } from "../../../_helper/_todayDate";
import "./loanReschedule.css";
import { toast } from "react-toastify";
import Loading from "../../../_helper/_loading";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";

const initData = {
  employee: "",
  intRemainingLoan: "",
  intRemainingInstallment: "",
  dteEffectiveDate: _todayDate(),
};

// Validation schema
const LoanApproveSchema = Yup.object().shape({
  intRemainingLoan: Yup.number()
    .min(1, "Minimum 0 range")
    .required("Approve Loan Amount is required"),
  intRemainingInstallment: Yup.number()
    .min(1, "Minimum 0 range")
    .required("Approve Installment Amount is required"),
  dteEffectiveDate: Yup.date().required("Effective Date required"),
});

const LoanRescheduleLanding = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const setApproveLoanAmount = (sl, value) => {
    const cloneArr = rowDto;
    cloneArr[sl].intRemainingLoan = value;
    setRowDto([...cloneArr]);
  };

  const setApproveNumberOfInstallment = (sl, value) => {
    const cloneArr = rowDto;
    cloneArr[sl].intRemainingInstallment = value;
    setRowDto([...cloneArr]);
  };
  // const setDate = (sl, value) => {
  //   const cloneArr = rowDto;
  //   cloneArr[sl].dteEffectiveDate = value;
  //   setRowDto([...cloneArr]);
  // };
  const selecItemHandler = (sl, value, name) => {
    const cloneArr = rowDto;
    cloneArr[sl][name] = value;
    setRowDto([...cloneArr]);
  };

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
      {loader && <Loading />}
      <ICustomCard title="Loan Reschedule">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            approveLoanAmount: 0,
            approveNumberOfinstallment: 0,
          }}
          validationSchema={LoanApproveSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            setValues,
            isValid,
          }) => (
            <>
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-3">
                          {/* <NewSelect
                            name="employee"
                            options={employeeDDL || []}
                            value={values?.employee}
                            label="Employee"
                            onChange={(valueOption) => {
                              setFieldValue("employee", valueOption);
                            }}
                            placeholder="Employee"
                            isSearchable={true}
                            errors={errors}
                            touched={touched}
                          /> */}
                          <>
                            <label>Employee</label>
                            <SearchAsyncSelect
                              selectedValue={values?.employee}
                              isSearchIcon={true}
                              handleChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                              }}
                              loadOptions={loadEmp}
                            />
                          </>
                        </div>
                        <div style={{ marginTop: "14px" }} className="col-lg-4">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              getLoanData(
                                values?.employee?.value,
                                setRowDto,
                                setLoader
                              );
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table Start */}
                {rowDto.length > 0 && (
                  <div className="loan-scrollable-table">
                    <div className="scroll-table _table">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Employee Name</th>
                            <th>Designation</th>
                            <th>Department</th>
                            <th>Unit</th>
                            <th>Application Date</th>
                            <th>Loan Type</th>
                            <th>Applied Loan Amount</th>
                            <th>Applied Installment</th>
                            <th> Amount</th>
                            <th>Approve Number of Installment</th>
                            <th>Effective Date</th>
                            <th>Reschedule</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.length >= 0 &&
                            rowDto.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="pl-2">
                                    {values?.employee?.label}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {values?.employee?.employeeInfoDesignation}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {values?.employee?.employeeInfoDepartment}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {values?.employee?.employeeBusinessUnit}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {_dateFormatter(data?.DateApplicationDate)}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {data?.strLoanType}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {data?.intLoanAmount}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {data?.intInstallment}
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <div className="text-right pr-2">
                                      <input
                                        type="text"
                                        name="intRemainingLoan"
                                        className="trans-date cj-landing-date"
                                        style={{
                                          padding: "0 10px",
                                          maxWidth: "98%",
                                        }}
                                        value={data?.intRemainingLoan}
                                        onChange={(e) =>
                                          setApproveLoanAmount(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <div className="text-right pr-2">
                                      <input
                                        type="number"
                                        min="0"
                                        name="intRemainingInstallment"
                                        className="trans-date cj-landing-date"
                                        style={{
                                          padding: "0 10px",
                                          maxWidth: "98%",
                                        }}
                                        value={data?.intRemainingInstallment}
                                        onChange={(e) =>
                                          setApproveNumberOfInstallment(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <input
                                      className="trans-date cj-landing-date"
                                      value={data?.dteEffectiveDate}
                                      name="dteEffectiveDate"
                                      onChange={(e) => {
                                        selecItemHandler(
                                          index,
                                          e.target.value,
                                          e.target.name
                                        );
                                      }}
                                      type="date"
                                    />
                                  </div>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => {
                                      if (
                                        data?.intRemainingLoan >
                                        data?.intLoanAmount
                                      )
                                        return toast.warn(
                                          "Amount should be equal or less than loan amount"
                                        );
                                      loanApproveAction(
                                        data?.intLoanID,
                                        data?.intloantypeid,
                                        values?.employee?.value,
                                        data?.intLoanAmount,
                                        data?.intInstallment,
                                        +data?.intRemainingLoan,
                                        +data?.intRemainingInstallment,
                                        _dateFormatter(data?.dteEffectiveDate),
                                        "Rescheduled"
                                      );
                                    }}
                                  >
                                    Reshedule
                                  </button>
                                </td>
                                {/* {values?.applicationType === 1 ? ( */}

                                {/* ) : null} */}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default LoanRescheduleLanding;
