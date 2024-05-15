import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, CardHeaderToolbar, ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { Form, Formik } from "formik";
import { useMemo } from "react";
import ReactToPrint from "react-to-print";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { _todayDate } from "../../../../_helper/_todayDate";
const ProfitCenterView = ({ currentRowData, landingValues }) => {
  const printRef = useRef();
  const [dataById, getDataById, getDataByIdLoading] = useAxiosGet([]);
  const { selectedBusinessUnit } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (currentRowData?.intCostRevId && currentRowData?.intElementId && currentRowData?.intProfitId) {
      getDataById(
        `/fino/FinancialStatement/CostCenterDetails?revId=${currentRowData?.intCostRevId}&elementId=${currentRowData?.intElementId}&profitId=${
          currentRowData?.intProfitId
        }&unitId=${selectedBusinessUnit?.value}&fromDate=${landingValues?.fromDate || _todayDate()}&toDate=${landingValues?.toDate || _todayDate()}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, currentRowData]);

  const totalAmount = useMemo(() => dataById.reduce((acc, item) => acc + (item?.numAmount || 0), 0), [dataById]);
  return (
    <>
      <Formik enableReinitialize={true} initialValues={{}} onSubmit={(values, { setSubmitting, resetForm }) => {}}>
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Profit Center Details">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {getDataByIdLoading && <Loading />}
                  <div className="row">
                    <div className="col-lg-8"></div>
                    <div className="col-lg-4">
                      <div className="d-flex align-items-end justify-content-end">
                        {dataById?.length ? (
                          <span>
                            <ReactHtmlTableToExcel
                              id="test-table-xls-button-att-reports"
                              className="btn btn-primary m-0 mx-2 py-2 px-2"
                              table="table-to-xls"
                              filename="Profit Center Details Report"
                              sheet="Profit Center Details Report"
                              buttonText="Export Excel"
                            />
                          </span>
                        ) : null}

                        <ReactToPrint
                          pageStyle={"@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"}
                          trigger={() => (
                            <button type="button" className="btn btn-primary ml-2" style={{ marginTop: "18px" }}>
                              <i class="fa fa-print pointer" aria-hidden="true"></i>
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
                      {/* <h3 className="m-0">{tableItem?.strSubGlName}</h3> */}
                    </div>

                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-striped table-bordered global-table" id="table-to-xls">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}> SL </th>
                            <th style={{ width: "100px" }}> Code </th>
                            <th style={{ width: "150px" }}> Gl Name </th>
                            <th style={{ width: "80px" }}> Business Transaction </th>
                            <th style={{ minWidth: "80px" }}> Cost Center </th>
                            <th style={{ minWidth: "120px" }}> Gl Narration </th>
                            <th style={{ minWidth: "100px" }}> Amount </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataById?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{item?.strAccountingJournalCode}</td>
                              <td>{item?.strGeneralLedgerName}</td>
                              <td>{item?.strSubGlname}</td>
                              <td>{item?.strCostRevenueName}</td>
                              <td>{item?.strNarration}</td>
                              <td>{item?.numAmount}</td>
                            </tr>
                          ))}
                          <tr>
                            <td className="text-right" colSpan="6">
                              Total:
                            </td>
                            <td className="text-right">{_formatMoney(totalAmount)}</td>
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

export default ProfitCenterView;
