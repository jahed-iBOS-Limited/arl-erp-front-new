/* eslint-disable no-useless-concat */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form as FormikForm, Formik } from "formik";
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
import { APIUrl } from "../../../../../App";
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png";
import ICustomCard from "../../../../_helper/_customCard";
import IViewModal from "../../../../_helper/_viewModal";
import { ReceivePoReportView } from "./recievePoReportView";
import "./shippingReport.css";
import ViewForm from "./viewForm";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
const html2pdf = require("html2pdf.js");

let imageObj = {
  8: iMarineIcon,
};

const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, do not change existing props name and existing code which is related to this props,
export function ShippingViewReport2({ poId, orId, isHiddenBackBtn }) {
  const [purchaseOrderReport, setPurchaseOrderReport] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [isReceivePoModal, setIsReceivePoModal] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

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

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 1,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 5,
        dpi: 300,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "p" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };

  let grandTotal =
    totalSum +
    purchaseOrderReport?.objHeaderDTO?.numFreight +
    purchaseOrderReport?.objHeaderDTO?.numCommission +
    purchaseOrderReport?.objHeaderDTO?.othersCharge -
    purchaseOrderReport?.objHeaderDTO?.numGrossDiscount;

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
              onClick={(e) =>
                pdfExport(
                  `${purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}`
                )
              }
            >
              PDF
            </button>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-primary ml-2"
              table="table-to-xlsx"
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
                        <div className="d-flex justify-content-center align-items-center">
                          {selectedBusinessUnit?.value !== 8 ? (
                            <img
                              style={{
                                width: "100px",
                                height: "80px",
                              }}
                              src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                              alt="logo"
                            />
                          ) : (
                            <img
                              style={{ width: "150px", height: "100px" }}
                              class=""
                              src={imageObj[selectedBusinessUnit?.value]}
                              alt="img"
                            />
                          )}
                        </div>

                        <div className="d-flex flex-column justify-content-center align-items-center header-title">
                          <h3 className="my-2 text-center">
                            {/* {purchaseOrderReport?.objHeaderDTO?.billToName} */}{" "}
                            AKIJ SHIPPING LINE LTD
                          </h3>
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
                            <td>{purchaseOrderReport?.objHeaderDTO?.supplierName}</td>
                            <td>Date:</td>
                            <td>{_dateFormatter(purchaseOrderReport?.objHeaderDTO?.purchaseOrderDateTime)}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Attn:</td>
                            <td>{purchaseOrderReport?.objHeaderDTO?.supplierEmail}</td>
                            <td>PO Ref:</td>
                            <td>{purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Your Ref:</td>
                            <td>{purchaseOrderReport?.objHeaderDTO?.supplierReference}</td>
                            <td>Vessel Ref:</td>
                            <td>{purchaseOrderReport?.objRowListDTO?.[0]?.purchaseRequestCode}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Supply location:</td>
                            <td>{purchaseOrderReport?.objHeaderDTO?.supplierAddress}</td>
                            <td>Vessel Name:</td>
                            <td>{purchaseOrderReport?.objHeaderDTO?.plantName}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Lead time:</td>
                            <td>{purchaseOrderReport?.objHeaderDTO?.leadDays}</td>
                            <td>Origin of spares:</td>
                            <td>{""}</td>
                          </tr>
                        </tbody>
                      </table>
                      <h3 className="pt-3 pb-1 text-center">
                        WE APPROVE SUPPLY OF BELOW HALF YEARLY ENGINE STORE FOR {purchaseOrderReport?.objHeaderDTO?.plantName}
                      </h3>
                      <table
                        className="global-table table py-5 report-container"
                        id="table-to-xlsx"
                      >
                        <thead className="tableHead">
                          <tr>
                            <th>NO</th>
                            <th>IMPA</th>
                            <th>DESCRIPTION</th>
                            <th>QTY</th>
                            <th>UNIT</th>
                            <th>UNIT USD</th>
                            <th>TOTAL USD</th>
                          </tr>
                        </thead>
                        <tbody className="tableHead">
                          {purchaseOrderReport?.objRowListDTO?.map(
                            (data, i) => (
                              <>
                                <tr>
                                  <td className="text-center">{i + 1}</td>
                                  <td>{data?.itemCode}</td>
                                  <td>{data?.itemName}</td>
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
                              className="font-weight-bold text-right"
                              colspan="6"
                            >
                              Total USD
                            </td>

                            <td className="font-weight-bold text-right">
                              {totalSum}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-3">
                        {/* <p>
                          Note: 1) All spares must be asbestos-free. <br />{" "}
                          <span className="pl-5 ml-5">
                            2) Custom, delivery and packing charges will be
                            added at actual depending upon delivery destination.
                          </span>
                        </p> */}

                        <h3
                          className="text-uppercase font-weight-bold text-center"
                          style={{ marginTop: "350px" }}
                        >
                          THIS IS A SYSTEM GENERATED PURCHASE ORDER, HENCE NO
                          SIGNATURE IS REQUIRED
                        </h3>
                      </div>

                      <div
                        className="text-uppercase font-weight-bold text-center d-flex footer"
                        style={{ marginTop: "50vh" }}
                      >
                        <div>
                          Chattogram Office: 3rd Floor, Shahjadi Chamber 1331/S
                          Sk. Mujib Road Agrabad, Chattogram, Phone: +880 1711
                          338613, E-mail: agency.asll@akij.net
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
