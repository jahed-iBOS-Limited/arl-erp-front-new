import React from "react";

function BongTradersTable({ deliveryOrderReportData, totalQuantity }) {
  return (
    <>
      <div className="my-8">
        {deliveryOrderReportData?.rows?.length >= 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered  global-table">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th>PRODUCT DESCRIPTION</th>
                  <th>UOM</th>
                  <th>QNT.(TON)</th>
                  <th>QNT.(BAG)</th>
                </tr>
              </thead>
              <tbody>
                {deliveryOrderReportData?.rows?.map((td, index) => {
                  return (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td>
                        <div className="text-left pr-2">
                          {td.prodcuctDescription}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{td.uom}</div>
                      </td>
                      <td>
                        <div className="text-right pl-2">{td.quantity}</div>
                      </td>
                      <td>
                        <div className="text-right pl-2">
                          {td.quantity * 20}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">
                    <b>TOTAL</b>
                  </td>
                  <td className="text-right">
                    <b>{totalQuantity}</b>
                  </td>
                  <td className="text-right">
                    <b>{totalQuantity * 20}</b>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default BongTradersTable;
