import React from "react";
import { _fixedPoint } from "../../../_helper/_fixedPoint";

export default function ItemVsWarehouse({ rowData }) {
  return (
    <div className="mt-5">
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table mt-0">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Item Name</th>
              {/* <th>MVessel Name</th> */}
              <th>Warehouse Name</th>
              <th>Open Qty</th>
              <th>Open Value</th>
              <th>In Qty</th>
              <th>In Value</th>
              <th>Out Qty</th>
              <th>Out Value</th>
              <th>Close Qty</th>
              <th>Rate</th>
              <th>Closing Value</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.length > 0 &&
              rowData?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.strG2GItemName}</td>
                    {/* <td>{item?.strMVesselName}</td> */}
                    <td>{item?.strWarehouseName}</td>
                    <td className="text-center">{_fixedPoint(item?.numOpenQty)}</td>
                    <td className="text-center">{_fixedPoint(item?.numOpenValue)}</td>
                    <td className="text-center">{_fixedPoint(item?.numInQty)}</td>
                    <td className="text-center">{_fixedPoint(item?.numInValue)}</td>
                    <td className="text-center">{_fixedPoint(item?.numOutQty)}</td>
                    <td className="text-center">{_fixedPoint(item?.numOutValue)}</td>
                    <td className="text-center">{_fixedPoint(item?.numCloseQty)}</td>
                    <td className="text-center">{_fixedPoint(item?.numRate)}</td>
                    <td className="text-center">{_fixedPoint(item?.numClosingValue)}</td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan={5}>
                <strong>Total</strong>
              </td>
              <td className="text-center">
                {_fixedPoint(rowData.reduce((acc, { numInQty }) => acc + numInQty || 0, 0))}
              </td>
              <td className="text-center"></td>
              <td className="text-center">
                {_fixedPoint(rowData.reduce(
                  (acc, { numOutQty }) => acc + numOutQty || 0,
                  0
                ))}
              </td>
              <td className="text-center"></td>
              <td className="text-center">
                {_fixedPoint(rowData.reduce(
                  (acc, { numCloseQty }) => acc + numCloseQty || 0,
                  0
                ))}
              </td>
              <td className="text-center"></td>
              <td className="text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
