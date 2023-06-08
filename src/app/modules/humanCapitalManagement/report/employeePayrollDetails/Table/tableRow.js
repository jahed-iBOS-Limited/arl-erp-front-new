/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { getPayrollDetailsGridData } from "../helper";
import "./style.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import moment from "moment";

export function TableRow() {
  const [loading, setLoading] = useState(false);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [fromDate, setFromDate] = useState(_todayDate());

  const date = () => {
    var today = fromDate;
    const todayDate = moment(today).format("MMMM, YYYY");
    return todayDate;
  };

  const viewHandler = () => {
    if (fromDate && selectedBusinessUnit?.value) {
      getPayrollDetailsGridData(
        selectedBusinessUnit?.value,
        fromDate.split("-")[1],
        fromDate.split("-")[0],
        setGridData,
        setLoading
      );
    }
  };

  const exportHandler = () => {
    console.log("Click Export");
  };

  return (
    <>
      <ICustomCard
        title="Employee Payroll Details"
        renderProps={() => (
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button btn btn-primary"
            table="table-to-xlsx"
            filename="Employee Payroll Details"
            sheet="tablexls"
            buttonText="Export Excel"
          />
        )}
      >
        <div className="row my-4 global-form">
          <div className="col-lg-3">
            <div class="form-group">
              <label>Date</label>
              <input
                type="date"
                class="form-control"
                name="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="Date"
              />
            </div>
          </div>
          <div style={{marginTop: "17px"}} className="col-lg-2">
            <button
              type="button"
              disabled={!fromDate}
              className="btn btn-primary"
              onClick={(e) => viewHandler()}
            >
              Show
            </button>
          </div>
        </div>
        {loading && <Loading />}
        <div className="sales-details-scrollable-table">
          <div className="scroll-table _table">
            <table
              id="table-to-xlsx"
              className="table bj-table bj-table-landing"
            >
              <thead>
                <tr className="text-center">
                  <th
                    colSpan="40"
                    className="text-center"
                    style={{ fontSize: "2rem", backgroundColor: "white" }}
                  >
                    Employee Payroll Details of {date()}
                  </th>
                </tr>
                <tr>
                  <th>SL</th>
                  <th>Employee Name</th>
                  <th style={{ minWidth: "30px" }}>Employee Id</th>
                  {/* <th style={{ minWidth: "40px" }}>ERP Emp. Id</th> */}
                  <th className="th-number">Employee Code</th>
                  <th className="th-number">Employee Id</th>
                  <th className="th-number">Present</th>
                  <th className="th-number">Holiday</th>
                  <th className="th-number">Late</th>
                  <th className="th-number">Absent</th>
                  <th className="th-number">Offday</th>
                  <th className="th-number">Working Days</th>
                  <th className="th-number">Leave with pay</th>
                  <th className="th-number">Leave without pay</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th className="text-center">Date of Joining</th>
                  <th className="text-center">Date of Payroll End</th>
                  <th className="text-center">Date of Payroll Start</th>
                  <th>Business Unit</th>
                  <th className="th-number">Year</th>
                  <th>SBU</th>
                  <th>Bank</th>
                  <th>Bank Branch</th>
                  <th>District</th>
                  <th className="th-number">Routing No</th>
                  <th>Bank Ac No</th>
                  <th>Remuneration</th>
                  <th className="th-number">Basic Amount</th>
                  <th className="th-number">Gross Amount</th>
                  <th className="th-number">Allowance And Benefit</th>
                  <th className="th-number">Total Payable</th>
                  <th className="th-number">Total Deduction</th>
                  <th className="th-number">Bill Adjustment</th>
                  <th className="th-number">Net Payable</th>
                  <th className="th-number">Amount</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.map((data, i) => (
                  <tr key={i + 1}>
                    <td>{i + 1}</td>
                    <td>{data?.employeeName}</td>
                    <td> {data?.employeeId} </td>
                    {/* <td> {data?.erpemployeeId} </td> */}
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.employeeCode}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.employeeId}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.present}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.holiday}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.late}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.absent}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.offday}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.workingDays}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.leaveWithPay}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.leaveWithoutPay}
                    </td>
                    <td>{data?.department}</td>
                    <td>{data?.designation}</td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {_dateFormatter(data?.dteJoining)}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {_dateFormatter(data?.dtePayrollEndEnd)}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {_dateFormatter(data?.dtePayrollStartDate)}
                    </td>
                    <td>{data?.businessUnit}</td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {data?.yearId}
                    </td>
                    <td>{data?.sbu}</td>
                    <td>{data?.bankName}</td>
                    <td>{data?.bankBranchName}</td>
                    <td>{data?.district}</td>
                    <td>{data?.routingNumber}</td>
                    <td>{data?.bankAccountNo}</td>
                    <td>{data?.remunerationComName}</td>
                    <td>{data?.numBasicAmount}</td>
                    <td>{data?.numGrossAmount}</td>
                    <td>{data?.numTotalAllowanceAndBenifit}</td>
                    <td>{data?.numTotalPayable}</td>
                    <td>{data?.numTotalDeduction}</td>
                    <td>{data?.numBillAdjustment}</td>
                    <td>{data?.numNetPayable}</td>
                    <td>{data?.numAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ICustomCard>
    </>
  );
}
