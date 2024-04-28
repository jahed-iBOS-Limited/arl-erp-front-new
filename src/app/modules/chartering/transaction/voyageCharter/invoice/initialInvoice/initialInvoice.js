/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { ToWords } from "to-words";
import { getOwnerBankInfoDetailsByStakeHolderId } from "../../../../helper";
// import akijShippingLogo from "../../../../_chartinghelper/assets/images/logos/akijShippingText.svg";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
import { _dateFormatter } from "../../../../_chartinghelper/_dateFormatter";
import {
  _formatMoneyWithDoller,
  _formatMoneyWithDollerZero,
} from "../../../../_chartinghelper/_formatMoney";
import { BankInfoComponent } from "../BankInfoComponent";
import "../style.css";
import letterhead from "../../../assets/images/shipping_line_pte_letterhead.jpeg";

const toWords = new ToWords({
  localeCode: "en-US",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

export const filter95PercentInitialInvoice = (rowData, total) => {
  const filterPercentageValue = rowData?.filter((obj) => obj?.parcentageValue);
  const percentValue95 =
    (total * filterPercentageValue[0]?.parcentageValue) / 100 || 0;

  const totalBorkerageCom =
    (total * filterPercentageValue[1]?.parcentageValue) / 100 || 0;

  const totalAddCom =
    (total * filterPercentageValue[2]?.parcentageValue) / 100 || 0;

  const totalCom = totalBorkerageCom + totalAddCom || 0;

  return {
    totalCom,
    percentValue95,
    totalBorkerageCom,
    totalAddCom,
    filterPercentageValue,
  };
};

export const totalNetPayableInitialInvoice = (rowData) => {
  /* Total in rowData */
  let total = rowData?.reduce(
    (acc, obj) => acc + (obj?.isChecked ? obj?.cargoQty * obj?.freightRate : 0),
    0
  );

  const filterNewRowTotal = rowData
    ?.filter((obj) => obj?.isNew)
    .reduce((acc, obj) => acc + +obj?.credit, 0);

  const filterCom = filter95PercentInitialInvoice(rowData, total);

  const result =
    (filterCom?.percentValue95 || 0) -
    (filterCom?.totalCom || 0) +
    (filterNewRowTotal || 0);

  return result;
};

function InitialInvoice({ invoiceHireData, formikprops, rowData, setRowData }) {
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
    copy[index][name] = +value || value;
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
      isAction: true,
    });
    setRowData(copy);
  };

  const deleteHandler = (index) => {
    const copy = [...rowData];
    const newArr = copy.filter((item, idx) => idx !== index);
    setRowData(newArr);
  };

  /* Total in rowData */
  let total = rowData?.reduce(
    (acc, obj) => acc + (obj?.isChecked ? obj?.cargoQty * obj?.freightRate : 0),
    0
  );

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
        <div style={{ margin: "0 40px" }}>
          {" "}
          <h5
            style={{ marginBottom: "3rem" }}
            className="text-center mb-6 statementTitle uppercase"
          >
            {`Freight Invoice For ${values?.vesselName?.label} CP Date
        ${_dateFormatter(invoiceHireData?.cpDate)}`}
          </h5>
          {/* First Column Header */}
          <div
            className="column-header-section"
            style={{ alignItems: "flex-start" }}
          >
            {/* left */}
            <div>
              <div className="headerWrapper">
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
              <div className="headerWrapper">
                <div className="headerKey">TO :</div>
                <div className="headerValue">
                  {values?.hireTypeName?.value === 2 ? (
                    <>
                      {invoiceHireData?.fromName}
                      {invoiceHireData?.fromAddress
                        ? ` ${invoiceHireData?.fromAddress}`
                        : ""}
                    </>
                  ) : (
                    <>
                      {invoiceHireData?.toName}
                      {invoiceHireData?.toAdress
                        ? ` ${invoiceHireData?.toAdress} `
                        : ""}
                    </>
                  )}
                </div>
              </div>
              <div className="headerWrapper">
                <div className="headerKey">FROM :</div>
                <div className="headerValue">
                  {values?.hireTypeName?.value === 1 ? (
                    <>
                      {invoiceHireData?.fromName}
                      {invoiceHireData?.fromAddress
                        ? ` ${invoiceHireData?.fromAddress}`
                        : ""}
                    </>
                  ) : (
                    <>
                      {invoiceHireData?.toName}
                      {invoiceHireData?.toAdress
                        ? ` ${invoiceHireData?.toAdress} `
                        : ""}
                    </>
                  )}
                </div>
              </div>
              <div className="headerWrapper mb-2">
                <div className="headerKey">REFERENCE :</div>
                <div className="headerValue">
                  {`Freight Invoice For ${values?.vesselName?.label} CP Date
        ${_dateFormatter(invoiceHireData?.cpDate)}`}
                </div>
              </div>
              <div className="headerWrapper">
                <div className="headerKey">VESSEL & VOYAGE :</div>
                <div className="headerValue">
                  {invoiceHireData?.vesselname}
                  {invoiceHireData?.voyageNo
                    ? ` & V${invoiceHireData?.voyageNo}`
                    : ""}
                </div>
              </div>
              <div className="headerWrapper">
                <div className="headerKey">FRIEGHT FOR CARGO QTY :</div>
                <div className="headerValue">{invoiceHireData?.cargoQty}</div>
              </div>
              <div className="headerWrapper">
                <div className="headerKey">LOAD PORT :</div>
                <div className="headerValue">{invoiceHireData?.loadPort}</div>
              </div>
              <div className="headerWrapper">
                <div className="headerKey">DISCH PORT :</div>
                <div className="headerValue">{invoiceHireData?.dischPort}</div>
              </div>
            </div>
            {/* right */}
            <div>
              <div className="headerWrapper">
                {invoiceHireData?.invoiceRef ? (
                  <>
                    <div className="headerKey">INVOICE REF :</div>
                    <div className="headerValue">
                      {invoiceHireData?.invoiceRef || ""}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          {/* First Section Header */}
          <div className="headerWrapper">
            <table className="table mt-1 bj-table bj-table-landing mt-3">
              <thead>
                <tr
                  style={{ borderTop: "1px solid #d6d6d6" }}
                  className="text-center"
                >
                  <th>SL</th>
                  <th>PARTICULARS</th>
                  <th>CARGO QTY MT</th>
                  <th>FREIGHT RATE USD/PMT</th>
                  <th>TOTAL AMOUNT</th>
                  {!viewType ? <th>ACTION</th> : null}
                </tr>
              </thead>

              <>
                {!viewType ? (
                  <>
                    <tbody>
                      {rowData?.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{ width: "40px" }}
                            className={`${
                              !item?.isChecked ? "isCheckedFalse" : ""
                            } text-center`}
                          >
                            {index + 1}
                          </td>

                          {/* Particulers */}
                          <td
                            className={`${
                              !item?.isChecked ? "isCheckedFalse" : ""
                            }`}
                          >
                            {!item?.isNew ? (
                              <>{item?.particulars}</>
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

                          {/* Quantity */}
                          <td
                            className={`${
                              !item?.isChecked ? "isCheckedFalse" : ""
                            } text-right`}
                          >
                            {item?.cargoQty || ""}
                          </td>

                          {/* Rate */}
                          <td
                            className={`${
                              !item?.isChecked ? "isCheckedFalse" : ""
                            } text-right`}
                          >
                            <>
                              {/* For View Manage */}
                              {index > rowData.length - 3
                                ? ""
                                : _formatMoneyWithDoller(
                                    item?.freightRate?.toFixed(2)
                                  ) || ""}
                            </>
                          </td>

                          {/* Total */}
                          <td
                            className={`${
                              !item?.isChecked ? "isCheckedFalse" : ""
                            } text-right`}
                          >
                            {viewType ? (
                              /* For View */
                              <>
                                {index !== rowData?.length - 2 &&
                                  index !== rowData.length - 1 &&
                                  _formatMoneyWithDollerZero(
                                    (
                                      item?.cargoQty * item?.freightRate || 0
                                    )?.toFixed(2)
                                  )}
                              </>
                            ) : (
                              /* For Create */
                              <>
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
                                    disabled={!item?.isChecked}
                                  />
                                ) : (
                                  <>
                                    {item?.parcentageValue
                                      ? (
                                          (item?.parcentageValue * total) /
                                          100
                                        ).toFixed(2)
                                      : _formatMoneyWithDollerZero(
                                          (
                                            item?.cargoQty *
                                              item?.freightRate || 0
                                          )?.toFixed(2)
                                        )}
                                  </>
                                )}
                              </>
                            )}
                          </td>

                          {viewType ? null : (
                            <td
                              className="text-center"
                              style={{ width: "80px" }}
                            >
                              {!item?.isAction ? null : (
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
                                      disabled={item?.isFixed}
                                      type="checkbox"
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
                              )}
                            </td>
                          )}
                        </tr>
                      ))}

                      <tr>
                        <td colSpan={4} className="text-right">
                          <strong>NET PAYABLE TO OWNERS</strong>
                        </td>

                        <td className="text-right">
                          <strong>
                            {_formatMoneyWithDollerZero(
                              totalNetPayableInitialInvoice(rowData)
                            )}
                          </strong>
                        </td>
                        {viewType ? null : <td></td>}
                      </tr>

                      {true ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            <div>
                              <strong>
                                {`(In Word USD) ${toWords.convert(
                                  totalNetPayableInitialInvoice(rowData)
                                )}`}
                              </strong>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </>
                ) : (
                  <TableForView
                    rowData={rowData}
                    invoiceHireData={invoiceHireData}
                  />
                )}
              </>
            </table>
          </div>
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
    </>
  );
}

