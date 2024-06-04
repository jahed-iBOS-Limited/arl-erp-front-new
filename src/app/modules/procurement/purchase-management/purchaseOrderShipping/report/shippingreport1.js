/* eslint-disable no-useless-concat */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Formik, Form as FormikForm } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
// import printIcon from "../../../../../helper/assets/images/print/print-icon.png";
import { useHistory } from "react-router-dom";
import { getReportPurchaseOrderForShipping } from "../helper";
import "./parchaseReport.css";
//import { convertNumberToWords } from "./../../../../../helper/_convertMoneyToWord";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
import { downloadFile } from "../../../../_helper/downloadFile";
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png";
import akijShippingLogo from "./images/akijShippingText.png";
import background from "./images/signature.PNG";
import { ReceivePoReportView } from "./recievePoReportView";
import "./shippingReport.css";
import ViewForm from "./viewForm";
//const html2pdf = require("html2pdf.js");

let imageObj = {
  8: iMarineIcon,
};

const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, do not change existing props name and existing code which is related to this props,
export function ShippingViewReport1({
  poId,
  orId,
  isHiddenBackBtn,
  setLoading,
}) {
  const [purchaseOrderReport, setPurchaseOrderReport] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [isReceivePoModal, setIsReceivePoModal] = useState(false);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getReportPurchaseOrderForShipping(poId, orId, setPurchaseOrderReport);
  }, [poId]);

  let totalSum = purchaseOrderReport?.objRowListDTO?.reduce(
    (acc, sum) => sum?.totalValue + acc,
    0
  );

  const printRef = useRef();
  const history = useHistory();

  const initDataforEmail = {
    toMail: purchaseOrderReport?.objHeaderDTO?.supplierEmail,
    toCC: "",
    toBCC: "",
    subject: `Purchase Order No: ${purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}`,
    message: `Dear ${purchaseOrderReport?.objHeaderDTO?.supplierName}
    A Purchase Order has been sent from ${purchaseOrderReport?.objHeaderDTO?.billToName}Purchase Order No:   ${purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}
    Please take the necessary action 
    `,
    attachment: "",
  };

  // const pdfExport = (fileName) => {
  //   var element = document.getElementById("pdf-section");
  //   var opt = {
  //     margin: 1,
  //     filename: `${fileName}.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       scale: 5,
  //       dpi: 300,
  //       letterRendering: true,
  //       scrollX: 0,
  //       scrollY: 0,
  //     },
  //     jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "p" },
  //     compress: true
  //   };
  //   html2pdf()
  //     .set(opt)
  //     .from(element)
  //     .save();
  // };

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => (
                <button className="btn btn-primary">
                  {/* <img
                style={{ width: "25px", paddingRight: "5px" }}
                src={printIcon}
                alt="print-icon"
              /> */}
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
            {/* <ReactToPrint
              pageStyle='@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              trigger={() => (
                <button className="btn btn-primary ml-2">
                  PDF
                </button>
              )}
              content={() => printRef.current}
            /> */}
            <button
              className="btn btn-primary ml-2"
              type="button"
              onClick={(e) =>
                // pdfExport(
                //    `${purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}`
                // )
                downloadFile(
                  `/procurement/Report/GetShippingPurchaseOrderInformationByPOIdPDF?PurchaseOrderId=${poId}&OrderTypeId=${orId}`,
                  `${purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}`,
                  "pdf",
                  setLoading
                )
              }
            >
              PDF
            </button>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-primary ml-2"
              table="table-to-xlsx-row"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Export Excel"
            />
            <button
              type="button"
              onClick={() => setIsShowModal(true)}
              className="btn btn-primary back-btn ml-2"
            >
              Mail
            </button>
            {!isHiddenBackBtn && (
              <button
                type="button"
                onClick={() => history.goBack()}
                className="btn btn-secondary back-btn ml-2"
              >
                <i className="fa fa-arrow-left mr-1"></i>
                Back
              </button>
            )}
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              <FormikForm>
                <div id="pdf-section">
                  <div className="mx-5">
                    <div ref={printRef}>
                      <div className="d-flex justify-content-between align-items-center ship-report">
                        <div></div>

                        <div>
                          <div>
                            <img
                              style={{
                                // width: "100%",
                                height: "70px",
                                margin: "0 auto",
                                marginTop: "25px",
                              }}
                              src={akijShippingLogo}
                              alt={"Akij Shipping Logo"}
                            />
                          </div>
                          {/* <h6>{purchaseOrderReport?.objHeaderDTO?.billToAddress}</h6> */}
                          <h4 className=" text-center">
                            {+orId === 8 ? "Purchase Return" : "Purchase Order"}
                          </h4>
                        </div>
                        <div></div>
                      </div>

                      <table
                        className="global-table table mt-5 mb-5"
                        id="table-to-xlsx"
                      >
                        <thead className="tableHead"></thead>
                        <tbody className="tableHead">
                          <tr>
                            <td className="text-left">To:</td>
                            <td>
                              {purchaseOrderReport?.objHeaderDTO?.supplierName}
                            </td>
                            <td>Date:</td>
                            <td>
                              {_dateFormatter(
                                purchaseOrderReport?.objHeaderDTO
                                  ?.purchaseOrderDateTime
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Attn:</td>
                            <td>
                              {purchaseOrderReport?.objHeaderDTO?.supplierEmail}
                            </td>
                            <td>PO Ref:</td>
                            <td>
                              {
                                purchaseOrderReport?.objHeaderDTO
                                  ?.purchaseOrderNo
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Qtn Ref:</td>
                            <td>
                              {
                                purchaseOrderReport?.objHeaderDTO
                                  ?.supplierQuotationNo
                              }
                            </td>
                            <td>Vessel Ref:</td>
                            <td>
                              {
                                purchaseOrderReport?.objRowListDTO?.[0]
                                  ?.purchaseRequestCode
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Supply location:</td>
                            <td>
                              {
                                purchaseOrderReport?.objHeaderDTO
                                  ?.supplyLocationShip
                              }
                            </td>
                            <td>Vessel Name:</td>
                            <td>
                              {purchaseOrderReport?.objHeaderDTO?.plantName}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Lead time:</td>
                            <td>
                              {!purchaseOrderReport?.objHeaderDTO?.leadDay
                                ? ""
                                : purchaseOrderReport?.objHeaderDTO?.leadDay < 2
                                ? `${purchaseOrderReport?.objHeaderDTO?.leadDay} day`
                                : `${purchaseOrderReport?.objHeaderDTO?.leadDay} days`}
                            </td>
                            <td>Terms:</td>
                            <td>
                              {
                                purchaseOrderReport?.objHeaderDTO
                                  ?.originOfSparesShip
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Description:</td>
                            <td>
                              {
                                purchaseOrderReport?.objHeaderDTO
                                  ?.descriptionShip
                              }
                            </td>
                            <td>Prepared by:</td>
                            <td>
                              {purchaseOrderReport?.objHeaderDTO?.preparedBy}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <h3 className="pt-3 pb-1 text-center">
                        WE APPROVE SUPPLY OF BELOW ITEMS
                      </h3>
                      <table
                        className="global-table table py-5 report-container"
                        id="table-to-xlsx-row"
                      >
                        <thead className="tableHead">
                          <tr>
                            <th>No.</th>
                            <th>P/N</th>
                            <th>DESCRIPTION</th>
                            <th>REMARKS</th>
                            <th>QTY</th>
                            <th>UNIT</th>
                            <th>
                              {purchaseOrderReport?.objHeaderDTO?.currencyId ===
                              141
                                ? "UNIT BDT"
                                : "UNIT USD"}
                            </th>
                            <th>
                              {purchaseOrderReport?.objHeaderDTO?.currencyId ===
                              141
                                ? "TOTAL BDT"
                                : "TOTAL USD"}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="tableHead">
                          {purchaseOrderReport?.objRowListDTO?.map(
                            (data, i) => (
                              <>
                                {(i === 0 || data.shippingItemSubHead !== purchaseOrderReport?.objRowListDTO[i - 1].shippingItemSubHead) && data?.shippingItemSubHead ? (
                                  <tr style={{background:'#ADD8E6', paddingTop: '5px', paddingBottom: '5px' }}>
                                      <td colSpan={'8'}>
                                          <div style={{fontSize: '20'}} className="text-bold text-center">
                                              {data.shippingItemSubHead}
                                          </div>
                                      </td>
                                  </tr>
                                ) : null}
                                <tr key={i}>
                                  <td className="text-center">{i + 1}</td>
                                  <td>{data?.itemCode}</td>
                                  <td>{data?.itemName}</td>
                                  <td>{data?.purchaseDescription}</td>
                                  <td className="text-right">
                                    {data?.orderQty}
                                  </td>
                                  <td>{data?.uomName}</td>
                                  <td className="text-right">
                                    {data?.itemRate}
                                  </td>
                                  <td className="text-right">
                                    {data?.totalValue}
                                  </td>
                                </tr>
                              </>
                            )
                          )}
                          <tr>
                            <td
                              colSpan={7}
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              {"SUB TOTAL"}
                            </td>
                            <td
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              {(totalSum || 0).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={7}
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              {`Discount (${purchaseOrderReport?.objHeaderDTO
                                ?.discountPercentage || 0}%)`}
                            </td>
                            <td
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              {
                                purchaseOrderReport?.objHeaderDTO
                                  ?.numGrossDiscount
                              }
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={7}
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              Total After Discount
                            </td>
                            <td
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              {(
                                (totalSum || 0) -
                                  (purchaseOrderReport?.objHeaderDTO
                                    ?.numGrossDiscount || 0) || 0
                              ).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={7}
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              Transportation
                            </td>
                            <td
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              {purchaseOrderReport?.objHeaderDTO?.numFreight ||
                                0}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={7}
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              Other Cost
                            </td>
                            <td
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              {purchaseOrderReport?.objHeaderDTO?.othersCharge}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={7}
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              Grand Total
                            </td>
                            <td
                              className="text-right font-weight-bold "
                              style={{ fontSize: "12px" }}
                            >
                              {(
                                (totalSum || 0) -
                                (purchaseOrderReport?.objHeaderDTO
                                  ?.numGrossDiscount || 0) +
                                (purchaseOrderReport?.objHeaderDTO
                                  ?.numFreight || 0) +
                                (purchaseOrderReport?.objHeaderDTO
                                  ?.othersCharge || 0)
                              ).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-3 fixed">
                        <p>
                          Note: 1) All spares must be asbestos-free. <br />{" "}
                          <span className="pl-5 ml-5">
                            2) Packing and delivery charges will be added at
                            actual.
                          </span>
                        </p>

                        <div className="d-flex justify-content-center">
                          <img
                            style={{ width: "50%" }}
                            src={background}
                            alt={"company-stamp"}
                          />
                        </div>

                        <p
                          className="text-uppercase  text-center fixed-signature"
                          style={{
                            marginTop: "10px",
                            fontSize: "14px",
                          }}
                        >
                          THIS IS A SYSTEM GENERATED PURCHASE ORDER, HENCE NO
                          SIGNATURE IS REQUIRED
                        </p>
                      </div>

                      <div
                        className="text-uppercase font-weight-bold text-center d-flex footer"
                        style={{ marginTop: "50vh" }}
                      >
                        <div>
                          Corporate Office: Akij House, 198, Bir Uttam Mir
                          Shawkat Ali Road, Tejgaon I/A, Dhaka -1208, Phone:
                          +880 1671 595899, +880 9613311021, E-mail:
                          shipping@akij.net
                        </div>
                        <div className="px-2">
                          <hr
                            style={{
                              borderLeft: "2px solid black",
                              height: "30px",
                              left: " 50%",
                            }}
                          />
                        </div>
                        <div>
                          Chattogram Office: 3rd Floor, Shahjadi Chamber 1331/S
                          Sk. Mujib Road Agrabad, Chattogram, Phone: +880 1711
                          338613, E-mail: agency.asll@akij.net
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <IViewModal
                      title="Send Email"
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                    >
                      <ViewForm initData={initDataforEmail} />
                    </IViewModal>
                  </div>
                </div>

                <IViewModal
                  show={isReceivePoModal}
                  onHide={() => setIsReceivePoModal(false)}
                  title="Receive Purchase Order"
                >
                  <ReceivePoReportView
                    poId={purchaseOrderReport?.objHeaderDTO?.purchaseOrderId}
                    isHiddenBackBtn={true}
                    values={values}
                  />
                </IViewModal>
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
