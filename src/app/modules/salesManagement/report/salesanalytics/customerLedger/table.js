import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function CustomerLedgerTable({ obj }) {
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
                <th>Customer ID</th>
                <th>Customer Code</th>
                <th>Customer Name</th>
                <th>Customer Address</th>
                <th>Credit Facility Type</th>
                <th>Collection Days</th>
                <th>Credit Limit</th>
                <th>Day Limit</th>
                <th>Ledger Balance</th>
                <th>Received</th>
                <th>Sales</th>
                <th>Unbilled Amount</th>
                <th>Is Exclusive</th>
              </thead>
              <tbody>
                {gridData?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="">{values?.year?.label}</td>
                      <td className="">{values?.month?.label}</td>
                      <td className="">{item?.CustomerId}</td>
                      <td className="">{item?.CustomerCode}</td>
                      <td className="">{item?.CustomerName}</td>
                      <td className="">{item?.CustomerAddress}</td>
                      <td className="">{item?.CreditFacilityType}</td>
                      <td className="text-right">{item?.CollectionDays}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.CreditLimit)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.DayLimit)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.LedgerBalance)}
                      </td>

                      <td className="text-right">
                        {_fixedPoint(item?.Received)}
                      </td>
                      <td className="text-right">{_fixedPoint(item?.Sales)}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.UnbilledAmount)}
                      </td>
                      <td className="">
                        {item?.isExclusive}
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

export default CustomerLedgerTable;
