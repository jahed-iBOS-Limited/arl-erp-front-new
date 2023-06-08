/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import ViewModalPayrollDetails from "../View/ViewModal";
import { getReportGridData, getReportForRowData } from "../helper"
import ReactHTMLTableToExcel from "react-html-table-to-excel";


export function TableRow() {
  const [loading, setLoading] = useState(false);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [fromDate, setFromDate] = useState(_todayDate);
  const [modalShow, setModalShow] = useState(false);
  const [rowDetails, setRowDetails] = useState([]);

  return (
    <>
      <ICustomCard title="Employee Payroll Report"
      renderProps={() => (
        <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button btn btn-primary"
        table="table-to-xlsx"
        filename="Employee Payroll Report"
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
          <div style={{marginTop: "17px"}}className="col-lg-2">
            <button className="btn btn-primary" onClick={(e) =>{
              getReportGridData(selectedBusinessUnit.value,parseInt(fromDate.split("-")[1]),fromDate.split("-")[0],setGridData ,setLoading)
            } }>
              View
            </button>
          </div>
        </div>
        {loading && <Loading />}

        <table className="table table-striped table-bordered global-table" id="table-to-xlsx">
          <thead>
            <tr>
              <th>SL</th>
              <th style={{ width: "30px" }}>Employee Id</th>
              {/* <th style={{ width: "40px", minWidth: "30px" }}>ERP Emp. Id</th> */}
              <th>Employee Code</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Bank Name</th>
              <th>Bank Branch Name</th>
              <th>Working Days</th>
              <th>Present</th>
              <th>Basic Amount</th>
              <th>Gross Amount</th>
              <th>Total Payable</th>
              <th>Total Deduction</th>
              <th>Net Payable</th>
              <th>Action</th>
              
            </tr>
          </thead>
          <tbody>
            {
              gridData?.map((data, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td> {data?.employeeId} </td>
                  {/* <td> {data?.erpemployeeId} </td> */}
                  <td>{data?.employeeCode}</td>
                  <td>{data?.employeeName}</td>
                  <td>{data?.department}</td>
                  <td>{data?.designation}</td>
                  <td>{data?.bankName}</td>
                  <td>{data?.bankBranchName}</td>
                  <td className="text-center">{data?.workingDays}</td>
                  <td className="text-center">{data?.present}</td>
                  <td className="text-right">{data?.numBasicAmount}</td>
                  <td className="text-right">{data?.numGrossAmount}</td>
                  <td className="text-right">{data?.numTotalPayable}</td>
                  <td className="text-right">{data?.numTotalDeduction}</td>
                  <td className="text-right">{data?.numNetPayable}</td>
                  <td className="text-center">
                    <IView
                      clickHandler={() => {
                        setModalShow(true);
                        getReportForRowData(data.payrollId,setRowDetails)
                      }}
                      title="Details"
                      classes="text-primary"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>


        <ViewModalPayrollDetails
         data={rowDetails}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </ICustomCard>
    </>
  );
}
