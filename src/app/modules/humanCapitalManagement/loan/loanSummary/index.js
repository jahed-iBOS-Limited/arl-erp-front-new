/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import Loading from "../../../_helper/_loading";
import axios from "axios";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import InputField from "../../../_helper/_inputField";
import ICustomTable from "../../../_helper/_customTable";
import "./loanSummary.css";
import ReactToPrint from "react-to-print";
import { getLoanSummaryReport } from "./helper";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {};

const LoanSummaryLanding = () => {
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const headers = [
    "SL No.",
    "Employee",
    "Application Id",
    "Loan Type",
    "Total Loan Amount",
    "Remaining Loan Amount",
    "Total Installment",
    "Remaining Installment",
    "Application Date",
    "Approve Status",
    "Loan Installment Status",
  ];

  useEffect(() => {
    getLoanSummaryReport(2, profileData?.employeeId, setRowDto, setLoading);
  }, [profileData]);

  const loadEmp = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
      )
      .then((res) => {
        return [{ value: 0, label: "All" }, ...res?.data];
      });
  };

  const printRef = useRef();

  return (
    <>
      {loading && <Loading />}
      <ICustomCard title="Loan Summary Report">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            approveLoanAmount: 0,
            approveNumberOfinstallment: 0,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-3">
                          <>
                            <label>Name</label>
                            <SearchAsyncSelect
                              selectedValue={values?.employee}
                              isSearchIcon={true}
                              handleChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                                getLoanSummaryReport(
                                  3,
                                  valueOption?.value,
                                  "",
                                  setLoading,
                                  (data) => {
                                    if (data?.length) {
                                      setFieldValue(
                                        "unit",
                                        data[0]?.strBusinessUnitName
                                      );
                                      setFieldValue(
                                        "designation",
                                        data[0]?.strDesignationName
                                      );
                                      setFieldValue(
                                        "department",
                                        data[0]?.strDepartmentName
                                      );
                                      setFieldValue(
                                        "jobStation",
                                        data[0]?.strWorkplaceName
                                      );
                                      setFieldValue(
                                        "jobStatus",
                                        data[0]?.strEmploymentStatus
                                      );
                                    }
                                  }
                                );
                              }}
                              loadOptions={loadEmp}
                            />
                          </>
                        </div>
                        <div className="col-lg-3 mb-3">
                          <InputField
                            type="text"
                            value={values?.unit}
                            label="Unit"
                            placeholder="Unit"
                            name="unit"
                            onChange={(e) => {
                              setFieldValue("unit", e.target.value);
                            }}
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg-3 mb-3">
                          <InputField
                            type="text"
                            value={values?.designation}
                            label="Designation"
                            placeholder="Designation"
                            name="designation"
                            onChange={(e) => {
                              setFieldValue("designation", e.target.value);
                            }}
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg-3 mb-3">
                          <InputField
                            type="text"
                            value={values?.department}
                            label="Department"
                            placeholder="Department"
                            name="department"
                            onChange={(e) => {
                              setFieldValue("department", e.target.value);
                            }}
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg-3 mb-3">
                          <InputField
                            type="text"
                            value={values?.jobStation}
                            label="Job Station"
                            placeholder="Job Station"
                            name="jobStation"
                            onChange={(e) => {
                              setFieldValue("jobStation", e.target.value);
                            }}
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg-3 mb-3">
                          <InputField
                            type="text"
                            value={values?.jobStatus}
                            label="Job Status"
                            placeholder="Job Status"
                            name="jobStatus"
                            onChange={(e) => {
                              setFieldValue("jobStatus", e.target.value);
                            }}
                            disabled={true}
                          />
                        </div>
                        <div style={{ marginTop: "14px" }} className="col-lg-4">
                          <ReactToPrint
                            pageStyle={
                              "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                            }
                            trigger={() => (
                              <button
                                type="button"
                                className="btn btn-primary px-3 py-2"
                              >
                                <i
                                  className="mr-1 fa fa-print pointer"
                                  aria-hidden="true"
                                ></i>
                                Print
                              </button>
                            )}
                            content={() => printRef.current}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div ref={printRef}>
                  <div className="loan-summary-print">
                    <h3>Loan Summary Report</h3>
                    <div className="header-print">
                      <div className="left">
                        <p>Name: {"NAjmus Sakib"}</p>
                        <p>Designation: {"Juniour"}</p>
                        <p>Department: {"Development"}</p>
                      </div>

                      <div className="right">
                        <p>Unit: {"iBOS"}</p> <p>Job Station: {"Lalmatiya"}</p>
                        <p>Job Status: {"Probationary"}</p>
                      </div>
                    </div>
                  </div>
                  {/* Table Start */}
                  {rowDto?.length > 0 && (
                    <ICustomTable ths={headers}>
                      {rowDto?.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item?.employeeName}</td>
                          <td>{item?.applicationId}</td>
                          <td>{item?.loanType}</td>
                          <td>{item?.totalLoanAmount}</td>
                          <td>{item?.remainingLoanAmount}</td>
                          <td>{item?.totalInstallment}</td>
                          <td>{item?.remainingInstallment}</td>
                          <td className="text-center">
                            {_todayDate(item?.applicationDate)}
                          </td>
                          <td>{item?.approveStatus}</td>
                          <td>{item?.loanInstallmentStatus}</td>
                        </tr>
                      ))}
                    </ICustomTable>
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default LoanSummaryLanding;
