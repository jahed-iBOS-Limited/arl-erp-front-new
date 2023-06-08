import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getAdvanceTaxPaidDetails } from "../helper";
import AdjustmentTaxDetailsModal from "./../adjustmentTaxModal/adjustmentTaxModal";

export default function AddjustmentVatDecrementReport({
  gridData,
  parentValues,
}) {
  const [adjustmentTaxModal, setAdjustmentTaxModal] = useState(false);
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
              <div className="text-right pr-2">{gridData[0]?.vat}</div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getAdvanceTaxPaidDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    gridData[0]?.adjustmentTypeId,
                    setSingleAdjustmentTax
                  );
                  setAdjustmentTaxModal(true);
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
              <div className="text-right pr-2">{gridData[1]?.vat}</div>
            </td>
            <td>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  getAdvanceTaxPaidDetails(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    parentValues?.mushakDate,
                    gridData[1]?.adjustmentTypeId,
                    setSingleAdjustmentTax
                  );
                  setAdjustmentTaxModal(true);
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
              <div className="text-right pr-2">{gridData[2]?.vat}</div>
            </td>
            <td>
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
            </td>
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
              <div className="text-right pr-2"></div>
            </td>
          </tr>
          {/* 5th row */}
          <tr>
            <td style={{ height: "18px" }}>
              <div className="pl-2"></div>
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
                {claculator(gridData, "vat")}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Adjustment Tax Modal */}
      <AdjustmentTaxDetailsModal
        show={adjustmentTaxModal}
        onHide={(e) => setAdjustmentTaxModal(false)}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setAdjustmentTaxModal={setAdjustmentTaxModal}
        parentValues={parentValues}
        setSingleOutputTax={setSingleAdjustmentTax}
        singleAdjustmentTax={singleAdjustmentTax}
      />
    </>
  );
}
