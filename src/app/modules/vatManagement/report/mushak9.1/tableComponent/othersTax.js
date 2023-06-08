/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getTreasuryDepositDetailsById } from "../helper";
import RefundModal from "../refundModal/refundModal";
import TreasuryDepositDetailsModal from "../treasuryDepositModal/treasuryDepositModal";
import InputField from "../../../../_helper/_inputField";

export default function OthersTaxReport({
  parentValues,
  setFieldValue,
  setLoading,
  getTaxLedgerSdVat,
  setTaxLedgerSdVat,
  allValueResult,
  employeeBasicDetails,
  treasuryDepositInfo,
  commonNumberFormat,
  setElevenRefund,
  elevenRefund,
  allGridData,
  monthlyReturn,
}) {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [isRedfundRow, setIsRefundRow] = useState(false);
  const { objRowList } = monthlyReturn;
  const commonNoteFind = (noteNo) => {
    if (objRowList?.length > 0) {
      return objRowList?.find((data) => +data.noteNo === +noteNo);
    } else {
      return false;
    }
  };
  const getNote_54 = commonNoteFind(54);
  const getNote_55 = commonNoteFind(55);
  const getNote_56 = commonNoteFind(56);
  const getNote_57 = commonNoteFind(57);
  const getNote_58 = commonNoteFind(58);
  const getNote_59 = commonNoteFind(59);
  const getNote_60 = commonNoteFind(60);
  const getNote_61 = commonNoteFind(61);
  const getNote_62 = commonNoteFind(62);
  const getNote_63 = commonNoteFind(63);
  const getNote_64 = commonNoteFind(64);
  const getNote_65 = commonNoteFind(65);
  const getNote_66 = commonNoteFind(66);
  const getNote_67 = commonNoteFind(67);
  const getNote_68 = commonNoteFind(68);
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

  const note_54 = {
    noteNo: "note_54",
    value: 0,
    sd: 0,
    vat: getNote_54?.vat || result54,
  };
  const note_55 = {
    noteNo: "note_55",
    value: 0,
    sd: 0,
    vat: getNote_55?.vat || result55,
  };
  const note_56 = {
    noteNo: "note_56",
    value: 0,
    sd: 0,
    vat: getNote_56?.vat || result56,
  };
  const note_57 = {
    noteNo: "note_57",
    value: 0,
    sd: 0,
    vat: getNote_57?.vat || result57,
  };
  const note_58 = {
    noteNo: "note_58",
    value: 0,
    sd: 0,
    vat: getNote_58?.vat || result58,
  };
  const note_59 = {
    noteNo: "note_59",
    value: 0,
    sd: 0,
    vat: getNote_59?.vat || result59,
  };
  const note_60 = {
    noteNo: "note_60",
    value: 0,
    sd: 0,
    vat: getNote_60?.vat || result60,
  };
  const note_61 = {
    noteNo: "note_61",
    value: 0,
    sd: 0,
    vat: getNote_61?.vat || result61,
  };
  const note_62 = {
    noteNo: "note_62",
    value: 0,
    sd: 0,
    vat: getNote_62?.vat || result62,
  };
  const note_63 = {
    noteNo: "note_63",
    value: 0,
    sd: 0,
    vat: getNote_63?.vat || result63,
  };
  const note_64 = {
    noteNo: "note_64",
    value: 0,
    sd: 0,
    vat: getNote_64?.vat || result64,
  };
  const note_65 = {
    noteNo: "note_65",
    value: 0,
    sd: 0,
    vat: getNote_65?.vat || result65,
  };
  const note_66 = {
    noteNo: "note_66",
    value: 0,
    sd: 0,
    vat: getNote_66?.vat || result66,
  };
  const note_67 = {
    noteNo: "note_67",
    value: 0,
    sd: 0,
    vat: +getNote_67?.vat || 0 || result67,
  };
  const note_68 = {
    noteNo: "note_68",
    value: 0,
    sd: 0,
    vat: +getNote_68?.vat || 0 || result68,
  };

  allGridData[53] = note_54;
  allGridData[54] = note_55;
  allGridData[55] = note_56;
  allGridData[56] = note_57;
  allGridData[57] = note_58;
  allGridData[58] = note_59;
  allGridData[59] = note_60;
  allGridData[60] = note_61;
  allGridData[61] = note_62;
  allGridData[62] = note_63;
  allGridData[63] = note_64;
  allGridData[64] = note_65;
  allGridData[65] = note_66;
  allGridData[66] = note_67;
  allGridData[67] = note_68;
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_54?.vat)}
              </div>
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_55?.vat)}
              </div>
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_56?.vat)}
              </div>
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_57?.vat)}
              </div>
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_58?.vat)}
              </div>
            </td>
            {note_58?.vat ? (
              <td className="printSectionNone">
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
            ) : null}
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_59?.vat)}
              </div>
            </td>
            {note_59?.vat ? (
              <td className="printSectionNone">
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
            ) : null}
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_60?.vat)}
              </div>
            </td>
            {note_60?.vat ? (
              <td className="printSectionNone">
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
            ) : null}
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_61?.vat)}
              </div>
            </td>
            {note_61?.vat ? (
              <td className="printSectionNone">
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
            ) : null}
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_62?.vat)}
              </div>
            </td>
            {note_62?.vat ? (
              <td className="printSectionNone">
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
            ) : null}
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_63?.vat)}
              </div>
            </td>
            {note_63?.vat ? (
              <td className="printSectionNone">
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
            ) : null}
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_64?.vat)}
              </div>
            </td>
            {note_64?.vat ? (
              <td className="printSectionNone">
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
            ) : null}
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_65?.vat)}
              </div>
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
              <div className="text-right pr-2">
                {commonNumberFormat(note_66?.vat)}
              </div>
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
                    onClick={(e) => {
                      setIsRefundRow(true);
                      setFieldValue("isRefundNo", false);
                      setFieldValue("isRefundYes", e.target.checked);
                    }}
                    // checked={parentValues?.isRefundYes}
                    checked={
                      parentValues?.isRefundYes ||
                      (note_67?.vat || note_68?.vat ? true : false)
                    }
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
                      if (note_67?.vat || note_68?.vat) {
                        return false;
                      } else {
                        setIsRefundRow(false);
                        setFieldValue("isRefundYes", false);
                        setFieldValue("isRefundNo", e.target.checked);
                        if (objRowList?.length > 0) {
                          return false;
                        } else {
                          setElevenRefund((prv) => {
                            return { note67: 0, note68: 0 };
                          });
                        }
                      }
                    }}
                    style={{ position: "relative", top: "2px" }}
                    disabled={parentValues?.isRefundNo === true}
                  />
                </div>
              </div>
            </td>
          </tr>
          {isRedfundRow === true || note_67?.vat || note_68?.vat ? (
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
                  <div className="text-right pr-2">
                    {/* {commonNumberFormat(result67)} */}
                    {objRowList?.length > 0 ? (
                      commonNumberFormat(note_67?.vat)
                    ) : (
                      <InputField
                        style={{ height: "25px" }}
                        value={elevenRefund?.note67}
                        name="names"
                        placeholder="Name"
                        type="number"
                        onChange={(e) => {
                          setElevenRefund((prv) => {
                            return { ...prv, note67: e.target.value };
                          });
                        }}
                      />
                    )}
                  </div>
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
                  <div className="text-right pr-2">
                    {/* {commonNumberFormat(result68)} */}
                    {objRowList?.length > 0 ? (
                      commonNumberFormat(note_68?.vat)
                    ) : (
                      <InputField
                        style={{ height: "25px" }}
                        value={elevenRefund?.note68}
                        name="names"
                        placeholder="Name"
                        type="number"
                        onChange={(e) => {
                          setElevenRefund((prv) => {
                            return { ...prv, note68: e.target.value };
                          });
                        }}
                      />
                    )}
                  </div>
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
