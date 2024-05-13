import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ToWords } from "to-words";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
// import background from "../../../../_helper/letterheadImages/akij_cement_letterhead.jpg";
import "./InvoiceRecept.css";
import { cementLetterhead } from "../base64Images/cement";
import { readymixLetterhead } from "../base64Images/readymix";
import { MTSLetterhead } from "../base64Images/mts";
import { essentialLetterhead } from "../base64Images/essential";
import { bluePillLetterhead } from "../base64Images/bluePill";
import { polyFibreLetterhead } from "../base64Images/polyFibre";
import { ispatLetterhead } from "../base64Images/ispat";
import { buildingLetterhead } from "../base64Images/building";
import { magnumLetterhead } from "../base64Images/magnum";
import { commoditiesLetterhead } from "../base64Images/commodities";
import { tradersLetterhead } from "../base64Images/traders";
import { tradingLetterhead } from "../base64Images/trading";
import { oneTradingLetterhead } from "../base64Images/oneTrading";
import { batayonTradersLetterhead } from "../base64Images/batayounTraders";
import { bongoTradersLetterhead } from "../base64Images/bongoTraders";
import { dailyTradingLetterhead } from "../base64Images/dailyTrading";
import { directTradingLetterhead } from "../base64Images/directTrading";
import { eurasiaTradingLetterhead } from "../base64Images/eurasiaTrading";
import { exoticaTradersLetterhead } from "../base64Images/exoticaTraders";
import { lineAsiaTradingLetterhead } from "../base64Images/lineAsiaTrading";
import { nobayonTradersLetterhead } from "../base64Images/nobayonTraders";
import { optimaTradersLetterhead } from "../base64Images/optimaTraders";
import { resourceTradersLetterhead } from "../base64Images/resourceTraders";

