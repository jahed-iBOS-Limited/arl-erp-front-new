import React, { useState, useRef, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import ReactToPrint from "react-to-print";
import Loading from "./../../../../_helper/loader/_loader";
import { getBankJournalView } from "./helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICustomCard from "../../../../_helper/_customCard";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { useSelector } from "react-redux";

export function BankJournalViewTableRow({ currentRowData }) {
  const [loading, setLoading] = useState(false);
  const [bankJournalReport, setbankJournalReport] = useState([]);
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  });

  useEffect(() => {
    if (currentRowData?.bankJournalId && currentRowData?.bankJournalTypeId) {
      getBankJournalView(
        currentRowData?.bankJournalId,
        currentRowData?.bankJournalTypeId,
        selectedBusinessUnit?.value,
        setbankJournalReport,
        setLoading
      );
    }
  }, [currentRowData, selectedBusinessUnit]);

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
                      <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <span>
                            {bankJournalReport?.objHeader?.businessUnitName}
                          </span>
                          <span>
                            {bankJournalReport?.objHeader?.businessUnitAddress}
                          </span>
                          <span className="my-2">Bank Journal</span>
                          <span style={{ fontSize: "11px" }}>
                            Bank Name And A/C NO.{" "}
                            {bankJournalReport?.objHeader?.bankName}{" "}
                            {bankJournalReport?.objHeader?.bankAccountNo}
                          </span>
                        </div>
                        {/* <div></div> */}
                      </div>
                      <div className="my-3 d-flex justify-content-between">
                        {/* {bankJournalReport?.objHeader?.instrumentId === 2 ?  : <div></div>} */}
                        <div>
                          <div>
                            Cheque No.
                            <sapn className="font-weight-bold ml-1">
                              {bankJournalReport?.objHeader?.chequeNo}{" , "}
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
                            <sapn className="font-weight-bold ml-1">
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
                            <td className="text-right pr-2">
                              {_formatMoney(
                                Math.abs(
                                  bankJournalReport?.objHeader?.numAmount
                                )
                              )}
                            </td>
                            <td className="text-right pr-2">
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
                          <p className="font-weight-bold mr-2">
                            Sum Of Taka :{" "}
                          </p>
                          <p>{bankJournalReport?.objHeader?.amount}</p>
                        </div>
                        <div className="d-flex">
                          <p className="font-weight-bold mr-2">
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
