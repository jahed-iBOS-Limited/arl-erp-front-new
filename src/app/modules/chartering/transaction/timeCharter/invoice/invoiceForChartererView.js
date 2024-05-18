import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { ToWords } from "to-words";
// import akijShippingLogo from "../../../_chartinghelper/assets/images/logos/akijShippingText.svg";
import {
  _formatMoney,
  _formatMoneyWithDoller,
} from "../../../_chartinghelper/_formatMoney";
import { getOwnerBankInfoDetailsById } from "../helper";
import { BankInfoComponent } from "./bankInfoComponent";
import letterhead from "../../assets/images/shipping_line_pte_letterhead.jpeg";
import "./style.css";

const toWords = new ToWords({
  localeCode: "en-US",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

export default function InvoiceForChartererView({
  invoiceHireData,
  formikprops,
  rowData,
}) {
  const [bankInfoData, setBankInfoData] = useState();
  const { values } = formikprops;

  /* Bank Info & Prev Hire API */
  useEffect(() => {
    if (invoiceHireData?.beneficiaryId) {
      getOwnerBankInfoDetailsById(
        invoiceHireData?.beneficiaryId,
        setBankInfoData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceHireData]);

  let totalCredit = 0;
  let totalDebit = 0;

  const printRef = useRef();

  return (
    <>
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
      </div>
      <div
        ref={printRef}
        className="p-4 transactionInvoice"
        style={{
          backgroundImage: `url(${letterhead})`,
          backgroundRepeat: "no-repeat",
          // backgroundPosition: "center",
          backgroundPosition: "50% 50%",
          backgroundSize: "cover",
          width: "100%",
          height: "100%",
        }}
      >
        {/* <div className="timeCharterLogo">
          <img src={akijShippingLogo} alt={akijShippingLogo} />
        </div> */}
        <div className="invoiceForChartererWraper">
          <h5 className="text-center uppercase mb-4 statementTitle">
            {values?.transactionName?.label || invoiceHireData?.transactionName}{" "}
            STATEMENT
          </h5>

          <div className="column-header-section">
            {/* Left */}
            <div>
              <div className="headerWrapper">
                <div className="headerKey">VESSEL & VOYAGE :</div>
                <div className="headerValue">{`${invoiceHireData?.vesselName} & ${invoiceHireData?.voyageNo}`}</div>
              </div>
              <div className="headerWrapper">
                <div className="headerKey">OWNER :</div>
                <div className="headerValue">{invoiceHireData?.ownerName}</div>
              </div>
              <div className="headerWrapper">
                <div className="headerKey">CHTR :</div>
                <div className="headerValue">{invoiceHireData?.chtrName}</div>
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
                <div className="headerValue">{invoiceHireData?.brokerage}%</div>
              </div>
              <div className="headerWrapper">
                <div className="headerKey">ADD COMM :</div>
                <div className="headerValue">{invoiceHireData?.comm}%</div>
              </div>
              <div className="headerWrapper mb-2">
                <div className="headerKey">LSFO PRICE/MT :</div>
                <div className="headerValue">
                  {_formatMoney(invoiceHireData?.lsfoprice)} USD
                </div>
              </div>
            </div>

            {/* Right */}
            <div>
              <div className="headerWrapper">
                <div className="headerKey">DATE OF INVOICE :</div>
                <div className="headerValue">
                  {invoiceHireData?.transactionDate ||
                    moment(invoiceHireData?.cpdtd).format("DD-MMM-YYYY")}
                </div>
              </div>

              <div className="headerWrapper">
                <div className="headerKey">REF :</div>
                <div className="headerValue">{invoiceHireData?.refNo}</div>
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
            <table className="table mt-3 bj-table bj-table-landing">
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
                        {+item?.duration > 0 ? `${item?.duration} DAYS` : ""}
                      </td>
                      <td className={`text-right`}>
                        {item?.quantity > 0 ? `${+item?.quantity} MT` : ""}
                      </td>
                      <td className={`text-right`}>
                        {_formatMoneyWithDoller(item?.debit?.toFixed(2))}
                      </td>
                      <td className={`text-right`}>
                        {_formatMoneyWithDoller(item?.credit?.toFixed(2))}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="4" className="text-right mr-3">
                    <strong>Total</strong>
                  </td>
                  <td className="text-right">
                    <strong>
                      {_formatMoneyWithDoller(totalDebit?.toFixed(2)) || 0}
                    </strong>
                  </td>
                  <td className="text-right">
                    <strong>
                      {_formatMoneyWithDoller(totalCredit?.toFixed(2)) || 0}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right mr-3">
                    <strong>AMOUNT PAYABLE TO OWNERS</strong>
                  </td>
                  <td colSpan={2} className="text-right">
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
                {(totalCredit?.toFixed(2) - totalDebit?.toFixed(2)).toFixed(
                  2
                ) ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div>
                        <strong>
                          {`(In Word USD) ${toWords.convert(
                            (
                              totalCredit?.toFixed(2) - totalDebit?.toFixed(2)
                            ).toFixed(2)
                          )}`}
                        </strong>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          {/* </div> */}

          {/* Bank Info Section */}
          <BankInfoComponent data={bankInfoData} />
        </div>
      </div>
    </>
  );
}
