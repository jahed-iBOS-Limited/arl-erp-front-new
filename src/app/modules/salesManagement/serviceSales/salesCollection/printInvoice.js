import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { convertNumberToWords } from "../../../_helper/_convertMoneyToWord";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import { formatMonthYear } from "../../../_helper/_getMonthYearFormat";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import printIcon from "../../../_helper/images/print-icon.png";
import { getLetterHead } from "../../../financialManagement/report/bankLetter/helper";
import "./style.css";

const PrintInvoiceModal = ({ singleItem }) => {
  const printRef = useRef();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [printData, getPrintData, loader] = useAxiosGet();

  useEffect(() => {
    getPrintData(
      `/oms/ServiceSales/GetServiceSalesInvocieById?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&serviceSalesInvoiceId=${singleItem?.invocieHeader?.intServiceSalesInvoiceId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleItem]);

  const calculateTotal = (items) => {
    return items.reduce(
      (sum, item) =>
        sum +
        ((item?.numSalesQty || 0) * (item?.numRate || 0) +
          (item?.numSalesVatAmount || 0)),
      0
    );
  };

  return (
    <>
      {loader && <Loading />}
      <div className="text-right mt-4 mb-8">
        <ReactToPrint
          pageStyle={
            "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
          }
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

      {/* Print Content */}
      <div
        componentRef={printRef}
        ref={printRef}
        className="sales-collection-table"
        style={{ margin: "-13px 0 51px 0" }}
      >
        <table>
          <thead className="sales-collection-hide">
            <div
              className="invoice-header"
              style={{
                backgroundImage: `url(${getLetterHead({
                  buId: selectedBusinessUnit?.value,
                })})`,
                backgroundRepeat: "no-repeat",
                height: "150px",
                backgroundPosition: "left 10px",
                backgroundSize: "cover",
                // position: "fixed",
                width: "100%",
                top: "-60px",
              }}
            ></div>
          </thead>
          <tbody className="print-invoice-wrapper">
            <div className="container">
              <div className="info">
                {/* <h2 className="info_item info_name ">
              {selectedBusinessUnit?.label}
            </h2>
            <h3 className="info_item info_address ">
              {selectedBusinessUnit?.businessUnitAddress}
            </h3>
            <br />
            <br /> */}
                <h3 className="info_item info_invoice ">INVOICE</h3>
              </div>
              <div></div>
              <div className="invoice_info">
                <div className="invoice_info__item">
                  <p>
                    <strong>Invoice No:</strong>
                    {printData[0]?.invocieHeader?.strServiceSalesInvoiceCode}
                  </p>
                  <p>
                    {" "}
                    <strong>Order No :</strong> ORD202309018{" "}
                  </p>
                  <p></p>
                </div>
                <div className="invoice_info__item">
                  <p>
                    <strong> Invoice Date:</strong>

                    {_dateFormatter(
                      printData[0]?.invocieHeader?.dteInvoiceDateTime
                    )}
                  </p>
                  <p>
                    <strong> Order Date:</strong>
                    {_dateFormatter(printData[0]?.invocieRow[0]?.dteOrderDate)}
                  </p>
                  <p>
                    <strong> Due Date:</strong>
                    {_dateFormatter(
                      printData[0]?.invocieRow[0]?.dteDueDateTime
                    )}
                  </p>
                </div>
              </div>
              <div className="address">
                <div className="address_billing">
                  <p className="address_title">BILLING ADDRESS</p>
                  <p className="address_buyer">
                    <strong>Customer Name: </strong>{" "}
                    {printData[0]?.invocieHeader?.strCustomerName}
                  </p>
                  <p className="address_text">
                    <strong>Address: </strong>{" "}
                    {printData[0]?.invocieHeader?.strCustomerAddress}
                  </p>
                  <p className="address_text">
                    <strong>Contact Person: </strong>{" "}
                    {printData[0]?.customerContactPerson}
                  </p>
                  <p className="address_text">
                    <strong>Contact Number: </strong>{" "}
                    {printData[0]?.customerContactPersonNumber}
                  </p>
                </div>
                {/* <div className="address_shipping">
              <p className="address_title"> SHIPPING ADDRESS</p>
              <p className="address_text">
              <strong>Address: </strong>{" "}
                {printData[0]?.invocieHeader?.strCustomerAddress}
              </p>
            </div> */}
              </div>
              <div style={{ marginBottom: "15px" }}>
                <table>
                  <thead>
                    <tr style={{ height: "30px", fontSize: "14px" }}>
                      <th style={{ width: "30px" }}>SL</th>
                      <th>Item Name</th>
                      <th style={{ width: "80px" }}>UoM</th>
                      <th style={{ width: "80px" }}>Qty</th>
                      <th style={{ width: "80px" }}>Rate</th>
                      <th style={{ width: "80px" }}>Sub Total</th>
                      <th style={{ width: "80px" }}>Vat</th>
                      <th style={{ width: "80px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {printData[0]?.items?.length > 0 &&
                        printData[0]?.items?.map((item, index) => (
                          <tr key={index} style={{ height: "30px" }}>
                            <td>{index + 1}</td>
                            <td
                              style={{ textAlign: "left", paddingLeft: "5px" }}
                            >
                              {item?.strItemName}
                            </td>
                            <td>{item?.strUom || "EA"}</td>
                            <td
                              style={{
                                textAlign: "right",
                                paddingRight: "5px",
                              }}
                            >
                              {item?.numSalesQty}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                paddingRight: "5px",
                              }}
                            >
                              {_formatMoney(item?.numRate || 0)}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                paddingRight: "5px",
                              }}
                            >
                              {_formatMoney(
                                item?.numSalesQty * item?.numRate || 0
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                paddingRight: "5px",
                              }}
                            >
                              {_formatMoney(item?.numSalesVatAmount)}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                paddingRight: "5px",
                              }}
                            >
                              {_formatMoney(
                                Math.floor(
                                  item?.numSalesQty * item?.numRate +
                                    item?.numSalesVatAmount
                                ) || 0
                              )}
                            </td>
                          </tr>
                        ))}
                      <tr style={{ height: "25px", fontSize: "13px" }}>
                        <td
                          colspan="7"
                          style={{
                            textAlign: "right",
                            fontWeight: "bold",
                            paddingRight: "5px",
                          }}
                        >
                          Total Order Value
                        </td>
                        <td style={{ textAlign: "right", paddingRight: "3px" }}>
                          <strong>
                            {_formatMoney(
                              Math.floor(
                                calculateTotal(
                                  printData[0]?.items?.length > 0
                                    ? printData[0]?.items
                                    : []
                                )
                              ) || 0
                            )}
                          </strong>
                        </td>
                      </tr>
                      <tr style={{ height: "25px", fontSize: "13px" }}>
                        <td
                          colspan="7"
                          style={{
                            textAlign: "right",
                            fontWeight: "bold",
                            paddingRight: "5px",
                          }}
                        >
                          {printData[0]?.intPaymentTypeId === 1
                            ? `100% of Total Amount`
                            : `Billing Amount: ${printData[0]?.invocieRow[0]?.intPaymentByPercent}% of Total Amount`}
                        </td>
                        <td style={{ textAlign: "right", paddingRight: "3px" }}>
                          <strong>
                            {_formatMoney(
                              Math.floor(
                                printData[0]?.invocieRow[0]?.numScheduleAmount +
                                  printData[0]?.invocieRow[0]
                                    ?.numScheduleVatAmount
                              ) || 0
                            )}
                          </strong>
                        </td>
                      </tr>
                    </>
                  </tbody>
                </table>
              </div>
              <div className="taka-in-words">
                <strong>In Words: </strong>{" "}
                <p
                  style={{
                    borderBottom: "1px dashed",
                    marginLeft: "3px",
                  }}
                >
                  {(() => {
                    const invoiceRow = printData[0]?.invocieRow[0] || {};
                    const numScheduleAmount = invoiceRow.numScheduleAmount || 0;
                    const numScheduleVatAmount =
                      invoiceRow.numScheduleVatAmount || 0;

                    const totalNetAmount = Math.floor(
                      numScheduleAmount + numScheduleVatAmount
                    );

                    if (isNaN(totalNetAmount)) {
                      console.error("Invalid totalNetAmount. Check your data.");
                      return null; // or return an appropriate value for the error case
                    }

                    const totalNetAmountInWord = convertNumberToWords(
                      totalNetAmount
                    );
                    const capitalizeFirstLetter = totalNetAmountInWord
                      ? totalNetAmountInWord.charAt(0).toUpperCase() +
                        totalNetAmountInWord.slice(1)
                      : "";

                    return capitalizeFirstLetter;
                  })()}{" "}
                  only
                </p>
              </div>
              <div className="bank_details">
                <div className="bd_item">
                  <h5 className="bd_title">Bank Details:</h5>
                  <p>
                    {" "}
                    <strong>A/C Name: </strong>iBOS Limited
                  </p>
                  <p>
                    {" "}
                    <strong>A/C Number: </strong> 20502130100249715
                  </p>
                  <p>
                    {" "}
                    <strong>Bank Name: </strong> Islami Bank Bangladesh Ltd
                  </p>
                  <p>
                    {" "}
                    <strong>Bank Branch: </strong> Head Office Complex Corporate
                    Branch
                  </p>
                  <p>
                    {" "}
                    <strong>Routing Number:</strong> 125272689
                  </p>
                </div>
                <div className="bd_item">
                  <h5 className="bd_title">Note:</h5>
                  <ul>
                    <li>
                      Month of{" "}
                      {formatMonthYear(
                        printData[0]?.invocieRow[0]?.dteDueDateTime
                      )}
                    </li>
                    <li>- Tax exempted</li>
                    <li>- {printData[0]?.invocieHeader?.strRemarks}</li>
                  </ul>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  bottom: "0",
                  width: "100%",
                  padding: "20px",
                }}
              >
                <div className="signature">
                  <p>Authorized Signature</p>
                  <p>Receiver's Signature</p>
                </div>
              </div>
            </div>
          </tbody>
          <tfoot className="sales-collection-hide">
            <div
              className="ifoot"
              style={{
                backgroundImage: `url(${getLetterHead({
                  buId: selectedBusinessUnit?.value,
                })})`,
                backgroundRepeat: "no-repeat",
                height: "100px",
                backgroundPosition: "center bottom",
                backgroundSize: "cover",
                bottom: "-25px",
                position: "fixed",
                width: "100%",
              }}
            ></div>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default PrintInvoiceModal;

// eslint-disable-next-line no-lone-blocks
{
  /* <div className="container">
  <img
    className="logo"
    src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
    alt="iBOS Ltd"
  />
  <div className="info">
    <h2 className="info_item info_name ">{selectedBusinessUnit?.label}</h2>
    <h3 className="info_item info_address ">
      {selectedBusinessUnit?.businessUnitAddress}
    </h3>
    <br />
    <br />
    <h3 className="info_item info_invoice ">INVOICE</h3>
  </div>
  <div></div>
  <div className="invoice_info">
    <div className="invoice_info__item">
      <p>
        <strong>Invoice No:</strong>
        {printData[0]?.invocieHeader?.strServiceSalesInvoiceCode}
      </p>
      <p>
        {" "}
        <strong>Order No :</strong> ORD202309018{" "}
      </p>
      <p></p>
    </div>
    <div className="invoice_info__item">
      <p>
        <strong> Invoice Date:</strong>

        {_dateFormatter(printData[0]?.invocieHeader?.dteInvoiceDateTime)}
      </p>
      <p>
        <strong> Order Date:</strong>
        {_dateFormatter(printData[0]?.invocieRow[0]?.dteOrderDate)}
      </p>
      <p>
        <strong> Due Date:</strong>
        {_dateFormatter(printData[0]?.invocieRow[0]?.dteDueDateTime)}
      </p>
    </div>
  </div>
  <div className="address">
    <div className="address_billing">
      <p className="address_title">BILLING ADDRESS</p>
      <p className="address_buyer">
        <strong>Customer Name: </strong>{" "}
        {printData[0]?.invocieHeader?.strCustomerName}
      </p>
      <p className="address_text">
        <strong>Address: </strong>{" "}
        {printData[0]?.invocieHeader?.strCustomerAddress}
      </p>
      <p className="address_text">
        <strong>Contact Person: </strong> {printData[0]?.customerContactPerson}
      </p>
      <p className="address_text">
        <strong>Contact Number: </strong>{" "}
        {printData[0]?.customerContactPersonNumber}
      </p>
    </div>
  </div>
  <div style={{ marginBottom: "15px" }}>
    <table>
      <thead>
        <tr style={{ height: "30px", fontSize: "14px" }}>
          <th style={{ width: "30px" }}>SL</th>
          <th>Item Name</th>
          <th style={{ width: "80px" }}>UoM</th>
          <th style={{ width: "80px" }}>Qty</th>
          <th style={{ width: "80px" }}>Rate</th>
          <th style={{ width: "80px" }}>Sub Total</th>
          <th style={{ width: "80px" }}>Vat</th>
          <th style={{ width: "80px" }}>Total</th>
        </tr>
      </thead>
      <tbody>
        <>
          {printData[0]?.items?.length > 0 &&
            printData[0]?.items?.map((item, index) => (
              <tr key={index} style={{ height: "30px" }}>
                <td>{index + 1}</td>
                <td style={{ textAlign: "left", paddingLeft: "5px" }}>
                  {item?.strItemName}
                </td>
                <td>{item?.strUom || "EA"}</td>
                <td style={{ textAlign: "right", paddingRight: "5px" }}>
                  {item?.numSalesQty}
                </td>
                <td style={{ textAlign: "right", paddingRight: "5px" }}>
                  {_formatMoney(item?.numRate || 0)}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    paddingRight: "5px",
                  }}
                >
                  {_formatMoney(item?.numSalesQty * item?.numRate || 0)}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    paddingRight: "5px",
                  }}
                >
                  {_formatMoney(item?.numSalesVatAmount)}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    paddingRight: "5px",
                  }}
                >
                  {_formatMoney(
                    Math.floor(
                      item?.numSalesQty * item?.numRate +
                        item?.numSalesVatAmount
                    ) || 0
                  )}
                </td>
              </tr>
            ))}
          <tr style={{ height: "25px", fontSize: "13px" }}>
            <td
              colspan="7"
              style={{
                textAlign: "right",
                fontWeight: "bold",
                paddingRight: "5px",
              }}
            >
              Total Order Value
            </td>
            <td style={{ textAlign: "right", paddingRight: "3px" }}>
              <strong>
                {_formatMoney(
                  Math.floor(
                    calculateTotal(
                      printData[0]?.items?.length > 0 ? printData[0]?.items : []
                    )
                  ) || 0
                )}
              </strong>
            </td>
          </tr>
          <tr style={{ height: "25px", fontSize: "13px" }}>
            <td
              colspan="7"
              style={{
                textAlign: "right",
                fontWeight: "bold",
                paddingRight: "5px",
              }}
            >
              {printData[0]?.intPaymentTypeId === 1
                ? `100% of Total Amount`
                : `Billing Amount: ${printData[0]?.invocieRow[0]?.intPaymentByPercent}% of Total Amount`}
            </td>
            <td style={{ textAlign: "right", paddingRight: "3px" }}>
              <strong>
                {_formatMoney(
                  Math.floor(
                    printData[0]?.invocieRow[0]?.numScheduleAmount +
                      printData[0]?.invocieRow[0]?.numScheduleVatAmount
                  ) || 0
                )}
              </strong>
            </td>
          </tr>
        </>
      </tbody>
    </table>
  </div>
  <div className="taka-in-words">
    <strong>In Words: </strong>{" "}
    <p
      style={{
        borderBottom: "1px dashed",
        marginLeft: "3px",
      }}
    >
      {(() => {
        const invoiceRow = printData[0]?.invocieRow[0] || {};
        const numScheduleAmount = invoiceRow.numScheduleAmount || 0;
        const numScheduleVatAmount = invoiceRow.numScheduleVatAmount || 0;

        const totalNetAmount = Math.floor(
          numScheduleAmount + numScheduleVatAmount
        );

        if (isNaN(totalNetAmount)) {
          console.error("Invalid totalNetAmount. Check your data.");
          return null; // or return an appropriate value for the error case
        }

        const totalNetAmountInWord = convertNumberToWords(totalNetAmount);
        const capitalizeFirstLetter = totalNetAmountInWord
          ? totalNetAmountInWord.charAt(0).toUpperCase() +
            totalNetAmountInWord.slice(1)
          : "";

        return capitalizeFirstLetter;
      })()}{" "}
      only
    </p>
  </div>
  <div className="bank_details">
    <div className="bd_item">
      <h5 className="bd_title">Bank Details:</h5>
      <p>
        {" "}
        <strong>A/C Name: </strong>iBOS Limited
      </p>
      <p>
        {" "}
        <strong>A/C Number: </strong> 20502130100249715
      </p>
      <p>
        {" "}
        <strong>Bank Name: </strong> Islami Bank Bangladesh Ltd
      </p>
      <p>
        {" "}
        <strong>Bank Branch: </strong> Head Office Complex Corporate Branch
      </p>
      <p>
        {" "}
        <strong>Routing Number:</strong> 125272689
      </p>
    </div>
    <div className="bd_item">
      <h5 className="bd_title">Note:</h5>
      <ul>
        <li>
          Month of{" "}
          {formatMonthYear(printData[0]?.invocieRow[0]?.dteDueDateTime)}
        </li>
        <li>- Tax exempted</li>
        <li>- {printData[0]?.invocieHeader?.strRemarks}</li>
      </ul>
    </div>
  </div>
  <div
    style={{
      position: "absolute",
      left: "0",
      bottom: "0",
      width: "100%",
      padding: "10px",
    }}
  >
    <div className="signature">
      <p>Authorized Signature</p>
      <p>Receiver's Signature</p>
    </div>
    <ul className="contact">
      Contact Us -<i className="fa-solid fa-location-dot"></i>
      <li>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 384 512"
          >
            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
          </svg>
        </span>{" "}
        {selectedBusinessUnit?.businessUnitAddress}
      </li>
      <li>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 192 512"
          >
            <path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z" />
          </svg>
        </span>
        info@ibos.io
      </li>
      <li>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
          </svg>
        </span>
        0135888588 (Sales)
      </li>
      <li>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
          </svg>
        </span>
        0152028885 (Sales)
      </li>
    </ul>
  </div>
</div>; */
}
