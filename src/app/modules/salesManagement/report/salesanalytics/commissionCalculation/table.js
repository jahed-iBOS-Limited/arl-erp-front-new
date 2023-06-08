import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function CommissionCalculationTable({ obj }) {
  const { gridData, printRef } = obj;
  return (
    <div className="mt-4">
      <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
        <div className="sta-scrollable-table scroll-table-auto">
          <div
            style={{ maxHeight: "500px" }}
            className="scroll-table _table scroll-table-auto"
          >
            <table
              id="table-to-xlsx"
              ref={printRef}
              className="table table-striped table-bordered global-table table-font-size-sm"
            >
              <thead>
                <th>SL</th>
                <th>Partner Name</th>
                <th>Region</th>
                <th>Area</th>
                <th>Territory</th>
                <th>Factory Qty</th>
                <th>Ghat Qty</th>
                <th>Total Qty</th>
                <th>Factory Amount</th>
                <th>Ghat Amount</th>
                <th>Total Amount</th>
              </thead>
              <tbody>
                {gridData?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td >{item?.strBusinessPartnerName}</td>
                      <td >{item?.strRegion}</td>
                      <td >{item?.strArea}</td>
                      <td >{item?.strTerritory}</td>
                      <td className="text-right">{_fixedPoint(item?.numFactoryQuantity, true, 0)}</td>
                      <td className="text-right">{_fixedPoint(item?.numGhatQuantity, true, 0)}</td>
                      <td className="text-right">{_fixedPoint(item?.numTotalQuantity, true, 0)}</td>
                      <td className="text-right">{_fixedPoint(item?.numLiftingFactoryAmount, true)}</td>
                      <td className="text-right">{_fixedPoint(item?.numLiftingGhatAmount, true)}</td>
                      <td className="text-right">{_fixedPoint(item?.numTotalLiftingAmount, true)}</td>
                     
                    </tr>
                  );
                })}
                {gridData?.length > 0 && <tr style={{fontWeight: "bold"}}>
                  <td colSpan="5" className="text-right">
                    Total
                  </td>
                  <td className="text-right">
                    {_fixedPoint(gridData?.reduce((a, b) => a + b?.numFactoryQuantity, 0), true, 0)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(gridData?.reduce((a, b) => a + b?.numGhatQuantity, 0), true, 0)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(gridData?.reduce((a, b) => a + b?.numTotalQuantity, 0), true, 0)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(gridData?.reduce((a, b) => a + b?.numLiftingFactoryAmount, 0), true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(gridData?.reduce((a, b) => a + b?.numLiftingGhatAmount, 0), true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(gridData?.reduce((a, b) => a + b?.numTotalLiftingAmount, 0), true)}
                  </td>
                </tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommissionCalculationTable;