const TableForView = ({ rowData, invoiceHireData }) => {
  return (
    <tbody>
      {rowData?.map((item, index) => (
        <>
          <tr key={index}>
            <td style={{ width: "40px" }} className={`text-center`}>
              {index + 1}
            </td>

            {/* Particulers */}
            <td>{item?.particulars}</td>

            {/* Quantity */}
            <td className={`text-right`}>{item?.cargoQty || ""}</td>

            {/* Rate */}
            <td className={`text-right`}>
              <>{!item?.cargoQty ? "" : item?.freightRate?.toFixed(2)}</>
            </td>

            {/* Total */}
            <td className={`text-right`}>
              {_formatMoneyWithDollerZero(item?.credit?.toFixed(2))}
            </td>
          </tr>
        </>
      ))}

      <tr>
        <td colSpan={4} className="text-right">
          <strong>NET PAYABLE TO OWNERS</strong>
        </td>

        <td className="text-right">
          <strong>
            {_formatMoneyWithDollerZero(+invoiceHireData?.totalNetPayble || 0)}
          </strong>
        </td>
      </tr>

      {true ? (
        <tr>
          <td colSpan="7" className="text-center">
            <div>
              <strong>
                {`(In Word USD) ${toWords.convert(
                  +invoiceHireData?.totalNetPayble || 0
                )}`}
              </strong>
            </div>
          </td>
        </tr>
      ) : null}
    </tbody>
  );
};
export default InitialInvoice;
