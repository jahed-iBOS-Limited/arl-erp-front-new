/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import ReactToPrint from "react-to-print";
import Loading from "./../../../../_helper/loader/_loader";
import { getTaxAccountingJournal } from "./helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { useSelector, shallowEqual } from "react-redux";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import Attachments from "./Attachments";

export function CashJournalReportView({ journalCode, headerData, clickRowData }) {
  const [loading, setLoading] = useState(false);
  const [cashJournalReport, setCashJournalReport] = useState([]);
  const [isModal, setIsModal] = useState(false)

  useEffect(() => {
    getTaxAccountingJournal(journalCode, setCashJournalReport, setLoading);
  }, [journalCode, headerData]);

  const printRef = useRef();
  const history = useHistory();

  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  let creditAmount = 0,
    debitAmount = 0;
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
                      <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <h3>{selectedBusinessUnit?.label}</h3>
                          <span>
                            <b>{selectedBusinessUnit?.address}</b>
                          </span>
                          <span className="my-2">
                            <h5>Cash Journal</h5>
                          </span>
                          {/* <span>Bank Name And A/C NO. {cashJournalReport?.objHeader
                            ?.bankName} {cashJournalReport?.objHeader
                              ?.bankAccountNo}</span> */}
                        </div>

                        {/* <div></div> */}
                      </div>
                      <div className="my-3 d-flex justify-content-between">
                        <div style={{transform: "translateY(21px)"}}>
                          <span className="font-weight-bold mr-2">
                          Reference :  <IView 
                                            title="View Attachment" 
                                            clickHandler={() => {
                                              setIsModal(true)
                                            }} />
                          </span>
                        </div>
                        <div>
                          <div>
                            Voucher No.
                            <sapn className="font-weight-bold ml-1">
                              {cashJournalReport?.[0]?.journalCode}
                            </sapn>
                          </div>
                          <div>
                            Voucher Date :
                            <sapn className="font-weight-bold ml-1">
                              {cashJournalReport ? _dateFormatter(
                                cashJournalReport?.[0]?.transactionDate
                              ) : ""}
                            </sapn>
                          </div>
                        </div>
                      </div>
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
                          {cashJournalReport?.map((data, i) => {
                            debitAmount += Math.abs(data.debit);
                            creditAmount += Math.abs(data?.credit);
                            return (
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                {/* <td className='text-right'>{data?.itemCode}</td> */}
                                <td>{data?.generalLedgerName}</td>
                                <td>{data?.subGLName}</td>
                                <td>
                                  <div className="text-right pr-2">
                                    {data.debit
                                      ? _formatMoney(Math.abs(data?.debit))
                                      : ""}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {data.credit
                                      ? _formatMoney(Math.abs(data?.credit))
                                      : ""}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="text-center"></td>
                            <td className="font-weight-bold text-center ml-1">
                              Total
                            </td>
                            <td></td>
                            <td className="text-right pr-2">
                              {_formatMoney(Math.abs(debitAmount))}
                            </td>
                            <td className="text-right pr-2">
                              {_formatMoney(Math.abs(creditAmount))}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="mt-5">
                        <div className="d-flex">
                          {/* <p className="font-weight-bold mr-2">
                            Sum Of Taka :{" "}
                          </p>
                          <p>{cashJournalReport?.objHeader?.amount}</p> */}
                        </div>
                        <div className="d-flex">
                          <p className="font-weight-bold mr-2">Narration : </p>
                          <p>{cashJournalReport?.[0]?.narration}</p>
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
                          <span>Authorized Signatory</span>
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
      <IViewModal 
        show={isModal}
        onHide={() => setIsModal(false)}
      >
        <Attachments clickRowData={clickRowData} />
      </IViewModal>
    </>
  );
}
