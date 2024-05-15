import { Form, Formik } from "formik";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "./../../../../_helper/customHooks/useAxiosGet";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { downloadFile } from "./../../../../_helper/downloadFile";

export default function ProductionDetails({
  productionOrderId,
  selectedBusinessUnit,
}) {
  const [loading, setLoading] = useState(false);
  const [reportData, getReportData, reportDataLoader] = useAxiosGet();
  const printRef = useRef();

  useEffect(() => {
    if (productionOrderId) {
      getReportData(
        `/mes/ProductionOrder/GetProductionDetailsById?BuId=${selectedBusinessUnit?.value}&ProductionOrderId=${productionOrderId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productionOrderId]);

  // pdfExport function
  const pdfExport = (fileName) => {
    var element = document.getElementById("production-details");
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

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(reportDataLoader || loading) && <Loading />}
          <IForm
            title="Production Details"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      downloadFile(
                        `/mes/ProductionOrder/GetProductionDetailsById?BuId=${selectedBusinessUnit?.value}&ProductionOrderId=${productionOrderId}&isDownload=true`,
                        "Production Details",
                        "xlsx",
                        setLoading
                      );
                    }}
                  >
                    Export
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary ml-3 mr-3"
                    onClick={() => {
                      pdfExport("Production Details");
                    }}
                  >
                    Pdf
                  </button>
                  <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                    }
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-primary px-3 py-2"
                      >
                        <i
                          className="mr-1 fa fa-print pointer"
                          aria-hidden="true"
                        ></i>
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </div>
              );
            }}
          >
            <Form>
              <div
                ref={printRef}
                className="production-report-wrapper mt-5"
                id="production-details"
              >
                <div className="header-section text-center">
                  <h3>{selectedBusinessUnit?.label}</h3>
                  <p style={{ marginBottom: "0px", fontSize: "14px" }}>
                    {selectedBusinessUnit?.businessUnitAddress}
                  </p>
                  <p style={{ marginBottom: "0px", fontSize: "14px" }}>
                    <strong>Production Details</strong>
                  </p>
                </div>
                <div className="info-section mt-3">
                  <div className="table-responsive">
                    <table style={{ width: "100%" }}>
                      <tr>
                        <td>Item Name</td>
                        <td>:</td>
                        <td>{reportData?.headerDetails?.itemName}</td>
                        <td></td>
                        <td>Order Qty</td>
                        <td>:</td>
                        <td>{reportData?.headerDetails?.orderQty}</td>
                      </tr>
                      <tr>
                        <td>Order Date</td>
                        <td>:</td>
                        <td>
                          {_dateFormatter(reportData?.headerDetails?.orderDate)}
                        </td>
                        <td></td>
                        <td>Uom</td>
                        <td>:</td>
                        <td>{reportData?.headerDetails?.uomName}</td>
                      </tr>
                      <tr>
                        <td>Production Order Code</td>
                        <td>:</td>
                        <td>
                          {reportData?.headerDetails?.productionOrderCode}
                        </td>
                        <td></td>
                        <td>Request Code</td>
                        <td>:</td>
                        <td>{reportData?.headerDetails?.itemRequestCode}</td>
                      </tr>
                      <tr>
                        <td>Gross Weight (Kg)</td>
                        <td>:</td>
                        <td>{reportData?.headerDetails?.grossWeight}</td>
                        <td></td>
                        <td>Total (Kg)</td>
                        <td>:</td>
                        <td>{reportData?.headerDetails?.total}</td>
                      </tr>
                      <tr>
                        <td>Status</td>
                        <td>:</td>
                        <td>{reportData?.headerDetails?.status}</td>
                        <td></td>
                        <td>Close Date</td>
                        <td>:</td>
                        <td>{reportData?.headerDetails?.closeDate}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div className="mt-3">
                  <h6
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Raw Material
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>Item Code</th>
                          <th>Product Name</th>
                          <th>Uom</th>
                          <th>Quantity</th>
                          <th>Issue Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData?.rawMaterialDetails?.length > 0 &&
                          reportData?.rawMaterialDetails.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.itemCode}</td>
                              <td>{item?.itemName}</td>
                              <td>{item?.uomName}</td>
                              <td className="text-center">{item?.quantity}</td>
                              <td className="text-center">
                                {item?.issueQuantity}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-3">
                  <h6
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Output Item
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>Item Code</th>
                          <th>Item Name (Output)</th>
                          <th>Output Quantity</th>
                          <th>Gross Weight (Kg)</th>
                          <th>Production Quantity (Kg)</th>
                          <th>%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData?.outputMaterialDetails?.length > 0 &&
                          reportData?.outputMaterialDetails.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.itemCode}</td>
                                <td>{item?.itemName}</td>
                                <td className="text-center">
                                  {item?.outputQuantity}
                                </td>
                                <td className="text-center">
                                  {item?.grossWeight}
                                </td>
                                <td className="text-center">
                                  {item?.productionQuantity}
                                </td>
                                <td className="text-center">{item?.percent}</td>
                              </tr>
                            )
                          )}
                        <tr>
                          {reportData?.outputMaterialDetails?.length > 0 && (
                            <td colSpan="5" className="text-right">
                              <strong>Total</strong>
                            </td>
                          )}
                          {reportData?.outputMaterialDetails?.length > 0 && (
                            <td className="text-center">
                              <strong>
                                {reportData?.totalProductionQuantity}
                              </strong>
                            </td>
                          )}
                          {reportData?.outputMaterialDetails?.length > 0 && (
                            <td className="text-center">
                              <strong>{reportData?.totalPercentage}</strong>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="footer mt-3">
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "11px",
                    }}
                  >
                    <strong>
                      Order Create By :{" "}
                      {reportData?.headerDetails?.orderCreatedBy}{" "}
                    </strong>
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "11px",
                    }}
                  >
                    <strong>
                      Last Entry Date :{" "}
                      {_dateFormatter(reportData?.headerDetails?.lastEntryDate)}{" "}
                    </strong>
                  </p>
                  <p
                    style={{
                      marginBottom: "0px",
                      fontSize: "11px",
                    }}
                  >
                    <strong>Print Date: {_todayDate()}</strong>
                  </p>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
