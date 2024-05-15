/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Formik, Form as FormikForm } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import ICustomCard from "../../../_helper/_customCard";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import { getCashJournalView } from "./helper";

export function InvTransViewTableRow({ id, headerData }) {
  const [loading, setLoading] = useState(false);
  const [cashJournalReport, setCashJournalReport] = useState([]);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    getCashJournalView(
      id,
      headerData?.accountingJournalTypeId,
      selectedBusinessUnit?.value,
      setCashJournalReport,
      setLoading
    );
  }, [id, headerData]);

  const printRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            {cashJournalReport?.objHeader?.attachment ? (
              <div>
                <button
                  onClick={() => {
                    dispatch(
                      getDownlloadFileView_Action(
                        cashJournalReport?.objHeader?.attachment
                      )
                    );
                  }}
                  className="btn btn-primary mr-4"
                >
                  Attachment View
                </button>
              </div>
            ) : null}
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
                          <span>
                            {cashJournalReport?.objHeader?.businessUnitName}
                          </span>
                          <span>
                            {cashJournalReport?.objHeader?.businessUnitAddress}
                          </span>
                          <span className="my-2">Cash Journal</span>
                          {/* <span>Bank Name And A/C NO. {cashJournalReport?.objHeader
                            ?.bankName} {cashJournalReport?.objHeader
                              ?.bankAccountNo}</span> */}
                        </div>
                        {/* <div></div> */}
                      </div>
                      <div className="my-3 d-flex justify-content-between">
                        <div>
                          <span className="font-weight-bold mr-2"></span>{" "}
                        </div>
                        <div>
                          <div>
                            Voucher No.
                            <span className="font-weight-bold ml-1">
                              {cashJournalReport?.objHeader?.journalCode}
                            </span>
                          </div>
                          <div>
                            Voucher Date :
                            <span className="font-weight-bold ml-1">
                              {_dateFormatter(
                                cashJournalReport?.objHeader?.journalDate
                              )}
                            </span>
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
                            {cashJournalReport?.objRow?.map((data, i) => (
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
                            ))}
                            <tr>
                              <td className="text-center"></td>
                              <td className="font-weight-bold text-center ml-1">
                                Total
                              </td>
                              <td></td>
                              <td className="text-right pr-2">
                                {_formatMoney(
                                  Math.abs(
                                    cashJournalReport?.objHeader?.numAmount
                                  )
                                )}
                              </td>
                              <td className="text-right pr-2">
                                {_formatMoney(
                                  Math.abs(
                                    cashJournalReport?.objHeader?.numAmount
                                  )
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-5">
                        <div className="d-flex">
                          <p className="font-weight-bold mr-2">
                            Sum Of Taka :{" "}
                          </p>
                          <p>{cashJournalReport?.objHeader?.amount}</p>
                        </div>
                        <div className="d-flex">
                          <p className="font-weight-bold mr-2">Pay To : </p>
                          <p>{cashJournalReport?.objHeader?.paidTo}</p>
                        </div>
                        <div className="d-flex">
                          <p className="font-weight-bold mr-2">
                            Description :{" "}
                          </p>
                          <p>{cashJournalReport?.objHeader?.narration}</p>
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
                          <span>
                            Authorized Signatory Akij Resources Limited
                          </span>
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
