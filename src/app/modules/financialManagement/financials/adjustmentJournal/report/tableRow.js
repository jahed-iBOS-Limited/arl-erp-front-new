import React, { useState, useRef, useEffect, useMemo } from "react";
import { Formik, Form as FormikForm } from "formik";
import ReactToPrint from "react-to-print";
import Loading from "./../../../../_helper/loader/_loader";
import { getAdjustmentJournalView } from "./helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICustomCard from "../../../../_helper/_customCard";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import findIndex from "../../../../_helper/_findIndex";
import NotPermittedPage from "../../../../_helper/notPermitted/NotPermittedPage";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
export function AdjustmentJournalViewTableRow({ id }) {
  const [loading, setLoading] = useState(false);
  const [adjustmentReport, setAdjustmentReport] = useState([]);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  });

  useEffect(() => {
    getAdjustmentJournalView(
      id,
      selectedBusinessUnit?.value,
      setAdjustmentReport,
      setLoading
    );
  }, [id, selectedBusinessUnit]);

  const printRef = useRef();

  const renderHeadOfAcc = (data) => {
    // if(data?.businessTransactionName){
    //   return data?.businessTransactionName
    // } else if(data?.generalLedgerName && data?.businessPartnerName){
    //   return  data?.generalLedgerName + "(" +  data?.businessPartnerName + ")"
    // } else if(data?.generalLedgerName){
    //   return  data?.generalLedgerName
    // }
    // else {
    //   return data?.businessPartnerName
    // }
    if (data?.generalLedgerName && data?.businessPartnerName) {
      return data?.generalLedgerName + "(" + data?.businessPartnerName + ")";
    } else {
      return data?.generalLedgerName;
    }
  };

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );
  const dispatch = useDispatch();
  // Total Debit Credit calculation
  const totalDebitCreditAmount = useMemo(() => {
    if (!adjustmentReport?.objRow?.length) return null;
    const list = adjustmentReport?.objRow;
    let totalCredit = 0;
    let totalDebit = 0;
    for (let i = 0; i < list?.length; i++) {
      const element = list[i];
      if (element?.amount < 0) {
        totalCredit += element?.amount * -1;
      } else {
        totalDebit += element?.amount;
      }
    }
    return { totalCredit, totalDebit };
  }, [adjustmentReport]);

  const adjustmentJournal = userRole[findIndex(userRole, "Adjustment Journal")];
  if (!adjustmentJournal?.isView) return <NotPermittedPage />;

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            {adjustmentReport?.objHeader?.attachment ? (
              <button
                className="btn btn-primary mr-2"
                onClick={() => {
                  dispatch(
                    getDownlloadFileView_Action(
                      adjustmentReport?.objHeader?.attachment
                    )
                  );
                }}
              >
                View Attachment
              </button>
            ) : (
              <></>
            )}
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
                          <h4>
                            {adjustmentReport?.objHeader?.businessUnitName}
                          </h4>
                          <span>
                            {adjustmentReport?.objHeader?.businessUnitAddress}
                          </span>
                          <span className="my-2">Adjustment Journal</span>
                          {/* <span>Bank Name And A/C NO.</span> */}
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
                            <sapn className="font-weight-bold ml-1">
                              {
                                adjustmentReport?.objHeader
                                  ?.adjustmentJournalCode
                              }
                            </sapn>
                          </div>
                          <div>
                            Voucher Date :
                            <sapn className="font-weight-bold ml-1">
                              {_dateFormatter(
                                adjustmentReport?.objHeader?.journalDate
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
                            <th>Head Of Accounts</th>
                            <th>Transaction</th>
                            <th>Element</th>
                            <th>Debit</th>
                            <th>Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adjustmentReport?.objRow?.map((data, i) => (
                            <tr>
                              <td className="text-center">{i + 1}</td>
                              <td className="text-left">
                                {renderHeadOfAcc(data)}
                              </td>
                              <td className="text-left">{data?.subGLName}</td>
                              <td>
                                {data?.costRevenueName +
                                  " " +
                                  data?.elementName}
                              </td>
                              {data?.debitCredit === "Debit" ? (
                                <td>
                                  <div className="text-right pr-2">
                                    {selectedBusinessUnit?.value === 102
                                      ? Math.abs(data?.amount).toFixed(2)
                                      : Math.abs(data?.amount)}
                                    {/* {Math.abs(data?.amount)} */}
                                  </div>
                                </td>
                              ) : (
                                <td>{""}</td>
                              )}
                              {data?.debitCredit === "Credit" ? (
                                <td>
                                  <div className="text-right pr-2">
                                    {selectedBusinessUnit?.value === 102
                                      ? Math.abs(data?.amount).toFixed(2)
                                      : Math.abs(data?.amount)}
                                    {/* {Math.abs(data?.amount)} */}
                                  </div>
                                </td>
                              ) : (
                                <td>{""}</td>
                              )}
                            </tr>
                          ))}
                          <tr>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td className="font-weight-bold text-center ml-1">
                              Total
                            </td>
                            <td className="text-center"></td>
                            <td className="text-right pr-2">
                              {_formatMoney(totalDebitCreditAmount?.totalDebit)}
                            </td>
                            <td className="text-right pr-2">
                              {_formatMoney(
                                totalDebitCreditAmount?.totalCredit
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
                          <p>{adjustmentReport?.objHeader?.amount}</p>
                        </div>
                        <div className="d-flex">
                          <p className="font-weight-bold mr-2">Pay To : </p>
                          <p>{adjustmentReport?.objHeader?.paidTo}</p>
                        </div>
                        <div className="d-flex">
                          <p className="font-weight-bold mr-2">
                            Description :{" "}
                          </p>
                          <p>{adjustmentReport?.objHeader?.narration}</p>
                        </div>
                      </div>
                      <div className="row d-flex justify-content-around align-items-center my-15">
                        <div className="d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Prepared By</span>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Reviewed By</span>
                        </div>
                        <div className=" d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>
                            Authorized Signatory Akij Resource Limited
                          </span>
                        </div>
                        <div className="d-flex flex-column">
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
