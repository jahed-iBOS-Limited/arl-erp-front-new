import React from "react"; 
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function TableTwo({ gridData, values }) {
  const bgStyleFunc = (item) => {
    if (
      (item?.numSupervisorAmount || 0) === 0 ||
      (item?.numLineManagerAmount || 0) === 0
    ) {
      return { backgroundColor: "#fbfb0054" };
    } else if (
      item?.numSupervisorAmount > item?.numApplicantAmount ||
      item?.numLineManagerAmount > item?.numApplicantAmount ||
      item?.numNetPayable > item?.numApplicantAmount
    ) {
      return { backgroundColor: "#ff000052" };
    } else {
      return;
    }
  };

  let totalNumNetPayable = 0,
    totalNumApprvBySuppervisor = 0,
    totalNumApprvByHR = 0,
    totalNumApplicantAmount = 0,
    totalNumAdvanceAmount = 0;
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
                <th style={{ minWidth: "70px" }}>Enroll</th>
                <th style={{ minWidth: "100px" }}>Employee Name</th>
                <th style={{ minWidth: "100px" }}>Designation</th>
                <th style={{ minWidth: "100px" }}>Expense Code</th>
                <th style={{ minWidth: "100px" }}>Expense Date</th>
                <th style={{ minWidth: "100px" }}>Expense Location</th>
                <th style={{ minWidth: "100px" }}>Status</th>
                <th style={{ minWidth: "100px" }}>Email</th>
                <th style={{ minWidth: "100px" }}>Contact Number</th>
                <th style={{ minWidth: "100px" }}>Supervisor</th>

                {[5, 6, 7].includes(values?.reportType?.value) ? (
                  <th style={{ minWidth: "100px" }}>Supervisor Phone Number</th>
                ) : null}

                <th style={{ minWidth: "100px" }}>Workplace Name</th>
                <th style={{ minWidth: "100px" }}>Advance Amount</th>
                <th style={{ minWidth: "100px" }}>Applicant Amount</th>
                <th style={{ minWidth: "100px" }}>Apprve By Suppervisor</th>
                <th style={{ minWidth: "100px" }}>Apporve By HR</th>
                <th style={{ minWidth: "100px" }}>Net Payable</th>
                {values?.reportType?.value === 9 && (
                  <th style={{ minWidth: "50px" }}>Expense Group</th>
                )}
                <th style={{ minWidth: "100px" }}>Bill ID</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, index) => {
                totalNumAdvanceAmount += item?.numAdvanceAmount || 0;
                totalNumApplicantAmount += item?.numApplicantAmount || 0;
                totalNumApprvBySuppervisor += item?.numSupervisorAmount || 0;
                totalNumApprvByHR += item?.numLineManagerAmount || 0;
                totalNumNetPayable += item?.numNetPayable || 0;
                return (
                  <tr key={index} style={bgStyleFunc(item)}>
                    <td>{index + 1}</td>
                    <td>{item?.intExpenseForId}</td>
                    <td>{item?.strEmployeeFullName}</td>
                    <td>{item?.strDesignationName}</td>
                    {/* <td>{item?.strBankRoutingNumber}</td>
                  <td>{item?.strAccountNumber}</td>
                  <td>{item?.strBankName}</td>
                  <td>{item?.strBankBranchName}</td> */}
                    <td>{item?.strExpenseCode}</td>
                    <td>{_dateFormatter(item?.dteExpenseDate)}</td>
                    <td>{item?.strExpenseLocation}</td>
                    <td>{item?.StatusofBill}</td>
                    <td>{item?.strEmail}</td>
                    <td>{item?.strContactNumber}</td>
                    <td>{item?.strSupervisorName}</td>

                    {[5, 6, 7].includes(values?.reportType?.value) ? (
                      <td>{item?.supervisorPhone || ""}</td>
                    ) : null}

                    <td>{item?.strWorkplaceName}</td>
                    <td className="text-right">
                      {_fixedPoint(item?.numAdvanceAmount || 0)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.numApplicantAmount || 0)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.numSupervisorAmount || 0)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.numLineManagerAmount || 0)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.numNetPayable || 0)}
                    </td>
                    {values?.reportType?.value === 9 && (
                      <td
                        style={{ backgroundColor: "rgba(251, 251, 0, 0.33)" }}
                      >
                        {item?.strExpenseGroup}
                      </td>
                    )}
                    <td>{item?.rhintBillId}</td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td
                  colSpan={
                    [5, 6, 7].includes(values?.reportType?.value) ? "12" : "11"
                  }
                  className="text-right"
                >
                  <b>Total</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalNumAdvanceAmount)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalNumApplicantAmount)}</b>
                </td>

                <td className="text-right">
                  <b>{_fixedPoint(totalNumApprvBySuppervisor)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalNumApprvByHR)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalNumNetPayable)}</b>
                </td>
                {values?.reportType?.value === 9 && <td></td>}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TableTwo;
