import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { GetDetailsForNote30_api } from "../helper";
import AdjustmentTaxDetailsModal30 from "./../adjustmentTaxModal/adjustmentTaxModal30";
import AdjustmentTaxDetailsModal29 from "./../adjustmentTaxModal/adjustmentTaxModal29";
import { GetDetailsForNote24AndNote29_api } from "./../helper";

export default function AddjustmentVatDecrementReport({
  gridData,
  parentValues,
  commonNumberFormat,
  allGridData,
  monthlyReturn,
}) {
  const [adjustmentTaxModal30, setAdjustmentTaxModal30] = useState(false);
  const [adjustmentTaxModal29, setAdjustmentTaxModal29] = useState(false);
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
  const getNote_29 = commonNoteFind(29);
  const getNote_30 = commonNoteFind(30);
  const getNote_31 = commonNoteFind(31);
  const getNote_32 = commonNoteFind(32);
  const getNote_33 = commonNoteFind(33);

  const note_29 = {
    noteNo: "note_29",
    value: 0,
    sd: 0,
    vat: getNote_29?.vat || gridData?.[0]?.vat,
  };

  const note_30 = {
    noteNo: "note_30",
    value: 0,
    sd: 0,
    vat: getNote_30?.vat || gridData?.[1]?.vat,
  };

  const note_31 = {
    noteNo: "note_31",
    value: 0,
    sd: 0,
    vat: getNote_31?.vat || gridData?.[2]?.vat,
  };
  const note_32 = {
    noteNo: "note_32",
    value: 0,
    sd: 0,
    vat: getNote_32?.vat || gridData?.[3]?.vat || 0,
  };
  const note_33 = {
    noteNo: "note_33",
    value: 0,
    sd: 0,
    vat: getNote_33?.vat || claculator(gridData, "vat"),
  };

  allGridData[28] = note_29;
  allGridData[29] = note_30;
  allGridData[30] = note_31;
  allGridData[31] = note_32;
  allGridData[32] = note_33;

  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="6">Part - 6: DECREASING ADJUSTMENTS (VAT)</th>
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
                Due to VAT Deducted at Source from the Suppliers delivered
              </div>
            </td>
            <td>
              <div className="text-right pr-2">29</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_29?.vat)}
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
                    2,
                    setSingleAdjustmentTax
                  );
                  setAdjustmentTaxModal29(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 2nd row */}
          <tr>
            <td>
              <div className="pl-2">Advance Tax Paid at Import Stage</div>
            </td>
            <td>
              <div className="text-right pr-2">30</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_30?.vat)}
              </div>
            </td>
            <td className="printSectionNone">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  GetDetailsForNote30_api(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    setSingleAdjustmentTax
                  );
                  setAdjustmentTaxModal30(true);
                }}
              >
                Sub Form
              </button>
            </td>
          </tr>
          {/* 3rd row */}
          <tr>
            <td>
              <div className="pl-2">Issuance of Credit Note</div>
            </td>
            <td>
              <div className="text-right pr-2">31</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_31?.vat)}
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
              <div className="text-right pr-2">32</div>
            </td>
            <td rowSpan="2">
              <div className="text-right pr-2">
                {commonNumberFormat(note_32?.vat)}
              </div>
            </td>
          </tr>
          {/* 5th row */}
          <tr>
            <td style={{ height: "18px" }}>
              <div className="pl-2">{gridData?.[3]?.notes}</div>
            </td>
          </tr>
          {/* 9th row */}
          <tr>
            <td>
              <div className="pl-2">Total Decreasing Adjustment</div>
            </td>
            <td>
              <div className="text-right pr-2">33</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_33?.vat)}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Adjustment Tax Modal */}
      <AdjustmentTaxDetailsModal30
        show={adjustmentTaxModal30}
        onHide={(e) => {
          setAdjustmentTaxModal30(false);
          setSingleAdjustmentTax([]);
        }}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setAdjustmentTaxModal={setAdjustmentTaxModal30}
        parentValues={parentValues}
        setSingleOutputTax={setSingleAdjustmentTax}
        singleAdjustmentTax={singleAdjustmentTax}
 
      />
      <AdjustmentTaxDetailsModal29
        show={adjustmentTaxModal29}
        onHide={(e) => {
          setAdjustmentTaxModal29(false);
          setSingleAdjustmentTax([]);
        }}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setAdjustmentTaxModal={setAdjustmentTaxModal29}
        parentValues={parentValues}
        setSingleOutputTax={setSingleAdjustmentTax}
        singleAdjustmentTax={singleAdjustmentTax}
      />
    </>
  );
}
