import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
// import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
// import Loading from "../../../_helper/_loading";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";

// import { _dateFormatter } from "../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
// import { _formatMoney } from "../../../_helper/_formatMoney";
// import { getPartnerBook, partnerGeneralLedgerList } from "./helper";
import { Formik, Form } from "formik";
// import { _todayDate } from "../../../_helper/_todayDate";
// import InputField from "../../../_helper/_inputField";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getPartnerBook,
  partnerGeneralLedgerList,
} from "../../../report/register/helper";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
// import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
// import NewSelect from "../../../_helper/_select";
const html2pdf = require("html2pdf.js");

const SupplierModal = ({ gridItem, partnerTypeId, partnerTypeName }) => {
  const initData = {
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
  };
  const [rowDto, setRowDto] = useState([]);
  const [, setGlDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  console.log("gridItem", gridItem);

  useEffect(() => {
    if (gridItem) {
      getPartnerBook(
        selectedBusinessUnit?.value,
        gridItem?.partnerId,
        partnerTypeId,
        _firstDateofMonth(),
        _todayDate(),
        setLoading,
        setRowDto
      );
    }
  }, [gridItem, selectedBusinessUnit, partnerTypeId]);

  useEffect(() => {
    if (selectedBusinessUnit) {
      partnerGeneralLedgerList(
        selectedBusinessUnit?.value,
        partnerTypeId,
        setGlDDL
      );
    }
  }, [selectedBusinessUnit, partnerTypeId]);

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
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Register Details">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-lg-2">
                      <InputField
                        label="From Date"
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                          // localStorage.setItem("accountReportRegisterFromDate", e.target.value)
                          // dispatch(SetFinancialManagementReportRegisterAction({
                          //   ...values,
                          //   fromDate:e.target.value
                          // }))
                          setRowDto([]);
                        }}
                      />
                    </div>

                    <div className="col-lg-2">
                      <InputField
                        label="To Date"
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                          // localStorage.setItem("accountReportRegisterToDate", e.target.value)
                          // dispatch(SetFinancialManagementReportRegisterAction({
                          //   ...values,
                          //   toDate:e.target.value
                          // }))
                          setRowDto([]);
                        }}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="gl"
                        options={glDDL || []}
                        value={values?.gl}
                        label="Select GL"
                        onChange={(valueOption) => {
                          setFieldValue("gl", valueOption);
                        }}
                        placeholder="Select GL"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-2">
                      <ButtonStyleOne
                        label="View"
                        onClick={() => {
                          getPartnerBook(
                            selectedBusinessUnit?.value,
                            gridItem?.partnerId,
                            partnerTypeId,
                            values?.fromDate,
                            values?.toDate,
                            setLoading,
                            setRowDto
                          );
                        }}
                        style={{ marginTop: "19px" }}
                      />
                    </div>
                    <div className="col-lg-4">
                      {rowDto?.length ? (
                        <div className="d-flex align-items-end justify-content-end">
                          <button
                            style={{ marginTop: "18px" }}
                            className="btn btn-primary ml-2"
                            type="button"
                            onClick={(e) => pdfExport("Bank Book")}
                          >
                            Export PDF
                          </button>
                          <span>
                            <ReactHtmlTableToExcel
                              id="test-table-xls-button-att-reports"
                              className="btn btn-primary m-0 mx-2 py-1 px-2"
                              table="table-to-xls"
                              filename="Register Details"
                              sheet="Register Details"
                              buttonText="Export Excel"
                            />
                          </span>

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
                                <i
                                  class="fa fa-print pointer"
                                  aria-hidden="true"
                                ></i>
                                Print
                              </button>
                            )}
                            content={() => printRef.current}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {rowDto?.length > 0 && (
                    <div
                      id="pdf-section"
                      componentRef={printRef}
                      ref={printRef}
                    >
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
                        <h3 className="m-0">{partnerTypeName} Ledger</h3>
                        <p className="m-0">
                          <strong className="mr-5">
                            {gridItem?.partnerName}
                          </strong>
                        </p>
                        {/* <div className="row justify-content-center">
                    <strong className="mr-5">From: {values?.fromDate}</strong>
                    <strong>To: {values?.toDate}</strong>
                  </div> */}
                      </div>

                      <div className="react-bootstrap-table table-responsive">
                        <table
                          className="table table-striped table-bordered global-table"
                          id="table-to-xls"
                        >
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}> SL </th>
                              <th style={{ width: "60px" }}> Date </th>
                              <th style={{ width: "100px" }}> Code </th>
                              <th style={{ width: "62px" }}> Account Name </th>
                              <th style={{ width: "250px" }}> Description </th>
                              <th style={{ width: "80px" }}> Debit </th>
                              <th style={{ width: "80px" }}> Credit </th>
                              <th style={{ width: "80px" }}> Balance </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                  {_dateFormatter(item?.strBankJournalDate)}
                                </td>
                                <td>{item?.strGeneralLedgerCode}</td>
                                <td>{item?.strGeneralLedgerName}</td>
                                <td>{item?.strNarration}</td>
                                <td className="text-right">
                                  {_formatMoney(
                                    Math.abs(item?.numDebit)?.toFixed(2)
                                  )}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(
                                    Math.abs(item?.numCredit)?.toFixed()
                                  )}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(
                                    Number(item?.numBalance)?.toFixed(2)
                                  )}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td className="text-right" colSpan="5">
                                Total
                              </td>
                              <td className="text-right">
                                {_formatMoney(
                                  Math.abs(
                                    rowDto?.reduce(
                                      (a, b) => a + Number(b?.numDebit),
                                      0
                                    )
                                  )?.toFixed(2)
                                )}
                              </td>
                              <td className="text-right">
                                {_formatMoney(
                                  Math.abs(
                                    rowDto?.reduce(
                                      (a, b) => a + Number(b?.numCredit),
                                      0
                                    )
                                  )?.toFixed(2)
                                )}
                              </td>
                              <td className="text-right">
                                {_formatMoney(
                                  (
                                    Math.abs(
                                      rowDto?.reduce(
                                        (a, b) => a + Number(b?.numDebit),
                                        0
                                      )
                                    ) -
                                    Math.abs(
                                      rowDto?.reduce(
                                        (a, b) => a + Number(b?.numCredit),
                                        0
                                      )
                                    )
                                  )?.toFixed(2)
                                )}
                              </td>
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
    </>
  );
};

export default SupplierModal;
