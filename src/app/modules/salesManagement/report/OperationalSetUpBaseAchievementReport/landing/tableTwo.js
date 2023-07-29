import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function TableTwo({ obj }) {
  const { rowDto, printRef, values } = obj;

  let numTargetQuantityTotal = 0,
    QntOneDayTotal = 0,
    QntOneMonthTotal = 0,
    montsalesTotal = 0,
    monCollectionAmountTotal = 0,
    monTotalRevenueTargetTotal = 0,
    monSeventyPercentTRTtotal = 0;

  return (
    <>
      <table
        id="table-to-xlsx"
        ref={printRef}
        className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm"
      >
        <thead>
          <tr>
            <th style={{ width: "30px" }}>SL</th>
            {[2].includes(values?.reportType?.value) ? (
              <th style={{ width: "140px" }}>Territory</th>
            ) : null}
            <th style={{ width: "80px" }}>Employee</th>
            <th style={{ width: "60px" }}>Target Qty</th>
            <th style={{ width: "80px" }}>One Day Qty</th>
            <th style={{ width: "80px" }}>Monthly Qty</th>
            <th style={{ width: "80px" }}>Revenue (TK.)</th>
            <th style={{ width: "80px" }}>Monthly Achievement</th>
            <th style={{ width: "80px" }}>Monthly Collection Amount (TK.)</th>
            <th style={{ width: "80px" }}>Total Revenue Target (TK.)</th>
            <th style={{ width: "80px" }}>95% TRT (TK.)</th>
            <th style={{ width: "80px" }}>Credit Realization</th>
            <th style={{ width: "80px" }}>Sales Growth</th>
            <th style={{ width: "80px" }}>Total Visited Customer</th>
            <th style={{ width: "80px" }}>Total New Customer</th>
            <th style={{ width: "80px" }}>Salesforce Enroll</th>
            <th style={{ width: "50px" }}>Action</th>
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
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                {[2].includes(values?.reportType?.value) ? (
                  <td style={{ width: "120px" }}>{item?.nl7}</td>
                ) : null}
                <td className="text-left">{item?.strEmployeeName}</td>
                <td className="text-right">{item?.numTargetQuantity}</td>
                <td className="text-right">{item?.QntOneDay}</td>
                <td className="text-right">{item?.QntOneMonth}</td>
                <td className="text-right">{item?.montsales}</td>
                <td
                  style={{
                    backgroundColor:
                      +item?.monAchv >= 100
                        ? "#34d399"
                        : +item?.monAchv >= 80 && +item?.monAchv < 100
                        ? "#facc15"
                        : "#f87171",
                  }}
                  className="text-right"
                >
                  <strong>{item?.monAchv}%</strong>
                </td>
                <td className="text-right">{item?.monCollectionAmount}</td>
                <td className="text-right">{item?.monTotalRevenueTarget}</td>
                <td className="text-right">{item?.monSeventyPercentTRT}</td>
                <td
                  className="text-right"
                  style={{
                    backgroundColor:
                      +item?.monAchv >= 100
                        ? "#34d399"
                        : +item?.monAchv >= 80 && +item?.monAchv < 100
                        ? "#facc15"
                        : "#f87171",
                  }}
                >
                  {item?.monCreditRealization}
                </td>
                <td className="text-right">{item?.decSalesGrowth}</td>
                <td className="text-right">{item?.intTotalVisitedCustomer}</td>
                <td className="text-right">{item?.intTotalNewCustomer}</td>
                <td className="text-left">{item?.intSalesForceEnrol}</td>
                <td className="text-center">
                  <button className="btn btn-primary btn-sm" type="button">
                    Update
                  </button>
                </td>
              </tr>
            );
          })}
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan="3" className="text-right">
              <b>Grand Total </b>
            </td>
            <td className="text-right">
              {_fixedPoint(numTargetQuantityTotal, true)}
            </td>
            <td className="text-right">{_fixedPoint(QntOneDayTotal, true)}</td>
            <td className="text-right">
              {_fixedPoint(QntOneMonthTotal, true)}
            </td>
            <td className="text-right">{_fixedPoint(montsalesTotal, true)}</td>
            <td></td>
            <td className="text-right">
              {_fixedPoint(monCollectionAmountTotal, true)}
            </td>
            <td className="text-right">
              {_fixedPoint(monTotalRevenueTargetTotal, true)}
            </td>
            <td className="text-right">
              {_fixedPoint(monSeventyPercentTRTtotal, true)}
            </td>
            <td colSpan={3}></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
