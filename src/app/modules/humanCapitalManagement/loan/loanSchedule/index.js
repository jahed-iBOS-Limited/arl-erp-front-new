import React, { useEffect, useRef, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import axios from "axios";
import Loading from "../../../_helper/_loading";
import ICustomCard from "../../../_helper/_customCard";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import InputField from "../../../_helper/_inputField";
import ReactToPrint from "react-to-print";
import "./style.css";
import { getEmployeeInfo, getLoanScheduleReport } from "./helper";

const initData = {
  employee: "",
};

// const fakeData = [
//   {
//     sl: 1,
//     employeeName: "m",
//     applicationId: 6598,
//     installmentMonth: "January",
//     installmentYear: 2022,
//     totalLoanAMount: 35000,
//     loanInstallmentStatus: "Completed",
//   },
// ];

// Validation schema
const LoanApproveSchema = Yup.object().shape({});

const LoanScheduleLanding = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [employeeInfo, setEmployeeInfo] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

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

  const getLanding = (values) => {
    getLoanScheduleReport(values?.employee || 0, setRowDto, setLoader);
  };
  useEffect(() => {
    getLanding();
  }, [profileData]);

  console.log("rowData", rowDto);

  const totalAmount = rowDto?.reduce(
    (pre, cur) => (pre = pre?.totalLoanAMount + cur?.totalLoanAMount),
    0
  );

  const printRef = useRef();

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Loan Schedule">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
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
                          <label>Employee</label>
                          <SearchAsyncSelect
                            selectedValue={values?.employee}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {
                              setFieldValue("employee", valueOption);
                              getEmployeeInfo(
                                valueOption?.value || 0,
                                setEmployeeInfo,
                                setLoader,
                                (responseValue) => {
                                  if (responseValue?.length === 1) {
                                    setFieldValue(
                                      "designation",
                                      responseValue[0]?.strDesignationName
                                    );
                                    setFieldValue(
                                      "department",
                                      responseValue[0]?.strDepartmentName
                                    );
                                    setFieldValue(
                                      "unit",
                                      responseValue[0]?.strBusinessUnitName
                                    );
                                    setFieldValue(
                                      "jobStation",
                                      responseValue[0]?.strWorkplaceName
                                    );
                                    setFieldValue(
                                      "jobStatus",
                                      responseValue[0]?.strEmploymentType
                                    );
                                  } else {
                                    setFieldValue("designation", "");
                                    setFieldValue("department", "");
                                    setFieldValue("unit", "");
                                    setFieldValue("jobStation", "");
                                    setFieldValue("jobStatus", "");
                                  }
                                }
                              );
                            }}
                            loadOptions={loadEmp}
                          />
                        </div>
                        <div className="col-lg-3 mb-3">
                          <InputField
                            type="text"
                            value={values?.designation}
                            label="Designation"
                            placeholder="Designation"
                            name="designation"
                            onChange={(e) => {}}
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
                            onChange={(e) => {}}
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg-3 mb-3">
                          <InputField
                            type="text"
                            value={values?.unit}
                            label="Unit"
                            placeholder="Unit"
                            name="unit"
                            onChange={(e) => {}}
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
                            onChange={(e) => {}}
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
                            onChange={(e) => {}}
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg-3">
                          <div className="mt-3 ">
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
                </div>
                <div ref={printRef}>
                  <div className="loan-schedule-print">
                    <h3>Loan Schedule Report</h3>
                    <div className="header-print">
                      <div className="left">
                        <p>Name: {values?.employee?.label}</p>
                        <p>Designation: {values?.designation}</p>
                        <p>Department: {values?.department}</p>
                      </div>
                      <div className="right">
                        <p>Unit: {values?.unit}</p>
                        <p>Job Station: {values?.jobStation}</p>
                        <p>Job Status: {values?.jobStatus}</p>
                      </div>
                    </div>
                  </div>
                  {/* Table Start */}
                  {rowDto.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Employee</th>
                            <th>Application Id</th>
                            <th>Installment Month</th>
                            <th>Installment Year</th>
                            <th>Total Loan Amount</th>
                            <th>Loan Installment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.length > 0 &&
                            rowDto.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="pl-2">
                                    {data?.employeeName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {data?.applicationId}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">{data?.instMonth}</div>
                                </td>
                                <td>
                                  <div className="pl-2">{data?.instYear}</div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {data?.totalLoanAmount}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">{data?.loanStatus}</div>
                                </td>
                              </tr>
                            ))}
                          <tr>
                            <td colSpan={5}>
                              <strong>Total Amount</strong>
                            </td>
                            <td colSpan={2}>
                              <strong>{totalAmount}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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

export default LoanScheduleLanding;
