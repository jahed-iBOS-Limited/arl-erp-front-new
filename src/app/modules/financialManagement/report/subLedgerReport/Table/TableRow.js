import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { fromDateFromApiNew } from "../../../../_helper/_formDateFromApi";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import printIcon from "../../../../_helper/images/print-icon.png";
import { SetReportSubLedgerReportAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { CreatePartnerLedgerExcel, GetAccountingJournal_api, GetSubLedgerDDL_api } from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import { _todayDate } from "./../../../../_helper/_todayDate";

const initDataFuction = (reportSubLedgerReport) => {
  const initData = {
    id: undefined,
    glLedger: reportSubLedgerReport?.glLedger || "",
    fromDate: "",
    todate:  _todayDate(),
  };

  return initData;
};


export function TableRow() {
  const { reportSubLedgerReport } = useSelector((state) => state?.localStorage);
  
  const dispatch = useDispatch();
  const formikRef = React.useRef(null);


  const printRef = useRef();
  const [glLedger, setGlLedger] = useState([]);
  const [subLedgerReportData, setSubLedgerReportData] = useState([]);


  const [totalAmount, setTotalAmount] = useState(0);
  let netTotal = 0;
  let netTotalSum = 0;

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      GetSubLedgerDDL_api(selectedBusinessUnit.value, setGlLedger);
      fromDateFromApiNew(selectedBusinessUnit?.value, (date) => {
        if (formikRef.current) {
          const apiFormDate = date ? _dateFormatter(date) : "";
          const modifyInitData = initDataFuction(reportSubLedgerReport);
          formikRef.current.setValues({
            ...modifyInitData,
            fromDate: apiFormDate,
          });
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const debitTotal = subLedgerReportData.reduce((total, data) => {
    return total + data?.debit;
  }, 0);
  const creditTotal = subLedgerReportData.reduce((total, data) => {
    return total + data?.credit;
  }, 0);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}} 
        innerRef={formikRef}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"General Ledger Report"}>
                <CardHeaderToolbar>
                  <ReactToPrint
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-primary sales_invoice_btn"
                      >
                        <img
                          style={{ width: "25px", paddingRight: "5px" }}
                          src={printIcon}
                          alt="print-icon"
                        />
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right incomestatementTable">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="glLedger"
                        options={glLedger || []}
                        value={values?.glLedger}
                        label="Ganeral Ledger"
                        onChange={(valueOption) => {
                          setFieldValue("glLedger", valueOption);
                          // dispatch(
                          //   SetReportSubLedgerReportAction({
                          //     glLedger: valueOption,
                          //     fromDate: values?.fromDate,
                          //     toDate: values?.toDate,
                          //   })
                          // );
                        }}
                        placeholder="Ganeral Ledger"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                          // dispatch(
                          //   SetReportSubLedgerReportAction({
                          //     glLedger: values?.glLedger,
                          //     fromDate: e?.target?.value,
                          //     toDate: values?.toDate,
                          //   })
                          // );
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To date</label>
                      <InputField
                        value={values?.todate}
                        name="todate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("todate", e.target.value);
                          // dispatch(
                          //   SetReportSubLedgerReportAction({
                          //     glLedger: values?.glLedger,
                          //     fromDate: values?.fromDate,
                          //     todate: e?.target?.value,
                          //   })
                          // );
                        }}
                      />
                    </div>
                    <div className="col-lg-4 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          dispatch(
                            SetReportSubLedgerReportAction({
                              ...values,
                            })
                          );
                          GetAccountingJournal_api(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            values?.glLedger?.value,
                            values?.fromDate,
                            values?.todate,
                            setSubLedgerReportData
                          );
                        }}
                        disabled={!values?.glLedger}
                      >
                        Show
                      </button>
                      <button
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={() => {
                          CreatePartnerLedgerExcel(
                            selectedBusinessUnit,
                            subLedgerReportData,
                            values?.fromDate,
                            values?.todate,
                          )
                        }}
                        disabled={!subLedgerReportData?.length > 0}
                      >
                        Export Excel
                      </button>
                    </div>
                  </div>

                  <div className="row print_wrapper " ref={printRef}>
                    {subLedgerReportData.length > 0 && (
                      <div className="col-lg-12 mt-5">
                        <div className="titleContent text-center">
                          <h3>{selectedBusinessUnit?.label?.toUpperCase()}</h3>
                          <h6>
                            AKIJ HOUSE, 198 BIR UTTAM, GULSHAN LINK ROAD,
                            TEJGAON, DHAKA-1208.
                          </h6>
                          <h4>Subsidiary Ledger</h4>
                          <p className="m-0">
                            {" "}
                            <strong>
                              {`From ${values?.fromDate} To ${values?.todate}`}
                            </strong>
                          </p>
                        </div>
                        <div>
                          <p className="d-flex justify-content-between">
                            <strong>{values?.glLedger?.name}</strong>
                            <strong>
                              Account Code:{" "}
                              { }
                            </strong>
                          </p>
                        </div>
                        <div className="table-responsive">
 <table id="generalLedgerReport" className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>Code</th>
                              <th style={{ width: "50px" }}>Date</th>
                              <th style={{ width: "50px" }}>Description</th>
                              <th style={{ width: "50px" }}>Debit</th>
                              <th style={{ width: "50px" }}>Credit</th>
                              <th style={{ width: "50px" }}>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subLedgerReportData?.map((data, index) => {
                              netTotalSum += data?.debit + data?.credit;
                              setTotalAmount(netTotalSum);
                              return (
                                <tr>
                                  <td>{data?.accountingJournalCode}</td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {_dateFormatter(data?.transactionDate)}
                                    </div>
                                  </td>
                                  <td>{data?.narration}</td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {numberWithCommas(
                                        (data?.debit || 0).toFixed(2)
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {numberWithCommas(
                                        (data?.credit || 0).toFixed(2)
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {numberWithCommas(
                                        (
                                          (netTotal +=
                                            data?.debit + data?.credit) || 0
                                        ).toFixed(2)
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                            <tr>
                              <td colspan="3">
                                <div className="text-right font-weight-bold pr-2">
                                  Total
                                </div>
                              </td>
                              <td>
                                <div className="text-right font-weight-bold pr-2">
                                  {numberWithCommas(
                                    (debitTotal || 0).toFixed(2)
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="text-right font-weight-bold pr-2">
                                  {numberWithCommas(
                                    (creditTotal || 0).toFixed(2)
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="text-right font-weight-bold pr-2">
                                  {numberWithCommas(
                                    (totalAmount || 0).toFixed(2)
                                  )}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
          </div>
                       
                      </div>
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
