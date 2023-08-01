import React from "react";

export default function TableOne({ obj }) {
  const { printRef, rowDto } = obj;

  // variables for total
  let numTargetQuantityTotal = 0,
    QntOneDayTotal = 0,
    QntOneMonthTotal = 0,
    montsalesTotal = 0,
    monCollectionAmountTotal = 0,
    monTotalRevenueTargetTotal = 0,
    monSeventyPercentTRTtotal = 0,
    monCreditRealizationTotal = 0;

  return (
    <>
      <table
        id="table-to-xlsx"
        ref={printRef}
        className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm"
      >
        <thead>
          <tr>
            <th>SL</th>
            <th style={{ width: "230px" }}>Customer Name</th>
            <th>Region</th>
            <th>Area</th>
            <th style={{ width: "170px" }}>Territory</th>
            <th>Target Qty</th>
            <th>One Day Qty</th>
            <th>Monthly Qty</th>
            <th>Monthly Sales</th>
            <th>Monthly Achv</th>
            <th>Collection Amount</th>
            <th>TRT</th>
            <th>70% TRT</th>
            <th>Credit Realization</th>
          </tr>
        </thead>

        <tbody>
          {rowDto?.map((item, index) => {
            numTargetQuantityTotal += +item?.numTargetQuantity;
            QntOneDayTotal += +item?.QntOneDay;
            QntOneMonthTotal += +item?.QntOneMonth;
            montsalesTotal += +item?.montsales;
            monCollectionAmountTotal += +item?.monCollectionAmount;
            monTotalRevenueTargetTotal += +item?.monTotalRevenueTarget;
            monSeventyPercentTRTtotal += +item?.monSeventyPercentTRT;
            monCreditRealizationTotal += +item?.monCreditRealization;

            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{item?.strBusinessPartnerName}</td>
                <td className="text-start">{item?.nl5}</td>
                <td className="text-start">{item?.nl6}</td>
                <td className="text-start">{item?.nl7}</td>

                <td className="text-right">{item?.numTargetQuantity}</td>
                <td className="text-right">{item?.QntOneDay}</td>
                <td className="text-right">{item?.QntOneMonth}</td>
                <td className="text-right">{item?.montsales}</td>
                <td className="text-right">{item?.monAchv}%</td>
                <td className="text-right">{item?.monCollectionAmount}</td>
                <td className="text-right">{item?.monTotalRevenueTarget}</td>
                <td className="text-right">{item?.monSeventyPercentTRT}</td>
                <td className="text-right">{item?.monCreditRealization}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan="5" className="text-right">
              <b>Grand Total </b>
            </td>
            <td className="text-right">{numTargetQuantityTotal}</td>
            <td className="text-right">{QntOneDayTotal}</td>
            <td className="text-right">{QntOneMonthTotal}</td>
            <td className="text-right">{montsalesTotal}</td>
            <td className="text-right"></td>
            <td className="text-right">{monCollectionAmountTotal}</td>
            <td className="text-right">{monTotalRevenueTargetTotal}</td>
            <td className="text-right">{monSeventyPercentTRTtotal}</td>
            <td className="text-right">{monCreditRealizationTotal}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
