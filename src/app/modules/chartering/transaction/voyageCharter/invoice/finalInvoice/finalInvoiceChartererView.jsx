import React from "react";
import { ToWords } from "to-words";
import { _formatMoneyWithDoller } from "../../../../_chartinghelper/_formatMoney";
import "../style.css";

const toWords = new ToWords({
  localeCode: "en-US",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

function FinalInvoiceChartererView({ rowData, invoiceHireData }) {
  return (
    <>
      <div className="table-responsive">
      <table className="table mt-3 bj-table bj-table-landing mt-3">
        <thead>
          <tr
            style={{ borderTop: "1px solid #d6d6d6" }}
            className="text-center"
          >
            <th>SL</th>
            <th>PARTICULARS</th>
            <th>CARGO QTY MT</th>
            <th>FRIEGHT RATE USD/PMT</th>
            <th>Debit</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => (
            <tr key={index}>
              <td style={{ width: "40px" }} className="text-center">
                {index + 1}
              </td>
              <td className="text-left">{item?.particulars}</td>
              <td className="text-right">
                {+item?.cargoQty > 0 ? item.cargoQty : ""}
              </td>
              <td className="text-right">
                {_formatMoneyWithDoller(item?.freightRate?.toFixed(2))}
              </td>
              <td className="text-right">
                {_formatMoneyWithDoller(item?.credit?.toFixed(2))}
              </td>
              <td className="text-right">
                {_formatMoneyWithDoller(item?.debit?.toFixed(2))}
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan={4} className="text-right">
              <strong>NET PAYABLE TO OWNERS</strong>
            </td>
            <td colSpan={2} className="text-right">
              <strong>
                {_formatMoneyWithDoller(
                  invoiceHireData?.totalNetPayble?.toFixed(2)
                )}
              </strong>
            </td>
          </tr>

          {invoiceHireData?.totalNetPayble ? (
            <tr>
              <td colSpan="7" className="text-center">
                <div>
                  <strong>
                    {`(In Word USD) ${toWords.convert(
                      invoiceHireData?.totalNetPayble
                    )}`}
                  </strong>
                </div>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
      </div>
    </>
  );
}

export default FinalInvoiceChartererView;
