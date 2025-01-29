import React from "react";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const COGSTable = ({ journalData, landingValues, isDayBased }) => {
  return (
    <>
      <div className="table-responsive">
        <table
          id={"cogs"}
          className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5"
        >
          <thead className="bg-secondary">
            <tr>
              <th className="positionSticky">SL</th>
              {isDayBased === 1 && <th>Transaction Date</th>}
              <th>General Ledger Name</th>
              <th>Warehouse Name</th>
              <th>Item Code</th>
              <th>Item Name</th>
              {landingValues?.transactionType?.value === 1 && (
                <th>Profit Center</th>
              )}
              <th>Quantity</th>
              {landingValues?.transactionType?.value === 1 ? (
                <th>Avg. COGS</th>
              ) : (
                <th>Rate</th>
              )}

              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <>
              {journalData?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center positionSticky">{index + 1}</td>
                  {isDayBased === 1 && (
                    <td>
                      {item?.dteTransactionDate
                        ? _dateFormatter(item?.dteTransactionDate)
                        : ""}
                    </td>
                  )}
                  <td className="text-center">{item?.strGeneralLedgerName}</td>
                  <td className="text-center">{item?.strWarehouseName}</td>
                  <td className="text-center">{item?.strItemCode}</td>
                  <td>{item?.strItemName}</td>
                  {landingValues?.transactionType?.value === 1 && (
                    <td>{item?.strProfitCenterName}</td>
                  )}

                  <td className="text-right">{item?.numQty}</td>
                  {landingValues?.transactionType?.value === 1 ? (
                    <td className="text-right">
                      {item?.numAvgCOGS.toFixed(2)}
                    </td>
                  ) : (
                    <td className="text-right">{item?.numRate.toFixed(2)}</td>
                  )}

                  <td className="text-right">{item?.numValue.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={
                    landingValues?.transactionType?.value === 1 ||
                    isDayBased === 1
                      ? "6"
                      : "5"
                  }
                  className="text-right font-weight-bold"
                >
                  Total
                </td>
                <td className="text-right font-weight-bold">
                  {numberWithCommas(
                    journalData
                      ?.reduce((acc, item) => acc + item.numQty, 0)
                      .toFixed(2)
                  )}
                </td>
                <td></td>
                <td className="text-right font-weight-bold">
                  {numberWithCommas(
                    journalData
                      ?.reduce((acc, item) => acc + item.numValue, 0)
                      .toFixed(2)
                  )}
                </td>
              </tr>
            </>
          </tbody>
        </table>
      </div>
    </>
  );
};
export default COGSTable;