const InvoiceReceptForCement = ({ printRef, invoiceData, channelId }) => {
  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  // get user data from store
  const {
    profileData: { employeeFullName: empName, designationName },
    selectedBusinessUnit: { label: buName, value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  let totalQty = 0;
  let totalNetQty = 0;
  let grandTotal = 0;
  let grandVatTotal = 0;
  let grandTotalWithVat = 0;
  // let totalItemRate = 0;

  const getStyle = {
    fontWeight: "bold",
    fontSize: "16px",
    color: "black !important",
    verticalAlign: "middle",
  };

  const letterhead =
    buId === 175
      ? readymixLetterhead
      : buId === 94
      ? MTSLetterhead
      : buId === 144
      ? essentialLetterhead
      : buId === 4
      ? cementLetterhead
      : buId === 186
      ? bluePillLetterhead
      : buId === 8
      ? polyFibreLetterhead
      : buId === 224
      ? ispatLetterhead
      : buId === 220
      ? buildingLetterhead
      : buId === 171
      ? magnumLetterhead
      : buId === 221
      ? commoditiesLetterhead
      : buId === 216
      ? tradersLetterhead
      : buId === 213
      ? tradingLetterhead
      : buId === 181
      ? oneTradingLetterhead
      : buId === 212
      ? batayonTradersLetterhead
      : buId === 178
      ? bongoTradersLetterhead
      : buId === 182
      ? dailyTradingLetterhead
      : buId === 180
      ? directTradingLetterhead
      : buId === 183
      ? eurasiaTradingLetterhead
      : buId === 218
      ? exoticaTradersLetterhead
      : buId === 209
      ? lineAsiaTradingLetterhead
      : buId === 211
      ? nobayonTradersLetterhead
      : buId === 214
      ? optimaTradersLetterhead
      : buId === 210
      ? resourceTradersLetterhead
      : "";

  const isVatinclude = invoiceData?.[0]?.isVatinclude || false;
  return (
    <div>
      <div ref={printRef} id="print_sales_invoice_wrapper_cement">
        <div
          className="invoice-header"
          style={{
            backgroundImage: `url(${letterhead})`,
            backgroundRepeat: "no-repeat",
            height: "150px",
            backgroundPosition: "left 10px",
            backgroundSize: "cover",
            position: "fixed",
            width: "100%",
            top: "-40px",
          }}
        ></div>
        <div
          className="invoice-footer"
          style={{
            backgroundImage: `url(${letterhead})`,
            backgroundRepeat: "no-repeat",
            height: "100px",
            backgroundPosition: "left bottom",
            backgroundSize: "cover",
            bottom: "-0px",
            position: "fixed",
            width: "100%",
          }}
        ></div>
        <table>
          <thead>
            <tr>
              <td
                style={{
                  border: "none",
                }}
              >
                {/* place holder for the fixed-position header */}
                <div
                  style={{
                    height: "110px",
                  }}
                ></div>
              </td>
            </tr>
          </thead>
          {/* CONTENT GOES HERE */}
          <tbody>
            <div style={{ margin: "-13px 50px 51px 50px" }}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  // marginTop: "120px",
                }}
              >
                <i>
                  <p
                    style={{
                      fontSize: "30px",
                      textDecoration: "underLine",
                      fontWeight: "bold",
                    }}
                  >
                    Invoice: {invoiceData[0]?.strInvoiceNo}
                  </p>
                </i>
              </div>
              <div>
                <p>
                  <b>
                    DATE:{" "}
                    {_dateFormatter(invoiceData[0]?.invoiceDate || new Date())}
                  </b>
                </p>
                <p>
                  <b>Reference: {invoiceData[0]?.referance}</b>
                </p>
                <br />
                <p>
                  <b>{invoiceData[0]?.customerName}</b>
                </p>
                <p>{invoiceData[0]?.businessPartnerAddress}</p>

                <p style={{ margin: "2px 0" }}>
                  <strong> Delivery Address:</strong>{" "}
                  {invoiceData[0]?.projLocation}
                </p>

                <p>Dear Sir,</p>
                <p>
                  We are pleased to issue a bill in favour of our supply as per
                  your purchase order.
                </p>
                <br />
              </div>
              <div className="main_table">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={getStyle}>SL</th>
                      <th style={getStyle}>Item</th>
                      <th style={getStyle}>Sales Order</th>
                      {/* <th style={getStyle}>Destination</th> */}
                      <th style={{ width: "90px", ...getStyle }}>
                        Delivery Date
                      </th>
                      <th style={getStyle}>Challan No.</th>
                      <th style={getStyle}>{`${
                        channelId === 43 ? "Primary Qty" : "Qty"
                      }`}</th>
                      <th style={getStyle}>UoM</th>
                      {channelId === 43 && <th style={getStyle}>Net Qty</th>}

                      <th style={{ ...getStyle, width: "90px" }}>
                        {/* Unit Price (TK/{`${channelId === 43 ? "M.T" : "Bag"}`}) */}
                        Unit Price (TK)
                      </th>
                      <th style={getStyle}>
                        Total Amount
                        {isVatinclude ? " (Without VAT)" : ""}
                      </th>
                      {isVatinclude && (
                        <>
                          {" "}
                          <th style={getStyle}>Vat Amount</th>
                          <th style={getStyle}>Total Amount(Vat included)</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData?.map((item, index) => {
                      let totalAmount = 0;
                      let vatAmount = 0;
                      let amountWithVat = 0;

                      if ([8].includes(buId)) {
                        // if vat is included in the price
                        if (isVatinclude) {
                          totalAmount =
                            (+item?.totalAmount || 0) - (+item?.vatAmount || 0);
                          vatAmount = item?.vatAmount || 0;
                          amountWithVat = totalAmount + vatAmount;
                        } else {
                          // if vat is not included in the price
                          totalAmount = item?.totalAmount || 0;
                          vatAmount = 0;
                          amountWithVat = totalAmount + vatAmount;
                        }
                      } else {
                        totalAmount = item?.totalAmount || 0;
                        vatAmount = item?.vatAmount || 0;
                        amountWithVat = totalAmount + vatAmount;
                      }

                      totalQty += item?.quantity;
                      // totalQty += item?.totalDeliveredQtyCFT;
                      grandTotal += totalAmount;
                      grandVatTotal += item?.vatAmount || 0;
                      grandTotalWithVat += amountWithVat;
                      // totalItemRate += item?.itemRate || 0;
                      totalNetQty += item?.netQty || 0;

                      return (
                        <>
                          <tr>
                            <td className="text-center">{index + 1}</td>
                            <td>{item?.itemName}</td>
                            <td>{item?.orderCode}</td>
                            {/* <td>{item?.deliveryAddress}</td> */}
                            <td>{_dateFormatter(item?.deliveriDate)}</td>
                            <td>{item?.deliveryCode}</td>
                            <td className="text-right">
                              {item?.quantity}
                              {/* {_fixedPoint(item?.totalDeliveredQtyCFT, true)} */}
                            </td>
                            <td className="text-right">{item?.uom}</td>
                            {channelId === 43 && (
                              <td className="text-right">{item?.netQty}</td>
                            )}

                            <td
                              className="text-right"
                              style={{ width: "60px" }}
                            >
                              {item?.itemRate}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(totalAmount, true)}
                            </td>
                            {isVatinclude && (
                              <>
                                <td className="text-right">
                                  {_fixedPoint(item?.vatAmount, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(amountWithVat, true)}
                                </td>
                              </>
                            )}
                          </tr>
                        </>
                      );
                    })}

                    <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                      <td colSpan={5}>Grand Total</td>
                      <td>{_fixedPoint(totalQty, true)}</td>
                      <td> </td>
                      {channelId === 43 && (
                        <td>{_fixedPoint(totalNetQty, true)}</td>
                      )}
                      <td> </td>
                      <td>{_fixedPoint(grandTotal, true)}</td>
                      {isVatinclude && (
                        <>
                          <td>{_fixedPoint(grandVatTotal, true)}</td>
                          <td>{_fixedPoint(grandTotalWithVat, true)}</td>
                        </>
                      )}
                    </tr>
                    <tr style={{ fontWeight: "bold", textAlign: "left" }}>
                      <td
                        colSpan={
                          channelId === 43
                            ? isVatinclude
                              ? 12
                              : 10
                            : isVatinclude
                            ? 11
                            : 9
                        }
                        className="text-left"
                      >
                        IN WORDS:{" "}
                        {toWords.convert(
                          isVatinclude
                            ? Number(grandTotalWithVat || 0).toFixed(0)
                            : Number(grandTotal || 0)?.toFixed(0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-danger py-2">
                Note : If you have any queries regarding this bill, please
                inform the concerned official within 10 days; otherwise, any
                kind of objection will not be granted further.
              </p>
              <p>On behalf of {buName}</p>
              <div
                style={{ marginTop: "70px" }}
                className="d-flex justify-content-between"
              >
                <p>
                  <b>Prepared By</b>
                </p>
                <p>
                  <b>Recieved By</b>
                </p>
              </div>
              <div className="signature_wrapper">
                <div className="first signature bold">
                  <p>{empName}</p>
                </div>
              </div>
              <p>{designationName}</p>
              <p>{buName}</p>
              <div style={{ marginTop: "25px" }}>
                <p>
                  <b>Enclose</b>
                </p>
                <p>1. Delivery Invoice</p>
              </div>
              <div style={{ position: "relative" }}>
                <p
                  style={{
                    bottom: "100px",
                    textAlign: "center",
                    position: "fixed",
                    width: "100%",
                    fontWeight: "bold",
                  }}
                >
                  This is an automatically generated invoice, no signature is
                  required.
                </p>
              </div>
            </div>
          </tbody>

          <tfoot>
            <tr>
              <td
                style={{
                  border: "none",
                }}
              >
                {/* place holder for the fixed-position footer */}
                <div
                  style={{
                    height: "150px",
                  }}
                ></div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InvoiceReceptForCement;
