import React from "react";
import { ToWords } from "to-words";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import "./InvoiceRecept.css";
// import image from "../../../../_helper/images/armcl_logo.png";
// import successorsLogo from "../../../../_helper/images/SUCCESSORS-LOGO.png";
import { shallowEqual, useSelector } from "react-redux";
import { essentialLetterhead } from "../base64Images/essential";
import { MTSLetterhead } from "../base64Images/mts";
import { readymixLetterhead } from "../base64Images/readymix";

const InvoiceRecept = ({ printRef, invoiceData }) => {
  const {
    profileData: { employeeFullName, designationName },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  let totalDeliveryQtyCFT = 0;
  let totalDeliveryQtyCUM = 0;
  let totalAmount = 0;

  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  const letterhead =
    buId === 175
      ? readymixLetterhead
      : buId === 94
      ? MTSLetterhead
      : buId === 144
      ? essentialLetterhead
      : "";

  return (
    <div
      className="sales_invoice_print_wrapper"
      ref={printRef}
      style={{
        backgroundImage: `url(${letterhead})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100%",
        height: "100%",
      }}
    >
      {/* <div className="header">
        <div className="office_info">
          <p>Corporate Office :Akij House, 198, Bir Uttam Mir Shawkat Sarak</p>
          <p>
            (Gulshan-Tejgaon Link Road), Tejgaon I/A, Dhaka-1208, Phone :
            09613313131, 09604313131
          </p>
          <p>Email: info@akij.net, Website: www.akijcement.com</p>
          <p>Factory Location: Dhour, Narayanganj.</p>
        </div>
        {[175, 94].includes(buId) && (
          <div className="logo">
            <img
              style={{ width: "255px", objectFit: "cover" }}
              src={buId === 175 ? image : successorsLogo}
              alt="Logo"
            />
          </div>
        )}
      </div> */}

      <div style={{ margin: "0 50px" }}>
        <div className="main_table" style={{ marginTop: "130px" }}>
          <p className="text-center bold table_header">
            {invoiceData[0]?.strInvoiceNo}
          </p>
          <table className="table">
            <thead>
              <tr>
                <th colspan="5" className="text-left">
                  Name of company: {invoiceData[0]?.customerName}.
                </th>
                <th colspan="2" className="text-left">
                  Ref: {invoiceData[0]?.referance}
                </th>
              </tr>
              <tr>
                <th
                  colspan="5"
                  className="text-left"
                  style={{ backgroundColor: "rgba(128, 128, 128, 0.107)" }}
                >
                  Project Location: {invoiceData[0]?.projLocation}
                </th>
                <th colspan="2" className="text-left">
                  Date: {_dateFormatter(new Date())}
                  {/* Date: {_dateFormatter(invoiceData[0]?.deliveriDate)} */}
                </th>
              </tr>

              <tr>
                <th>SL</th>
                <th
                  style={{ minWidth: "90px", maxWidth: "90px", width: "90px" }}
                >
                  Casting Date
                </th>
                <th>Description</th>
                <th>Total Quantity (CFT)</th>
                <th>Total Quantity (CUM)</th>
                <th>Rate/CFT (TK)</th>
                <th>Total Amount (BDT)</th>
                {/* <th>Order Number</th> */}
              </tr>
            </thead>
            <tbody>
              {invoiceData?.map((item, index) => {
                totalDeliveryQtyCFT += item?.totalDeliveredQtyCFT;
                totalDeliveryQtyCUM += item?.totalDeliveredQtyCUM;
                totalAmount += item?.totalAmount;
                return (
                  <tr>
                    <td className="text-center">{index + 1}</td>
                    <td
                      style={{
                        minWidth: "90px !important",
                      }}
                      className="text-center"
                    >
                      {_dateFormatter(item?.deliveriDate)}
                    </td>
                    <td
                      style={{
                        minWidth: "192px",
                      }}
                      className="text-left"
                    >
                      {item?.itemName}
                    </td>
                    <td className="text-right">{item?.totalDeliveredQtyCFT}</td>
                    <td className="text-right">{item?.totalDeliveredQtyCUM}</td>
                    <td className="text-right">{item?.itemRate}</td>
                    <td className="text-right">{item?.totalAmount}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" className="text-right bold">
                  Total
                </td>
                <td className="text-right">{totalDeliveryQtyCFT.toFixed(2)}</td>
                <td className="text-right">{totalDeliveryQtyCUM.toFixed(2)}</td>
                <td></td>
                <td className="text-right">{totalAmount.toFixed(0)}</td>
              </tr>
              <tr>
                <td colspan="7" className="bold">
                  In Words:
                  <span style={{ textTransform: "capitalize" }}>
                    {" "}
                    {toWords.convert(totalAmount.toFixed(0))}
                    {/* {convertNumberToWords(totalAmount?.toFixed(0))}{" "} */}
                    {/* {amountToWords(totalAmount?.toFixed(0))}{" "} */}
                  </span>
                  {/* TK Only */}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="note bold">
            <p>Note:</p>
            <ul>
              <li>
                *Above total amount is{" "}
                {invoiceData[0]?.isAitinclude ? "including" : "excluding"} AIT
              </li>
              {/* <li>*RMC is not a vat able ITEM(Exampted)</li> */}
            </ul>
          </div>
        </div>
        <div className="signature_wrapper">
          <div className="first signature bold">
            <p>Recived By</p>
          </div>
          <div className="second signature bold">
            <p>Proposer</p>
          </div>
          <div className="third signature text-center">
            <p className="bold">{employeeFullName}</p>
            <span>{designationName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceRecept;
