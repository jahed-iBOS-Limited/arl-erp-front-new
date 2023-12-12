import React from "react";
import { _dateFormatter, dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";

function SummarySheet({ gridData }) {
  let numVatAmount = 0,
    numVatPercentage = 0,
    numBasePrice = 0,
    numOrderQty = 0,
    numTotalValue = 0;

  console.log("gridData", gridData);
  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
          {gridData?.length >= 0 && (
            <table className="table table-striped table-bordered global-table table-font-size-sm">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>SL</th>
                  <th>Plant</th>
                  <th>Warehouse</th>
                  <th>Purchase Order Date</th>
                  <th>Item</th>
                  <th>UOM</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Cost/KG</th>
                  <th>Cost/Maunds</th>
                </tr>
              </thead>
              <tbody>
                {/* [
                {
                    "plantId": 17,
                    "plantName": "Akij House",
                    "warehouseId": 36,
                    "warehouseName": "ARL Corporate",
                    "purchaseOrderDate": "2023-05-02T00:00:00",
                    "itemId": 94990,
                    "itemName": "Mobile Bill",
                    "uomId": 130,
                    "uomName": "JOB",
                    "orderQuantity": 1,
                    "orderValue": 2863,
                    "costPerUom": 0,
                    "costPerMaunds": 0
                }] */}

                {gridData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item.plantName}</td>
                      <td className="text-left">{item?.warehouseName}</td>
                      <td className="text-center">{
                      _dateFormatter(item?.purchaseOrderDate)
                      }</td>
                      <td>{item.itemName}</td>
                      <td className="text-center">{item.uomName}</td>
                      <td className="text-right">
                        {item?.orderQuantity}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item.orderValue.toFixed(2))}
                      </td>
                      <td className="text-center">
                        {_formatMoney(item.costPerUom.toFixed(2))}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item.costPerMaunds.toFixed(2))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default SummarySheet;
