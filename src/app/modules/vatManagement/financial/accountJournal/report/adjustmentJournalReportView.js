import React, { useState, useRef, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import ReactToPrint from "react-to-print";
import Loading from "./../../../../_helper/loader/_loader";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICustomCard from "../../../../_helper/_customCard";
import { shallowEqual, useSelector } from "react-redux";
import findIndex from "../../../../_helper/_findIndex";
import NotPermittedPage from "../../../../_helper/notPermitted/NotPermittedPage";
import { getTaxAccountingJournal } from "./helper";
import { _formatMoney } from "../../../../_helper/_formatMoney";

export function AdjustmentJournalReportView({ journalCode }) {
  const [loading, setLoading] = useState(false);
  const [adjustmentReport, setAdjustmentReport] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [headerObj, setHeaderObj] = useState("")


  useEffect(() => {
    getTaxAccountingJournal( journalCode, setAdjustmentReport, setLoading);
  }, [journalCode]);

  useEffect(() => {
    if(adjustmentReport?.length > 0){
      const modifyRowDto = adjustmentReport?.map((item)=>{
        return {...item,
          debitCredit: item?.credit < 0 ? "Credit" : item?.debit > 0 ? "Debit" :"",
          amount: Math.abs(item?.credit < 0 ? item?.credit : item?.debit > 0 ? item?.debit :0),
        }
      })
      setRowDto(modifyRowDto);
      const findHeaderObj = adjustmentReport[0]
      const modifyHeaderObj = {
        ...findHeaderObj,
        businessUnitName:findHeaderObj?.businessUnitName ,
        businessUnitAddress: findHeaderObj?.businessUnitAddress,
        bankName:findHeaderObj?.subGLName,
        bankAccountNo:findHeaderObj?.subGlCode,
        billRegisterId:findHeaderObj?.billRegisterId,
        billTypeId: findHeaderObj?.billTypeId,
        narration: findHeaderObj?.narration,
        bankJournalCode: findHeaderObj?.journalCode,
        journalDate: findHeaderObj?.transactionDate,
        instrumentName:findHeaderObj?.instrumentTypeName,
      }
      setHeaderObj(modifyHeaderObj)
    }
  }, [adjustmentReport])

  console.log(adjustmentReport)
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
  const {selectedBusinessUnit} = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const adjustmentJournal = userRole[findIndex(userRole, "Adjustment Journal")];
  if (!adjustmentJournal?.isView) return <NotPermittedPage />;

  let creditAmount =0,debitAmount=0
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
                {/* {gridItem?.map((adjustmentReport) => ( */}
                  <div className="mt-2">
                    <div ref={printRef}>
                      <div className="m-3 adjustment-journalReport">
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                            <h3>
                              {selectedBusinessUnit?.label}
                            </h3>
                            <span>
                              <b>{selectedBusinessUnit?.address}</b>
                            </span>
                            <span className="my-2"><h5>Adjustment Journal</h5></span>
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
                                  headerObj
                                    ?.bankJournalCode
                                }
                              </sapn>
                            </div>
                            <div>
                              Voucher Date :
                              <sapn className="font-weight-bold ml-1">
                                {_dateFormatter(
                                  headerObj?.journalDate
                                )}
                              </sapn>
                            </div>
                          </div>
                        </div>
                        <table className="journalTable" id="table-to-xlsx">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Head Of Accounts</th>
                              <th>Transaction</th>
                              {/* <th>Narration</th> */}
                              <th>Debit</th>
                              <th>Credit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((data, i) => {
                              if(data?.debitCredit === "Debit"){
                                debitAmount += Math.abs(data?.amount)
                              }
                              if(data?.debitCredit === "Credit"){
                                creditAmount += Math.abs(data?.amount)
                              }
                              return (
                                <tr>
                                  <td className="text-center">{i + 1}</td>
                                  <td className="text-left">
                                    {renderHeadOfAcc(data)}
                                  </td>
                                  <td className="text-left">{data?.subGLName}</td>
                                  {/* <td>{data?.narration}</td> */}
                                  {data?.debitCredit === "Debit" ? (
                                    <td>
                                      <div className="text-right pr-2">
                                        {_formatMoney(Math.abs(data?.amount))}
                                      </div>
                                    </td>
                                  ) : (
                                    <td>{""}</td>
                                  )}
                                  {data?.debitCredit === "Credit" ? (
                                    <td>
                                      <div className="text-right pr-2">
                                        {_formatMoney(Math.abs(data?.amount))}
                                      </div>
                                    </td>
                                  ) : (
                                    <td>{""}</td>
                                  )}
                                </tr>
                              )
                            })}
                            <tr>
                              <td className="text-center"></td>
                              <td className="text-center"></td>
                              <td className="font-weight-bold text-center ml-1">
                                Total
                              </td>
                              {/* <td className="text-center"></td> */}
                              <td className="text-right pr-2">
                              {_formatMoney(Math.abs(debitAmount))}
                              </td>
                              <td className="text-right pr-2">
                              {_formatMoney(Math.abs(creditAmount))}
                                {}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="mt-5">
                          <div className="d-flex">
                            {/* <p className="font-weight-bold mr-2">
                              Sum Of Taka :{" "}
                            </p>
                            <p>{headerObj?.amount}</p> */}
                          </div>
                          <div className="d-flex">
                            <p className="font-weight-bold mr-2">
                            Narration :{" "}
                            </p>
                            <p>{headerObj?.narration}</p>
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
                            <span>Authorized Signatory</span>
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
                {/* ))} */}
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
