import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import Loading from "../../../_helper/_loading";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
// import { _todayDate } from "../../../_helper/_todayDate";
// import InputField from "../../../_helper/_inputField";
import { Form, Formik } from "formik";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import { _todayPreviousMonthDate } from "../../../_helper/_todayPreviousMonthDate";
import { getPartnerBook } from "./helper";
import { generateExcelAction } from "./partnerDetailsModal/excelConvert";
import {
  contractualExcelColumn,
  contractualExcelData,
} from "./partnerDetailsModal/excelStyle";
const html2pdf = require("html2pdf.js");

const SubScheduleModal = ({ tableItem, landingValues }) => {
  const initData = {
    fromDate: landingValues?.fromDate || _todayPreviousMonthDate(),
    toDate: landingValues?.toDate || _todayDate(),
  };
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  useEffect(() => {
    // console.log(landingValues)
    if (tableItem && landingValues) {
      getPartnerBook(
        selectedBusinessUnit?.value,
        tableItem?.intSubGlId || 0,
        tableItem?.intSubGlTypeId,
        landingValues?.fromDate || _todayPreviousMonthDate(),
        landingValues?.toDate || _todayDate(),
        setLoading,
        setRowDto,
        landingValues?.generalLedger?.value,
        landingValues?.profitCenter?.value
      );
    }
  }, [tableItem, landingValues, selectedBusinessUnit]);

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

  // excel column set up
  const excelColumnFunc = () => {
    return contractualExcelColumn;
  };

  // excel data set up
  const excelDataFunc = () => {
    return contractualExcelData(rowDto);
  };

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
                    <div className="col-lg-3">
                      <InputField
                        label="From Date"
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
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
                          setRowDto([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <ButtonStyleOne
                        label="View"
                        onClick={() => {
                          getPartnerBook(
                            selectedBusinessUnit?.value,
                            tableItem?.intSubGlId || 0,
                            tableItem?.intSubGlTypeId,
                            values?.fromDate,
                            values?.toDate,
                            setLoading,
                            setRowDto,
                            landingValues?.generalLedger?.value
                          );
                        }}
                        style={{ marginTop: "19px" }}
                      />
                    </div>
                    <div className="col-lg-4">
                      <div className="d-flex align-items-end justify-content-end">
                        <button
                          style={{ marginTop: "18px" }}
                          className="btn btn-primary ml-2"
                          type="button"
                          onClick={(e) => pdfExport("Bank Book")}
                        >
                          Export PDF
                        </button>

                        {rowDto?.length ? (
                          <span>
                            <button
                              style={{ marginTop: "18px" }}
                              className="btn btn-primary ml-2"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (rowDto?.length <= 0) {
                                  return toast.warning("Data is empty !!!!", {
                                    toastId: 1,
                                  });
                                }
                                const excelLanding = () => {
                                  generateExcelAction(
                                    "Sub Schedule Register Details",
                                    "",
                                    "",
                                    excelColumnFunc(),
                                    excelDataFunc(),
                                    selectedBusinessUnit?.label,
                                    0,
                                    rowDto,
                                    selectedBusinessUnit?.address,
                                    "",
                                    tableItem?.strSubGlName
                                  );
                                };
                                excelLanding();
                              }}
                            >
                              Export Excel
                            </button>
                          </span>
                        ) : null}

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
                    </div>
                  </div>
                  <div id="pdf-section" componentRef={printRef} ref={printRef}>
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
                      <h3 className="m-0">{tableItem?.strSubGlName}</h3>
                      {landingValues?.profitCenter ? (
                        <p>
                          {"Profit Center: "}
                          {landingValues?.profitCenter?.label}
                        </p>
                      ) : null}
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
                            <th style={{ width: "150px" }}> Account Name </th>
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
                                {_formatMoney(item?.numDebit || 0)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numCredit * -1 || 0)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numBalance || 0)}
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
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default SubScheduleModal;
