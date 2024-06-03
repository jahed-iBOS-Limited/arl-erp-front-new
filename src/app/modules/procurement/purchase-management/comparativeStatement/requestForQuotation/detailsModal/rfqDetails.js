
import { Form as FormikForm, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import ICustomCard from "../../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IViewModal from "../../../../../_helper/_viewModal";
import ViewForm from "./emailForm";
import akijShippingLogo from "./images/akijShippingText.png";
const html2pdf = require("html2pdf.js");



const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, do not change existing props name and existing code which is related to this props,
export function RFQViewDetails({ currentItem, isHiddenBackBtn }) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [rfqDetailsData, getRfqDetailsData] = useAxiosGet(); 

  const intRequestForQuotationId = currentItem?.intRequestForQuotationId

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    //getSingleData(intRequestForQuotationId, setRfqDetails, setRowDto, setRowDtoTwo, setLoading);
    getRfqDetailsData(`/procurement/ShipRequestForQuotation/GetRequestForQuotationShipById?RequestForQuotationId=${intRequestForQuotationId}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intRequestForQuotationId, profileData, selectedBusinessUnit]);


  const printRef = useRef();
  const history = useHistory();

  //const emailReceiverList = rfqDetailsData[0]?.objSuplier?.map((itm) => (itm?.strEmail))

  const initDataforEmail = {
    toMail: [],
    toCC: "",
    toBCC: rfqDetailsData[0]?.objSuplier?.map((itm) => (itm?.strEmail)),
    subject: `Request for Quotation No: ${rfqDetailsData[0]?.objHeader?.strRequestForQuotationCode}`,
    message: `Dear Sir, Please find the request for quotation: ${rfqDetailsData[0]?.objHeader?.strRequestForQuotationCode}
    To enter the quotation, please go to the link,  https://erp.ibos.io/mngProcurement/comparative-statement/shipping-quotation-entry`, // changes dynamic to static for wahed vai instruction
    attachment: "",
  };

//   Dear Sir,

// Please find the request for quotation:  

// To enter the quotation, please go to the link

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
                  `${rfqDetailsData[0]?.objHeader?.strRequestForQuotationCode}`
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
                          {/* <h6>{rfqDetailsData[0]?.objHeader?.billToAddress}</h6> */}
                          <h4 className=" text-center">
                            {"Request For Quotation"}
                          </h4>
                        </div>
                        <div></div>
                      </div>

                      <table
                        className="global-table table mt-5 mb-5"
                        // id="table-to-xlsx"
                      >
                        <thead className="tableHead"></thead>
                        <tbody className="tableHead">
                          <tr>
                            <td className="text-left">RFQ Code:</td>
                            <td>
                              {rfqDetailsData[0]?.objHeader?.strRequestForQuotationCode}
                            </td>
                            <td>RFQ Date:</td>
                            <td>
                              {_dateFormatter(
                               rfqDetailsData[0]?.objHeader?.dteRfqdate
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Currency:</td>
                            <td>
                              {rfqDetailsData[0]?.objHeader?.strCurrencyCode}
                            </td>
                            {/* <td>Payment Terms:</td>
                            <td>
                              {
                                rfqDetailsData[0]?.objHeader?.strPaymentTermsName
                              }
                            </td> */}
                          </tr>
                          {/* <tr>
                            <td className="text-left">VAT/AIT:</td>
                            <td>
                              {
                                rfqDetailsData[0]?.objHeader?.strVatAti
                              }
                            </td>
                            <td>Transport Cost:</td>
                            <td>
                              {
                                rfqDetailsData[0]?.objHeader?.strTransportCost
                              }
                            </td>
                          </tr> */}
                          <tr>
                            <td className="text-left">Quotation Start Date:</td>
                            <td>
                              {
                                _dateFormatter(rfqDetailsData[0]?.objHeader?.quotationStartDateTime)
                              }
                            </td>
                            <td>Quotation End Date:</td>
                            <td>
                              {_dateFormatter(rfqDetailsData[0]?.objHeader?.quotationEndDateTime)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table
                        className="global-table table py-5 report-container"
                        id="table-to-xlsx"
                      >
                        <thead className="tableHead">
                          <tr>
                            <th>SL.</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            {rfqDetailsData[0]?.objRow[0]?.intItemCategoryId === 624 ? 
                            <>
                              <th>Part No</th>
                              <th>Drawing No</th>
                            </> : null}
                            <th>Ref Remarks</th>
                            <th>UOM</th>
                            <th>RFQ QTY</th>
                          </tr>
                        </thead>
                        <tbody className="tableHead">
                          {rfqDetailsData[0]?.objRow?.map(
                            (data, i) => (
                              <>
                              {(i === 0 || data.strShippingItemSubHead !== rfqDetailsData[0]?.objRow[i - 1].strShippingItemSubHead) && data?.strShippingItemSubHead ? (
                                 <tr style={{background:'#ADD8E6', paddingTop: '5px', paddingBottom: '5px' }}>
                                     <td colSpan={rfqDetailsData[0]?.objRow[0]?.intItemCategoryId === 624 ? '8' : '6'}>
                                         <div style={{fontSize: '20'}} className="text-bold text-center">
                                             {data.strShippingItemSubHead}
                                         </div>
                                     </td>
                                 </tr>
                              ) : null}
                                <tr key={i}>
                                  <td className="text-center">{i + 1}</td>
                                  <td>{data?.strItemCode}</td>
                                  <td>{data?.strItemName}</td>
                                  {data?.intItemCategoryId === 624 ? 
                                  <>
                                    <td>{data?.strPartNo}</td>
                                    <td>{data?.strDrawingNo}</td>
                                  </> : null}
                                  <td>{data?.strDescription}</td>
                                  <td className="">
                                    {data?.strUoMname}
                                  </td>
                                  <td className="">
                                    {data?.numRfqquantity}
                                  </td>
                                </tr>
                              </>
                            )
                          )}
                        </tbody>
                      </table>
                      <div className="mt-3">
                        <h6>Supplier for Send RFQ/RFI/RFP</h6>
                      </div>
                      <table
                        className="global-table table py-5 report-container"
                        id="table-to-xlsx"
                      >
                        <thead className="tableHead">
                          <tr>
                            <th>SL.</th>
                            <th>Supplier Name</th>
                            <th>Supplier Address</th>
                            <th>Contact No</th>
                            <th>Email</th>
                          </tr>
                        </thead>
                        <tbody className="tableHead">
                          {rfqDetailsData[0]?.objSuplier?.map(
                            (data, i) => (
                              <>
                                <tr key={i}>
                                  <td className="text-center">{i + 1}</td>
                                  <td>{data?.strBusinessPartnerName}</td>
                                  <td>{data?.strBusinessPartnerAddress}</td>
                                  <td className="">
                                    {data?.strContactNumber}
                                  </td>
                                  <td>{data?.strEmail}</td>
                                </tr>
                              </>
                            )
                          )}
                        </tbody>
                      </table>
                      <div className="mt-3">
                        <small >{rfqDetailsData[0]?.objHeader?.strCreatedBy ? `Created By: [${rfqDetailsData[0]?.objHeader?.strCreatedBy || "--"}][${rfqDetailsData[0]?.objHeader?.strDesignation || "--"}]` : ""}</small>
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
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
