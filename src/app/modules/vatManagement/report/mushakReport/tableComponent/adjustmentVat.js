import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AdjustmentTaxDetailsModal from "../adjustmentTaxModal/adjustmentTaxModal";
import { getAdvanceTaxPaidDetails } from "../helper";

export default function AddjustmentVatReport({ gridData, parentValues }) {
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
                Due toVAT Deducted at Source by the Supply receiver
              </div>
            </td>
            <td>
              <div className="text-right pr-2">24</div>
            </td>
            <td>
              <div className="text-right pr-2">{gridData[0]?.vat?.toFixed(2)}</div>
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
              <div className="pl-2">
                Payment Not Made Through Banking Channel
              </div>
            </td>
            <td>
              <div className="text-right pr-2">25</div>
            </td>
            <td>
              <div className="text-right pr-2">{gridData[1]?.vat}</div>
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
              <div className="text-right pr-2">27</div>
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
                {claculator(gridData, "vat").toFixed(2)}
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
