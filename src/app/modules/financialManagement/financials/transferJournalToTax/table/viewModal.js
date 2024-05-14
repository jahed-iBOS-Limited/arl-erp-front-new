/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import ICustomCard from "../../../../_helper/_customCard";
import ReactToPrint from "react-to-print";
import { getBankJournalView } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { APIUrl } from "../../../../../App";
import { useSelector } from "react-redux";

export function BankJournalViewTableRow({ viewData, journalType }) {
  const [loading, setLoading] = useState(false);
  const [bankJournalReport, setbankJournalReport] = useState([]);
  const [gridItem, setGridItem] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  });

  useEffect(() => {
    if ([1, 2, 3].includes(journalType)) {
      getBankJournalView(
        `/fino/CommonFino/GetJournalViewReport?JournalId=${viewData?.cashJournalId}&AccountingJournalTypeId=${viewData?.accountingJournalTypeId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
        setbankJournalReport,
        setLoading
      );
    }
    if ([4, 5, 6].includes(journalType)) {
      getBankJournalView(
        `/fino/CommonFino/GetBankJournalReport?JournalId=${viewData?.bankJournalId}&AccountingJournalTypeId=${viewData?.accountingJournalTypeId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
        setbankJournalReport,
        setLoading
      );
    }

    if ([7].includes(journalType)){
      getBankJournalView(
        `/fino/AdjustmentJournal/GetAdjustmentJournalByIdForReport?adjustmentJournalId=${viewData?.adjustmentJournalId}&accountingJournalTypeId=${viewData?.accountingJournalTypeId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
        setbankJournalReport,
        setLoading,
        "adjustment"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewData]);

  useEffect(() => {
    setGridItem(bankJournalReport?.objHeader);
  }, [bankJournalReport]);

  const printRef = useRef();

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => <button className="btn btn-primary">Print</button>}
              content={() => printRef.current}
            />
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              {loading && <Loading />}
              <FormikForm>
                <div className="mt-2">
                  <div ref={printRef}>
                    <div className="m-3 adjustment-journalReport">
                      <div>
                        <div style={{ position: "absolute" }}>
                          <img
                            style={{ width: "70px" }}
                            src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                            alt=""
                          />
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <span
                            style={{
                              fontSize: "22px",
                              fontWeight: "bold",
                            }}
                          >
                            {bankJournalReport?.objHeader?.businessUnitName}
                          </span>
                          <span>
                            {bankJournalReport?.objHeader?.businessUnitAddress}
                          </span>
                          <span className="my-2">{[1, 2, 3].includes(journalType) ? 'Cash Journal' : [4, 5, 6].includes(journalType) ? 'Bank Journal' : [7].includes(journalType) ? 'Adjustment Journal' : ''}</span>
                          <span>
                            Bank Name And A/C NO.{" "}
                            {bankJournalReport?.objHeader?.bankName}{" "}
                            {bankJournalReport?.objHeader?.bankAccountNo}
                          </span>
                        </div>
                      </div>
                      <div className="my-3 d-flex justify-content-between">
                        <div>
                          <div>
                            Cheque No.
                            <sapn
                              className="ml-1"
                              style={{ fontWeight: "bold" }}
                            >
                              {bankJournalReport?.objHeader?.chequeNo}
                              {" , "}
                            </sapn>
                            Instrument :
                            <sapn className="font-weight-bold ml-1">
                              {bankJournalReport?.objHeader?.instrumentName}
                            </sapn>
                          </div>
                          <div>
                            Cheque Date :
                            <sapn className="font-weight-bold ml-1">
                              {_dateFormatter(
                                bankJournalReport?.objHeader?.chequeDate
                              )}
                            </sapn>
                          </div>
                        </div>
                        <div>
                          <div>
                            Voucher No.
                            <sapn
                              className="font-weight-bold ml-1"
                              style={
                                gridItem?.billRegisterId && gridItem?.billTypeId
                                  ? {
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                      color: "#3699FF",
                                    }
                                  : {}
                              }
                              onClick={() => {
                                if (
                                  gridItem?.billRegisterId &&
                                  gridItem?.billTypeId
                                ) {
                                  setModalShow(true);
                                }
                              }}
                            >
                              {bankJournalReport?.objHeader?.bankJournalCode}
                            </sapn>
                          </div>
                          <div>
                            Voucher Date :
                            <sapn className="font-weight-bold ml-1">
                              {_dateFormatter(
                                bankJournalReport?.objHeader?.journalDate
                              )}
                            </sapn>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive">
                      <table className="journalTable" id="table-to-xlsx">
                        <thead>
                          <tr>
                            <th>SL</th>
                            {/* <th>Account Code No</th> */}
                            <th>Head Of Accounts</th>
                            <th>Transaction</th>
                            <th>Debit</th>
                            <th>Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bankJournalReport?.objRow?.map((data, i) => (
                            <tr>
                              <td className="text-center">{i + 1}</td>
                              {/* <td className='text-right'>{data?.itemCode}</td> */}
                              <td>{data?.generalLedgerName}</td>
                              <td>{data?.subGLName}</td>
                              <td>
                                <div className="text-right pr-2">
                                  {data.debit
                                    ? _formatMoney(Math.abs(data?.debit))
                                    : data?.amount
                                    ? data?.amount > 0 &&
                                      _formatMoney(Math.abs(data?.amount))
                                    : ""}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {data.credit
                                    ? _formatMoney(Math.abs(data?.credit))
                                    : data?.amount
                                    ? data?.amount < 0 &&
                                      _formatMoney(Math.abs(data?.amount))
                                    : ""}
                                </div>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td
                              colspan="3"
                              className="text-center ml-1"
                              style={{ fontWeight: "bold" }}
                            >
                              Total
                            </td>
                            <td
                              className="text-right pr-2"
                              style={{ fontWeight: "bold" }}
                            >
                              {_formatMoney(
                                Math.abs(
                                  bankJournalReport?.objHeader?.numAmount
                                )
                              )}
                            </td>
                            <td
                              className="text-right pr-2"
                              style={{ fontWeight: "bold" }}
                            >
                              {_formatMoney(
                                Math.abs(
                                  bankJournalReport?.objHeader?.numAmount
                                )
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
      </div>
                      <div className="mt-5">
                        <div className="d-flex">
                          <p className="mr-2" style={{ fontWeight: "bold" }}>
                            Sum Of Taka :{" "}
                          </p>
                          <p style={{ fontWeight: "bold" }}>
                            {bankJournalReport?.objHeader?.amount}
                          </p>
                        </div>
                        <div className="d-flex">
                          <p className="mr-2" style={{ fontWeight: "bold" }}>
                            Description :{" "}
                          </p>
                          <p>{bankJournalReport?.objHeader?.narration}</p>
                        </div>
                      </div>
                      <div className="row d-flex justify-content-around align-items-center my-15">
                        <div className=" d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Prepared By</span>
                        </div>
                        <div className=" d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Reviewed By</span>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Authorized Signatory Akij Group</span>
                        </div>
                        {/* <div className=' d-flex flex-column'>
                        <span className="reportBorder"></span>
                        <span>Authorized Signatory Akij Group</span>
                      </div> */}
                        <div className=" d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Payee</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
