import { Form, Formik } from "formik";
import QRCode from "qrcode.react";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import ISpinner from "../../../../_helper/_spinner";
import printIcon from "../../../../_helper/images/print-icon.png";
import { getChallanData } from "../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
const initData = {};

export default function ChallanPrintModal({
  show,
  onHide,
  isShow,
  deliveryId,
  setChallanPrintModalShow,
}) {
  const [challanData, setChallanData] = useState({});

  useEffect(() => {
    if (deliveryId) {
      getChallanData(deliveryId, setChallanData, setChallanPrintModalShow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryId]);

  const printRef = useRef();

  return (
    <div className="clear_sales_invoice_View_Form">
      <div className="viewModal">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={() => {}}
        >
          {() => (
            <>
              <Modal
                show={show}
                onHide={onHide}
                size="xl"
                aria-labelledby="example-modal-sizes-title-xl"
                className="clear_sales_invoice_View_Form"
              >
                {true && <ModalProgressBar variant="query" />}
                {isShow ? (
                  <ISpinner isShow={isShow} />
                ) : (
                  <>
                    <Form className="form form-label-right">
                      <Modal.Header className="bg-custom">
                        <Modal.Title className="w-100">
                          <div className="d-flex justify-content-between px-4 py-2">
                            <div className="title">
                              {"Partner Challan Print Preview"}
                            </div>
                            <div className="d-flex">
                              <div>
                                <ReactToPrint
                                  documentTitle="Bongo_Traders_Ltd"
                                  pageStyle={
                                    "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}"
                                  }
                                  trigger={() => (
                                    <button
                                      type="button"
                                      className="btn btn-primary px-4 py-1"
                                    >
                                      <img
                                        style={{
                                          width: "25px",
                                          paddingRight: "5px",
                                        }}
                                        src={printIcon}
                                        alt="print-icon"
                                      />
                                      Print
                                    </button>
                                  )}
                                  content={() => printRef.current}
                                />
                              </div>
                            </div>
                          </div>
                        </Modal.Title>
                      </Modal.Header>

                      <Modal.Body id="example-modal-sizes-title-xl">
                        <>
                          <div
                            ref={printRef}
                            style={{
                              marginLeft: "30px",
                              marginRight: "30px",
                              marginTop: "50px",
                            }}
                          >
                            <div className="mt-2">
                              <div ref={printRef}>
                                <div className="m-3 adjustment-journalReport bongoTradersLtdPrintWrapper">
                                  <div className="d-flex flex-column justify-content-center align-items-center mt-2 position-relative">
                                    <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                                      <span
                                        style={{
                                          fontWeight: 600,
                                          fontSize: "25px",
                                        }}
                                      >
                                        {challanData?.supplierName}
                                      </span>
                                      <span style={{ fontSize: "14px" }}>
                                        {challanData?.supplierAddress}
                                      </span>
                                      <span>
                                        Sales center:{" "}
                                        {challanData?.salesCenterName}
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: "0",
                                        right: "14px",
                                        fontSize: "14px",
                                        textAlign: "center",
                                      }}
                                    >
                                      <div>
                                        {" "}
                                        <QRCode
                                          data-qr={"Challan Code"}
                                          value={`${challanData?.secondaryDeliveryCode}`}
                                          size={50}
                                        />
                                      </div>
                                      <b>
                                        {challanData?.secondaryDeliveryCode}
                                      </b>
                                    </div>
                                  </div>
                                  <div className="my-3">
                                    <hr className="challan-underline" />
                                    <div
                                      className="row"
                                      style={{ fontSize: "14px" }}
                                    >
                                      <div
                                        className="col-md-12"
                                        style={{ textAlign: "center" }}
                                      >
                                        <sapn className=" ml-1">
                                          {
                                            "1st Copy: The Deputy Commissioner acknowledge the mentioned receipt of Fertilizer after arrival in the district to send Seller within 7 days by specific Dealer."
                                            // "১ম কপিঃ জেলা প্রশাসকের জন্য যা রশিদে উল্লেখিত সম্পূর্ণ সার জেলায় আগমনের পর জেলা প্রশাসক প্রাপ্তি স্বীকার করে ৭ (সাত) দিনের মধ্যে ঊক্ত ডিলারের মাধ্যমে বিক্রেতার নিকট প্রেরণ করবেন"
                                          }
                                        </sapn>
                                      </div>
                                    </div>
                                    <div className="row mt-3">
                                      <div
                                        className="col-md-12"
                                        style={{ textAlign: "left" }}
                                      >
                                        <sapn
                                          style={{
                                            fontWeight: 900,
                                            fontSize: "15px",
                                          }}
                                        >
                                          {
                                            "The sales receipt by importer under by subsidized by the Govt. for DAP/TSP/MOP fertilizer"
                                            // "ভর্তুকি প্রদত্ত টিএসপি, ডিএপি ও এমওপি সারের আমদানিকারক কর্তৃক বিক্রয়ের রশিদ"
                                          }
                                        </sapn>
                                      </div>
                                    </div>
                                    <hr className="challan-underline" />
                                    <div
                                      className="row"
                                      style={{ fontSize: "15px" }}
                                    >
                                      <div className="col-md-7 mt-2">
                                        <sapn className=" ml-1">
                                          {" Customer Name: "}{" "}
                                          {challanData?.soldToPartnerName}
                                        </sapn>
                                      </div>
                                      <div className="col-md-5 mt-2">
                                        <sapn className=" ml-1">
                                          {" Issue Date: "}{" "}
                                          {_dateFormatter(
                                            challanData?.deliveryDate
                                          )}
                                        </sapn>
                                      </div>
                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {" Customer Registration No:: "}{" "}
                                          {challanData?.partnerCode}
                                        </sapn>
                                      </div>
                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {" Customer Full Address: "}{" "}
                                          {challanData?.businessPartnerAddress}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-7 mt-2"
                                        style={{ width: "70%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {" Upozilla Name: "}
                                          {challanData?.upzilaName}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-5 mt-2"
                                        style={{ width: "30%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {"District Name: "}
                                          {challanData?.zilaName}
                                        </sapn>
                                      </div>
                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {" Fertilizer Name: "}
                                          {challanData?.itemName}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-7 mt-2"
                                        style={{ width: "70%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {"Country of Origin: "}{" "}
                                          {challanData?.fromCountryName}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-5 mt-2"
                                        style={{ width: "30%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {"Fertilizer Color: "}
                                          {challanData?.color}
                                        </sapn>
                                      </div>

                                      <div
                                        className="col-md-7 mt-2"
                                        style={{ width: "70%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {" Quantity(Metric Ton): "}{" "}
                                          {challanData?.numQuantity}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-5 mt-2"
                                        style={{ width: "30%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {"Bag: "}{" "}
                                          {challanData?.numQuantity * 20}
                                        </sapn>
                                      </div>
                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {" Fertilizer Rate(Per Ton Taka): "}{" "}
                                          {challanData?.itemRate}
                                        </sapn>
                                      </div>
                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {" Total Price(Taka): "}{" "}
                                          {challanData?.numTotalPrice}
                                        </sapn>
                                      </div>

                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {" Importer Name: "}{" "}
                                          {challanData?.supplierName}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-7 mt-2"
                                        style={{ width: "70%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {" Importer Registration No: "}{" "}
                                          {challanData?.supplierCode}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-5 mt-2"
                                        style={{ width: "30%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {"Date: "}{" "}
                                          {_dateFormatter(
                                            challanData?.supplierDate
                                          )}
                                        </sapn>
                                      </div>

                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {" Address: "}{" "}
                                          {challanData?.supplierAddress}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-7 mt-2"
                                        style={{ width: "70%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {" L/C No & Bank Name: "}{" "}
                                          {challanData?.lcnumber}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-5 mt-2"
                                        style={{ width: "30%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {"Date: "}{" "}
                                          {_dateFormatter(
                                            challanData?.dteLcdate
                                          )}
                                        </sapn>
                                      </div>

                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {" Vessel Name: "}{" "}
                                          {challanData?.shipName}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-7 mt-2"
                                        style={{ width: "70%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {
                                            " Memo No of Ministry of Agriculture: "
                                          }{" "}
                                          {challanData?.permissionNumber}
                                        </sapn>
                                      </div>
                                      <div
                                        className="col-md-5 mt-2"
                                        style={{ width: "30%" }}
                                      >
                                        <sapn className=" ml-1">
                                          {"Date: "}{" "}
                                          {_dateFormatter(
                                            challanData?.dtePermissionDate
                                          )}
                                        </sapn>
                                      </div>
                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {
                                            " Value Determiner & Specific Value of Audit Committee(Taka): "
                                          }{" "}
                                          {challanData?.govtRate}
                                        </sapn>
                                      </div>
                                      <div className="col-md-12 mt-2">
                                        <sapn className=" ml-1">
                                          {" Warehouse Name: "}{" "}
                                          {challanData?.shippointName}
                                        </sapn>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="row d-flex justify-content-between mt-30 "
                                    style={{ fontSize: "14px" }}
                                  >
                                    <div className=" d-flex flex-column ml-15">
                                      <div className="text-center">
                                        <span style={{ display: "block" }}>
                                          .............................................................
                                        </span>
                                        <span>{"Dealer Signature"}</span>

                                        <span
                                          style={{
                                            display: "block",
                                            marginTop: "10px",
                                          }}
                                        >
                                          Date:.................................................
                                        </span>
                                      </div>
                                      <br />
                                      <div className="text-center">
                                        <span style={{ display: "block" }}>
                                          .............................................................
                                        </span>
                                        <span>(TNO)</span>
                                      </div>
                                    </div>

                                    <div className=" d-flex flex-column mr-15">
                                      <div className="text-center">
                                        <span style={{ display: "block" }}>
                                          ...................................................................................
                                        </span>
                                        <span className="mb-1">
                                          {"Importer Signature & Seal"}
                                        </span>

                                        <span
                                          style={{
                                            display: "block",
                                            marginTop: "10px",
                                          }}
                                        >
                                          Date:........................................................................
                                        </span>
                                      </div>
                                      <br />
                                      <div className="text-center">
                                        <span style={{ display: "block" }}>
                                          ..................................................................................
                                        </span>
                                        <span>
                                          Deputy Commissioner/ Secretary <br />{" "}
                                          District Fertilizer & Seed Monitoring
                                          Committee
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      </Modal.Body>
                      <Modal.Footer>
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              onHide();
                            }}
                            className="btn btn-light btn-elevate"
                          >
                            Cancel
                          </button>
                          <> </>
                        </div>
                      </Modal.Footer>
                    </Form>
                  </>
                )}
              </Modal>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}
