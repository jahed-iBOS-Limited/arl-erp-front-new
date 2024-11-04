import moment from "moment";
import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function Table({ gridData }) {
  const bgStyleFunc = (item) => {
    if (item?.strBillRegisterCode) {
      return { backgroundColor: "#42d342bd" };
    }
    if (item?.numApprvBySuppervisor === 0 || item?.numApprvByHR === 0) {
      return { backgroundColor: "#fbfb0054" };
    } else if (
      item?.numApprvBySuppervisor > item?.numApplicantAmount ||
      item?.numApprvByHR > item?.numApplicantAmount ||
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
                <th style={{ minWidth: "100px" }}>Routing</th>
                <th style={{ minWidth: "100px" }}>Account Number</th>
                <th style={{ minWidth: "100px" }}>Bank Name</th>
                <th style={{ minWidth: "100px" }}>Branch</th>
                <th style={{ minWidth: "100px" }}>Contact Number</th>
                <th style={{ minWidth: "100px" }}>Supervisor</th>
                <th style={{ minWidth: "100px" }}>Workplace Name</th>
                <th style={{ minWidth: "100px" }}>Advance Amount</th>
                <th style={{ minWidth: "100px" }}>Expense Code</th>
                <th style={{ minWidth: "100px" }}>Applicant Amount</th>
                <th style={{ minWidth: "100px" }}>Approve By HR</th>
                <th style={{ minWidth: "100px" }}>Approve By Supervisor</th>
                <th style={{ minWidth: "80px" }}>Supervisor Approve Date</th>
                <th style={{ minWidth: "80px" }}>Line Manager Approve Date</th>
                <th style={{ minWidth: "100px" }}>Net Payable</th>
                <th style={{ minWidth: "100px" }}>Bill Register Code</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, index) => {
                totalNumAdvanceAmount += item?.numAdvanceAmount || 0;
                totalNumApplicantAmount += item?.numApplicantAmount || 0;
                totalNumApprvByHR += item?.numApprvByHR || 0;
                totalNumApprvBySuppervisor += item?.numApprvBySuppervisor || 0;
                totalNumNetPayable += item?.numNetPayable || 0;
                return (
                  <tr key={index} style={bgStyleFunc(item)}>
                    <td>{index + 1}</td>
                    <td>{item?.intExpenseForId}</td>
                    <td>{item?.strEmployeeFullName}</td>
                    <td>{item?.strDesignation}</td>
                    <td>{item?.strRouting}</td>
                    <td>{item?.strAccountNumber}</td>
                    <td>{item?.strBank}</td>
                    <td>{item?.strBranch}</td>
                    <td>{item?.strContactNumber}</td>
                    <td>{item?.strsupervisor}</td>
                    <td>{item?.strWorkplaceName}</td>
                    <td className="text-right">
                      {_fixedPoint(item?.numAdvanceAmount)}
                    </td>
                    <td>{item?.strexpensecode}</td>
                    <td className="text-right">
                      {_fixedPoint(item?.numApplicantAmount)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.numApprvByHR)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.numApprvBySuppervisor)}
                    </td>
                    <td>
                      {item?.dteSupervisorAprvdate &&
                        moment(item?.dteSupervisorAprvdate).format(
                          "YYYY-MM-DD, LT"
                        )}
                    </td>
                    <td>
                      {item?.dteLineManagerAprvdate &&
                        moment(item?.dteLineManagerAprvdate).format(
                          "YYYY-MM-DD, LT"
                        )}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.numNetPayable)}
                    </td>
                    <td>{item?.strBillRegisterCode}</td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td colSpan="10" className="text-right">
                  <b>Total</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalNumAdvanceAmount)}</b>
                </td>
                <td></td>
                <td className="text-right">
                  <b>{_fixedPoint(totalNumApplicantAmount)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalNumApprvByHR)}</b>
                </td>
                <td className="text-right">
                  <b>{_fixedPoint(totalNumApprvBySuppervisor)}</b>
                </td>
                <td></td>
                <td></td>
                <td className="text-right">
                  <b>{_fixedPoint(totalNumNetPayable)}</b>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Table;
