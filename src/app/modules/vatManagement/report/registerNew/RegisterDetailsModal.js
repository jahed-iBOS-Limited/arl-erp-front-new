import React, { useState, useRef } from "react";
import { getRegisterDetailsByIdAction } from "./helper";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import Loading from "../../../_helper/_loading";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { _todayDate } from "../../../_helper/_todayDate";
import InputField from "../../../_helper/_inputField";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import { _formatMoney } from './../../../_helper/_formatMoney';
import {SetFinancialManagementReportRegisterAction} from "../../../_helper/reduxForLocalStorage/Actions"
const html2pdf = require("html2pdf.js");



const RegisterDetailsModal = ({ tableItem, landingValues }) => {
  const initData = {
    fromDate: landingValues?.toDate || _todayDate(),
    toDate: landingValues?.toDate || _todayDate(),
  };


  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };
  const printRef = useRef();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => { }}
    >
      {({ errors, touched, setFieldValue, isValid, values }) => (
        <>
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title="Ledger Details">
              <CardHeaderToolbar></CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <Form className="form form-label-right">
                {loading && <Loading />}
                <div className="row global-form">
                  <div className="col-lg-3">
                    <InputField
                      label="From Date"
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        // localStorage.setItem("accountReportRegisterFromDate", e.target.value)
                        dispatch(SetFinancialManagementReportRegisterAction({
                          ...values,
                          fromDate:e.target.value
                        }))
                        setRowDto([]);
                      }}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      label="To Date"
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        // localStorage.setItem("accountReportRegisterToDate", e.target.value)
                        dispatch(SetFinancialManagementReportRegisterAction({
                          ...values,
                          toDate:e.target.value
                        }))
                        setRowDto([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <ButtonStyleOne
                      label="View"
                      onClick={() => {
                        getRegisterDetailsByIdAction(
                          selectedBusinessUnit?.value,
                          tableItem?.intBankAccountId,
                          values?.fromDate,
                          values?.toDate,
                          setLoading,
                          setRowDto
                        );
                      }}
                      style={{ marginTop: "19px" }}
                    />

                    <button
                      style={{ marginTop: "18px" }}
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={(e) => pdfExport("Bank Book")}
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
                          className="btn btn-primary ml-2"
                          style={{ marginTop: "18px" }}
                        >
                          <i class="fa fa-print pointer" aria-hidden="true"></i>
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                </div>
                {rowDto?.length > 0 && (
                  <div id="pdf-section" componentRef={printRef} ref={printRef} >
                    <div className="text-center">
                      <h2>{selectedBusinessUnit?.label.toUpperCase()}</h2>
                      <h6
                        style={{
                          borderBottom: "2px solid #ccc",
                          paddingBottom: "10px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedBusinessUnit?.address}
                      </h6>
                      <h3 className="m-0">Bank Book</h3>
                      <p className="m-0"><strong>{tableItem?.strBankAccountNo}</strong></p>
                      <p className="m-0">
                        <strong className="mr-5">{tableItem?.strBankName + (tableItem?.strBankBranchName ? ", "+tableItem?.strBankBranchName : "")}</strong>
                      </p>
                      <div className="row justify-content-center">
                        <strong className="mr-5">
                          From: {values?.fromDate}
                        </strong>
                        <strong>To: {values?.toDate}</strong>
                      </div>
                    </div>

                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}> SL </th>
                            <th style={{ width: "60px" }}> Date </th>
                            <th style={{ width: "100px" }}> Code </th>
                            <th style={{ width: "62px" }}>Partner Name</th>
                            <th style={{ width: "250px" }}> Description </th>
                            <th style={{ width: "100px" }}> Instrument </th>
                            <th style={{ width: "80px" }}> Debit </th>
                            <th style={{ width: "80px" }}> Credit </th>
                            <th style={{ width: "80px" }}> Balance </th>
                          </tr>
                        </thead>
                        <tbody>
                          {" "}
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                {_dateFormatter(item?.strBankJournalDate)}
                              </td>
                              <td>{item?.strBankJournalCode}</td>
                              <td>{item?.strBusinessPartnerName}</td>
                              <td>{item?.strNarration}</td>
                              <td>{item?.strChequeNo}</td>
                              <td className="text-right">{_formatMoney(item?.numDebit?.toFixed(2))}</td>
                              <td className="text-right">{_formatMoney(item?.numCredit?.toFixed())}</td>
                              <td className="text-right">{_formatMoney(item?.numBalance?.toFixed(2))}</td>
                            </tr>
                          ))}
                           <tr >
                              <td className="text-right" colSpan="6">Total</td>
                              <td className="text-right">{_formatMoney(rowDto?.reduce((a,b)=>a+Number(b?.numDebit),0)?.toFixed(2))}</td>
                              <td className="text-right">{ _formatMoney(rowDto?.reduce((a,b)=>a+Number(b?.numCredit),0)?.toFixed(2))}</td>
                              <td className="text-right">{_formatMoney(Number(rowDto[rowDto?.length-1]?.numBalance)?.toFixed(2))}</td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Form>
            </CardBody>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default RegisterDetailsModal;
