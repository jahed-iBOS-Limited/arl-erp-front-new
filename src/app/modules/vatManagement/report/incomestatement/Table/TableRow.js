import { Formik, Form } from "formik";
import React, { useState, useRef } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "./../../../../_helper/_inputField";
import ReactToPrint from "react-to-print";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { getIncomeStatement_api,  } from "../helper";
import { _formatMoney } from "./../../../../_helper/_formatMoney";
import printIcon from "../../../../_helper/images/print-icon.png";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { SetReportIncomestatementAction } from "./../../../../_helper/reduxForLocalStorage/Actions";
import Loading from "../../../../_helper/_loading";
const html2pdf = require("html2pdf.js");

export function TableRow() {
  const { reportIncomestatement } = useSelector((state) => state?.localStorage);
  const [isLoading, setIsLoading] = useState(false);

  const initData = {
    id: undefined,
    fromDate: reportIncomestatement?.fromDate || _todayDate(),
    todate: reportIncomestatement?.todate || _todayDate(),
    lastPeriodFrom: reportIncomestatement?.lastPeriodFrom || _todayDate(),
    lastPeriodTo: reportIncomestatement?.lastPeriodTo || _todayDate(),
    SBU: reportIncomestatement?.SBU || "",
  };

  const dispatch = useDispatch();

  // const [sbiDDL, setSbuDDL] = useState([]);
  const [incomeStatement, setIncomeStatement] = useState([]);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { selectedBusinessUnit } = storeData;

  // useEffect(() => {
  //   if (profileData.accountId && selectedBusinessUnit.value) {
  //     getSbuDDL(profileData.accountId, selectedBusinessUnit.value, setSbuDDL);
  //   }
  // }, [profileData, selectedBusinessUnit]);
  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 5,
        dpi: 300,
        letterRendering: true,
        padding: "50px",
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };
  const printRef = useRef();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
          {
            isLoading && <Loading />
          }
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Income Statement Report"}>
                <CardHeaderToolbar>
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary m-0 mx-2 py-2 px-2"
                    table="table-to-xlsx"
                    filename="Income Statement Report"
                    sheet="Income Statement Report"
                    buttonText="Export Excel"
                  />
                  <button
                    className="btn btn-primary ml-2"
                    type="button"
                    onClick={(e) => pdfExport("Income Statement Report")}
                  >
                    Export PDF
                  </button>
                  <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                    }
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary sales_invoice_btn ml-3"
                      >
                        <img
                          style={{ width: "20px", paddingRight: "5px" }}
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
                <Form
                  className="form form-label-right incomestatementTable"
                  // ref={printRef}
                >
                  <div className="row global-form incomestatementTablePrint">
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="SBU"
                        options={sbiDDL || []}
                        value={values?.SBU}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("SBU", valueOption);
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                              SBU: valueOption,
                            })
                          );
                        }}
                        placeholder="Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                              fromDate: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To date</label>
                      <InputField
                        value={values?.todate}
                        name="todate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                              todate: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <label>Last Period From</label>
                      <InputField
                        value={values?.lastPeriodFrom}
                        name="lastPeriodFrom"
                        placeholder="Last Period From"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                              lastPeriodFrom: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Last Period To</label>
                      <InputField
                        value={values?.lastPeriodTo}
                        name="lastPeriodTo"
                        placeholder="Last Period To"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                              lastPeriodTo: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div> */}
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary mt-1"
                        type="button"
                        onClick={() => {
                          getIncomeStatement_api(
                            values?.fromDate,
                            values?.todate,
                            selectedBusinessUnit?.value,
                            values?.SBU?.value,
                            setIncomeStatement,
                            setIsLoading
                          );
                        }}
                        // disabled={!values?.SBU}
                        disabled={!values?.fromDate || !values?.todate}
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  <div className="row" id="pdf-section" ref={printRef}>
                    {incomeStatement.length > 0 && (
                      <div className="col-lg-12">
                        <div className="titleContent text-center">
                          <h3>{selectedBusinessUnit?.label}</h3>
                          <h5>Comprehensive Income Statement</h5>
                          <p className="m-0">
                            <strong>
                              {`For the period from ${values?.fromDate} to ${values?.todate}`}
                            </strong>
                          </p>
                        </div>
                        <div className="print_wrapper">
                          <table
                            id="table-to-xlsx"
                            className="table table-striped table-bordered mt-3 global-table table-font-size-sm"
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "500px" }}>Particulars</th>
                                {/* <th style={{ width: "200px" }}>Note SL</th> */}

                                <th
                                  style={{ width: "250px" }}
                                  className="incTableThPadding"
                                >
                                  <span>
                                    Budget
                                    <br />
                                    {/* {`${values?.fromDate} to ${values?.todate}`} */}
                                  </span>
                                </th>
                                <th
                                  style={{ width: "250px" }}
                                  className="incTableThPadding"
                                >
                                  <span>
                                    Actual <br />
                                    {/* {`${values?.lastPeriodFrom} to ${values?.lastPeriodTo}`} */}
                                  </span>
                                </th>
                                <th style={{ width: "250px" }}>Variance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {incomeStatement?.map((data, index) => (
                                <tr
                                  className={
                                    data?.strFSComponentName === "Sales Revenue"
                                      ? "font-weight-bold"
                                      : data?.strFSComponentName ===
                                        "Gross Margin"
                                      ? "font-weight-bold"
                                      : data?.strFSComponentName ===
                                        "Income From Operation"
                                      ? "font-weight-bold"
                                      : data?.strFSComponentName ===
                                        "Earning Before Tax"
                                      ? "font-weight-bold"
                                      : data?.strFSComponentName ===
                                        "Earning Before Tax"
                                      ? "font-weight-bold"
                                      : ""
                                  }
                                >
                                  <td className="text-left">
                                    {data?.strFSComponentName}
                                  </td>
                                  {/* <td></td> */}
                                  <td className="text-right">
                                    {_formatMoney(data?.monLastPeriodAmount)}
                                  </td>
                                  <td className="text-right">
                                    {_formatMoney(data?.monCurrentPeriodAmount)}
                                  </td>
                                  <td className="text-right">
                                    {_formatMoney(
                                      data?.monLastPeriodAmount -
                                        data?.monCurrentPeriodAmount
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div></div>
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
