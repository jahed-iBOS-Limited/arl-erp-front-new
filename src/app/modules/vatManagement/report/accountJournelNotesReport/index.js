import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, CardHeaderToolbar, ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
   fromDate: _todayDate(),
   toDate: _todayDate(),
 };

export function AccountJournelNotesReport() {

   const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  

  // get user profile data from store
  const profileData = useSelector(
   (state) => state.authData.profileData,
   shallowEqual
 );

  const [notesReportData, getNotesReportData, reportLoading] = useAxiosGet([]);
  // get user profile data from store

  // get selected business unit from store
 const selectedBusinessUnit = useSelector(
   (state) => state.authData.selectedBusinessUnit,
   shallowEqual
 );


//   const pdfExport = (fileName) => {
//     var element = document.getElementById("pdf-section");
//     var opt = {
//       margin: 20,
//       filename: `${fileName}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: {
//         scale: 5,
//         dpi: 300,
//         letterRendering: true,
//         padding: "50px",
//         scrollX: -window.scrollX,
//         scrollY: -window.scrollY,
//         windowWidth: document.documentElement.offsetWidth,
//         windowHeight: document.documentElement.offsetHeight,
//       },
//       jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
//     };
//     html2pdf()
//       .set(opt)
//       .from(element)
//       .save();
//   };
//   const printRef = useRef();

const setPositionHandler = (pageNo, pageSize, values) => {
   let fromDate = values?.fromDate ? `&fromDate=${values?.fromDate}` : ""
   let toDate = values?.toDate ? `&toDate=${values?.toDate}` : ""
   getNotesReportData(
     `/fino/AccountingJournalTax/GetAccountingJournalTaxNotesReport?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit.value}${fromDate}${toDate}&pageNo=${pageNo}&pageSize=${pageSize}`
   );
 };
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
            <Card>
              {reportLoading && <ModalProgressBar />}
              <CardHeader title={"Accounts Journel Notes Report"}>
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
                  className="form form-label-right incomestatementTable"
                  // ref={printRef}
                >
                  <div className="row global-form incomestatementTablePrint">
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL || []}
                        value={values?.sbu}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          if(valueOption){
                           setFieldValue("sbu", valueOption);
                           setNotesReportData([])
                          }else{
                           setFieldValue("sbu", valueOption);
                           setNotesReportData([])
                          }                          
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
                          setFieldValue("fromDate", e.target.value)
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To date</label>
                      <InputField
                        value={values?.toDate}
                        name="todate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                        setFieldValue("toDate", e.target.value)
                        }}
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                           let fromDate = values?.fromDate ? `&fromDate=${values?.fromDate}` : ""
                           let toDate = values?.toDate ? `&toDate=${values?.toDate}` : ""
                           getNotesReportData(
                             `/fino/AccountingJournalTax/GetAccountingJournalTaxNotesReport?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit.value}${fromDate}${toDate}&pageNo=${pageNo}&pageSize=${pageSize}`
                           );
                        }}
                        disabled={false}
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  <div className="row" id="pdf-section" >
                    {notesReportData.length > 0 && (
                        <div className="col-lg-12">
                        {/* <div className="titleContent text-center">
                          <h3>{selectedBusinessUnit?.label}</h3>
                          <h5>Comprehensive Income Statement</h5>
                          <p className="m-0">
                            <strong>
                              {`For the period from ${values?.fromDate} to ${values?.todate}`}
                            </strong>
                          </p>
                        </div> */}
                        <div className="print_wrapper">
                          <table
                            id="table-to-xlsx"
                            className="table table-striped table-bordered mt-3 global-table table-font-size-sm"
                          >
                            <thead>
                              <tr>
                                <th >SL</th>
                                <th >Note Name</th>
                                <th >General Ledger Code</th>
                                <th >General Ledger Name</th>
                                <th >Total Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {notesReportData?.map((data, index) => (
                                <tr style={{fontWeight: data?.IsAggregate ? "bold" : "normal"}}>
                                  <td>
                                    {index + 1}
                                  </td>
                                  <td>{data?.NoteName}</td>
                                  <td>{data?.GeneralLedgerCode}</td>
                                  <td>{data?.GeneralLedgerName}</td>                                  
                                  <td>{data?.TotalAmount ? _formatMoney(data?.TotalAmount) : ""}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {notesReportData?.data?.length > 0 && (
                      <PaginationTable
                        count={notesReportData?.totalCount}
                        setPositionHandler={setPositionHandler}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                        values={values}
                        rowsPerPageOptions={[15, 25, 50, 100, 200, 300, 400, 500]}
                      />
                    )}
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
