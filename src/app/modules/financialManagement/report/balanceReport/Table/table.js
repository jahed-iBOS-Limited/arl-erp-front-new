/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { getReportBalance } from "../helper";
import Loading from "../../../../_helper/_loading";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import { useFormik } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { getBusinessDDLByED, getEnterpriseDivisionDDL } from "../../incomestatement/helper";
import NewSelect from "../../../../_helper/_select";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import moment from "moment";
const html2pdf = require("html2pdf.js");

const initData = {
  enterpriseDivision: "",
  business: "",
  fromDate: _todayDate(),
  conversionRate: 1,
};
export default function BalancerReportTable() {
  const [enterpriseDivisionDDL, setEnterpriseDivisionDDL] = useState([]);
  const [businessDDL, setBusinessUnitDDL] = useState([]);
  const [rowDto, setRowDto] = useState({});
  const [loading, setLoading] = useState(false);
  const { profileData } = useSelector(
    (store) => store?.authData,
    shallowEqual
  );

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 1,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "p" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };

  const printRef = useRef();

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

  const getTotalAssetsVariance = (rowDto) => {
    const data =
      (rowDto?.currentassetsTotalPlanBalance || 0) +
      (rowDto.nonCurrentAssetsTotalPlanBalance || 0) -
      ((rowDto?.currentassetsTotalBalance || 0) +
        (rowDto.nonCurrentAssetsTotalBalance || 0));

    return _formatMoney(data || 0);
  };

  const { errors, touched, setFieldValue, values } = useFormik({
    initialValues: initData,
  });
  useEffect(() => {
    getEnterpriseDivisionDDL(
      profileData?.accountId,
      (enterpriseDivisionData) => {
        setEnterpriseDivisionDDL(enterpriseDivisionData);
        setFieldValue("enterpriseDivision", enterpriseDivisionData?.[0]);
        if (enterpriseDivisionData?.[0]) {
          getBusinessDDLByED(
            profileData?.accountId,
            enterpriseDivisionData?.[0]?.value,
            (businessUnitDDLData) => {
              setBusinessUnitDDL(businessUnitDDLData);
              setFieldValue("business", businessUnitDDLData?.[0]);
            }
          );
        }
      }
    );
  }, [profileData?.accountId]);
  const [showRDLC, setShowRDLC] = useState(false);
  const groupId = "218e3d7e-f3ea-4f66-8150-bb16eb6fc606";
  const reportId = "1cea2afd-f9aa-4b6b-9f46-5a39fa65ca4a";
  const parameterValues = (values) => {
    const agingParameters = [
      { name: "BusinessUnitGroup", value: `${values?.enterpriseDivision?.value}` },
      { name: "intBusinessUnitId", value: `${values?.business?.value}` },
      { name: "dteAsOnDate", value: `${values?.fromDate}` },
      { name: "intAccountId", value: `1` },
      { name: "ConvertionRate", value: `${values?.conversionRate}` }
    ];
    return agingParameters;
  };

  return (
    <>
      <>
        <Card>
          {true && <ModalProgressBar />}
          <CardHeader title="Balance Report">
            <CardHeaderToolbar></CardHeaderToolbar>
          </CardHeader>
          <CardBody>

            {loading && <Loading />}
            <div className="global-form align-items-end">
              <div className="row">
                <div className="col-md-2">
                  <NewSelect
                    name="enterpriseDivision"
                    options={enterpriseDivisionDDL || []}
                    value={values?.enterpriseDivision}
                    label="Enterprise Division"
                    onChange={(valueOption) => {
                      setShowRDLC(false);
                      setRowDto([]);
                      setFieldValue("enterpriseDivision", valueOption);
                      setFieldValue("business", "");

                      if (valueOption?.value) {
                        getBusinessDDLByED(
                          profileData?.accountId,
                          valueOption?.value,
                          (businessUnitDDLData) => {
                            setBusinessUnitDDL(businessUnitDDLData);
                            setFieldValue("business", businessUnitDDLData?.[0]);
                          }
                        );
                      }
                    }}
                    placeholder="Enterprise Division"
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    label="Business Unit"
                    options={businessDDL || ""}
                    value={values?.business}
                    name="business"
                    onChange={(data) => {
                      setShowRDLC(false);
                      setFieldValue("business", data);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <label>Date</label>
                  <input
                    className="form-control trans-date cj-landing-date"
                    value={values?.fromDate}
                    onChange={(e) => {
                      setShowRDLC(false);
                      setFieldValue("fromDate", e.target.value);
                    }}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Conversion Rate</label>
                  <input
                    className="form-control trans-date cj-landing-date"
                    value={values?.conversionRate}
                    onChange={(e) => {
                      setShowRDLC(false);
                      setFieldValue("conversionRate", e.target.value);
                    }}
                    name="conversionRate"
                    placeholder="Conversion Rate"
                    type="number"
                  />
                </div>
                <div className="col-auto" style={{
                  marginTop: "17px"
                }}>
                  <ButtonStyleOne
                    label="View"
                    onClick={() => {
                      setShowRDLC(false);
                      getReportBalance(
                        profileData?.accountId,
                        values?.business?.value,
                        values?.fromDate,
                        setRowDto,
                        setLoading,
                        values?.enterpriseDivision?.label,
                        values?.conversionRate
                      );
                    }}
                    disabled={!values?.business || values?.conversionRate < 1}
                  />
                </div>
                <div className="col-auto" style={{
                  marginTop: "17px"
                }}>
                  <button
                    type="button"
                    className="btn btn-primary sales_invoice_btn"
                    style={{ float: "right", marginLeft: "5px" }}
                    onClick={() => {
                      setShowRDLC(true);
                    }}
                    disabled={values?.conversionRate < 1}
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-primary sales_invoice_btn"
                    style={{ float: "right", marginLeft: "5px" }}
                    onClick={() => {
                      pdfExport("balanceReport");
                    }}
                  >
                    Export PDF
                  </button>
                </div>
                <div className="col-auto">
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-primary sales_invoice_btn export-excel"
                    table="table-to-xlsx"
                    filename={`balanceReport (Date : ${values?.fromDate
                      ? dateFormatWithMonthName(values?.fromDate)
                      : "N/A"
                      })`}
                    sheet="balanceReport"
                    buttonText="Export Excel"
                  />
                </div>
                <div className="col-auto">
                  <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: A4 portrait ! important; margin-top:20}}"
                    }
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-primary sales_invoice_btn"
                        style={{ float: "right", marginLeft: "5px" }}
                      >
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </div>
              </div>

            </div>
            {
              showRDLC ? <div>
                <PowerBIReport
                  reportId={reportId}
                  groupId={groupId}
                  parameterValues={parameterValues(values)}
                  parameterPanel={false}
                />
              </div> : <>
                {rowDto?.nonCurrentAssets ||
                  rowDto?.currentassets ||
                  rowDto?.equity ||
                  rowDto?.nonCurrentLiability ||
                  rowDto?.currentLiability ? (
                  <div className="mx-auto mt-2" id="pdf-section" ref={printRef}>
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
                            <td
                              className="text-center"
                              style={{ fontWeight: "bold" }}
                            >
                              Budget
                            </td>
                            <td
                              className="text-center"
                              style={{ fontWeight: "bold" }}
                            >
                              Amount
                            </td>
                            <td
                              className="text-center"
                              style={{ fontWeight: "bold" }}
                            >
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

                          {rowDto?.nonCurrentAssets &&
                            rowDto?.nonCurrentAssets.map((itm, index) => {
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
                                    {_formatMoney(
                                      itm?.numPlanBalance - itm.numBalance
                                    )}
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
                                rowDto?.nonCurrentAssetsTotalPlanBalance
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(rowDto?.nonCurrentAssetsTotalBalance)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                rowDto?.nonCurrentAssetsTotalPlanBalance -
                                rowDto?.nonCurrentAssetsTotalBalance
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="4" style={{ fontWeight: "bold" }}>
                              Current Assets
                            </td>
                          </tr>
                          {rowDto?.currentassets &&
                            rowDto?.currentassets.map((itm, index) => {
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
                                    {_formatMoney(
                                      itm?.numPlanBalance - itm.numBalance
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          <tr style={{ background: "#F2F2F2" }}>
                            <td style={{ fontWeight: "bold" }}>
                              Total Current Assets
                            </td>
                            <td className="text-right">
                              {_formatMoney(rowDto?.currentassetsTotalPlanBalance)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(rowDto?.currentassetsTotalBalance)}
                            </td>
                            <td className="text-right">
                              {rowDto?.currentassetsTotalPlanBalance ||
                                0 - rowDto?.currentassetsTotalBalance ||
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
                                rowDto?.currentassetsTotalPlanBalance ||
                                0 + rowDto.nonCurrentAssetsTotalPlanBalance ||
                                0
                              )}
                            </td>
                            <td
                              className="text-right"
                              style={{ borderBottom: "3px double black" }}
                            >
                              {_formatMoney(
                                (rowDto?.currentassetsTotalBalance || 0) +
                                (rowDto?.nonCurrentAssetsTotalBalance || 0)
                              )}
                            </td>
                            <td
                              className="text-right"
                              style={{ borderBottom: "3px double black" }}
                            >
                              {getTotalAssetsVariance(rowDto)}
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

                          {rowDto?.equity &&
                            rowDto?.equity.map((itm, index) => {
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
                                    {_formatMoney(
                                      itm?.numPlanBalance - itm.numBalance
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          <tr style={{ background: "#F2F2F2" }}>
                            <td style={{ fontWeight: "bold" }}>Total Equity</td>
                            <td className="text-right">
                              {_formatMoney(rowDto?.equityTotalPlanBalance)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(rowDto?.equityTotalBalance)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                rowDto?.equityTotalPlanBalance -
                                rowDto?.equityTotalBalance
                              )}
                            </td>
                          </tr>
                          {/* <tr key="g">
                          <td className="text-center">Total</td>
                          <td className="text-right">
                            <span clssName="pr-1">
                              {numberWithCommas(parseFloat(rowDto?.equityTotalBalance).toFixed(2))}
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
                          {rowDto?.nonCurrentLiability &&
                            rowDto?.nonCurrentLiability.map((itm, index) => {
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
                                    {_formatMoney(
                                      itm?.numPlanBalance - itm.numBalance
                                    )}
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
                                rowDto?.nonCurrentLiabilityTotalPlanBalance
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                rowDto?.nonCurrentLiabilityTotalBalance
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                rowDto?.nonCurrentLiabilityTotalPlanBalance -
                                rowDto?.nonCurrentLiabilityTotalBalance
                              )}
                            </td>
                          </tr>
                          {/* <tr key="i">
                          <td className="text-center">Total</td>
                          <td className="text-right">
                            <span>
                              {numberWithCommas(parseFloat(rowDto?.nonCurrentLiabilityTotalBalance).toFixed(2))}
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
                          {rowDto?.currentLiability &&
                            rowDto?.currentLiability.map((itm, index) => {
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
                                    {_formatMoney(
                                      itm?.numPlanBalance - itm.numBalance
                                    )}
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
                                rowDto?.currentLiabilityTotalPlanBalance
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(rowDto?.currentLiabilityTotalBalance)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                rowDto?.currentLiabilityTotalPlanBalance -
                                rowDto?.currentLiabilityTotalBalance
                              )}
                            </td>
                          </tr>
                          {/* <tr key="k">
                          <td className="text-center">Total</td>
                          <td className="text-right">
                            <span className="pr-1">
                              {numberWithCommas(parseFloat(rowDto?.currentLiabilityTotalBalance).toFixed(2))}
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
                              {_formatMoney(equityAndLiaTotalForBudget(rowDto))}
                            </td>
                            <td
                              className="text-right"
                              style={{ borderBottom: "3px double black" }}
                            >
                              {_formatMoney(equityAndLiaTotal(rowDto))}
                            </td>
                            <td
                              className="text-right"
                              style={{ borderBottom: "3px double black" }}
                            >
                              {_formatMoney(
                                equityAndLiaTotalForBudget(rowDto) -
                                equityAndLiaTotal(rowDto)
                              )}
                            </td>
                          </tr>
                          <tr style={{ height: "15px" }}></tr>
                          <tr>
                            <td
                              className="text-center d-none"
                              colSpan={4}
                            >{`System Generated Report - ${moment().format('LLLL')}`}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            }
            {/* </Form> */}

          </CardBody>
        </Card>
      </>
    </>
  );
}
