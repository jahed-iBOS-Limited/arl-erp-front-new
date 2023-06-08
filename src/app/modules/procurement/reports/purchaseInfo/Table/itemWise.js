import React from "react";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

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
                      <td className="text-center">{td?.strPurchaseOrderNo}</td>
                      <td className="text-left">
                        {td?.strBusinessPartnerName}
                      </td>
                      <td className="text-center">
                        {_dateFormatter(td?.dtePurchaseOrderDate)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(td?.numVatAmount)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(td?.numVatPercentage)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(td?.numBasePrice)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(td?.numOrderQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(td?.numTotalValue)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="text-right" colspan="4">
                    Total
                  </td>
                  <td className="text-right">{_fixedPoint(numVatAmount)}</td>
                  <td className="text-right">
                    {_fixedPoint(numVatPercentage)}
                  </td>
                  <td className="text-right">{_fixedPoint(numBasePrice)}</td>
                  <td className="text-right">{_fixedPoint(numOrderQty)}</td>
                  <td className="text-right">{_fixedPoint(numTotalValue)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default ItemWise;
