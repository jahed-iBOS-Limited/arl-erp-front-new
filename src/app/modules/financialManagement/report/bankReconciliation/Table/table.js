import { Formik, Form } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
// import numberWithCommas from "../../../../_helper/_numberWithCommas";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getBankAccDDLAction, getBankReconciliationAction } from "../helper";
import ICustomCard from "./../../../../_helper/_customCard";
import AllTable from "./AllTable";
import ReactToPrint from "react-to-print";
import { SetReportBankReconciliationAction } from "../../../../_helper/reduxForLocalStorage/Actions";
// const html2pdf = require("html2pdf.js");

export const BankReconciliationTable = () => {
  const [bankAccDDL, setBankAccDDL] = useState([]);
  const [report, setReport] = useState({
    typeOne: [],
    typeTwo: [],
    typeThree: [],
    typeFour: [],
    // typeBalanceOfBankBook: [],
    // typeSix: [],
    allData: [],
  });
  const [loading, setLoading] = useState(false);
  // const [aggregateClosing, setAggregateClosing] = useState(0);
  const printRef = useRef();
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankAccDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBankAccDDL
    );
  }, [selectedBusinessUnit, profileData]);

  // const pdfExport = (fileName) => {
  //   var element = document.getElementById("pdf-bank-reconciliation");
  //   var opt = {
  //     filename: `${fileName}.pdf`,
  //     margin: 0.5,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       dpi: 96, letterRendering: true, padding: "50px", scrollX: -window.scrollX,
  //       scrollY: -window.scrollY,
  //       windowWidth: document.documentElement.offsetWidth,
  //       windowHeight: document.documentElement.offsetHeight,
  //     },
  //     jsPDF: { unit: "in", format: "letter", orientation: "l" },
  //   };
  //   html2pdf()
  //     .set(opt)
  //     .from(element)
  //     .save();
  // };
  
  const {reportBankReconciliation} = useSelector((state => state?.localStorage));

  const dispatch = useDispatch();

  const initData = {
    date: reportBankReconciliation?.date || _todayDate(),
    bankAccount: reportBankReconciliation?.bankAccount || "",
  };

  // const scrollToBottom = ()=>{
  //   let postionY = window.pageYOffset
  //   setTimeout(()=>{
  //     if(postionY<document.body.scrollHeight){
  //       window.scrollTo(postionY,postionY+200);
  //       scrollToBottom()
  //     }
  //   },10)
  // }

  return (
    <div className="position-relative">
     <button
        className="scrollBottom"
        onClick={(e) => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
          // scrollToBottom()
        }}
      >
        <i class="far fa-arrow-alt-circle-down" style={{color: "#fff"}}></i>
      </button>
      <ICustomCard title="Bank Reconciliation">
        <Formik initialValues={initData} enableReinitialize={true}>
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              <Form className="form global-form">
                {loading && <Loading />}
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="bankAccount"
                      options={bankAccDDL}
                      value={values?.bankAccount}
                      label="Bank Account"
                      onChange={(valueOption) => {
                        setFieldValue("bankAccount", valueOption);
                        dispatch(SetReportBankReconciliationAction({
                          bankAccount: valueOption,
                          date: values?.date,
                        }))
                      }}
                      placeholder="Bank Account"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Date</label>
                    <InputField
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        dispatch(SetReportBankReconciliationAction({
                          date: e?.target?.value,
                          bankAccount: values?.bankAccount
                        }))
                      }}
                    />
                  </div>
                  <div style={{ marginTop: "19px" }} className="col-lg-1">
                    <ButtonStyleOne
                      disabled={!values?.date || !values?.bankAccount}
                      type="button"
                      label="View"
                      onClick={(e) =>
                        getBankReconciliationAction(
                          selectedBusinessUnit?.value,
                          values?.date,
                          values?.bankAccount?.value,
                          setReport,
                          setLoading
                        )
                      }
                    />
                  </div>

                  {report?.allData?.length > 0 && (
                    <ReactToPrint
                      pageStyle={
                        "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                      }
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ height: "24px", marginTop: "19px" }}
                        >
                          {/* <img
                          style={{
                            width: "25px",
                            paddingRight: "5px",
                          }}
                          // src={printIcon}
                          alt="print-icon"
                        /> */}
                          PDF Export
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  )}
                </div>
              </Form>

              {report?.allData?.length > 0 && (
                <div
                  id="pdf-bank-reconciliation"
                  componentRef={printRef}
                  ref={printRef}
                >
                  <div className="row text-center my-2">
                    <div className="col-lg-12">
                      <h3>{selectedBusinessUnit?.label}</h3>
                      <b className="display-5">
                        Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon,
                        Dhaka-1208.
                      </b>
                      <br />
                      <b className="display-6">Account Reconcile</b>
                      <br />
                      <b className="display-6">As On {values?.date}</b>
                      <br />
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-md-2">
                      <b className="display-7">Bank</b>
                      <br />
                      <b className="display-7">Branch</b>
                      <br />
                      <b className="display-7">Account No</b>
                      <br />
                    </div>
                    <div className="col-md-5">
                      <b>{values?.bankAccount?.label}</b>
                      <br />
                      <b className="display-7">
                        {values?.bankAccount?.bankBranchName}
                      </b>
                      <br />
                      <b className="display-7">
                        {values?.bankAccount?.bankAccNo}
                      </b>
                      <br />
                    </div>
                  </div>
                  <div>
                    <AllTable
                      report={report}
                      // setAggregateClosing={setAggregateClosing}
                      values={values}
                    />
                    {/* <div className="text-right">
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "red",
                        }}
                      >
                        Aggregated Bank Statement Closing
                        Aggregated Bank Statement Closing As On {values?.date} :{" "}
                        {numberWithCommas((aggregateClosing || 0).toFixed(2))}
                      </p>
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "red",
                        }}
                      >
                        Actual Bank Statement Closing As On {values?.date} :{" "}
                        {numberWithCommas(
                          (
                            report?.allData[report?.allData?.length - 1]
                              ?.numAmount || 0
                          ).toFixed(2)
                        )}
                      </p>
                    </div> */}
                  </div>
                </div>
              )}
            </>
          )}
        </Formik>
      </ICustomCard>
    </div>
  );
};
