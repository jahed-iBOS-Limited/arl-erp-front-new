import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
// import ReactToPrint from "react-to-print";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { getAutoReconcileList } from "../helper";
import { _formatMoney } from "./../../../../_helper/_formatMoney";
// import printIcon from "../../../../_helper/images/print-icon.png";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { getBankAccDDLAction } from "../../bankReconciliation/helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import {SetFinancialManagementReportAutoReconcileAction} from "../../../../_helper/reduxForLocalStorage/Actions"
import { fromDateFromApi } from "../../../../_helper/_formDateFromApi";

// const html2pdf = require("html2pdf.js");

export function TableRow() {

  const {financialManagementReportAutoReconcile} = useSelector(state=>state?.localStorage)

  const initData = {
    fromDate: financialManagementReportAutoReconcile?.fromDate || _todayDate(),
    toDate:financialManagementReportAutoReconcile?.toDate || _todayDate(),
    bankAccount: financialManagementReportAutoReconcile?.bankAccount ||"",
  };

  const dispatch = useDispatch()

  const [bankAccDDL, setBankAccDDL] = useState([]);
  const [rowDate, setRowData] = useState([]);
  const [fromDateFApi, setFromDateFApi] = useState("");

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    fromDateFromApi(selectedBusinessUnit?.value, setFromDateFApi);
    getBankAccDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBankAccDDL
    );
  }, [selectedBusinessUnit, profileData]);
  // const pdfExport = (fileName) => {
  //   var element = document.getElementById("pdf-section");
  //   var opt = {
  //     margin: 20,
  //     filename: `${fileName}.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       scale: 5,
  //       dpi: 300,
  //       letterRendering: true,
  //       padding: "50px",
  //       scrollX: -window.scrollX,
  //       scrollY: -window.scrollY,
  //       windowWidth: document.documentElement.offsetWidth,
  //       windowHeight: document.documentElement.offsetHeight,
  //     },
  //     jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
  //   };
  //   html2pdf()
  //     .set(opt)
  //     .from(element)
  //     .save();
  // };
  // const printRef = useRef();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{...initData, fromDate:fromDateFApi}}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Auto Reconcile"}>
                <CardHeaderToolbar>
                  {/* <ReactHTMLTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary m-0 mx-2 py-2 px-2"
                    table="table-to-xlsx"
                    filename="Income Statement Report"
                    sheet="Income Statement Report"
                    buttonText="Export Excel"
                  /> */}
                  {/* <button
                    className="btn btn-primary ml-2"
                    type="button"
                    onClick={(e) => pdfExport("Income Statement Report")}
                  >
                    Export PDF
                  </button> */}
                  {/* <ReactToPrint
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
                  /> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form
                  className="form form-label-right"
                  // ref={printRef}
                >
                  <div className="row global-form">
                    <div className="col-lg-2">
                      <NewSelect
                        name="bankAccount"
                        options={bankAccDDL}
                        value={values?.bankAccount}
                        label="Bank Account"
                        onChange={(valueOption) => {
                          setFieldValue("bankAccount", valueOption);
                          dispatch(SetFinancialManagementReportAutoReconcileAction({
                            ...values,
                            bankAccount:valueOption
                          }))
                        }}
                        placeholder="Bank Account"
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
                        onChange={e=>{
                          setFieldValue("fromDate",e.target.value)
                          dispatch(SetFinancialManagementReportAutoReconcileAction({
                            ...values,
                            fromDate:e.target.value
                          }))
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        onChange={e=>{
                          setFieldValue("toDate",e.target.value)
                          dispatch(SetFinancialManagementReportAutoReconcileAction({
                            ...values,
                            toDate:e.target.value
                          }))
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Search</label>
                      <InputField
                        value={values?.search}
                        name="search"
                        placeholder="Search"
                        type="text"
                        onChange={e=>{
                          setFieldValue("search",e.target.value)
                          dispatch(SetFinancialManagementReportAutoReconcileAction({
                            ...values,
                            search:e.target.value
                          }))
                        }}
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          getAutoReconcileList(
                            selectedBusinessUnit?.value,
                            values?.bankAccount?.value,
                            values?.fromDate,
                            values?.toDate,
                            values?.search || "",
                            setRowData
                          );
                        }}
                        disabled={
                          !values?.bankAccount ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  <div className="row" id="pdf-section">
                    {rowDate.length > 0 && (
                      <div className="col-lg-12">
                        <div className="print_wrapper">
                          <table
                            id="table-to-xlsx"
                            className="table table-striped table-bordered mt-3 global-table table-font-size-sm"
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}>SL</th> 
                                <th style={{ width: "150px" }}>Partner Name</th> 
                                <th style={{ width: "150px" }}>Voucher Code</th>
                                <th style={{ width: "50px" }}>Type</th>
                                <th style={{ width: "80px" }}>Issue Date</th>
                                <th style={{ width: "200px" }}>Ref No.</th>
                                <th>Particulars</th>
                                <th style={{ width: "100px" }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDate?.map((item, index) => (
                                <tr>
                                  <td className="text-center">{index+1}</td>
                                  <td>{item?.partnerName}</td>
                                  <td>{item?.voucherCode}</td>
                                  <td>{item?.type}</td>
                                  <td>{ _dateFormatter(item?.issueDate)}</td>
                                  <td>{item?.refNo}</td>
                                  <td>{item?.particulars}</td>
                                  <td>{ _formatMoney(item?.amount)}</td>
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
