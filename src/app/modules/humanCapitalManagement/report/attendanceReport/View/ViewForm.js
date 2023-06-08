import React, { useRef } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import "./../leaveMovementHistory.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactToPrint from "react-to-print";

export default function AttendanceReportViewForm({ data }) {
  const printRef = useRef();
  return (
    <>
      {data?.length > 0 && (
        <>
          <div className="mt-4 d-flex justify-content-end">
            <ReactHTMLTableToExcel
              id="test-table-xls-button-att-reports"
              className="btn btn-primary m-0 mx-2 py-2 px-2"
              table="table-to-xlsx"
              filename="Attendance Report"
              sheet="Attendance Report"
              buttonText="Export Excel"
            />
            <button type="button" className="btn btn-primary p-0 m-0 py-2 px-2">
              <ReactToPrint
                pageStyle={
                  "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                }
                trigger={() => (
                  <i style={{ fontSize: "18px" }} className="fas fa-print"></i>
                )}
                content={() => printRef.current}
              />
            </button>
          </div>
        </>
      )}
      <div style={{ margin: "0 160px" }} ref={printRef}>
        <h3 className="d-none-print text-center">Attendance Report</h3>
        <div className="d-flex justify-content-between">
          <div>
            <p className="p-0 m-0">
              <b>Enroll : {data?.[0]?.employeeId}</b>
            </p>
            <p className="p-0 m-0">
              <b>Name : {data?.[0]?.employeeName}</b>
            </p>
          </div>
          <div>
            <p className="p-0 m-0">
              <b>Designation : {data?.[0]?.designation}</b>
            </p>
            <p className="p-0 m-0">
              <b>Department : {data?.[0]?.department}</b>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div className="d-flex justify-content-around">
              <b>From Date : {_dateFormatter(data?.[0]?.attendanceDate)}</b>
              <b>
                To Date :{" "}
                {_dateFormatter(data?.[data?.length - 1]?.attendanceDate)}
              </b>
            </div>
          </div>
          <div className="col-lg-3"></div>
        </div>
        <table className="table table-striped table-bordered my-5 bj-table bj-table-landing">
          <thead>
            <tr>
              <th style={{ width: "20px" }}>SL</th>
              <th style={{ width: "50px" }}>Date</th>
              <th style={{ width: "50px" }}>Employee Name</th>
              <th style={{ width: "50px" }}>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.length >= 0 &&
              data?.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="text-center">
                      {_dateFormatter(data?.attendanceDate)}
                    </div>
                  </td>
                  <td>
                    <div className="pl-2">{data?.employeeName}</div>
                  </td>
                  {data?.status?.toLowerCase() === "present" ? (
                    <td style={{ color: "green" }}>{data?.status}</td>
                  ) : data?.status?.toLowerCase() === "absent" ? (
                    <td style={{ color: "red" }}>{data?.status}</td>
                  ) : data?.status?.toLowerCase() === "not found" ? (
                    <td style={{ color: "red" }}>{data?.status}</td>
                  ) : data?.status?.toLowerCase() === "offday" ? (
                    <td style={{ color: "DarkSalmon" }}>{data?.status}</td>
                  ) : data?.status?.toLowerCase() === "holiday" ? (
                    <td style={{ color: "DarkOrange" }}>{data?.status}</td>
                  ) : data?.status?.toLowerCase() === "late" ? (
                    <td style={{ color: "DarkKhaki" }}>{data?.status}</td>
                  ) : data?.status?.toLowerCase() === "leave" ? (
                    <td style={{ color: "#4B0082" }}>{data?.status}</td>
                  ) : data?.status?.toLowerCase() === "movement" ? (
                    <td style={{ color: "#FF69B4	" }}>{data?.status}</td>
                  ) : (
                    "-"
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
