import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { ToWords } from "to-words";
// import akijShippingLogo from "../../../_chartinghelper/assets/images/logos/akijShippingText.svg";
import Loading from "../../../../_helper/_loading";
import {
  _formatMoney,
  _formatMoneyWithDoller,
} from "../../../_chartinghelper/_formatMoney";
// import akijResourceLogo from "../../../_chartinghelper/assets/images/logos/akij-resource.png";
// import akijShippingLogo from "../../../_chartinghelper/assets/images/logos/shipping.png";
// import Envelope from "../../../_chartinghelper/assets/images/social/envelope.svg";
// import Internet from "../../../_chartinghelper/assets/images/social/internet.svg";
// import WhatsApp from "../../../_chartinghelper/assets/images/social/whatsapp.svg";
import { ExportPDF } from "../../../_chartinghelper/exportPdf";
import letterhead from "../../assets/images/shipping_line_pte_letterhead.jpeg";
import { getOwnerBankInfoDetailsById } from "../helper";
import { BankInfoComponent } from "./bankInfoComponent";
import "./style.css";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { getLetterHead } from "../../../../financialManagement/report/bankLetter/helper";

const toWords = new ToWords({
  localeCode: "en-US",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

export default function InvoiceForOwnerView({
  invoiceHireData,
  formikprops,
  rowData,
}) {
  const [bankInfoData, setBankInfoData] = useState();
  const [loading, setLoading] = useState(false);
  const { values } = formikprops;
  const location = useLocation();

  /* Bank Info & Prev Hire API */
  useEffect(() => {
    if (invoiceHireData?.beneficiaryId) {
      getOwnerBankInfoDetailsById(
        invoiceHireData?.beneficiaryId,
        setBankInfoData
      );
    } else if (location?.actionType === "view") {
      getOwnerBankInfoDetailsById(
        location?.state?.beneficiaryId,
        setBankInfoData
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceHireData]);

  let totalCredit = 0;
  let totalDebit = 0;

  const printRef = useRef();

  const exportToExcel = () => {
    const wsData = [
      [
        "VESSEL & VOYAGE :",
        `${invoiceHireData?.vesselName} & V${invoiceHireData?.voyageNo}`,
      ],
      ["OWNER :", invoiceHireData?.ownerName],
      ["CHTR :", invoiceHireData?.chtrName],
      [
        "DELIVERY :",
        moment(invoiceHireData?.deliveryDate).format("DD-MMM-YYYY HH:mm A"),
      ],
      [
        "REDELIVERY :",
        moment(
          invoiceHireData?.reDeliveryDate || invoiceHireData?.dteReDeliveryDate
        ).format("DD-MMM-YYYY HH:mm A"),
      ],
      ["TOTAL DURATION :", invoiceHireData?.totalDuration],
      ["BROKERAGE :", `${invoiceHireData?.brokerage}%`],
      ["ADD COMM :", `${invoiceHireData?.comm}%`],
      ["LSFO PRICE/MT :", `${_formatMoney(invoiceHireData?.lsfoprice)} USD`],
      ["DATE OF INVOICE :", invoiceHireData?.invoiceDate],
      ["REF :", invoiceHireData?.refNo],
      ["DUE DATE :", moment(invoiceHireData?.dueDate).format("DD-MMM-YYYY")],
      ["START PORT :", invoiceHireData?.startPortName],
      ["END PORT :", invoiceHireData?.endPortName],
      ["DAILY HIRE :", `${_formatMoney(invoiceHireData?.dailyHire)} USD`],
      ["ILOHC :", `${_formatMoney(invoiceHireData?.ilohc)} USD`],
      ["C/V/E /DAYS :", `${_formatMoney(invoiceHireData?.cveday)} USD`],
      ["LSMGO PR/MT :", `${_formatMoney(invoiceHireData?.lsmgoprice)} USD`],
      [],
      ["SR.", "DESCRIPTION", "Duration", "Quantity", "Debit", "Credit"],
      ...rowData.map((item, index) => [
        index + 1,
        item.description,
        +item.duration > 0 ? `${item.duration} DAYS` : "",
        +item.quantity > 0 ? `${+item.quantity} MT` : "",
        _formatMoneyWithDoller(item.credit?.toFixed(2)),
        _formatMoneyWithDoller(item.debit?.toFixed(2)),
      ]),
      [
        "Total",
        "",
        "",
        "",
        _formatMoneyWithDoller(totalCredit?.toFixed(2)),
        _formatMoneyWithDoller(totalDebit?.toFixed(2)),
      ],
      [
        "AMOUNT PAYABLE TO OWNERS",
        "",
        "",
        "",
        "",
        _formatMoneyWithDoller((totalCredit - totalDebit)?.toFixed(2)),
      ],
      [
        `(In Word USD) ${toWords.convert(
          (totalCredit - totalDebit)?.toFixed(2)
        )}`,
      ],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");
    XLSX.writeFile(wb, `${invoiceHireData?.vesselName}_Invoice.xlsx`);
  };


  return (
    <>
      {loading && <Loading />}
      <div className="d-flex justify-content-end my-2">
        <ReactToPrint
          pageStyle={
            "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
          }
          trigger={() => (
            <button type="button" className="btn btn-primary px-3 py-2">
              <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
              Print
            </button>
          )}
          content={() => printRef.current}
        />
        <button
          className="btn btn-primary px-3 py-2 mr-2 ml-3"
          type="button"
          onClick={() => {
            ExportPDF(
              `${invoiceHireData?.vesselName} & V${invoiceHireData?.voyageNo} ${values?.transactionName?.label} STATEMENT`,
              setLoading
            );
          }}
        >
          Export PDF
        </button>
        <button
          className="btn btn-primary px-3 py-2 mr-2 ml-3"
          type="button"
          onClick={exportToExcel}
        >
          Export Excel
        </button>
      </div>
      <div ref={printRef} className="p-4 transactionInvoice" id="pdf-section">
        <div>
          <div
            className="invoice-header"
            style={{
              backgroundImage: `url(${getLetterHead({
                buId: invoiceHireData?.businessUnitId,
              })})`,
              backgroundRepeat: "no-repeat",
              height: "170px",
              backgroundPosition: "left 10px",
              backgroundSize: "cover",
              position: "fixed",
              width: "100%",
              top: "-50px",
              left: "-2px",
            }}
          ></div>
          <div
            className="invoice-footer"
            style={{
              backgroundImage: `url(${getLetterHead({
                buId: invoiceHireData?.businessUnitId,
              })})`,
              backgroundRepeat: "no-repeat",
              height: "100px",
              backgroundPosition: "left bottom",
              backgroundSize: "cover",
              bottom: "-0px",
              position: "fixed",
              width: "100%",
              left: "-2px",
            }}
          ></div>
          <table style={{ width: "100%" }}>
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
            <tbody>
              <div
                style={{ marginTop: "2px" }}
                className="invoiceForChartererWraper"
              >
                <h5
                  className="text-center uppercase mb-4 statementTitle"
                  // style={{ marginTop: "120px" }}
                >
                  {values?.transactionName?.label ||
                    invoiceHireData?.transactionName}{" "}
                  STATEMENT
                </h5>

                {/* First Column Header */}
                <div className="column-header-section">
                  {/* left */}
                  <div>
                    <div className="headerWrapper">
                      <div className="headerKey">VESSEL & VOYAGE :</div>
                      <div className="headerValue">{`${invoiceHireData?.vesselName} & V${invoiceHireData?.voyageNo}`}</div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">OWNER :</div>
                      <div className="headerValue">
                        {invoiceHireData?.ownerName}
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">CHTR :</div>
                      <div className="headerValue">
                        {invoiceHireData?.chtrName}
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">DELIVERY :</div>
                      <div className="headerValue">
                        {moment(invoiceHireData?.deliveryDate).format(
                          "DD-MMM-YYYY HH:mm A"
                        )}
                      </div>
                    </div>
                    <div className="headerWrapper mb-2">
                      <div className="headerKey">REDELIVERY :</div>
                      <div className="headerValue">
                        {moment(
                          invoiceHireData?.reDeliveryDate ||
                            invoiceHireData?.dteReDeliveryDate
                        ).format("DD-MMM-YYYY HH:mm A")}
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">TOTAL DURATION :</div>
                      <div className="headerValue">
                        {invoiceHireData?.totalDuration}
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">BROKERAGE :</div>
                      <div className="headerValue">
                        {invoiceHireData?.brokerage}%
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">ADD COMM :</div>
                      <div className="headerValue">
                        {invoiceHireData?.comm}%
                      </div>
                    </div>
                    <div className="headerWrapper mb-2">
                      <div className="headerKey">LSFO PRICE/MT :</div>
                      <div className="headerValue">
                        {_formatMoney(invoiceHireData?.lsfoprice)} USD
                      </div>
                    </div>
                  </div>
                  {/* right */}
                  <div>
                    <div className="headerWrapper">
                      <div className="headerKey">DATE OF INVOICE :</div>
                      <div className="headerValue">
                        {
                          invoiceHireData?.invoiceDate
                          // || moment(invoiceHireData?.cpdtd).format("DD-MMM-YYYY")
                        }
                      </div>
                      {/* <div className="headerValue">
                {invoiceHireData?.transactionDate ||
                  moment(invoiceHireData?.cpdtd).format("DD-MMM-YYYY")}
              </div> */}
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">REF :</div>
                      <div className="headerValue">
                        {invoiceHireData?.refNo}
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">DUE DATE :</div>
                      <div className="headerValue">
                        {moment(invoiceHireData?.dueDate).format("DD-MMM-YYYY")}
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">START PORT :</div>
                      <div className="headerValue">
                        {invoiceHireData?.startPortName}
                      </div>
                    </div>
                    <div className="headerWrapper mb-2">
                      <div className="headerKey">END PORT :</div>
                      <div className="headerValue">
                        {invoiceHireData?.endPortName}
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">DAILY HIRE :</div>
                      <div className="headerValue">
                        {_formatMoney(invoiceHireData?.dailyHire)} USD
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">ILOHC :</div>
                      <div className="headerValue">
                        {_formatMoney(invoiceHireData?.ilohc)} USD
                      </div>
                    </div>
                    <div className="headerWrapper">
                      <div className="headerKey">C/V/E /DAYS :</div>
                      <div className="headerValue">
                        {_formatMoney(invoiceHireData?.cveday)} USD
                      </div>
                    </div>
                    <div className="headerWrapper mb-2">
                      <div className="headerKey">LSMGO PR/MT :</div>
                      <div className="headerValue">
                        {_formatMoney(invoiceHireData?.lsmgoprice)} USD
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row And Table Section */}
                {/* <div className="table-responsive"> */}
                <div className="table-responsive">
                  <table className="table mt-1 bj-table bj-table-landing">
                    <thead>
                      <tr
                        style={{ borderTop: "1px solid #d6d6d6" }}
                        className="text-center"
                      >
                        <th>SR.</th>
                        <th>DESCRIPTION</th>
                        <th>Duration</th>
                        <th>Quantity</th>
                        <th>Debit</th>
                        <th>Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => {
                        totalCredit = totalCredit + item?.credit;
                        totalDebit = totalDebit + item?.debit;

                        return (
                          <tr key={index}>
                            <td className={`text-center`}>{index + 1}</td>
                            <td className={`text-left`}>{item?.description}</td>
                            <td className={`text-right`}>
                              {+item?.duration > 0
                                ? `${item?.duration} DAYS`
                                : ""}
                            </td>
                            <td className={`text-right`}>
                              {+item?.quantity > 0
                                ? `${+item?.quantity} MT`
                                : ""}
                            </td>
                            {/* 
                  N.B: Debit Will be Credit & Credit will be Debit For Owner View
                  */}
                            <td className={`text-right`}>
                              {_formatMoneyWithDoller(item?.credit?.toFixed(2))}
                            </td>
                            <td className={`text-right`}>
                              {_formatMoneyWithDoller(item?.debit?.toFixed(2))}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan="4" className="text-right mr-3">
                          <strong>Total</strong>
                        </td>
                        {/* Credit Here For Owner */}
                        <td className="text-right">
                          <strong>
                            {_formatMoneyWithDoller(totalCredit?.toFixed(2)) ||
                              0}
                          </strong>
                        </td>
                        {/* Debit Here! For Onwner */}
                        <td className="text-right">
                          <strong>
                            {_formatMoneyWithDoller(totalDebit?.toFixed(2)) ||
                              0}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-right mr-3">
                          <strong>AMOUNT PAYABLE TO OWNERS</strong>
                        </td>
                        <td colSpan="2" className="text-right">
                          <strong>
                            {_formatMoneyWithDoller(
                              (
                                totalCredit?.toFixed(2) - totalDebit?.toFixed(2)
                              ).toFixed(2)
                            ) || 0}
                          </strong>
                        </td>
                      </tr>

                      {/* In Word USD */}
                      {(
                        totalCredit?.toFixed(2) - totalDebit?.toFixed(2)
                      ).toFixed(2) ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            <div>
                              <strong>
                                {`(In Word USD) ${toWords.convert(
                                  (
                                    totalCredit?.toFixed(2) -
                                    totalDebit?.toFixed(2)
                                  ).toFixed(2)
                                )}`}
                              </strong>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                {/* </div> */}

                {/* Bank Info Section */}
                <BankInfoComponent data={bankInfoData} />
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
    </>
  );
}
