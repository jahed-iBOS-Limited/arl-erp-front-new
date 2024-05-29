import React, { useState, useEffect } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { useSelector, shallowEqual } from "react-redux";
import {
  getCostingSummary,
  getReportHeaderInfo,
} from "../../costSummary/helper";
const Print = ({ currentRow }) => {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const header = ["SL", "Particulars", "Estimated Amount", "Actual Amount"];
  const [rowDto, setRowDto] = React.useState([]);
  const [headerInfo, setHeaderInfo] = React.useState([]);
  const [, setLoader] = useState(false);

  useEffect(() => {
    if (currentRow) {
      getCostingSummary(
        currentRow?.poId,
        currentRow?.lcid,
        0,
        setRowDto,
        setLoader
      );
    }
  }, [currentRow]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getReportHeaderInfo(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setHeaderInfo
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // Calculation of Total Cost Including Vat And Tax
  const totalCostIncludingVatAndTax = () => {
    let total = 0;
    rowDto.forEach((item) => {
      if (item?.section === 1) {
        total += item.numBookedAmount;
      }
    });
    return total?.toFixed(4);
  };

  // Calculation of Total Deduction Of VAT And TAX
  const totalDeductionOfVatAndTax = () => {
    let total = 0;
    rowDto.forEach((item) => {
      if (item?.section === 2) {
        total += item.numBookedAmount;
      }
    });
    return total?.toFixed(4);
  };

  // Calculation of Net landing cost excluding VAT and TAX
  const netLandingCostExcludingVatAndTax =
    totalCostIncludingVatAndTax() - totalDeductionOfVatAndTax();
  return (
    <>
      <div>
        {/* {isPrintable && ( */}
        <div className="text-center d-none-print">
          <h2> {headerInfo?.businessUnitName} </h2>
          <h6> {headerInfo?.businessUnitCode} </h6>
          <h6> {headerInfo?.businessUnitAddress} </h6>
        </div>
        {/* )} */}

        <div className="global-form text-center mt-2">
          <h6 className="">LC Wise Total Cost Information</h6>
          {rowDto?.length > 0 && (
            <>
              <b className="ml-5">PO No : {currentRow?.ponumber}</b>
              <b className="ml-5">LC No : {currentRow?.lcnumber}</b>
              <b className="ml-5">
                LC Date : {_dateFormatter(currentRow?.dteLcdate)}
              </b>{" "}
              <b className="ml-5">
                {" "}
                PO Date : {_dateFormatter(currentRow?.poDate)}
              </b>{" "}
              <b className="ml-5">Supplier : {currentRow?.beneficiaryName}</b>{" "}
              <b className="ml-5">
                Total Value : {_formatMoney(currentRow?.totalBalance)} BDT
              </b>{" "}
            </>
          )}
        </div>

        {/* Table Start */}
        {
          <div className="react-bootstrap-table table-responsive">
            <table className="table table-striped table-bordered bj-table bj-table-landing">
              <thead>
                <tr>
                  {header?.length > 0 &&
                    header?.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
              </thead>

              <tbody>
                {rowDto?.length > 0 ? (
                  rowDto?.map((item, index) => {
                    return item?.section === 1 ? (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.strHead}</td>
                        <td className="text-right">
                          {item?.numBookedAmount
                            ? _formatMoney(item?.numBookedAmount, 4)
                            : ""}
                        </td>
                        <td className="text-right">
                          {item?.numActualAmount
                            ? _formatMoney(item?.numActualAmount, 4)
                            : ""}
                        </td>
                      </tr>
                    ) : (
                      false
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td>1</td>
                      <td>Invoice Payment in Local Currency</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Custom Duty</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Port Charge</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Shipping Charge</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Crearing and forwarding</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Inland transportation</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>Survey and Inspection</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>Unloading Charge</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>Cleaning Charge</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>Insurance</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>11</td>
                      <td>Document Acceptance/Release</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>12</td>
                      <td>Bank charges and commissions</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>13</td>
                      <td>Payment of Performance Guarantee</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <p className="text-right font-weight-bold m-0">
                          Total Cost including VAT and TAX
                        </p>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </>
                )}
                {rowDto?.length > 0 && (
                  <tr className="font-weight-bold">
                    <td colSpan="2">
                      <p className="text-right  m-0">
                        Total Cost including VAT and TAX
                      </p>
                    </td>
                    <td></td>
                    <td className="text-right">
                      {" "}
                      {_formatMoney(totalCostIncludingVatAndTax(), 4)}{" "}
                    </td>
                  </tr>
                )}

                {rowDto?.length > 0 ? (
                  rowDto?.map((item, index) => {
                    return item?.section === 2 ? (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.strHead}</td>
                        <td className="text-right">
                          {_formatMoney(item?.numBookedAmount, 4)}
                        </td>
                        <td className="text-right">
                          {" "}
                          {
                            "0"
                            // _formatMoney(item?.numActualAmount , 4)
                          }{" "}
                        </td>
                      </tr>
                    ) : (
                      false
                    );
                  })
                ) : (
                  <>
                    {" "}
                    <tr>
                      <td>14</td>
                      <td>Value Added Tax (VAT)</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>15</td>
                      <td>Advance Tax (AT)</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>16</td>
                      <td>Advance Income Tax (AIT)</td>
                      <td></td>
                      <td></td>
                    </tr>{" "}
                  </>
                )}
                <tr className="font-weight-bold text-right">
                  <td></td>
                  <td>Total Deduction of VAT and TAX</td>
                  <td></td>
                  <td> {_formatMoney(totalDeductionOfVatAndTax(), 4)} </td>
                </tr>
                <tr className="font-weight-bold text-right">
                  <td></td>
                  <td>Net Landing Cost Excluding VAT and TAX</td>
                  <td></td>
                  <td>{_formatMoney(netLandingCostExcludingVatAndTax, 4)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  );
};

export default Print;
