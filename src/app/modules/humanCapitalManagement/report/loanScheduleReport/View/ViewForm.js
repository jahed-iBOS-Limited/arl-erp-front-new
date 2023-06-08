import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function LoanRescheduleReportViewForm({ data, empInfo }) {
  const monthArr = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // console.log(data);

  const printRef = useRef();
  return (
    <>
      <div className="text-right">
        <ReactToPrint
          trigger={() => (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!empInfo?.length || !data?.length}
            >
              <i class="fa fa-print pointer" aria-hidden="true"></i>
              Print
            </button>
          )}
          content={() => printRef.current}
        />
      </div>
      <div componentRef={printRef} ref={printRef}>
        {empInfo.length > 0 && (
          <div
            style={{ maxWidth: "600px", margin: "0px auto" }}
            className="global-form mb-2"
          >
            <div className="d-flex justify-content-between">
              {/* 1st half */}
              <div className="d-flex justify-content-between flex-column">
                <div className="d-flex">
                  <div style={{ width: "76px" }}>
                    <b>Name : </b>
                  </div>
                  <div>{empInfo[0]?.employeeFullName}</div>
                </div>

                <div className="d-flex">
                  <div style={{ width: "76px" }}>
                    <b>Designation : </b>
                  </div>
                  <div>{empInfo[0]?.designationName}</div>
                </div>

                <div className="d-flex">
                  <div style={{ width: "76px" }}>
                    <b>Department : </b>
                  </div>
                  <div>{empInfo[0]?.departmentName}</div>
                </div>
              </div>

              {/* 2nd half */}
              <div className="d-flex justify-content-between flex-column">
                <div className="d-flex">
                  <div style={{ width: "76px" }}>
                    <b>Unit : </b>
                  </div>
                  <div>{empInfo[0]?.businessUnitName}</div>
                </div>

                <div className="d-flex">
                  <div style={{ width: "76px" }}>
                    <b>Job Station : </b>
                  </div>
                  <div>{empInfo[0]?.workplaceName}</div>
                </div>

                <div className="d-flex">
                  <div style={{ width: "76px" }}>
                    <b>Job Status : </b>
                  </div>
                  <div>{empInfo[0]?.employmentTypeName}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className="table table-striped table-bordered my-5 bj-table bj-table-landing">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th style={{ width: "50px" }}>Month</th>
              <th style={{ width: "50px" }}>Year</th>
              <th style={{ width: "50px" }}>Installment Amount</th>
              <th style={{ width: "50px" }}>Installment Date</th>
              <th style={{ width: "50px" }}>Installment Satus</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{monthArr[data.month]}</td>
                  <td>{data.year}</td>
                  <td>{data.installmentAmount}</td>
                  <td>{_dateFormatter(data.installmentDate)}</td>
                  <td>{data?.isInstallmentStatus}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
