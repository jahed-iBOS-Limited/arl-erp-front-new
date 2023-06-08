import React from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

function TableGirdTwo({ rowDto, values }) {
  let totalSalesQty = 0;
  let totalCoveragePercentage = 0;
  let totalSHop = 0;
  let SalesAmount = 0;
  let soldToShop = 0;
  return (
    <div className="react-bootstrap-table table-responsive">
      <table className={"table table-striped table-bordered global-table "}>
        <thead>
          <tr>
            <th>SL </th>
            <th>Partner Code </th>
            <th>Partner Name </th>
            <th>Partner Address </th>
            {[4, 5, 6].includes(values?.reportType?.value) && (
              <>
                <th>Ship To Partner Name </th>
                <th>Ship To Partner ID </th>
              </>
            )}
            <th>Region </th>
            <th>Area </th>
            <th>Territory </th>
            {[3].includes(values?.reportType?.value) && (
              <>
                <th>Coverage Percentage </th>
                <th>Total Shop </th>
                <th>Sold Ship to Partner </th>
              </>
            )}
            <th>Sales Quantity </th>
            <th>Sales Amount </th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((itm, idx) => {
            totalCoveragePercentage += itm?.coveragepercentage || 0;
            totalSHop += itm?.totalSHop || 0;
            SalesAmount += itm?.Salesamount || 0;
            soldToShop += itm?.soldshiptopartner || 0;
            totalSalesQty += itm?.numSalesQuantity || 0;
            return (
              <tr>
                <td>{idx + 1}</td>
                <td>{itm?.strBusinessPartnerCode}</td>
                <td>{itm?.strBusinessPartnerName}</td>
                <td>{itm?.strBusinessPartnerAddress}</td>
                {[4, 5, 6].includes(values?.reportType?.value) && (
                  <>
                    <td>{itm?.strshiptopartnername}</td>
                    <td>{itm?.intshiptopartnerid}</td>
                  </>
                )}
                <td>{itm?.nl5}</td>
                <td>{itm?.nl6}</td>
                <td>{itm?.nl7}</td>
                {[3].includes(values?.reportType?.value) && (
                  <>
                    {" "}
                    <td className="text-right">{itm?.coveragepercentage}</td>
                    <td className="text-right">{itm?.totalSHop}</td>
                    <td className="text-right">{itm?.soldshiptopartner}</td>
                  </>
                )}
                <td className="text-right">
                  {_fixedPoint(itm?.numSalesQuantity, true, 0)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.Salesamount, true, 0)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td
              className="text-right"
              colspan={[3].includes(values?.reportType?.value) ? 7 : 8}
            >
              <b>Total</b>
            </td>
            {[3].includes(values?.reportType?.value) && (
              <>
                {" "}
                <td className="text-right">
                  <b>{_formatMoney(totalCoveragePercentage, 0)}</b>
                </td>
                <td className="text-right">
                  <b>{_formatMoney(totalSHop, 0)}</b>
                </td>
                <td className="text-right">
                  <b>{_formatMoney(soldToShop, 0)}</b>{" "}
                </td>
                <td className="text-right">
                  <b>{_formatMoney(totalSalesQty, 0)}</b>{" "}
                </td>
              </>
            )}

            <td className="text-right">
              <b>{_fixedPoint(SalesAmount, true, 0)}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableGirdTwo;
