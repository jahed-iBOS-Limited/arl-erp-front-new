/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export const NetToCompanyTable = ({ rowData }) => {
  return (
    <div
      style={{ maxHeight: "500px" }}
      className="scroll-table _table scroll-table-auto"
    >
      {rowData?.length > 0 && (
        <table
          id="table-to-xlsx"
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr>
              <th>SL</th>
              <th>Region</th>
              <th>Area</th>
              <th>Territory</th>
              <th>Partner Name</th>
              <th>Partner Code</th>
              <th>Exclusive Type</th>
              <th>Credit Facility Type</th>
              <th>OPC Qty</th>
              <th>PCC Qty</th>
              <th>Total</th>
              <th>Factory Quantity</th>
              <th>Ghat Quantity</th>
              <th>Total Quantity</th>
              <th>Factory Criteria Quantity</th>
              <th>Ghat Criteria Quantity</th>
              <th>Landing Price OPC</th>
              <th>Landing Price PCC</th>
              <th>Lifting Factory Amount</th>
              <th>Lifting Ghat Amount</th>
              <th>Total Lifting Amount</th>
              <th>Target Quantity</th>
              <th>Achievement</th>
              <th>Cash Rate</th>
              <th>Party Status</th>
              <th>Factory Transport Cost</th>
              <th>Ghat Transport Cost</th>
              <th>Factory Transport Cost Rate</th>
              <th>Ghat Transport Cost Rate</th>
              <th>Avg Ghat Transfer Rate</th>
              <th>Partner Type</th>
              <th>Ledger Balance</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Opening</th>
              <th>Lifting Incentive Rate</th>
              <th>Hundred Percent Ahv Rate</th>
              <th>Lifting Incentive Amount</th>
              <th>Hundred Percent Ahv Amount</th>
              <th>Column1</th>
              <th>Sales Ach Rate</th>
              <th>Sales Commission</th>
              <th>Cash Commission</th>
              <th>Yearly Commission Rate</th>
              <th>Yearly Commission Amount</th>
              <th>Exclusive Retail Rate</th>
              <th>Exclusive Retail Amount</th>
              <th>BG</th>
              <th>Actual CL</th>
              <th>BG vs Sale</th>
              <th>BG Commission Amount</th>
              <th>Total Commission</th>
              <th>Per Bag Commission</th>
              <th>Factory Transport Cost with Commission</th>
              <th>Ghat Transport Cost with Commission</th>
              <th>Transport and Commission Avg</th>
              <th>Net to Company</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, i) => {
              return (
                <tr key={i}>
                  <td className="text-center">{i + 1}</td>
                  <td>{item?.strRegion}</td>
                  <td>{item?.strArea}</td>
                  <td>{item?.strTerritory}</td>
                  <td>{item?.strBusinessPartnerName}</td>
                  <td>{item?.strBusinessPartnerCode}</td>
                  <td>{item?.strExclusiveType}</td>
                  <td>{item?.strCreditFacilytype}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.numTotalOPCQNT, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numTotalPCCQNT, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numTotalQuantity, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numFactoryQuantity, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numGhatQuantity, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numTotalQuantity, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numFactoryCriteriaQuantity, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numGhatCriteriaQuantity, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numLandingPriceOPC, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numLandingPricePCC, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numLiftingFactoryAmount, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numLiftingGhatAmount, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numTotalLiftingAmount, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.dectargetqnt, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.acheivement, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.deccashrate, true)}
                  </td>
                  <td>{item?.strPartyStatus}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.numFactoryTransportCost, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numGhatTransportCost, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numFactoryTransportCostRate, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numGhatTransportCostRate, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.AvgGhatTransferRate, true)}
                  </td>
                  <td>{item?.PartnerType}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.numLedgerBalance, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numDebit, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numCredit, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numOppening, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.liftingincentiverate, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.hundredpercentAhvRate, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.liftingincentiveAmount, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.hundredpercentAhvAmount, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.Column1, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numSalesAchRate, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numSalesCommision, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numCashCommission, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numYearlyComRate, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numYearlyComAmount, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numExclusiveRetailRate, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numExclusiveRetailAmount, true)}
                  </td>
                  <td className="text-right">{_fixedPoint(item?.BG, true)}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.ActualCL, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.BgVsSale, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.BgCommissionAmount, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numTotalCommission, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.numPerbagCommission, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.FactTransPortCostWithCommission, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.GhatTransPortCostWithCommission, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.transportandcommissonavg, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.NettoCompany, true)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const RetailAndDistributorAchievementTable = ({ rowData, values }) => {
  const tHeader_1 = [
    "SL",
    "Enroll",
    "Employee Name",
    "Designation",
    "Target Qty",
    "Increase Qty",
    "Achievement",
  ];

  const commonHeaders = [
    "SL",
    "Employee Name",
    "Region",
    "Area",
    "Territory",
    "Target Qty",
  ];

  const tHeader_2 = ["Zone","Delivery Qty", "Monthly Sales", "Monthly Achievement"];
  const tHeader_3 = [
    "Collection Amount",
    "Total Revenue Target",
    "Revenue Target 70 Percent",
  ];
  const tHeader_4 = [
    "Delivery Qty",
    "Monthly Sales",
    "Revenue Target 70 Percent",
    "Allow BG",
    "Mortgage Amount",
    "Actual CL",
    "Mortgage Vs Sales",
  ];

  const headers =
    values?.reportType?.value === 1
      ? tHeader_1
      : values?.reportType?.value === 2
      ? [...commonHeaders, ...tHeader_2]
      : values?.reportType?.value === 3
      ? [...commonHeaders, ...tHeader_3]
      : values?.reportType?.value === 4
      ? [...commonHeaders, ...tHeader_4]
      : [];

  const getRows = (row, index) => {
    return values?.reportType?.value === 1 ? (
      <tr key={index}>
        <td className="text-center" style={{ width: "40px" }}>
          {index + 1}
        </td>
        <td>{row?.enroll}</td>
        <td>{row?.strEmployeeFullName}</td>
        <td>{row?.strDesignationName}</td>
        <td className="text-right">{_fixedPoint(row?.targetQty, true, 0)}</td>
        <td className="text-right">{_fixedPoint(row?.inCreaseQty, true, 0)}</td>
        <td className="text-right">{_fixedPoint(row?.achievement, true, 0)}</td>
      </tr>
    ) : (
      <tr key={index}>
        <td className="text-center" style={{ width: "40px" }}>
          {index + 1}
        </td>
        <td>{row?.strEmployeeName}</td>
        <td>{row?.nl5}</td>
        <td>{row?.nl6}</td>
        <td>{row?.nl7}</td>
        <td className="text-right">
          {_fixedPoint(row?.numTargetQuantity, true, 0)}
        </td>
        {[2]?.includes(values?.reportType?.value) ? (<td>{row?.nl8}</td>) : null}
        {[2, 4]?.includes(values?.reportType?.value) && (
          <td className="text-right">
            {_fixedPoint(row?.QntOneMonth, true, 0)}
          </td>
        )}
        {[2]?.includes(values?.reportType?.value) && (
          <>
            <td className="text-right">
              {_fixedPoint(row?.montsales, true, 0)}
            </td>
            <td className="text-right">{_fixedPoint(row?.monAchv, true)}</td>
          </>
        )}
        {[3]?.includes(values?.reportType?.value) && (
          <>
            <td className="text-right">
              {_fixedPoint(row?.monCollectionAmount, true, 0)}
            </td>
            <td className="text-right">
              {_fixedPoint(row?.TotalvRevenueTarget, true, 0)}
            </td>
            <td className="text-right">
              {_fixedPoint(row?.RevenueTarget70Percent, true, 0)}
            </td>
          </>
        )}
        {[4]?.includes(values?.reportType?.value) && (
          <>
            <td className="text-right">
              {_fixedPoint(row?.montsales, true, 0)}
            </td>
            <td className="text-right">
              {_fixedPoint(row?.RevenueTarget70Percent, true, 0)}
            </td>
            <td className="text-right">{_fixedPoint(row?.allowbg, true, 0)}</td>
            <td className="text-right">
              {_fixedPoint(row?.decMortgageAmount, true, 0)}
            </td>
            <td className="text-right">
              {_fixedPoint(row?.decActualCL, true, 0)}
            </td>
            <td className="text-right">
              {_fixedPoint(row?.MortgageVsSales, true)}
            </td>
          </>
        )}
      </tr>
    );
  };

  const getTotal = (key) => {
    return rowData?.reduce((acc, curr) => acc + curr?.[key], 0);
  };

  const getTotalRow = () => {
    return values?.reportType?.value === 1 ? (
      <tr style={{ textAlign: "right", fontWeight: "bold" }}>
        <td colSpan={4}>Total</td>
        <td>{_fixedPoint(getTotal("targetQty"), true, 0)}</td>
        <td>{_fixedPoint(getTotal("inCreaseQty"), true, 0)}</td>
        <td>{_fixedPoint(getTotal("achievement"), true, 0)}</td>
      </tr>
    ) : (
      <tr style={{ textAlign: "right", fontWeight: "bold" }}>
        <td colSpan={5}>Total</td>
        <td>{_fixedPoint(getTotal("numTargetQuantity"), true, 0)}</td>

        {[2, 4]?.includes(values?.reportType?.value) && (
          <td>{_fixedPoint(getTotal("QntOneMonth"), true, 0)}</td>
        )}
        {[2]?.includes(values?.reportType?.value) && (
          <>
            <td>{_fixedPoint(getTotal("montsales"), true, 0)}</td>
            <td>{_fixedPoint(getTotal("monAchv"), true, 0)}</td>
          </>
        )}
        {[3]?.includes(values?.reportType?.value) && (
          <>
            <td>{_fixedPoint(getTotal("monCollectionAmount"), true, 0)}</td>
            <td>{_fixedPoint(getTotal("TotalvRevenueTarget"), true, 0)}</td>
            <td>{_fixedPoint(getTotal("RevenueTarget70Percent"), true, 0)}</td>
          </>
        )}
        {[4]?.includes(values?.reportType?.value) && (
          <>
            <td>{_fixedPoint(getTotal("montsales"), true, 0)}</td>
            <td>{_fixedPoint(getTotal("RevenueTarget70Percent"), true, 0)}</td>
            <td>{_fixedPoint(getTotal("allowbg"), true, 0)}</td>
            <td>{_fixedPoint(getTotal("decMortgageAmount"), true, 0)}</td>
            <td>{_fixedPoint(getTotal("decActualCL"), true, 0)}</td>
            <td>{_fixedPoint(getTotal("MortgageVsSales"), true, 0)}</td>
          </>
        )}
      </tr>
    );
  };

  return (
    <>
      <form className="form form-label-right">
        {rowData?.length > 0 && (
          <table
            id="table-to-xlsx"
            className={
              "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
            }
          >
            <thead>
              <tr>
                {headers?.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            {rowData?.map((row, index) => getRows(row, index))}
            {getTotalRow()}
          </table>
        )}
      </form>
    </>
  );
};

export default RetailAndDistributorAchievementTable;
