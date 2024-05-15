/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../_helper/SearchAsyncSelect";
import Loading from "../../_helper/_loading";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../_metronic/_partials/controls";
import { getPaySlip_api, getPDFAction } from "./helper";
import "./style.css";
import moment from "moment";
import { _todayDate } from "../../_helper/_todayDate";
import { downloadFile } from "../../_helper/downloadFile";

const PayslipReport = () => {
  const { profileData, selectedBusinessUnit, userRole } = useSelector(
    (state) => {
      return state?.authData;
    },
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(moment());
  const [gridData, setGridData] = useState("");
  const [employee, setEmployee] = useState({
    value: profileData?.employeeId,
    label: profileData?.employeeFullName,
  });

  const paySlipPublic = userRole?.find(
    ({ intFeatureId }) => intFeatureId === 985
  );

  useEffect(() => {
    getPaySlip_api(employee?.value, _todayDate(), setGridData, setLoading);
  }, [profileData]);

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

  function currMonthName() {
    return value.format("MMMM");
  }

  // function currMonth() {
  //   return value.format("MM");
  // }

  function currYear() {
    return value.format("YYYY");
  }

  function prevMonth() {
    return value.clone().subtract(1, "month");
  }

  function nextMonth() {
    return value.clone().add(1, "month");
  }

  return (
    <>
      {loading && <Loading />}
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"Payslip"}>
          <div className="currentMonthYear d-flex align-items-center pt-3">
            <span
              onClick={() => {
                setValue(prevMonth());
                getPaySlip_api(
                  employee?.value || profileData?.employeeId,
                  prevMonth().format("yyyy-MM-DD"),
                  setGridData,
                  setLoading
                );
              }}
            >
              <i
                style={{ color: "black" }}
                className="icon fas fa-backward pointer ml-2"
              ></i>
            </span>

            <div className="monthDate">
              <span
                style={{
                  color: "#3B82F6",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                className="month ml-2"
              >
                {currMonthName()}
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                className="year ml-1"
              >
                {currYear()}
              </span>
            </div>

            <span
              onClick={() => {
                setValue(nextMonth());
                getPaySlip_api(
                  employee?.value || profileData?.employeeId,
                  nextMonth().format("yyyy-MM-DD"),
                  setGridData,
                  setLoading
                );
              }}
            >
              <i
                style={{ color: "black" }}
                className="icon fas fa-forward pointer ml-2"
              ></i>
            </span>
          </div>
          <CardHeaderToolbar>
            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={() => {
                downloadFile(
                  `/hcm/PdfReport/PaySlipAPI?EmployeeId=${employee?.value ||
                    profileData?.employeeId}&Date=${value.format(
                    "yyyy-MM-DD"
                  )}&isDownload=true`,
                  "Employee Payslip",
                  "xlsx",
                  setLoading
                );
              }}
            >
              Export Excel
            </button>
            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={() => {
                getPDFAction(
                  `/hcm/PdfReport/PdfPaySlip?EmployeeId=${employee?.value ||
                    profileData?.employeeId}&Date=${value.format(
                    "yyyy-MM-DD"
                  )}`,
                  setLoading
                );
              }}
            >
              <i className="fa fa-print"></i>
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {paySlipPublic?.isView && (
            <div style={{ width: "300px" }} className="ml-2">
              <label>Employee</label>
              <SearchAsyncSelect
                selectedValue={employee}
                isSearchIcon={true}
                handleChange={(valueOption) => {
                  setEmployee({
                    value: valueOption?.value,
                    label: valueOption?.label,
                  });
                  if (valueOption) {
                    getPaySlip_api(
                      valueOption?.value,
                      value.format("yyyy-MM-DD"),
                      setGridData,
                      setLoading
                    );
                  }
                }}
                loadOptions={loadUserList}
              />
            </div>
          )}
          {gridData && (
            <div className="mt-0 self-payslip">
              <div class="report-header">
                <h1 style={{ marginBottom: "0" }}>{gridData?.strUnit}</h1>
                <h4 style={{ margin: "0" }}>
                  "Akij House" 198 Bir Uttam Mir Showkat Sarak, Tejgaon, Dhaka
                </h4>
                <h4 style={{ marginTop: "0", textDecoration: "underline" }}>
                  {gridData?.strSubject}
                </h4>
              </div>

              <div class="report-body">
                {/* basic information */}
                <div>
                  <h4>Basic Information</h4>
                  <div className="basicInfoTable">
                  <div className="table-responsive">
                    <table style={{ width: "100%", border: "0" }}>
                      <tbody>
                        <tr>
                          <td>Name</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.strName || "N/A"}
                            </div>
                          </td>
                          <td>Enroll</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.enrollAndCode || "N/A"}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Designation</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.strDesignation || "N/A"}
                            </div>
                          </td>
                          <td>Grade</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.strGradeName || "N/A"}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Department</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.strDepartment || "N/A"}
                            </div>
                          </td>
                          <td>Joining Date</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.dteJoining || "N/A"}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Unit</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.strUnit || "N/A"}
                            </div>
                          </td>
                          <td>Job Station</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.strJobStationName || "N/A"}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Job Type</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.strJobType || "N/A"}
                            </div>
                          </td>
                          <td>Serv. Length</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.joiningAndLength || "N/A"}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Gross Salary</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.monGrossSalary || "N/A"}
                            </div>
                          </td>
                          <td>Basic Salary</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.monBasicAmount || "N/A"}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Bank Name</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.strBankName || "N/A"}
                            </div>
                          </td>
                          <td>Branch Name</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.strBankBranchName || "N/A"}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Accounts No</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.bankRoutingAndACNo || "N/A"}
                            </div>
                          </td>
                          <td>PF A/C No</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.bankRoutingAndACNo || "N/A"}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
                <hr style={{ backgroundColor: "#000" }} />

                {/* attendence information */}
                <div>
                  <h4>Attendance Information</h4>
                  <div className="basicInfoTable">
                  <div className="table-responsive">
                    <table style={{ width: "100%", border: "0" }}>
                      <tbody>
                        <tr>
                          <td>Working</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.intWorkingDays || 0}
                            </div>
                          </td>
                          <td>Present</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.intPresent || 0}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Off</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.intOffday || 0}
                            </div>
                          </td>
                          <td>Holy</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.intHoliday || 0}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Leave</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.intLeave || 0}
                            </div>
                          </td>
                          <td>LWP</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.intLWP || 0}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>Late</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.intLate || 0}
                            </div>
                          </td>
                          <td>Absent</td>
                          <td>
                            <div>
                              <span className="mr-2"> : </span>
                              {gridData?.intAbsent || 0}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
                <br />

                {/* details information */}
                <div className="detailsInfoTable">
                <div className="table-responsive">
                  <table style={{ width: "100%", border: "0" }}>
                    <tbody>
                      <tr
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "blue",
                          textDecoration: "underline",
                        }}
                      >
                        <td
                          style={{
                            border: "1px solid black",
                            borderLeft: "1px solid transparent",
                          }}
                        >
                          Details Information
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          Earning (Tk.)
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            borderRight: "1px solid transparent",
                          }}
                        >
                          Deduction (Tk.)
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>1.</strong> Monthly Gross Salary
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >
                          {gridData?.monGrossSalary}
                        </td>
                        <td style={{ textAlign: "center" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>2.</strong> Mobile Allowance
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >
                          {gridData?.monMobileAllowance}
                        </td>
                        <td style={{ textAlign: "center" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>3.</strong> Driver/Car Allowance
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >
                          {gridData?.driverAndMotorCycleAllowance}
                        </td>
                        <td style={{ textAlign: "center" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>4.</strong> Special Allowance
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >
                          {gridData?.monSpecialSalaryAllowance}
                        </td>
                        <td style={{ textAlign: "center" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>5.</strong> Over Time
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >
                          {gridData?.monOTAmount}
                        </td>
                        <td style={{ textAlign: "center" }}></td>
                      </tr>
                      {/* <tr>
                        <td>
                          <strong>6.</strong> Medical Reimbursement
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.monMedicalAllowanceAmount}
                        </td>
                      </tr> */}
                      <tr>
                        <td>
                          <strong>6.</strong> Incentive
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >
                          {gridData?.incentive}
                        </td>
                        <td style={{ textAlign: "center" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>7.</strong> Leave Encashment / LFA
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >
                          {" "}
                          {gridData?.leaveEncashment}
                        </td>
                        <td style={{ textAlign: "center" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>8.</strong> Exgratia
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >
                          {" "}
                          {gridData?.exgratia}
                        </td>
                        <td style={{ textAlign: "center" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>9.</strong> PF
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.monPFAmount}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>10.</strong> Tax
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >                          
                        </td>
                        <td style={{ textAlign: "center" }}>{gridData?.monTaxAmount}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>11.</strong> Absent Punishment
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.monAbsentPunishmentAmount}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>12.</strong> Leave Without Pay (LWP)
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.monLeavePunishmentAmount}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>13.</strong> Subsidiary Lunch
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.monLunch}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>14.</strong> Flat Installment
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.monFlatInstallment}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>15.</strong> Fair Price
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.fairPrice}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>16.</strong> Loan
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.monLoanAmount}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>17.</strong> Late Punishment
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.monLatePunishmentAmount}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>18.</strong> Others Addition
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        >
                          {gridData?.allowanceOther}
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>
                          <strong>19.</strong> Others Deduction
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderRight: "1px solid black",
                            borderLeft: "1px solid black",
                          }}
                        ></td>
                        <td style={{ textAlign: "center" }}>
                          {gridData?.otherDeduction}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            textAlign: "right",
                            border: "1px solid black",
                            borderLeft: "1px solid transparent",
                          }}
                        >
                          Total Taka =
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            border: "1px solid black",
                          }}
                        >
                          {gridData?.totalAddition}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            border: "1px solid black",
                            borderRight: "1px solid transparent",
                          }}
                        >
                          {gridData?.totalDeduction}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            textAlign: "right",
                            border: "1px solid black",
                            borderLeft: "1px solid transparent",
                          }}
                        >
                          Total Net Payable =
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            border: "1px solid black",
                            borderRight: "1px solid transparent",
                          }}
                        >
                          {gridData?.monNetPayableSalary}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderBottom: "1px solid black",
                          }}
                        ></td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            textAlign: "right",
                            border: "1px solid black",
                            borderLeft: "1px solid transparent",
                          }}
                        >
                          Employee PF Contribution =
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            border: "1px solid black",
                            borderRight: "1px solid transparent",
                          }}
                        >
                          {gridData?.monPFEmployeeContribution}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            borderBottom: "1px solid black",
                          }}
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>

                {/* footer */}
                <div>
                  {gridData?.monNetPayableSalary && (
                    <h3
                      style={{
                        textAlign: "center",
                        marginBottom: 0,
                        marginTop: 0,
                        paddingTop: "5px",
                      }}
                    >
                      In Word: {gridData?.inWord}
                    </h3>
                  )}
                  <p
                    style={{
                      color: "red",
                      marginTop: 0,
                      marginBottom: 0,
                      fontWeight: "bold",
                      textAlign: "center",
                      paddingTop: "5px",
                    }}
                  >
                    {gridData?.strNB}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default PayslipReport;
