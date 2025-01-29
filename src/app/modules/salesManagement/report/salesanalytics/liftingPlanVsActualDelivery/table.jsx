import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

function LiftingPlanVsActualDeliveryTable({ obj }) {
  const { gridData, printRef, values } = obj;
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
                <th>Year</th>
                <th>Month</th>
                <th>Date</th>
                <th>Region</th>
                <th>Area</th>
                <th>Territory</th>
                <th>Item ID</th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Target</th>
                <th>Target ADS</th>
                <th>Total Sales</th>
                {/* <th>Business Unit</th> */}
              </thead>
              <tbody>
                {gridData?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="">{values?.year?.label}</td>
                      <td className="">{values?.month?.label}</td>
                      <td className="">{_dateFormatter(item?.dtedate)}</td>
                      <td className="">{item?.Region}</td>
                      <td className="">{item?.Area}</td>
                      <td className="">{item?.TerritoryName }</td>
                      <td className="">{item?.ItemID ||item?.ItemId}</td>
                      <td className="">{item?.ItemName}</td>
                      <td className="">{item?.ItemCode}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.Target)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.TargetADS)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.TotalSales)}
                      </td>
                      {/* <td className="">{item?.BusinessUnit}</td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiftingPlanVsActualDeliveryTable;
