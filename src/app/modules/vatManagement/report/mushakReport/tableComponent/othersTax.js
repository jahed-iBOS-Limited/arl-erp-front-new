/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getTreasuryDepositDetailsById } from "../helper";
import RefundModal from "../refundModal/refundModal";
import TreasuryDepositDetailsModal from "../treasuryDepositModal/treasuryDepositModal";

export default function OthersTaxReport({
  parentValues,
  setFieldValue,
  setLoading,
  getTaxLedgerSdVat,
  setTaxLedgerSdVat,
  allValueResult,
  employeeBasicInfo,
  employeeBasicDetails,
  treasuryDepositInfo,
}) {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [isRedfundRow, setIsRefundRow] = useState(false);
  const {
    result54,
    result55,
    result56,
    result57,
    result58,
    result59,
    result60,
    result61,
    result62,
    result63,
    result64,
    result65,
    result66,
    result67,
    result68,
  } = allValueResult;
  const [refundModal, setRefundModal] = useState(false);
  const [treasuryDepositModal, setTreasuryDepositModal] = useState(false);
  const [singleTreasuryDeposit, setSingleTreasuryDeposit] = useState([]);
  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="3">
              Part - 8: ADJUSTMENT FOR OLD ACCOUNT CURRENT BALANCE
            </th>
          </tr>
          <tr>
            <th style={{ width: "550px" }}>Items</th>
            <th>Note</th>
            <th>Amount (Tax)</th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Closing Balance (VAT) up to 30th June, 2019 from
                Mushak-18.6,[Rule 118(5)]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">54</div>
            </td>
            <td>
              <div className="text-right pr-2">{result54}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Closing Balance (SD) up to 30th June, 2019 from
                Mushak-18.6,[Rule 118(5)]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">55</div>
            </td>
            <td>
              <div className="text-right pr-2">{result55}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Decreasing Adjustment for Note 54 (up to 30% of Note 34)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">56</div>
            </td>
            <td>
              <div className="text-right pr-2">{result56.toFixed(2)}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Decreasing Adjustment for Note 55 (up to 30% of Note 36)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">57</div>
            </td>
            <td>
              <div className="text-right pr-2">{result57.toFixed(2)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="4">
              Part - 9: ACCOUNTS CODE WISE PAYMENT SCHEDULE (TREASURY DEPOSIT)
            </th>
          </tr>
          <tr>
            <th style={{ width: "550px" }}>Items</th>
            <th>Note</th>
            <th>Amount (Tax)</th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">VAT Deposit for the Current Tax</div>
            </td>
            <td>
              <div className="text-right pr-2">58</div>
            </td>
            <td>
              <div className="text-right pr-2">{result58}</div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getTreasuryDepositDetailsById(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    treasuryDepositInfo[0]?.treasuryDepositTypeId,
                    setSingleTreasuryDeposit
                  );
                  setTreasuryDepositModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">SD Deposit for the Current Tax Period</div>
            </td>
            <td>
              <div className="text-right pr-2">59</div>
            </td>
            <td>
              <div className="text-right pr-2">{result59}</div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getTreasuryDepositDetailsById(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    treasuryDepositInfo[1]?.treasuryDepositTypeId,
                    setSingleTreasuryDeposit
                  );
                  setTreasuryDepositModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Excise Duty</div>
            </td>
            <td>
              <div className="text-right pr-2">60</div>
            </td>
            <td>
              <div className="text-right pr-2">{result60}</div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getTreasuryDepositDetailsById(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    treasuryDepositInfo[2]?.treasuryDepositTypeId,
                    setSingleTreasuryDeposit
                  );
                  setTreasuryDepositModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Development Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">61</div>
            </td>
            <td>
              <div className="text-right pr-2">{result61}</div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getTreasuryDepositDetailsById(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    treasuryDepositInfo[3]?.treasuryDepositTypeId,
                    setSingleTreasuryDeposit
                  );
                  setTreasuryDepositModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">ICT Development Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">62</div>
            </td>
            <td>
              <div className="text-right pr-2">{result62}</div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getTreasuryDepositDetailsById(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    treasuryDepositInfo[4]?.treasuryDepositTypeId,
                    setSingleTreasuryDeposit
                  );
                  setTreasuryDepositModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Health Care Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">63</div>
            </td>
            <td>
              <div className="text-right pr-2">{result63}</div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getTreasuryDepositDetailsById(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    treasuryDepositInfo[5]?.treasuryDepositTypeId,
                    setSingleTreasuryDeposit
                  );
                  setTreasuryDepositModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Environmental Protection Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">64</div>
            </td>
            <td>
              <div className="text-right pr-2">{result64}</div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getTreasuryDepositDetailsById(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    treasuryDepositInfo[6]?.treasuryDepositTypeId,
                    setSingleTreasuryDeposit
                  );
                  setTreasuryDepositModal(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="4">Part - 10: CLOSING BALANCE</th>
          </tr>
          <tr>
            <th style={{ width: "550px" }}>Items</th>
            <th>Note</th>
            <th>Amount (Tax)</th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Closing Balance (VAT) [58-(50+67)+ the refund amount not
                approved]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">65</div>
            </td>
            <td>
              <div className="text-right pr-2">{result65.toFixed(2)}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Closing Balance (SD) [59-(51+68)+ the refund amount not
                approved]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">66</div>
            </td>
            <td>
              <div className="text-right pr-2">{result66.toFixed(2)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="4">Part - 11: REFUND</th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td rowSpan="3">
              <div className="pl-2">
                I am interested to get refund of my Closing Balance
              </div>
            </td>
            <td>
              <div className="text-center">
                <b>Items</b>
              </div>
            </td>
            <td>
              <div className="text-center">
                <b>Note</b>
              </div>
            </td>
            <td>
              <div className="d-flex justify-content-around">
                <div>
                  <label className="pr-2">Yes</label>
                  <input
                    name="isRefundYes"
                    type="checkbox"
                    style={{ position: "relative", top: "2px" }}
                    // onChange={(e) => {
                    //   setFieldValue("isMultipleUom", e.target.checked);
                    // }}
                    onClick={(e) => {
                      setIsRefundRow(true);
                      setFieldValue("isRefundNo", false);
                      setFieldValue("isRefundYes", e.target.checked);
                      // setRefundModal(true);
                    }}
                    checked={parentValues?.isRefundYes}
                    value={parentValues?.isRefundYes}
                    disabled={parentValues?.isRefundYes === true}
                  />
                </div>
                <div>
                  <label className="pr-2">No</label>
                  <input
                    name="isRefundNo"
                    type="checkbox"
                    checked={parentValues?.isRefundNo}
                    value={parentValues?.isRefundNo}
                    onClick={(e) => {
                      setIsRefundRow(false);
                      setFieldValue("isRefundYes", false);
                      setFieldValue("isRefundNo", e.target.checked);
                    }}
                    style={{ position: "relative", top: "2px" }}
                    disabled={parentValues?.isRefundNo === true}
                  />
                </div>
              </div>
            </td>
          </tr>
          {isRedfundRow === true ? (
            <>
              {/* 2nd row */}
              <tr>
                <td>
                  <div className="text-center">
                    Requested Amount for Refund (VAT)
                  </div>
                </td>
                <td>
                  <div className="text-center">67</div>
                </td>
                <td>
                  <div className="text-right pr-2">{result67}</div>
                </td>
              </tr>
              {/* 3rd row */}
              <tr>
                <td>
                  <div className="text-center">
                    Requested Amount for Refund (SD)
                  </div>
                </td>
                <td>
                  <div className="text-center">68</div>
                </td>
                <td>
                  <div className="text-right pr-2">{result68}</div>
                </td>
              </tr>
            </>
          ) : null}
        </tbody>
      </table>

      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="4">Part - 12: DECLARATION</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              I hereby declare that all information provided in this Return Form
              are complete, true & accurate.In case of any untrue/incomplete
              statement. I may be subjected to penal action under the Value
              Added Tax and Supplementary Duty Act,2012 or any other applicable
              Act prevailing at present
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table table-striped table-bordered global-table">
        <tbody>
          <tr>
            <td>
              <div className="pl-2">
                <b>Name:</b>
              </div>
            </td>
            <td>
              <div className="text-center">
                <b>:</b>
              </div>
            </td>
            <td>
              <div className="text-left pl-2">
                <b>{employeeBasicDetails?.userName}</b>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="pl-2">
                <b>Designation:</b>
              </div>
            </td>
            <td>
              <div className="text-center">
                <b>:</b>
              </div>
            </td>
            <td>
              <div className="text-left pl-2">
                <b>{employeeBasicDetails?.designationName}</b>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="pl-2">
                <b>Mobile Number:</b>
              </div>
            </td>
            <td>
              <div className="text-center">
                <b>:</b>
              </div>
            </td>
            <td>
              <div className="text-left pl-2">
                {employeeBasicDetails?.contact}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="pl-2">
                <b>National ID/Passport Number:</b>
              </div>
            </td>
            <td>
              <div className="text-center">
                <b>:</b>
              </div>
            </td>
            <td>
              <div className="text-left pl-2">
                {employeeBasicDetails?.idnumber}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="pl-2">
                <b>Email:</b>
              </div>
            </td>
            <td>
              <div className="text-center">
                <b>:</b>
              </div>
            </td>
            <td>
              <div className="text-left pl-2">
                <a href="#">{employeeBasicDetails?.emailAddress}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="pl-2">
                <b>Signature [Not required for electronic Submission]</b>
              </div>
            </td>
            <td>
              <div className="text-center">
                <b>:</b>
              </div>
            </td>
            <td>
              <div className="text-left pl-2"></div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* refund Modal */}
      <RefundModal
        show={refundModal}
        onHide={(e) => setRefundModal(false)}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setRefundModal={setRefundModal}
        parentValues={parentValues}
        setLoading={setLoading}
        getTaxLedgerSdVat={getTaxLedgerSdVat}
        setTaxLedgerSdVat={setTaxLedgerSdVat}
      />

      {/* treasury deposit Modal */}
      <TreasuryDepositDetailsModal
        show={treasuryDepositModal}
        onHide={(e) => setTreasuryDepositModal(false)}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setTreasuryDepositModal={setTreasuryDepositModal}
        parentValues={parentValues}
        singleTreasuryDeposit={singleTreasuryDeposit}
      />
    </>
  );
}
