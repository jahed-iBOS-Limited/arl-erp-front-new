import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const ths = [
  "Sl",
  "Party Name",
  "Bank Guarantee",
  "Actual Credit Limit",
  "BG vs Limit (%)",
  "Approved OD (30%)",
  "Used OD",
  "Out of 30% OD",
  "Debit",
  "Sales",
  "BG COMM/Bag",
  "Total BG Commission",
  "Remarks",
];

export default function TableOne({ obj }) {
  const { rowDto } = obj;

  let totalBG = 0;
  let totalActualCreditLimit = 0;
  let totalBGvsLimit = 0;
  let totalApprovedOD = 0;
  let totalUsedOD = 0;
  let totalOutOf30OD = 0;
  let totalDebit = 0;
  let totalSales = 0;
  // let totalBGComm = 0;
  let totalCommission = 0;
  return (
    <>
      <ICustomTable ths={ths} id="table-to-xlsx">
        {rowDto?.map((itm, index) => {
          totalBG += itm.BG;
          totalActualCreditLimit += itm.ActualCL;
          totalBGvsLimit += itm.BgVSL;
          totalApprovedOD += itm.ApprovedOD30;
          totalUsedOD += itm.UsedOD;
          totalOutOf30OD += itm.Outof30OD;
          totalDebit += itm.Debit;
          totalSales += itm.SalesBag;
          // totalBGComm += itm.BGCommissionBag;
          totalCommission += itm.TotalCommission;

          return (
            <>
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td> {itm?.CustomerName}</td>
                <td className="text-right"> {itm?.BG}</td>
                <td className="text-right">{itm?.ActualCL}</td>
                <td className="text-right">{itm?.BgVSL}</td>
                <td className="text-right">{itm?.ApprovedOD30}</td>
                <td className="text-right">{itm?.UsedOD}</td>
                <td className="text-right">{itm?.Outof30OD}</td>
                <td className="text-right">{itm?.Debit}</td>
                <td className="text-right">{itm?.SalesBag}</td>
                <td className="text-right">{itm?.BGCommissionBag}</td>
                <td className="text-right">{itm?.TotalCommission}</td>
                <td className="text-right">{itm?.Remarks}</td>
              </tr>
            </>
          );
        })}
        <tr style={{ fontWeight: "bold" }}>
          <td className="text-right" colSpan={2}>
            Total
          </td>
          <td className="text-right">{_fixedPoint(totalBG, true)}</td>
          <td className="text-right">
            {_fixedPoint(totalActualCreditLimit, true)}
          </td>
          <td className="text-right">{_fixedPoint(totalBGvsLimit, true)}</td>
          <td className="text-right">{_fixedPoint(totalApprovedOD, true)}</td>
          <td className="text-right">{_fixedPoint(totalUsedOD, true)}</td>
          <td className="text-right">{_fixedPoint(totalOutOf30OD, true)}</td>
          <td className="text-right">{_fixedPoint(totalDebit, true)}</td>
          <td className="text-right">{_fixedPoint(totalSales, true)}</td>
          <td className="text-right"></td>
          <td className="text-right">{_fixedPoint(totalCommission, true)}</td>
          <td></td>
        </tr>
      </ICustomTable>
    </>
  );
}
