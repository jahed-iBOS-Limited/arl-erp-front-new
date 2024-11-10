import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import "antd/dist/antd.css";
import Loading from "./../../../../_helper/_loading";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import OutPutTaxReport from "../tableComponent/outputTaxReport";
import InputPutTaxReport from "../tableComponent/inputTaxReport";
import TaxpayerInfoReport from "../tableComponent/taxPayerInfo";
import AddjustmentVatReport from "../tableComponent/adjustmentVat";
import TaxCalculationReport from "../tableComponent/taxCalculation";
import OthersTaxReport from "../tableComponent/othersTax";
import ReturnSubmissionReport from "../tableComponent/returnSubmission";
import AddjustmentVatDecrementReport from "../tableComponent/adjustmentVatDecrement";

import govLogo from "../images/govLogo.png";

const GridData = ({
  parentValues,
  setFieldValue,
  outputTaxData,
  inputTaxData,
  taxPayerInfo,
  incrAdjustmentData,
  decreAdjustmentData,
  noteData,
  loading,
  employeeBasicInfo,
  treasuryDepositInfo,
  taxLedgerSdVat,
  setLoading,
  getTaxLedgerSdVat,
  setTaxLedgerSdVat,
  employeeBasicDetails,
  payableSurcharge,
  closingbalance,
  cbLastTax,
}) => {
  const printRef = useRef();
  const claculator = (arr, key) => {
    const total = arr?.reduce((acc, cur) => (acc += cur?.[key]), 0);
    return total;
  };

  // outputTax
  const outputTaxValue = claculator(outputTaxData, "value_a");
  const outputTaxSD = claculator(outputTaxData, "sD_b");
  const outputTaxVat = claculator(outputTaxData, "vaT_b");

  // inputTax
  const inputTaxValue = claculator(inputTaxData, "value_a");
  const inputTaxVat = claculator(inputTaxData, "vaT_b");

  // adjustmentVat
  const increadjustmentVat = claculator(incrAdjustmentData, "vat");
  const decreadjustmentVat = claculator(decreAdjustmentData, "vat");

  // all total
  const allTotal = {
    outputTaxValue,
    outputTaxSD,
    outputTaxVat,
    inputTaxValue,
    inputTaxVat,
    increadjustmentVat,
    decreadjustmentVat,
  };

  console.log("allTotal", allTotal);

  const refObj = {
    result35: 0,
    result36: 0,
    result37: 0,
    result50: 0,
    result51: 0,
    result56: 0,
    result57: 0,
    result65: 0,
    result66: 0,
  };
  const result34 =
    outputTaxVat - inputTaxVat + increadjustmentVat - decreadjustmentVat;
  const result38 = noteData[0]?.noteNo === 38 ? noteData[0]?.amount : "";
  const result39 = noteData[1]?.noteNo === 39 ? noteData[1]?.amount : "";
  const result40 = 0;
  const result41 = 0;
  const result42 = 0;
  const result43 = 0;
  const result44 = 0;
  const result45 = 0;
  const result46 =
    payableSurcharge?.surchargeType === 1 ? payableSurcharge?.amount : 0;
  const result47 =
    payableSurcharge?.surchargeType === 2 ? payableSurcharge?.amount : 0;
  const result48 =
    payableSurcharge?.surchargeType === 3 ? payableSurcharge?.amount : 0;
  const result49 =
    payableSurcharge?.surchargeType === 4 ? payableSurcharge?.amount : 0;
  const result52 = cbLastTax ? cbLastTax?.vat : 0;
  const result53 = cbLastTax ? cbLastTax?.sd : 0;
  const result54 = closingbalance ? closingbalance?.vat : 0;
  const result55 = closingbalance ? closingbalance?.sd : 0;
  const result58 = treasuryDepositInfo ? treasuryDepositInfo[0]?.amount : 0;
  const result59 = treasuryDepositInfo ? treasuryDepositInfo[1]?.amount : 0;
  const result60 = treasuryDepositInfo ? treasuryDepositInfo[2]?.amount : 0;
  const result61 = treasuryDepositInfo ? treasuryDepositInfo[3]?.amount : 0;
  const result62 = treasuryDepositInfo ? treasuryDepositInfo[4]?.amount : 0;
  const result63 = treasuryDepositInfo ? treasuryDepositInfo[5]?.amount : 0;
  const result64 = treasuryDepositInfo ? treasuryDepositInfo[6]?.amount : 0;
  const result67 = taxLedgerSdVat ? taxLedgerSdVat?.vat : 0;
  const result68 = taxLedgerSdVat ? taxLedgerSdVat?.sd : 0;

  // dependency
  refObj["result36"] = outputTaxSD + result38 - (result39 + result40);

  refObj["result35"] = result34 - (result52 + refObj?.result56);
  refObj["result50"] = refObj?.result35 + result41 + result43 + result44;
  refObj["result65"] = refObj?.result50 - (result58 + result67);
  refObj["result56"] = refObj?.result65 * 0.3;
  refObj["result35"] = result34 - (result52 + refObj?.result56);
  refObj["result50"] = refObj?.result35 + result41 + result43 + result44;
  refObj["result65"] = refObj?.result50 - (result58 + result67);

  refObj["result37"] = refObj?.result36 - (result53 + refObj?.result57);
  refObj["result51"] = refObj?.result37 + result42;
  refObj["result66"] = refObj?.result51 - (result59 + result68);
  refObj["result57"] = refObj?.result66 * 0.3;
  refObj["result37"] = refObj?.result36 - (result53 + refObj?.result57);
  refObj["result51"] = refObj?.result37 + result42;
  refObj["result66"] = refObj?.result51 - (result59 + result68);

  const allValueResult = {
    result34,
    result35: refObj?.result35,
    result36: refObj?.result36,
    result37: refObj?.result37,
    result38,
    result39,
    result40,
    result41,
    result42,
    result43,
    result44,
    result45,
    result46,
    result47,
    result48,
    result49,
    result50: refObj?.result50,
    result51: refObj?.result51,
    result52,
    result53,
    result54,
    result55,
    result56: refObj?.result56,
    result57: refObj?.result57,
    result58,
    result59,
    result60,
    result61,
    result62,
    result63,
    result64,
    result65: refObj?.result65,
    result66: refObj?.result66,
    result67,
    result68,
  };

  return (
    <>
      <div componentRef={printRef} ref={printRef} className="print_wrapper">
        <div className="row global-table">
          <div className="col-lg-12 text-right printSectionNone">
            <ReactToPrint
              trigger={() => (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "2px 5px" }}
                >
                  <img
                    style={{
                      width: "25px",
                      paddingRight: "5px",
                    }}
                    src={printIcon}
                    alt="print-icon"
                  />
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
          </div>
          {loading && <Loading />}
          {taxPayerInfo && (
            <>
              <div className="col-lg-12">
                <div className="mushak-report-header">
                  <div className="mushak-report-header-img">
                    <img src={govLogo} alt={"Ibos"} />
                  </div>
                  <div className="report_top mushak-report-header-txt text-center">
                    <h2>GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH</h2>
                    <h2>NATIONAL BOARD OF REVENUE</h2>
                    <h2>VALUE ADDED TAX RETURN FORM</h2>
                    <p>[See rule 47(1)]</p>
                    <p>
                      [Please read the instructions before Filling up this form]
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="output-tax-report col-lg-12 pr-0 pl-0">
            {taxPayerInfo && <TaxpayerInfoReport gridData={taxPayerInfo} />}
          </div>
          <div className="output-tax-report col-lg-12 pr-0 pl-0">
            {taxPayerInfo && <ReturnSubmissionReport />}
          </div>
          <div className="output-tax-report col-lg-12 pr-0 pl-0">
            {outputTaxData?.length > 0 && (
              <OutPutTaxReport
                gridData={outputTaxData}
                parentValues={parentValues}
              />
            )}
          </div>
          <div className="input-tax-report col-lg-12 pr-0 pl-0">
            {inputTaxData?.length > 0 && (
              <InputPutTaxReport
                gridData={inputTaxData}
                parentValues={parentValues}
              />
            )}
          </div>
          <div className="input-tax-report col-lg-12 pr-0 pl-0">
            {incrAdjustmentData?.length > 0 && (
              <AddjustmentVatReport
                gridData={incrAdjustmentData}
                parentValues={parentValues}
              />
            )}
          </div>
          <div className="input-tax-report col-lg-12 pr-0 pl-0">
            {decreAdjustmentData?.length > 0 && (
              <AddjustmentVatDecrementReport
                gridData={decreAdjustmentData}
                parentValues={parentValues}
              />
            )}
          </div>
          {taxPayerInfo && (
            <>
              <div className="input-tax-report col-lg-12 pr-0 pl-0">
                <TaxCalculationReport
                  noteData={noteData}
                  allValueResult={allValueResult}
                />
              </div>
              <div className="input-tax-report col-lg-12 pr-0 pl-0">
                <OthersTaxReport
                  allValueResult={allValueResult}
                  employeeBasicInfo={employeeBasicInfo}
                  treasuryDepositInfo={treasuryDepositInfo}
                  parentValues={parentValues}
                  setFieldValue={setFieldValue}
                  setLoading={setLoading}
                  getTaxLedgerSdVat={getTaxLedgerSdVat}
                  setTaxLedgerSdVat={setTaxLedgerSdVat}
                  employeeBasicDetails={employeeBasicDetails}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
