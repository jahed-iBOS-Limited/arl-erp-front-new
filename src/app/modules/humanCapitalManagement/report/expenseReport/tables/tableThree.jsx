import React from "react"; 
import { _dateFormatter } from "../../../../_helper/_dateFormate";

function TableThree({ gridData }) {
  return (
    <>
      <div className="loan-scrollable-table">
        <div
          style={{ maxHeight: "400px" }}
          className="scroll-table _table scroll-table-auto react-bootstrap-table table-responsive"
        >
          <table
            className="table table-striped table-bordered global-table table-font-size-sm"
            id="table-to-xlsx"
          >
            <thead>
              <tr>
                <th style={{ minWidth: "30px" }}>SL</th>
                <th style={{ minWidth: "100px" }}>Employee Name</th>
                <th style={{ minWidth: "70px" }}>Employee Id</th>
                <th style={{ minWidth: "100px" }}>Supervisor Name</th>
                <th style={{ minWidth: "100px" }}>Supervisor Business Unit</th>
                <th style={{ minWidth: "100px" }}>Expense Date</th>
                <th style={{ minWidth: "100px" }}>Expense Group</th>
                <th style={{ minWidth: "70px" }}>Bill Submitted</th>
                <th style={{ minWidth: "100px" }}>Line Manager Approve</th>
                <th style={{ minWidth: "100px" }}>Supervisor Approve</th>
                <th style={{ minWidth: "50px" }}>Status</th>
                <th style={{ minWidth: "100px" }}>Comment</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.EmployeeFullName}</td>
                    <td>{item?.intExpenseForId}</td>
                    <td>{item?.SupervisorFullName}</td>
                    <td>{item?.SupBusinessUnitName}</td>
                    <td>{_dateFormatter(item?.dteExpenseDate)}</td>
                    <td>{item?.strExpenseGroup}</td>
                    <td>{item?.isBillSubmitted ? "Yes" : "No"}</td>
                    <td>{item?.strLineManagerApprove}</td>
                    <td>{item?.strSupervisorApprove}</td>
                    <td>{item?.isHeaderActive && item?.isRowActive ? "Active" : "Inactive"}</td>
                    <td>{item?.Comments}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TableThree;
