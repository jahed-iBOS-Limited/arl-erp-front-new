import moment from "moment";
import React from "react";
import { dateFormatWithMonthName } from "../../_helper/_dateFormate";
import numberWithCommas from "../../_helper/_numberWithCommas";

const ProjectedBalanceReport = ({ balanceReportData, values }) => {
  const getTotalAssetsVariance = (rowDto) => {
    const data =
      (rowDto?.currentassetsTotalBalance || 0) +
      (rowDto.nonCurrentAssetsTotalBalance || 0) -
      ((rowDto?.currentassetsTotalPlanBalance || 0) +
        (rowDto.nonCurrentAssetsTotalPlanBalance || 0));

    return numberWithCommas(Math.round(data || 0));
  };

  const equityAndLiaTotal = (rowDto) => {
    let a = (+rowDto?.equityTotalBalance || 0).toFixed(2);
    let b = (+rowDto?.nonCurrentLiabilityTotalBalance || 0).toFixed(2);
    let c = (+rowDto?.currentLiabilityTotalBalance || 0).toFixed(2);
    let total = (+a + +b + +c).toFixed(2);
    return Math.round(total);
  };

  const equityAndLiaTotalForBudget = (rowDto) => {
    let a = (+rowDto?.equityTotalPlanBalance || 0).toFixed(2);
    let b = (+rowDto?.nonCurrentLiabilityTotalPlanBalance || 0).toFixed(2);
    let c = (+rowDto?.currentLiabilityTotalPlanBalance || 0).toFixed(2);
    let total = (+a + +b + +c).toFixed(2);
    return Math.round(total);
  };

  return (
    <>
      {balanceReportData && (
        <div className=" mt-2" id="pdf-section">
          <div className="titleContent text-center">
            <h2>{values?.businessUnit?.label || ""}</h2>
            <h4 className="text-primary">Projected Balance Sheet</h4>
            {values?.fromDate ? (
              <p className="m-0">
                <strong>As On : {dateFormatWithMonthName(values?.date)}</strong>
              </p>
            ) : (
              <></>
            )}
          </div>
          <div style={{ width: 600, margin: "auto" }}>
            <div className="my-5">
              <div className="table-responsive">
                <table id="table-to-xlsx" className="w-full">
                  <tr>
                    <td style={{ fontWeight: "bold", border: "1px solid" }}>
                      Particulars
                    </td>
                    <td
                      className="text-center"
                      style={{ fontWeight: "bold", border: "1px solid" }}
                    >
                      Last Period
                    </td>
                    <td
                      className="text-center"
                      style={{ fontWeight: "bold", border: "1px solid" }}
                    >
                      Current Period
                    </td>
                    <td
                      className="text-center"
                      style={{ fontWeight: "bold", border: "1px solid" }}
                    >
                      Variance
                    </td>
                    {/* <td className="text-right" style={{ fontWeight: "bold" }}>Amount</td> */}
                  </tr>
                  <tr
                    style={{ background: "#D8D8D8", border: "1px solid black" }}
                  >
                    <td colSpan="4" style={{ fontWeight: "bold" }}>
                      Assets
                    </td>
                  </tr>
                  <tr style={{ border: "1px solid black" }}>
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
                            style={{ paddingLeft: "20px", border: "1px solid" }}
                          >
                            {itm.strGlName}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            {numberWithCommas(
                              Math.round(itm?.numPlanBalance) || 0
                            )}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            <span className="pr-1">
                              {/* {numberWithCommas(
                              parseFloat(itm.numBalance).toFixed(2)
                            )} */}
                              {numberWithCommas(
                                Math.round(itm.numBalance) || 0
                              )}
                            </span>
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            <span className="pr-1">
                              {numberWithCommas(
                                Math.round(itm.numBalance) -
                                  Math.round(itm?.numPlanBalance)
                              )}
                            </span>
                            {/* {_formatMoney(itm?.numPlanBalance - itm.numBalance)} */}
                          </td>
                          {/* <td></td> */}
                        </tr>
                      );
                    })}
                  <tr style={{ background: "#F2F2F2" }}>
                    <td style={{ fontWeight: "bold", border: "1px solid" }}>
                      Total Non-Current Assets
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.nonCurrentAssetsTotalPlanBalance
                        ) || 0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.nonCurrentAssetsTotalBalance
                        ) || 0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        (Math.round(
                          balanceReportData?.nonCurrentAssetsTotalBalance
                        ) || 0) -
                          (Math.round(
                            balanceReportData?.nonCurrentAssetsTotalPlanBalance
                          ) || 0)
                      )}
                    </td>
                  </tr>
                  <tr style={{ border: "1px solid" }}>
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
                            style={{ paddingLeft: "20px", border: "1px solid" }}
                          >
                            {itm.strGlName}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            {numberWithCommas(
                              Math.round(itm?.numPlanBalance) || 0
                            )}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            <span className="pr-1">
                              {numberWithCommas(
                                Math.round(itm.numBalance) || 0
                              )}
                            </span>
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            {numberWithCommas(
                              Math.round(itm.numBalance) -
                                Math.round(itm?.numPlanBalance)
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  <tr style={{ background: "#F2F2F2" }}>
                    <td style={{ fontWeight: "bold", border: "1px solid" }}>
                      Total Current Assets
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.currentassetsTotalPlanBalance
                        ) || 0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.currentassetsTotalBalance
                        ) || 0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.currentassetsTotalBalance || 0
                        ) -
                          Math.round(
                            balanceReportData?.currentassetsTotalPlanBalance ||
                              0
                          )
                      )}
                    </td>
                  </tr>
                  <tr style={{ background: "#D8D8D8" }}>
                    <td style={{ fontWeight: "bold", border: "1px solid" }}>
                      Total Assets
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.currentassetsTotalPlanBalance || 0
                        ) +
                          Math.round(
                            balanceReportData.nonCurrentAssetsTotalPlanBalance ||
                              0
                          )
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.currentassetsTotalBalance || 0
                        ) +
                          Math.round(
                            balanceReportData?.nonCurrentAssetsTotalBalance || 0
                          )
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {getTotalAssetsVariance(balanceReportData)}
                    </td>
                  </tr>
                  <tr style={{ height: "15px" }}></tr>
                  <tr style={{ background: "#D8D8D8", border: "1px solid" }}>
                    <td colSpan="4" style={{ fontWeight: "bold" }}>
                      EQUITY AND LIABILITIES
                    </td>
                  </tr>
                  <tr style={{ border: "1px solid" }}>
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
                            style={{ paddingLeft: "20px", border: "1px solid" }}
                          >
                            {itm.strGlName}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            {numberWithCommas(
                              Math.round(itm?.numPlanBalance) || 0
                            )}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            <span className="pr-1">
                              {numberWithCommas(
                                Math.round(itm.numBalance) || 0
                              )}
                            </span>
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            {numberWithCommas(
                              (Math.round(itm.numBalance) || 0) -
                                (Math.round(itm?.numPlanBalance) || 0)
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  <tr style={{ background: "#F2F2F2" }}>
                    <td style={{ fontWeight: "bold", border: "1px solid" }}>
                      Total Equity
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(balanceReportData?.equityTotalPlanBalance) ||
                          0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(balanceReportData?.equityTotalBalance) || 0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        (Math.round(balanceReportData?.equityTotalBalance) ||
                          0) -
                          (Math.round(
                            balanceReportData?.equityTotalPlanBalance
                          ) || 0)
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

                  <tr style={{ border: "1px solid" }}>
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
                            style={{ paddingLeft: "20px", border: "1px solid" }}
                          >
                            {itm.strGlName}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            {numberWithCommas(
                              Math.round(itm?.numPlanBalance) || 0
                            )}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            <span className="pr-1">
                              {numberWithCommas(
                                Math.round(itm.numBalance) || 0
                              )}
                            </span>
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            {numberWithCommas(
                              (Math.round(itm.numBalance) || 0) -
                                (Math.round(itm?.numPlanBalance) || 0)
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  <tr style={{ background: "#F2F2F2" }}>
                    <td style={{ fontWeight: "bold", border: "1px solid" }}>
                      Total Non-Current Liability
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.nonCurrentLiabilityTotalPlanBalance
                        ) || 0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.nonCurrentLiabilityTotalBalance
                        ) || 0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        (Math.round(
                          balanceReportData?.nonCurrentLiabilityTotalBalance
                        ) || 0) -
                          (Math.round(
                            balanceReportData?.nonCurrentLiabilityTotalPlanBalance
                          ) || 0)
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
                  <tr style={{ border: "1px solid" }}>
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
                            style={{ paddingLeft: "20px", border: "1px solid" }}
                          >
                            {itm.strGlName}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            {numberWithCommas(
                              Math.round(itm?.numPlanBalance) || 0
                            )}
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            <span className="pr-1">
                              {numberWithCommas(
                                Math.round(itm.numBalance) || 0
                              )}
                            </span>
                          </td>
                          <td
                            className="text-right"
                            style={{ border: "1px solid black" }}
                          >
                            {numberWithCommas(
                              (Math.round(itm.numBalance) || 0) -
                                (Math.round(itm?.numPlanBalance) || 0)
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  <tr style={{ background: "#F2F2F2" }}>
                    <td style={{ fontWeight: "bold", border: "1px solid" }}>
                      Total Current Liabilities
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.currentLiabilityTotalPlanBalance
                        ) || 0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        Math.round(
                          balanceReportData?.currentLiabilityTotalBalance
                        ) || 0
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        (Math.round(
                          balanceReportData?.currentLiabilityTotalBalance
                        ) || 0) -
                          (Math.round(
                            balanceReportData?.currentLiabilityTotalPlanBalance
                          ) || 0)
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
                    <td style={{ fontWeight: "bold", border: "1px solid" }}>
                      TOTAL EQUITY AND LIABILITIES
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        equityAndLiaTotalForBudget(balanceReportData)
                      )}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(equityAndLiaTotal(balanceReportData))}
                    </td>
                    <td
                      className="text-right"
                      style={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      {numberWithCommas(
                        equityAndLiaTotal(balanceReportData) -
                          equityAndLiaTotalForBudget(balanceReportData)
                      )}
                    </td>
                  </tr>
                  <tr style={{ height: "15px" }}></tr>
                  <tr>
                    <td
                      className="text-center d-none"
                      colSpan={4}
                    >{`System Generated Report - ${moment().format(
                      "LLLL"
                    )}`}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectedBalanceReport;
