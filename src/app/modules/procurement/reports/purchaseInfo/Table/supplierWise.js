import React from "react";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

function SupplierWise({ gridData }) {
  let numReceiveQty = 0,
    numTotalQty = 0,
    numTotalAmount = 0;
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
                  <th>Purchase Order Date</th>
                  <th>Purchase Organization</th>
                  <th>Payment Terms Name</th>
                  <th>Other Terms</th>
                  <th>Receive Qty</th>
                  <th>Total Qty</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.map((td, index) => {
                  numReceiveQty += td?.numReceiveQty || 0;
                  numTotalQty += td?.numTotalQty || 0;
                  numTotalAmount += td?.numTotalAmount || 0;

                  return (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{td?.strPurchaseOrderNo}</td>
                      <td className="text-center">
                        {_dateFormatter(td?.dtePurchaseOrderDate)}
                      </td>
                      <td className="text-left">
                        {td?.strPurchaseOrganization}
                      </td>
                      <td className="text-left">{td?.strPaymentTermsName}</td>
                      <td className="text-left">{td?.strOtherTerms}</td>
                      <td className="text-right">
                        {_fixedPoint(td?.numReceiveQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(td?.numTotalQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(td?.numTotalAmount)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="text-center" colspan="6">
                    Total
                  </td>

                  <td className="text-right">{_fixedPoint(numReceiveQty)}</td>
                  <td className="text-right">{_fixedPoint(numTotalQty)}</td>
                  <td className="text-right">{_fixedPoint(numTotalAmount)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default SupplierWise;
