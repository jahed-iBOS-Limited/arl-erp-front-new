import React from "react";
export default function PlannedAssetSchedule({ rowData }) {
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
          <div className="table-responsive">
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
                    <td className="text-center">{item?.numOpening}</td>
                    <td className="text-center">{item?.numAddition}</td>
                    <td className="text-center">{item?.numAdjustment}</td>
                    <td className="text-center">{item?.numClosing}</td>
                    <td className="text-center">{item?.numOpeningAccDep}</td>
                    <td className="text-center">{item?.numChargedDurAccDep}</td>
                    <td className="text-center">{item?.numClosingAccDep}</td>
                    <td className="text-center">{item?.numNetAsset}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} className="text-center">
                    <strong> Total</strong>
                  </td>
                  <td className="text-center">{numOpeningTotal}</td>
                  <td className="text-center">{numAdditionTotal}</td>
                  <td className="text-center">{numAdjustmentTotal}</td>
                  <td className="text-center">{numClosingTotal}</td>
                  <td className="text-center">{numOpeningAccDepTotal}</td>
                  <td className="text-center">{numChargedDurAccDepTotal}</td>
                  <td className="text-center">{numClosingAccDepTotal}</td>
                  <td className="text-center">{numNetAssetTotal}</td>
                </tr>
              </tbody>
            </table>
</div>
          
          </div>
        </div>
      ) : null}
    </>
  );
}
