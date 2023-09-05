import React from "react";
import { _formatMoney } from "../../_helper/_formatMoney";
import { dateFormatWithMonthName } from "../../_helper/_dateFormate";
import numberWithCommas from "../../_helper/_numberWithCommas";
import moment from "moment";

const ProjectedBalanceReport = ({ balanceReportData, values }) => {
  console.log("balanceReportData", balanceReportData)
  const getTotalAssetsVariance = (rowDto) => {
    const data =
      (rowDto?.currentassetsTotalPlanBalance || 0) +
      (rowDto.nonCurrentAssetsTotalPlanBalance || 0) -
      ((rowDto?.currentassetsTotalBalance || 0) +
        (rowDto.nonCurrentAssetsTotalBalance || 0));

    return _formatMoney(data || 0);
  };

  const equityAndLiaTotal = (rowDto) => {
    let a = (+rowDto?.equityTotalBalance || 0).toFixed(2);
    let b = (+rowDto?.nonCurrentLiabilityTotalBalance || 0).toFixed(2);
    let c = (+rowDto?.currentLiabilityTotalBalance || 0).toFixed(2);

    let total = (+a + +b + +c).toFixed(2);

    return total;
  };

  const equityAndLiaTotalForBudget = (rowDto) => {
    let a = (+rowDto?.equityTotalPlanBalance || 0).toFixed(2);
    let b = (+rowDto?.nonCurrentLiabilityTotalPlanBalance || 0).toFixed(2);
    let c = (+rowDto?.currentLiabilityTotalPlanBalance || 0).toFixed(2);

    let total = (+a + +b + +c).toFixed(2);

    return total;
  };

  return (
    <>
      {balanceReportData && (
        <div className="mx-auto mt-2" id="pdf-section">
          <div className="titleContent text-center">
            <h3>
              {values?.business?.value > 0
                ? values?.business?.label
                : "Akij Resources Limited"}
            </h3>
            <h5>Balance Sheet</h5>
            {values?.fromDate ? (
              <p className="m-0">
                As On : {dateFormatWithMonthName(values?.fromDate)}
              </p>
            ) : (
              <></>
            )}
          </div>
          <div style={{ width: 600, margin: "auto" }}>
            <div className="my-5">
              <table id="table-to-xlsx" className="w-full">
                <tr>
                  <td style={{ fontWeight: "bold" }}>Particulars</td>
                  <td className="text-center" style={{ fontWeight: "bold" }}>
                    Budget
                  </td>
                  <td className="text-center" style={{ fontWeight: "bold" }}>
                    Amount
                  </td>
                  <td className="text-center" style={{ fontWeight: "bold" }}>
                    Variance
                  </td>
                  {/* <td className="text-right" style={{ fontWeight: "bold" }}>Amount</td> */}
                </tr>
                <tr style={{ background: "#D8D8D8" }}>
                  <td colSpan="4" style={{ fontWeight: "bold" }}>
                    Assets
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" style={{ fontWeight: "bold" }}>
                    Non-Current Assets
                  </td>
                </tr>

                {balanceReportData?.nonCurrentAssets &&
                  balanceReportData?.nonCurrentAssets.map((itm, index) => {
                    return (
                      <tr key={index}>
                        <td
                          className="text-left"
                          style={{ paddingLeft: "20px" }}
                        >
                          {itm.strGlName}
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance)}
                        </td>
                        <td
                          className="text-right"
                          style={{ border: "1px solid black" }}
                        >
                          <span className="pr-1">
                            {numberWithCommas(
                              parseFloat(itm.numBalance).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance - itm.numBalance)}
                        </td>
                        {/* <td></td> */}
                      </tr>
                    );
                  })}
                <tr style={{ background: "#F2F2F2" }}>
                  <td style={{ fontWeight: "bold" }}>
                    Total Non-Current Assets
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.nonCurrentAssetsTotalPlanBalance
                    )}
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.nonCurrentAssetsTotalBalance
                    )}
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.nonCurrentAssetsTotalPlanBalance -
                        balanceReportData?.nonCurrentAssetsTotalBalance
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" style={{ fontWeight: "bold" }}>
                    Current Assets
                  </td>
                </tr>
                {balanceReportData?.currentassets &&
                  balanceReportData?.currentassets.map((itm, index) => {
                    return (
                      <tr key={index}>
                        <td
                          className="text-left"
                          style={{ paddingLeft: "20px" }}
                        >
                          {itm.strGlName}
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance)}
                        </td>
                        <td
                          className="text-right"
                          style={{ border: "1px solid black" }}
                        >
                          <span className="pr-1">
                            {numberWithCommas(
                              parseFloat(itm.numBalance).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance - itm.numBalance)}
                        </td>
                      </tr>
                    );
                  })}
                <tr style={{ background: "#F2F2F2" }}>
                  <td style={{ fontWeight: "bold" }}>Total Current Assets</td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.currentassetsTotalPlanBalance
                    )}
                  </td>
                  <td className="text-right">
                    {_formatMoney(balanceReportData?.currentassetsTotalBalance)}
                  </td>
                  <td className="text-right">
                    {balanceReportData?.currentassetsTotalPlanBalance ||
                      0 - balanceReportData?.currentassetsTotalBalance ||
                      0}
                  </td>
                </tr>
                <tr style={{ background: "#D8D8D8" }}>
                  <td style={{ fontWeight: "bold" }}>Total Assets</td>
                  <td
                    className="text-right"
                    style={{ borderBottom: "3px double black" }}
                  >
                    {_formatMoney(
                      balanceReportData?.currentassetsTotalPlanBalance ||
                        0 +
                          balanceReportData.nonCurrentAssetsTotalPlanBalance ||
                        0
                    )}
                  </td>
                  <td
                    className="text-right"
                    style={{ borderBottom: "3px double black" }}
                  >
                    {_formatMoney(
                      (balanceReportData?.currentassetsTotalBalance || 0) +
                        (balanceReportData?.nonCurrentAssetsTotalBalance || 0)
                    )}
                  </td>
                  <td
                    className="text-right"
                    style={{ borderBottom: "3px double black" }}
                  >
                    {getTotalAssetsVariance(balanceReportData)}
                  </td>
                </tr>
                <tr style={{ height: "15px" }}></tr>
                <tr style={{ background: "#D8D8D8" }}>
                  <td colSpan="4" style={{ fontWeight: "bold" }}>
                    EQUITY AND LIABILITIES
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" style={{ fontWeight: "bold" }}>
                    Equity
                  </td>
                </tr>

                {balanceReportData?.equity &&
                  balanceReportData?.equity.map((itm, index) => {
                    return (
                      <tr key={index}>
                        <td
                          className="text-left"
                          style={{ paddingLeft: "20px" }}
                        >
                          {itm.strGlName}
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance)}
                        </td>
                        <td
                          className="text-right"
                          style={{ border: "1px solid black" }}
                        >
                          <span className="pr-1">
                            {numberWithCommas(
                              parseFloat(itm.numBalance).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance - itm.numBalance)}
                        </td>
                      </tr>
                    );
                  })}
                <tr style={{ background: "#F2F2F2" }}>
                  <td style={{ fontWeight: "bold" }}>Total Equity</td>
                  <td className="text-right">
                    {_formatMoney(balanceReportData?.equityTotalPlanBalance)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(balanceReportData?.equityTotalBalance)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.equityTotalPlanBalance -
                        balanceReportData?.equityTotalBalance
                    )}
                  </td>
                </tr>
                {/* <tr key="g">
                          <td className="text-center">Total</td>
                          <td className="text-right">
                            <span clssName="pr-1">
                              {numberWithCommas(parseFloat(balanceReportData?.equityTotalBalance).toFixed(2))}
                            </span>
                          </td>
                        </tr> */}

                <tr>
                  <td colSpan="4" style={{ fontWeight: "bold" }}>
                    Non-Current Liabilities
                  </td>
                </tr>
                {/* <tr key="h">
                          <th style={{ width: '60%' }}>Non-Current Liabilities</th>
                          <th>Amount</th>
                        </tr> */}
                {balanceReportData?.nonCurrentLiability &&
                  balanceReportData?.nonCurrentLiability.map((itm, index) => {
                    return (
                      <tr key={index}>
                        <td
                          className="text-left"
                          style={{ paddingLeft: "20px" }}
                        >
                          {itm.strGlName}
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance)}
                        </td>
                        <td
                          className="text-right"
                          style={{ border: "1px solid black" }}
                        >
                          <span className="pr-1">
                            {numberWithCommas(
                              parseFloat(itm.numBalance).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance - itm.numBalance)}
                        </td>
                      </tr>
                    );
                  })}
                <tr style={{ background: "#F2F2F2" }}>
                  <td style={{ fontWeight: "bold" }}>
                    Total Non-Current Liability
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.nonCurrentLiabilityTotalPlanBalance
                    )}
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.nonCurrentLiabilityTotalBalance
                    )}
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.nonCurrentLiabilityTotalPlanBalance -
                        balanceReportData?.nonCurrentLiabilityTotalBalance
                    )}
                  </td>
                </tr>
                {/* <tr key="i">
                          <td className="text-center">Total</td>
                          <td className="text-right">
                            <span>
                              {numberWithCommas(parseFloat(balanceReportData?.nonCurrentLiabilityTotalBalance).toFixed(2))}
                            </span>
                          </td>
                        </tr> */}
                <tr>
                  <td colSpan="4" style={{ fontWeight: "bold" }}>
                    Current Liabilities
                  </td>
                </tr>
                {/* <tr key="j">
                          <th style={{ width: '60%' }}>Current Liabilities</th>
                          <th>Amount</th>
                        </tr> */}
                {balanceReportData?.currentLiability &&
                  balanceReportData?.currentLiability.map((itm, index) => {
                    return (
                      <tr key={index}>
                        <td
                          className="text-left"
                          style={{ paddingLeft: "20px" }}
                        >
                          {itm.strGlName}
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance)}
                        </td>
                        <td
                          className="text-right"
                          style={{ border: "1px solid black" }}
                        >
                          <span className="pr-1">
                            {numberWithCommas(
                              parseFloat(itm.numBalance).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          {_formatMoney(itm?.numPlanBalance - itm.numBalance)}
                        </td>
                      </tr>
                    );
                  })}
                <tr style={{ background: "#F2F2F2" }}>
                  <td style={{ fontWeight: "bold" }}>
                    Total Current Liabilities
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.currentLiabilityTotalPlanBalance
                    )}
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.currentLiabilityTotalBalance
                    )}
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      balanceReportData?.currentLiabilityTotalPlanBalance -
                        balanceReportData?.currentLiabilityTotalBalance
                    )}
                  </td>
                </tr>
                {/* <tr key="k">
                          <td className="text-center">Total</td>
                          <td className="text-right">
                            <span className="pr-1">
                              {numberWithCommas(parseFloat(balanceReportData?.currentLiabilityTotalBalance).toFixed(2))}
                            </span>
                          </td>
                        </tr> */}
                <tr style={{ background: "#D8D8D8" }}>
                  <td style={{ fontWeight: "bold" }}>
                    TOTAL EQUITY AND LIABILITIES
                  </td>
                  <td
                    className="text-right"
                    style={{ borderBottom: "3px double black" }}
                  >
                    {_formatMoney(
                      equityAndLiaTotalForBudget(balanceReportData)
                    )}
                  </td>
                  <td
                    className="text-right"
                    style={{ borderBottom: "3px double black" }}
                  >
                    {_formatMoney(equityAndLiaTotal(balanceReportData))}
                  </td>
                  <td
                    className="text-right"
                    style={{ borderBottom: "3px double black" }}
                  >
                    {_formatMoney(
                      equityAndLiaTotalForBudget(balanceReportData) -
                        equityAndLiaTotal(balanceReportData)
                    )}
                  </td>
                </tr>
                <tr style={{ height: "15px" }}></tr>
                <tr>
                  <td
                    className="text-center d-none"
                    colSpan={4}
                  >{`System Generated Report - ${moment().format("LLLL")}`}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectedBalanceReport;
