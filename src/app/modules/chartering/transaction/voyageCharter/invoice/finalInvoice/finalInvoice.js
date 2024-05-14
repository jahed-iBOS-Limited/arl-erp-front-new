/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { ToWords } from "to-words";
import { getOwnerBankInfoDetailsByStakeHolderId } from "../../../../helper";
// import akijShippingLogo from "../../../../_chartinghelper/assets/images/logos/akijShippingText.svg";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
import { _dateFormatter } from "../../../../_chartinghelper/_dateFormatter";
import { _formatMoneyWithDoller } from "../../../../_chartinghelper/_formatMoney";
import { BankInfoComponent } from "../BankInfoComponent";
import "../style.css";
import FinalInvoiceTable from "./finalInvoiceTableView";
import letterhead from "../../../assets/images/shipping_line_pte_letterhead.jpeg"

const toWords = new ToWords({
  localeCode: "en-US",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

function FinalInvoice({ invoiceHireData, formikprops, rowData, setRowData }) {
  const [bankInfoData, setBankInfoData] = useState();
  const { values, errors, touched, setFieldValue } = formikprops;

  /* For View Only */
  const viewType = invoiceHireData?.freightInvoiceId;

  /* Bank Info & Prev Hire API */
  useEffect(() => {
    setBankInfoData();
    if (
      viewType !== 0
        ? invoiceHireData?.beneficiaryId
        : values?.beneficiary?.value
    ) {
      getOwnerBankInfoDetailsByStakeHolderId(
        viewType !== 0
          ? invoiceHireData?.beneficiaryId
          : values?.beneficiary?.value,
        setBankInfoData
      );
    }
  }, [
    values?.beneficiary?.value,
    values?.statement?.value,
    invoiceHireData?.beneficiaryId,
  ]);

  useEffect(() => {
    setFieldValue("beneficiary", { ...values?.beneficiary, ...bankInfoData });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankInfoData]);

  const rowDataHandler = (index, name, value, item) => {
    const copy = [...rowData];
    copy[index][name] = +value || value || 0;
    setRowData(copy);
  };

  const addHandler = (index) => {
    const copy = [...rowData];
    copy.splice(index + 1, 0, {
      freightInvoiceId: 0,
      sl: index + 1,
      particulars: "",
      cargoQty: 0,
      freightRate: 0,
      debit: 0,
      credit: 0,
      isChecked: true,
      isNew: true,
    });
    setRowData(copy);
  };

  const deleteHandler = (index) => {
    const copy = [...rowData];
    const newArr = copy.filter((item, idx) => idx !== index);
    setRowData(newArr);
  };

  let totalDebit = rowData?.reduce((acc, obj) => acc + +obj?.debit, 0);

  let brokerCom =
    (rowData?.filter((item) => item?.isBrokerCom)[0]?.parcentageValue *
      totalDebit) /
      100 || 0;
  let addCom =
    (rowData?.filter((item) => item?.isAddCom)[0]?.parcentageValue *
      totalDebit) /
      100 || 0;
  let totalCredit =
    rowData?.reduce((acc, obj) => acc + obj?.credit, 0) + addCom + brokerCom;

  const printRef = useRef();

  return (
    <>
      {viewType ? (
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
      ) : null}

      <div
        ref={printRef}
        className="p-4 voyageChartererInvoice"
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
        <div style={{margin: "0 30px"}}>
          <h5
            style={{ marginBottom: "2rem" }}
            className="text-center statementTitle uppercase"
          >
            {`Freight Invoice For ${values?.charterer?.label} CP Date
        ${_dateFormatter(invoiceHireData?.cpDate)}`}
          </h5>

          {/* First Section Header */}
          <div className="row">
            <div className="col-lg-6 headerWrapper">
              <div className="headerKey">DATE :</div>
              <div className="headerValue">
                {viewType
                  ? _dateFormatter(
                      invoiceHireData?.dteInvoiceDate ||
                        invoiceHireData?.invoiceDate
                    )
                  : values?.invoiceDate}
              </div>
            </div>
            <div className="col-lg-6 headerWrapper d-flex justify-content-end">
              {invoiceHireData?.invoiceRef ? (
                <>
                  <div className="headerKey">INVOICE REF :</div>
                  <div className="headerValue">
                    {invoiceHireData?.invoiceRef || ""}
                  </div>
                </>
              ) : null}
            </div>

            <div className="col-lg-12 headerWrapper">
              <div className="headerKey">TO :</div>
              <div className="headerValue">
                {invoiceHireData?.toName}
                {invoiceHireData?.toAdress
                  ? ` ${invoiceHireData?.toAdress} `
                  : ""}
              </div>
            </div>
            <div className="col-lg-12 headerWrapper">
              <div className="headerKey">FROM :</div>
              <div className="headerValue">
                {invoiceHireData?.fromName}
                {invoiceHireData?.fromAddress
                  ? ` ${invoiceHireData?.fromAddress}`
                  : ""}
              </div>
            </div>

            <div className="col-lg-12 headerWrapper">
              <div className="headerKey">REFERENCE :</div>
              <div className="headerValue">
                {`Freight Invoice For ${
                  values?.charterer?.label
                } CP Date ${_dateFormatter(invoiceHireData?.cpDate)}`}
              </div>
            </div>

            <div className="col-lg-12 headerWrapper">
              <div className="headerKey">VESSEL & VOYAGE :</div>
              <div className="headerValue">
                {invoiceHireData?.vesselname}
                {invoiceHireData?.voyageNo
                  ? ` & ${invoiceHireData?.voyageNo}`
                  : ""}
              </div>
            </div>
            <div className="col-lg-12 headerWrapper">
              <div className="headerKey">FRIEGHT FOR CARGO QTY :</div>
              <div className="headerValue">{invoiceHireData?.cargoQty}</div>
            </div>
            <div className="col-lg-12 headerWrapper">
              <div className="headerKey">LOAD PORT :</div>
              <div className="headerValue">{invoiceHireData?.loadPort}</div>
            </div>
            <div className="col-lg-12 headerWrapper">
              <div className="headerKey">DISCH PORT :</div>
              <div className="headerValue">{invoiceHireData?.dischPort}</div>
            </div>

            {/* Table Section */}
            {viewType ? (
              <FinalInvoiceTable
                rowData={rowData}
                invoiceHireData={invoiceHireData}
              />
            ) : (
              <div className="headerWrapper">
               <div className="table-responsive">
               <table className="table mt-3 bj-table bj-table-landing">
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={{ maxWidth: "40px" }}
                          className={`text-center`}
                        >
                          {index + 1}
                        </td>
                        <td>
                          {!item?.isNew ? (
                            item?.particulars
                          ) : (
                            <>
                              <FormikInput
                                className="mr-2"
                                onChange={(e) =>
                                  rowDataHandler(
                                    index,
                                    "particulars",
                                    e.target.value,
                                    item
                                  )
                                }
                                value={item?.particulars}
                                name={`${index}particulars${values?.statement?.value}`}
                                type="text"
                                errors={errors}
                                touched={touched}
                                disabled={!item?.isChecked}
                              />
                            </>
                          )}
                        </td>
                        <td className={`text-right`}>
                          {!item?.isNew ? item?.cargoQty || "" : <></>}
                        </td>

                        <td className={`text-right`}>
                          {!item?.isNew
                            ? _formatMoneyWithDoller(
                                item?.freightRate?.toFixed(2)
                              ) || ""
                            : null}
                        </td>

                        {/* Debit */}
                        <td style={{ width: "130px" }} className={`text-right`}>
                          <>
                            {item?.isLocalPortDebit ? (
                              <>
                                {item?.isLocalPortDebit ? (
                                  <FormikInput
                                    className="mr-2"
                                    onChange={(e) =>
                                      rowDataHandler(
                                        index,
                                        "debit",
                                        e.target.value,
                                        item
                                      )
                                    }
                                    value={item?.debit}
                                    name={`${index}debit${values?.statement?.value}`}
                                    type="number"
                                    errors={errors}
                                    touched={touched}
                                    disabled={!item?.isChecked}
                                  />
                                ) : null}
                              </>
                            ) : (
                              <>
                                {item?.isGrandTotal ? (
                                  <>{totalDebit}</>
                                ) : !item?.isNew ? (
                                  item?.debit || ""
                                ) : (
                                  ""
                                )}
                              </>
                            )}

                            {item?.isNew ? (
                              <FormikInput
                                className="mr-2"
                                onChange={(e) =>
                                  rowDataHandler(
                                    index,
                                    "debit",
                                    e.target.value,
                                    item
                                  )
                                }
                                value={item?.debit}
                                name={`${index}debit${values?.statement?.value}`}
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={!item?.isChecked || item?.credit > 0}
                              />
                            ) : null}
                          </>
                        </td>

                        {/* Credit */}
                        <td style={{ width: "130px" }} className="text-right">
                          <>
                            {item?.isLocalPortCredit ? (
                              <FormikInput
                                className="mr-2"
                                onChange={(e) =>
                                  rowDataHandler(
                                    index,
                                    "credit",
                                    e.target.value,
                                    item
                                  )
                                }
                                value={item?.credit}
                                name={`${index}credit${values?.statement?.value}`}
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={!item?.isChecked}
                              />
                            ) : null}

                            {item?.isNew ? (
                              <FormikInput
                                className="mr-2"
                                onChange={(e) =>
                                  rowDataHandler(
                                    index,
                                    "credit",
                                    e.target.value,
                                    item
                                  )
                                }
                                value={item?.credit}
                                name={`${index}credit${values?.statement?.value}`}
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={!item?.isChecked || item?.debit > 0}
                              />
                            ) : null}

                            {item?.isBrokerCom
                              ? (
                                  (totalDebit * item?.parcentageValue) /
                                  100
                                ).toFixed(2)
                              : null}

                            {item?.isAddCom
                              ? (
                                  (totalDebit * item?.parcentageValue) /
                                  100
                                ).toFixed(2)
                              : null}

                            {!item?.isNew &&
                            !item?.isBrokerCom &&
                            !item?.isAddCom &&
                            !item?.isLocalPortCredit
                              ? item?.credit || ""
                              : ""}
                          </>
                        </td>

                        {/* Action */}
                        <td className="text-center" style={{ width: "80px" }}>
                          {item?.isNew || item?.prevReceive ? (
                            <>
                              <span
                                onClick={() => {
                                  addHandler(index);
                                }}
                              >
                                <i
                                  style={{ fontSize: "16px" }}
                                  className="fa fa-plus-square text-primary mr-2"
                                />
                              </span>
                              <span>
                                <input
                                  type="checkbox"
                                  disabled={item?.isFixed}
                                  checked={item?.isChecked}
                                  onChange={(e) => {
                                    rowDataHandler(
                                      index,
                                      "isChecked",
                                      e.target.checked,
                                      item
                                    );
                                  }}
                                />
                              </span>

                              {item?.isNew ? (
                                <>
                                  <span
                                    onClick={() => {
                                      deleteHandler(index);
                                    }}
                                  >
                                    <i
                                      style={{ fontSize: "14px" }}
                                      className="fa fa-trash text-danger ml-2"
                                    />
                                  </span>
                                </>
                              ) : null}
                            </>
                          ) : null}
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
                            (+totalDebit - +totalCredit).toFixed(2)
                          )}
                        </strong>
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td colSpan="7" className="text-center">
                        <div>
                          <strong>
                            {`(In Word USD) ${toWords.convert(
                              +totalDebit - +totalCredit
                            )}`}
                          </strong>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
               </div>
              </div>
            )}

            {/* Bank Info Section */}
            {bankInfoData?.bankName ? (
              <BankInfoComponent data={bankInfoData} />
            ) : null}

            <div className="bottom-sign-section">
              <p>
                <strong className="uppercase">
                  For And Behalf Of {invoiceHireData?.fromName}
                  {invoiceHireData?.fromAddress
                    ? ` ${invoiceHireData?.fromAddress}`
                    : ""}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FinalInvoice;
