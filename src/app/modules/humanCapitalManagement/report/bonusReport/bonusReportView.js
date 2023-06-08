import React, { useState, useEffect, useCallback, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { downloadFile } from "../../../_helper/downloadFile";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import { _todayDate } from "../../../_helper/_todayDate";
import { getApprovalDetailsViewAction } from "./helper";

const BonusReportView = ({ currentRowData }) => {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getApprovalDetailsViewAction(currentRowData?.id, setLoading, setData);
  }, [currentRowData]);

  const totalBonusAmount = useCallback(
    data?.rowData?.reduce((acc, item) => acc + +item?.bonusAmount, 0),
    [data]
  );

  const printRef = useRef();

  return (
    <>
      <div className="loan-scrollable-table mt-2">
        {loading && <Loading />}
        {data?.rowData?.length > 0 && (
          <div className="global-form text-right">
            <button
              className="btn btn-primary"
              type="button"
              onClick={(e) =>
                downloadFile(
                  `/hcm/BonusGenerate/GetBonusGenerateById?id=${currentRowData?.id}&isDownload=true`,
                  "Employee Bonus Report",
                  "xlsx",
                  setLoading
                )
              }
            >
              Export Excel
            </button>
            <ReactToPrint
              pageStyle={
                "@media print{body { -webkit-print-color-adjust: exact !important;} .global-table tbody tr td{font-size: 16px !important} .global-table thead tr th {font-size: 16px !important} .bonus-report-print{display : block !important}   .print-none{display : none !important} .bonus-report-code-col{position: static !important}  @page {size: landscape !important} }}"
              }
              trigger={() => (
                <button type="button" className="ml-1 btn btn-primary">
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
          </div>
        )}
        <div className="scroll-table _table">
          <div ref={printRef}>
            <div style={{ textAlign: "center", paddingTop: "20px" }} className="bonus-report-print">
              <div style={{ position: "relative" }}>
                <h3>{selectedBusinessUnit?.label}</h3>
                <h4>Employee Bonus Report</h4>
                <span style={{ position: "absolute", right: "0", top: "0" }}>
                  {_todayDate()}
                </span>
              </div>
            </div>
            <table className="table table-striped table-bordered bj-table bj-table-landing">
              <thead>
                <tr>
                  <th style={{ minWidth: "30px" }}>SL</th>
                  <th>Employee Id</th>
                  {/* <th>ERP Emp. Id</th> */}
                  <th
                    style={{
                      position: "sticky",
                      left: "30px",
                      top: "0px",
                      zIndex: "9999999",
                      minWidth: "85px",
                    }}
                    className="bonus-report-code-col"
                  >
                    Employee Code
                  </th>
                  <th>Employee Name</th>
                  <th>Group</th>
                  <th>Job Type</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th style={{ minWidth: "80px" }}>Religion Name</th>
                  <th>Unit</th>
                  <th>Job Station Name</th>
                  <th style={{ minWidth: "80px" }}>Joining Date</th>
                  <th style={{ minWidth: "80px" }}>Effected Date</th>
                  <th>Service Length</th>
                  <th style={{ minWidth: "90px" }}>Salary</th>
                  <th style={{ minWidth: "90px" }}>Basic</th>
                  <th style={{ minWidth: "90px" }}>Bonus Amount</th>
                  <th>Bank Name</th>
                  <th>Bank Branch Name</th>
                  <th style={{ minWidth: "90px" }}>Routing Number</th>
                  <th>Bank Account No</th>
                  <th>Bonus Name</th>
                </tr>
              </thead>
              <tbody>
                {data?.rowData?.length > 0 &&
                  data?.rowData?.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="text-center">{data?.employeeId}</td>
                      {/* <td className="text-center">{data?.erpemployeeId}</td> */}
                      <td
                        style={{
                          position: "sticky",
                          left: "30px",
                          zIndex: "99999",
                          backgroundColor: index % 2 === 0 ? "#ECF0F3" : "#fff",
                        }}
                        className="bonus-report-code-col"
                      >
                        <div className="text-center pl-2">
                          {data?.employeeCode}
                        </div>
                      </td>
                      <td>
                        <div className="text-left pl-2">
                          {data?.employeeName}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.positionGroupName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.employmentTypeName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.departmentName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.designationName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.religionName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.businessUnitName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.workPlaceGroupName}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {_dateFormatter(data?.joiningDate)}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {_dateFormatter(data?.effectedDate)}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.serviceLength}</div>
                      </td>
                      <td>
                        <div className="text-right">
                          {numberWithCommas(data?.salary)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {numberWithCommas(data?.basic)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {numberWithCommas(data?.bonusAmount)}
                        </div>
                      </td>
                      <td>
                        <div className="text-left">{data?.bankName}</div>
                      </td>
                      <td>
                        <div className="text-left">{data?.bankBranchName}</div>
                      </td>
                      <td>
                        <div className="text-center">{data?.routingNumber}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.bankAccountNumber}
                        </div>
                      </td>
                      <td>
                        <div className="text-left">{data?.bonusName}</div>
                      </td>
                    </tr>
                  ))}
                {data?.rowData?.length > 0 && (
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <b>Total</b>
                    </td>
                    <td className="text-right">
                      {numberWithCommas(totalBonusAmount)}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BonusReportView;
