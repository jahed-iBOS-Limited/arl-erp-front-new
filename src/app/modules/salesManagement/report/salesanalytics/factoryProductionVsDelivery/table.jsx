import React from "react";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

function FactoryProductionVsDeliveryTable({ obj }) {
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
                <th>Item Id</th>
                <th>Item Name</th>
                <th>Sub Category Name</th>
                <th>UOM Name</th>
                <th>Production Qty </th>
                <th>Production Cumulative</th>
                <th>Order Qty</th>
                <th>Order Cumulative</th>
                <th>Delivery Truck Qty</th>
                <th>Delivery River Qty</th>
                <th>Delivery Total</th>
                <th>Delivery Cumulative</th>
                <th>Transfer Truck Qty</th>
                <th>Transfer River Qty</th>
                <th>Transfer Total</th>
                <th>Transfer Cumulative</th>
              </thead>
              <tbody>
                {gridData?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="">{values?.year?.label}</td>
                      <td className="">{values?.month?.label}</td>
                      <td className="">{_dateFormatter(item?.dtedate)}</td>
                      <td className="">{item?.ItemId}</td>
                      <td className="">{item?.ItemName}</td>
                      <td className="">{item?.ItemSubCategoryName}</td>
                      <td className="">{item?.UOMName}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.ProductionQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.ProductionCumulitave)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.OrderQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.OrderCumulative)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.DeliveryTruckQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.DeliveryRiverQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.DeliveryTotal)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.DeliveryCumulative)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.TransferTruckqty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.TransferRiverqty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.TransferTotal)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.transferCumulative)}
                      </td>
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

export default FactoryProductionVsDeliveryTable;
