import React from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

function ItemWise({ gridData }) {
  let numVatAmount = 0,
    numVatPercentage = 0,
    numBasePrice = 0,
    numOrderQty = 0,
    numTotalValue = 0;
  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
          {gridData?.length >= 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table table-font-size-sm">
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>SL</th>
                    <th>Purchase Order No</th>
                    <th>Partner Name</th>
                    <th>Purchase Order Date</th>
                    <th>Vat Amount</th>
                    <th>Vat Percentage</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.map((td, index) => {
                    numVatAmount += td?.numVatAmount || 0;
                    numVatPercentage += td?.numVatPercentage || 0;
                    numBasePrice += td?.numBasePrice || 0;
                    numOrderQty += td?.numOrderQty || 0;
                    numTotalValue += td?.numTotalValue || 0;
                    return (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">
                          {td?.strPurchaseOrderNo}
                        </td>
                        <td className="text-left">
                          {td?.strBusinessPartnerName}
                        </td>
                        <td className="text-center">
                          {_dateFormatter(td?.dtePurchaseOrderDate)}
                        </td>
                        <td className="text-right">
                          {_formatMoney(td?.numVatAmount.toFixed(2))}
                        </td>
                        <td className="text-right">
                          {_formatMoney(td?.numVatPercentage.toFixed(2))}
                        </td>
                        <td className="text-right">
                          {_formatMoney(td?.numBasePrice.toFixed(2))}
                        </td>
                        <td className="text-right">
                          {_formatMoney(td?.numOrderQty)}
                        </td>
                        <td className="text-right">
                          {_formatMoney(td?.numTotalValue.toFixed(2))}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="text-right" colspan="4">
                      Total
                    </td>
                    <td className="text-right">
                      {_formatMoney(numVatAmount.toFixed(2))}
                    </td>
                    <td className="text-right">
                      {_formatMoney(numVatPercentage.toFixed(2))}
                    </td>
                    <td className="text-right">
                      {_formatMoney(numBasePrice.toFixed(2))}
                    </td>
                    <td className="text-right">
                      {_formatMoney(numOrderQty.toFixed(2))}
                    </td>
                    <td className="text-right">
                      {_formatMoney(numTotalValue.toFixed(2))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ItemWise;
