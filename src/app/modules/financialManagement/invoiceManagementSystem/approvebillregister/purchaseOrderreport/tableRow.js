/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import ReactToPrint from "react-to-print";
// import printIcon from "../../../../../helper/assets/images/print/print-icon.png";
import "./parchaseReport.css";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getReportPurchaseOrder } from "../../../../procurement/purchase-management/purchaseOrder/helper"
//import { convertNumberToWords } from "./../../../../../helper/_convertMoneyToWord";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
//import { amountToWords } from "../../../../_helper/_ConvertnumberToWord";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "./viewForm"
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png"
import ICustomCard from "../../../../_helper/_customCard";

let imageObj = {
  8: iMarineIcon
}

const initData = {};
const validationSchema = Yup.object().shape({});



export function TableRow({ poId, orId }) {
  const [purchaseOrderReport, setPurchaseOrderReport] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);


  useEffect(() => {
    getReportPurchaseOrder(
      poId, 
      orId,
      selectedBusinessUnit?.value,
      setPurchaseOrderReport
    );
  }, [poId]);

  let totalSum = purchaseOrderReport?.objRowListDTO?.reduce((acc, sum) => sum?.totalValue + acc, 0)

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
    attachment: ""
  }

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle='@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
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
            <ReactToPrint
              pageStyle='@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              trigger={() => (
                <button className="btn btn-primary ml-2">
                  PDF
                </button>
              )}
              content={() => printRef.current}
            />
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
            {/* <button
              type="button"
              onClick={() => history.goBack()}
              className="btn btn-secondary back-btn ml-2"
            >
              <i className="fa fa-arrow-left mr-1"></i>
        Back
      </button> */}
          </>
        )} >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {

          }}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              <FormikForm>
                <div className="">
                  <div className="mx-5">
                    <div ref={printRef}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {selectedBusinessUnit.value === 8 && <img style={{ width: "150px", height: "100px" }} class="" src={imageObj[selectedBusinessUnit?.value]} alt="img" />}

                          </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <h3 className="my-2">{purchaseOrderReport?.objHeaderDTO?.billToName}</h3>
                          <h6>
                            {purchaseOrderReport?.objHeaderDTO?.billToAddress}
                          </h6>
                          <h4>{+orId === 8 ? "Purchase Return" : "Purchase Order"}</h4>
                        </div>
                        <div></div>
                      </div>
                      <div className="my-2">
                        Purchase Order No: <span className="mr-2">{purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}</span>Order Date: {_dateFormatter(purchaseOrderReport?.objHeaderDTO?.purchaseOrderDateTime)}  Status: <span className="mr-2">{purchaseOrderReport?.objHeaderDTO?.isApproved ? "Approved" : "Pending"}</span>
                      </div>
                      <div className="parchaseReport">
                        <div className="reportInfo">
                          <div className="reportInfo1">
                            Supplier:
                        <p>{purchaseOrderReport?.objHeaderDTO?.supplierName}</p>
                            <p style={{ lineHeight: "8px" }}> Email: {purchaseOrderReport?.objHeaderDTO?.supplierEmail}</p>
                            <p style={{ lineHeight: "8px" }}>Attn: {purchaseOrderReport?.objHeaderDTO?.supplierName}</p>
                            <p style={{ lineHeight: "8px" }}>Phone: {purchaseOrderReport?.objHeaderDTO?.supplierContactNo}</p>
                            <p style={{ lineHeight: "17px" }}>Address: {purchaseOrderReport?.objHeaderDTO?.supplierAddress}</p>
                          </div>
                          <div className="reportInfo2">
                            <p>Ship To:</p>
                            <p style={{ lineHeight: "5px" }}>{purchaseOrderReport?.objHeaderDTO?.shipToName}</p>
                            <p style={{ lineHeight: "5px" }} className="mt-2">VAT Reg.No. {purchaseOrderReport?.objHeaderDTO?.vatRegNo} </p>
                            <p style={{ lineHeight: "5px" }}> PR No. {purchaseOrderReport?.objHeaderDTO?.prNo}</p>
                          </div>
                          <div className="reportInfo3">
                            <p>Bill To:</p>
                            <p style={{ lineHeight: "5px" }}>{purchaseOrderReport?.objHeaderDTO?.billToName}</p>
                            <div style={{ lineHeight: "17px" }}>{purchaseOrderReport?.objHeaderDTO?.billToAddress}</div>
                            {/* <p>{purchaseOrderReport?.objHeaderDTO?.prNo}</p> */}
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive">
                      <table className="global-table table mt-5 mb-5" id="table-to-xlsx">
                        <thead className="tableHead">
                          <tr>
                            <th>SL</th>
                            <th>ITEM</th>
                            <th>DESCRIPTION</th>
                            <th>UoM</th>
                            <th>QTY.</th>
                            <th>RATE</th>
                            <th>VAT</th>
                            <th>VAT AMOUNT</th>
                            <th>TOTAL</th>
                          </tr>
                        </thead>
                        <tbody className="tableHead">
                          {purchaseOrderReport?.objRowListDTO?.map((data, i) => (
                            <tr>
                              <td className="text-center">{i + 1}</td>
                              <td>{data?.itemName}</td>
                              <td>{data?.purchaseDescription}</td>
                              <td>{data?.uomName}</td>
                              <td>{data?.orderQty}</td>
                              <td className="text-right">{data?.itemRate}</td>
                              <td className="text-right">{data?.numVatPercentage || 0}</td>
                              <td className="text-right">{data?.numVatAmount || 0}</td>
                              <td className="text-right">{data?.totalValue}</td>
                            </tr>
                          ))}
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="font-weight-bold text-right">Total</td>
                            {/* <td className="font-weight-bold text-right">0</td>
                          <td className="font-weight-bold text-right">0</td> */}
                            <td className="font-weight-bold text-right">{totalSum}</td>
                          </tr>
                        </tbody>
                      </table>
                      </div>
                      <div className="row otherspoinfo mt-5">
                        <div className="col-lg-8">
                        <div className="table-responsive">
                          <table className="table custom-table">
                            <tr>
                              <td>
                                <span className="pl-2">Partial Shipment</span>
                                {/* <div className="pl-1">Payroll Group</div> */}
                              </td>
                              <td>{purchaseOrderReport?.objHeaderDTO?.partialShipment === "true" ? "Yes" : "No"}</td>
                              <td>
                                <span className="pl-2">Freight</span>
                                {/* <div className="pl-1">Calender Type</div> */}
                              </td>
                              <td style={{ width: "100px" }}>{purchaseOrderReport?.objHeaderDTO?.numFreight || 0}</td>
                            </tr>
                            <tr>
                              <td>
                                <span className="pl-2">No of Shipment</span>
                              </td>
                              <td>{purchaseOrderReport?.objHeaderDTO?.numberOfShipment}</td>
                              <td>
                                <span className="pl-2"> Others Charge</span>
                              </td>
                              <td>{0}</td>
                            </tr>
                            <tr>
                              <td>
                                <span className="pl-2"> Last Shipment Date</span>
                              </td>
                              <td>{_dateFormatter(purchaseOrderReport?.objHeaderDTO?.lastShipmentDate)}</td>
                              <td>
                                <span className="pl-2"> Gross Discount</span>
                              </td>
                              <td>{purchaseOrderReport?.objHeaderDTO?.numGrossDiscount || 0}</td>
                            </tr>
                            <tr>
                              <td>
                                <span className="pl-2"> Payment terms</span>
                              </td>
                              <td>{purchaseOrderReport?.objHeaderDTO?.paymentTerms}</td>
                              <td>
                                <span className="pl-2"> Commission</span>
                              </td>
                              <td>{purchaseOrderReport?.objHeaderDTO?.numCommission || 0}</td>
                            </tr>
                            <tr>
                              <td>
                                <span className="pl-2"> Payment days after MRR</span>
                              </td>
                              <td>{purchaseOrderReport?.objHeaderDTO?.paymentDaysAfterDelivery}</td>
                              <td>
                                <span className="pl-2"> Grand Total</span>
                              </td>
                              <td>{(totalSum + purchaseOrderReport?.objHeaderDTO?.numFreight + purchaseOrderReport?.objHeaderDTO?.numCommission) - purchaseOrderReport?.objHeaderDTO?.numGrossDiscount}</td>
                            </tr>
                            <tr>
                              <td>
                                <span className="pl-2"> No of Installment</span>
                              </td>
                              <td>{0}</td>

                            </tr>
                            <tr>
                              <td>
                                <span className="pl-2"> Installment Interval (Days)</span>
                              </td>
                              <td>{0}</td>
                            </tr>
                            {/* <tr>
                            <td>
                              <span className="pl-2"> Warrenty after delivery (months)</span>
                            </td>
                            <td>{0}</td>
                          </tr> */}
                          </table>
                          </div>
                        </div>
                      </div>
                      {/* <div className="mt-2">
                      <span className="font-weight-bold">In Word : {amountToWords(totalSum ? totalSum : 0)}</span>
                      </div> */}
                      <div className="mt-3">
                        <p>Prepared By: {purchaseOrderReport?.objHeaderDTO?.preparedBy || "NA"}</p>
                        <p>Approved By: {purchaseOrderReport?.objHeaderDTO?.approvedBy || "NA"}</p>
                      </div>

                      {+orId === 8 ? null : +orId === 2 ? null : <table className="global-table table mt-5 mb-5">
                        <thead className="tableHead">
                          <tr>
                            <th>SL</th>
                            <th>User Name</th>
                            <th>Group Name</th>
                            <th>Any User</th>
                            <th>Sequence ID</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody className="tableHead">
                          {purchaseOrderReport?.objEmpListDTO?.map((data, i) => (
                            <tr>
                              <td className="text-center">{i + 1}</td>
                              <td>{data?.userNameDesignationName}</td>
                              <td>{data?.groupName}</td>
                              <td className="text-center">{data?.anyUser}</td>
                              <td className="text-center">{data?.sequenceId}</td>
                              <td>{data?.isApprove ? "Approved" : "Pending" }</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>}
                    </div>
                  </div>
                  <div>
                    <IViewModal
                      title="Send Email"
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                    >
                      <ViewForm
                        initData={initDataforEmail}
                      />
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
