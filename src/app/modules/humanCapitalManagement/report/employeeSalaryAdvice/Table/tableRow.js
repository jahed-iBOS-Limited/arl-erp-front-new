/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getReportGridData,
  getBankDDLData,
  getBranchDDLData,
  getBankAccountDDLData,
} from "../helper";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { convertNumberToWords } from "../../../../_helper/_convertMoneyToWord";
import "./salaryAdvice.css";

export function TableRow() {
  const [loading, setLoading] = useState(false);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getBankDDLData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBankDDL
    );
  }, []);

  const [gridData, setGridData] = useState([]);

  const [fromDate, setFromDate] = useState(_todayDate);
  const [bankName, setBankName] = useState("");
  const [bankDDL, setBankDDL] = useState([]);
  const [branchDDL, setBranchDDL] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankAccountDDL, setbankAccountDDL] = useState([]);
  const printRef = useRef();

  console.log(gridData, "gridData");

  let NetAmount = gridData.reduce((total, acc) => total + acc.numNetPayable, 0);

  return (
    <>
      <ICustomCard
        title="Employee Salary Advice"
        renderProps={() => (
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-primary">
                <img
                  style={{ width: "25px", paddingRight: "5px" }}
                  src={printIcon}
                  alt="print-icon"
                />
                Print
              </button>
            )}
            content={() => printRef.current}
          />
        )}
      >
        <div className="row my-4">
          <div className="col-lg-2" style={{ marginTop: "-3px" }}>
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
          <div className="col-lg-3">
            <label>Select Bank Name</label>
            <Select
              onChange={(valueOption) => {
                setBranchName("");
                setBankName(valueOption);
                getBranchDDLData(
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  valueOption?.value,
                  setBranchDDL
                );
              }}
              options={bankDDL}
              value={bankName}
              isSearchable={true}
              name="bankName"
              styles={customStyles}
              placeholder="Select Bank Name"
            />
          </div>
          <div className="col-lg-3">
            <label>Select Branch Name</label>
            <Select
              onChange={(valueOption) => {
                setBankAccount("");
                setBranchName(valueOption);
                getBankAccountDDLData(
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  bankName?.value,
                  valueOption?.value,
                  setbankAccountDDL
                );
              }}
              options={branchDDL}
              value={branchName}
              isSearchable={true}
              name="branchName"
              styles={customStyles}
              placeholder="Select Branch Name"
              isDisabled={!bankName}
            />
          </div>
          <div className="col-lg-3">
            <label>Select Account Number</label>
            <Select
              onChange={(valueOption) => setBankAccount(valueOption)}
              options={bankAccountDDL}
              value={bankAccount}
              isSearchable={true}
              name="bankAccount"
              styles={customStyles}
              isDisabled={!bankName || !branchName}
              placeholder="Select Account Number"
            />
          </div>
          <div className="col-lg-1 mt-5">
            <button
              className="btn btn-primary"
              disabled={!fromDate || !bankName || !branchName || !bankAccount}
              onClick={(e) => {
                getReportGridData(
                  selectedBusinessUnit.value,
                  fromDate.split("-")[1],
                  fromDate.split("-")[0],
                  bankName.label,
                  bankAccount?.label,
                  setGridData,
                  setLoading
                );
              }}
            >
              View
            </button>
          </div>
        </div>
        {loading && <Loading />}

        <div ref={printRef} className="print_wrapper">
          <div>
            <div className="d-flex flex-column justify-content-center align-items-center my-3">
              <h1>{selectedBusinessUnit?.label}</h1>
              <p>
                Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon,
                Dhaka-1208.
              </p>
            </div>
            <div className="my-3 salaryAdvice">
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <p className="font-weight-bold">To</p>
                  <p>Date: {fromDate}</p>
                </div>
                <p className="font-weight-bold">The Manager</p>
              </div>
              <h6>{bankName?.label}</h6>
              <p>{branchName?.label}</p>
              <p className="font-weight-bold">Subject : Payment Instruction.</p>
              <p className="dearSirSpace">Dear Sir,</p>
              <p>
                We do hereby requesting you to make payment by transferring the
                amount to the respective Account Holder as shown below in
                detailed by debiting our CD Account No. {bankAccount?.label}
              </p>
              <p>Detailed particulars of each Account Holder:</p>
            </div>

            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Code No</th>
                  <th>Bank Name</th>
                  <th>Branch Name</th>
                  <th>A/C Type</th>
                  <th>Account No</th>
                  <th>Amount</th>
                  <th>Payment Info</th>
                  <th>Comments</th>
                  <th>Routing No</th>
                  <th>Instrument No</th>
                  <th>SL</th>
                  <th>Debit Account</th>
                </tr>
              </thead>
              {gridData.length > 0 && (
                <tbody>
                  {gridData?.map((data, i) => (
                    <tr key={i + 1}>
                      <td>{data?.employeeName}</td>
                      <td>{data?.employeeCode}</td>
                      <td>{data?.bankName}</td>
                      <td>{data?.bankBranchName}</td>
                      <td>{"Saving Account"}</td>
                      <td>{data?.bankAccountNo}</td>
                      <td className="text-right">{data?.numNetPayable}</td>
                      <td className="text-center">{"-"}</td>
                      <td>{"N/A"}</td>
                      <td>{data?.routingNumber}</td>
                      <td className="text-center">{data?.payrollId}</td>
                      <td className="text-center">{i + 1}</td>
                      <td className="text-right">{data?.accounty}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="font-weight-bold">Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="font-weight-bold text-right">{NetAmount}</td>
                  </tr>
                </tbody>
              )}
            </table>
            <p className="font-weight-bold mt-2">
              In Word: {convertNumberToWords(NetAmount)} Taka
            </p>
          </div>
          <div className=" my-3 font-weight-bold">
            <p>For {selectedBusinessUnit?.label}</p>
            <div className="d-flex justify-content-between mt-13">
              <h6>Authorize Signature</h6>
              <h6>Authorize Signature</h6>
              <h6>Authorize Signature</h6>
            </div>
          </div>
        </div>
      </ICustomCard>
    </>
  );
}
