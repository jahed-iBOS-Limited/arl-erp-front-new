import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AdjustmentTaxDetailsModal24 from "../adjustmentTaxModal/adjustmentTaxModal24";
import { GetDetailsForNote24AndNote29_api } from "../helper";
export default function AddjustmentVatReport({
  gridData,
  parentValues,
  commonNumberFormat,
  allGridData,
  monthlyReturn,
}) {
  const [adjustmentTaxModal24, setAdjustmentTaxModal24] = useState(false);
  const [singleAdjustmentTax, setSingleAdjustmentTax] = useState([]);
  const claculator = (arr, key) => {
    const total = arr?.reduce((acc, cur) => (acc += cur?.[key]), 0);
    return total;
  };
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const commonNoteFind = (noteNo) => {
    const { objRowList } = monthlyReturn;
    if (objRowList?.length > 0) {
      return objRowList?.find((data) => +data.noteNo === +noteNo);
    } else {
      return false;
    }
  };
  const getNote_24 = commonNoteFind(24);
  const getNote_25 = commonNoteFind(25);
  const getNote_26 = commonNoteFind(26);
  const getNote_27 = commonNoteFind(27);
  const getNote_28 = commonNoteFind(28);

  const note_24 = {
    noteNo: "note_24",
    value: 0,
    sd: 0,
    vat: getNote_24?.vat || gridData?.[0]?.vat,
  };
  const note_25 = {
    noteNo: "note_25",
    value: 0,
    sd: 0,
    vat: getNote_25?.vat || gridData?.[1]?.vat,
  };
  const note_26 = {
    noteNo: "note_26",
    value: 0,
    sd: 0,
    vat: getNote_26?.vat || gridData?.[2]?.vat,
  };
  const note_27 = {
    noteNo: "note_27",
    value: 0,
    sd: 0,
    vat: getNote_27?.vat || +gridData?.[3]?.vat || 0,
  };
  const note_28 = {
    noteNo: "note_28",
    value: 0,
    sd: 0,
    vat: getNote_28?.vat || claculator(gridData, "vat"),
  };

  allGridData[23] = note_24;
  allGridData[24] = note_25;
  allGridData[25] = note_26;
  allGridData[26] = note_27;
  allGridData[27] = note_28;

  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="4">Part-5: INCREASING ADJUSTMENTS (VAT)</th>
          </tr>
          <tr>
            <th>Adjustments Details</th>
            <th>Note</th>
            <th>VAT Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Due to VAT Deducted at Source by the Supply receiver
              </div>
            </td>
            <td>
              <div className="text-right pr-2">24</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_24?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  GetDetailsForNote24AndNote29_api(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    1,
                    setSingleAdjustmentTax,
                  );
                  setAdjustmentTaxModal24(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 2nd row */}
          <tr>
            <td>
              <div className="pl-2">
                Payment Not Made Through Banking Channel
              </div>
            </td>
            <td>
              <div className="text-right pr-2">25</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_25?.vat)}
              </div>
            </td>
          </tr>
          {/* 3rd row */}
          <tr>
            <td>
              <div className="pl-2">Issuance of Debit Note</div>
            </td>
            <td>
              <div className="text-right pr-2">26</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_26?.vat)}
              </div>
            </td>
            {/* <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getAdvanceTaxPaidDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    gridData[2]?.adjustmentTypeId,
                    setSingleAdjustmentTax
                  );
                  setAdjustmentTaxModal(true);
                }}
              >
                Sub Form
              </button>
            </td> */}
          </tr>
          {/* 4th row */}
          <tr>
            <td>
              <div className="pl-2">
                Any Other Adjustments (please specify below)
              </div>
            </td>
            <td rowSpan="2">
              <div className="text-right pr-2">27</div>
            </td>
            <td rowSpan="2">
              <div className="text-right pr-2">
                {commonNumberFormat(note_27?.vat)}
              </div>
            </td>
          </tr>
          {/* 5th row */}
          <tr>
            <td style={{ height: "18px" }}>
              <div className="pl-2">{gridData?.[3]?.notes || ""}</div>
            </td>
          </tr>
          {/* 6th row */}
          <tr>
            <td>
              <div className="pl-2">Total Increasing Adjustment</div>
            </td>
            <td>
              <div className="text-right pr-2">28</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_28?.vat)}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Adjustment Tax Modal */}
      <AdjustmentTaxDetailsModal24
        show={adjustmentTaxModal24}
        onHide={(e) => {
          setAdjustmentTaxModal24(false)
          setSingleAdjustmentTax([])
        }}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setAdjustmentTaxModal={setAdjustmentTaxModal24}
        parentValues={parentValues}
        setSingleOutputTax={setSingleAdjustmentTax}
        singleAdjustmentTax={singleAdjustmentTax}
      />
    </>
  );
}
