import React from "react";
import numberWithCommas from "../../_helper/_numberWithCommas";
export default function ProjectedPlannedAssetSchedule({ rowData }) {
  let numOpeningTotal = 0;
  let numAdditionTotal = 0;
  let numAdjustmentTotal = 0;
  let numClosingTotal = 0;
  let numOpeningAccDepTotal = 0;
  let numChargedDurAccDepTotal = 0;
  let numClosingAccDepTotal = 0;
  let numNetAssetTotal = 0;

  for (let i = 0; i < rowData.length; i++) {
    numOpeningTotal = numOpeningTotal + rowData[i]?.numOpening || 0;
    numAdditionTotal = numAdditionTotal + rowData[i]?.numAddition || 0;
    numAdjustmentTotal = numAdjustmentTotal + rowData[i]?.numAdjustment || 0;
    numClosingTotal = numClosingTotal + rowData[i]?.numClosing || 0;
    numOpeningAccDepTotal =
      numOpeningAccDepTotal + rowData[i]?.numOpeningAccDep || 0;
    numChargedDurAccDepTotal =
      numChargedDurAccDepTotal + rowData[i]?.numChargedDurAccDep || 0;
    numClosingAccDepTotal =
      numClosingAccDepTotal + rowData[i]?.numClosingAccDep || 0;
    numNetAssetTotal = numNetAssetTotal + rowData[i]?.numNetAsset || 0;
  }
  return (
    <>
      {rowData?.length > 0 ? (
        <div className="row">
          <div>
            <h4 className="mt-5 ml-5">
              <strong> Fixed Asset Planning</strong>
            </h4>
          </div>
          <div className="col-lg-12">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Asse Name</th>
                  <th>Opening</th>
                  <th>Addition</th>
                  <th>Adjustment</th>
                  <th>Closing</th>
                  <th>Opening Acc. Dep.</th>
                  <th>Charge During The Period</th>
                  <th>Closing Acc. Dep.</th>
                  <th>Net Asset Value</th>
                </tr>
              </thead>
              <tbody>
                {rowData?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{item?.strGLCode}</td>
                    <td>{item?.strGlName}</td>
                    <td className="text-center">
                      {numberWithCommas(Math.round(item?.numOpening) || 0)}
                    </td>
                    <td className="text-center">
                      {numberWithCommas(Math.round(item?.numAddition) || 0)}
                    </td>
                    <td className="text-center">
                      {numberWithCommas(Math.round(item?.numAdjustment) || 0)}
                    </td>
                    <td className="text-center">
                      {numberWithCommas(Math.round(item?.numClosing) || 0)}
                    </td>
                    <td className="text-center">
                      {numberWithCommas(
                        Math.round(item?.numOpeningAccDep) || 0
                      )}
                    </td>
                    <td className="text-center">
                      {numberWithCommas(
                        Math.round(item?.numChargedDurAccDep) || 0
                      )}
                    </td>
                    <td className="text-center">
                      {numberWithCommas(
                        Math.round(item?.numClosingAccDep) || 0
                      )}
                    </td>
                    <td className="text-center">
                      {numberWithCommas(Math.round(item?.numNetAsset) || 0)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} className="text-center">
                    <strong> Total</strong>
                  </td>
                  <td className="text-center">
                    {numberWithCommas(Math.round(numOpeningTotal) || 0)}
                  </td>
                  <td className="text-center">
                    {numberWithCommas(Math.round(numAdditionTotal) || 0)}
                  </td>
                  <td className="text-center">
                    {numberWithCommas(Math.round(numAdjustmentTotal) || 0)}
                  </td>
                  <td className="text-center">
                    {numberWithCommas(Math.round(numClosingTotal) || 0)}
                  </td>
                  <td className="text-center">
                    {numberWithCommas(Math.round(numOpeningAccDepTotal) || 0)}
                  </td>
                  <td className="text-center">
                    {numberWithCommas(
                      Math.round(numChargedDurAccDepTotal) || 0
                    )}
                  </td>
                  <td className="text-center">
                    {numberWithCommas(Math.round(numClosingAccDepTotal) || 0)}
                  </td>
                  <td className="text-center">
                    {numberWithCommas(Math.round(numNetAssetTotal) || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
}
