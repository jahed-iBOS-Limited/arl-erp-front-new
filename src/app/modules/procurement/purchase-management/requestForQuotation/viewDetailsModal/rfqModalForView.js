import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import {
  _dateFormatter,
  _dateTimeFormatter,
} from "../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import "./rfqModalForView.css";
import { eProcurementBaseURL } from "../../../../../App";
const initData = {};
export default function RfqModalForView({
  rfqId,
  rfqCode,
  rfqStatus,
  rfqCreatedBy,
}) {
  const saveHandler = (values, cb) => {};
  const [rfqData, getRfqData, rfqDataLoader] = useAxiosGet();
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const printRef = useRef();
  // /RequestForQuotation/GetRequestForQuotationDetails?requestForQuotationId=${requestForQuotationId}
  useEffect(() => {
    if (rfqId) {
      getRfqData(
        `${eProcurementBaseURL}/RequestForQuotation/GetRequestForQuotationDetails?requestForQuotationId=${rfqId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfqId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
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
          {false && <Loading />}
          <IForm
            rfqCode={rfqCode}
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <>
                <div className="d-flex justify-content-end align-items-end">
                  <ReactToPrint
                    pageStyle={`@media print{body { -webkit-print-color-adjust: exact;}}`}
                    trigger={() => (
                      <button
                        className="btn btn-primary btn-sm d-flex align-items-center "
                        style={{ height: "30px" }}
                      >
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                    onBeforePrint={() => {}}
                  />
                </div>
                {rfqDataLoader && <Loading />}
                <div ref={printRef} style={{ margin: "0 60px" }}>
                  <>
                    <div className="d-flex flex-column justify-content-center align-items-center my-3">
                      <h1>{selectedBusinessUnit?.label}</h1>
                      <h3>
                        Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon,
                        Dhaka-1208.
                      </h3>
                      <br />
                      <h3>Request for Quotation</h3>
                    </div>
                    <div
                      className="rfqDetails"
                      style={{
                        border: "3px solid #ddd",
                        padding: "5px",
                      }}
                    >
                      <div className="rfq-grid-container">
                        <div>
                          <span className="font-weight-bold"> RFQ Code:</span>{" "}
                          {rfqCode}
                        </div>
                        <div>
                          <span className="font-weight-bold">RFQ Type:</span>{" "}
                          {rfqData?.requestTypeName}
                        </div>
                        <div>
                          <span className="font-weight-bold">RFQ Date:</span>{" "}
                          {_dateTimeFormatter(rfqData?.deliveryDate)}
                        </div>
                      </div>
                      <div className="rfq-grid-container">
                        <div>
                          <span className="font-weight-bold"> RFQ Title:</span>{" "}
                          {rfqData?.rfqTitle}
                        </div>
                        <div>
                          <span className="font-weight-bold">
                            Start Date & Time:
                          </span>{" "}
                          {_dateTimeFormatter(rfqData?.quotationEntryStart)}
                        </div>
                        <div>
                          <span className="font-weight-bold">
                            End Date & Time:
                          </span>{" "}
                          {_dateTimeFormatter(rfqData?.validTillDate)}
                        </div>
                      </div>
                      <div className="rfq-grid-container">
                        <div>
                          <span className="font-weight-bold">
                            {" "}
                            Purchase Org:
                          </span>{" "}
                          {rfqData?.purchaseOrganizationName}
                        </div>
                        <div>
                          <span className="font-weight-bold">Plant:</span>{" "}
                          {rfqData?.plantName}
                        </div>
                        <div>
                          <span className="font-weight-bold">Warehouse:</span>{" "}
                          {rfqData?.warehouseName}
                        </div>
                      </div>
                      {rfqData?.purchaseOrganizationId === 11 && (
                        <div className="rfq-grid-container">
                          <div>
                            <span className="font-weight-bold">VAT/AIT:</span>{" "}
                            {rfqData?.isVatAitInclude
                              ? "Including"
                              : "Excluding"}
                          </div>
                          <div>
                            <span className="font-weight-bold">
                              Transport Cost:
                            </span>{" "}
                            {rfqData?.isTransportCostInclude
                              ? "Including"
                              : "Excluding"}
                          </div>
                          <div>
                            <span className="font-weight-bold">TDS:</span>{" "}
                            {rfqData?.isTdsInclude ? "Including" : "Excluding"}
                          </div>
                        </div>
                      )}

                      <div className="rfq-grid-container">
                        {rfqData?.purchaseOrganizationId === 11 && (
                          <div>
                            <span className="font-weight-bold">VDS:</span>{" "}
                            {rfqData?.isVdsInclude ? "Including" : "Excluding"}
                          </div>
                        )}
                        <div>
                          <span className="font-weight-bold">
                            Delivery Date:
                          </span>{" "}
                          {_dateFormatter(rfqData?.deliveryDate)}
                        </div>
                        <div>
                          <span className="font-weight-bold">
                            Payment Terms:
                          </span>{" "}
                          {rfqData?.paymentTerms}
                        </div>
                      </div>
                      <div className="rfq-grid-container">
                        <div>
                          <span className="font-weight-bold">Status:</span>
                          <span
                            style={{
                              color:
                                rfqStatus === "Live"
                                  ? "#3699FF"
                                  : rfqStatus === "Closed"
                                  ? "#F64E60"
                                  : rfqStatus === "Pending"
                                  ? "#FFA800"
                                  : rfqStatus === "Waiting"
                                  ? "#8950FC"
                                  : "",
                              fontWeight: "bold",
                              marginLeft: "1px",
                            }}
                          >
                            {rfqStatus}
                          </span>
                        </div>
                        <div>
                          <span className="font-weight-bold">Currency:</span>{" "}
                          {rfqData?.currencyCode}
                        </div>
                        <div>
                          <span className="font-weight-bold">
                            Delivery Address:
                          </span>{" "}
                          {rfqData?.deliveryAddress}
                        </div>
                      </div>
                      <div className="rfq-grid-container">
                        <div>
                          <span className="font-weight-bold">
                            Bidding Rank :
                          </span>{" "}
                          {rfqData?.isRankVisible ? "Show" : "Hidden"}
                        </div>
                      </div>
                    </div>
                    <div className="item-details">
                      <h3 className="mt-2">Item List</h3>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered table-font-size-sm rfq-table">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>Sl</th>
                              {/* {rfqData?.referenceTypeName ===
                                "with reference" && (
                                <th style={{ width: "100px" }}>Reference No</th>
                              )} */}
                              <th>Item Name</th>
                              <th style={{ width: "80px" }}>Uom</th>
                              <th>Description</th>
                              {rfqData?.referenceTypeName ===
                                "with reference" && (
                                <th style={{ width: "100px" }}>PR Quantity</th>
                              )}
                              <th style={{ width: "100px" }}>Quantity</th>
                              <th style={{ width: "100px" }}>
                                Supplier Bid Count
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rfqData?.rowList?.length > 0 &&
                              rfqData?.rowList?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  {/* {rfqData?.referenceTypeName ===
                                    "with reference" && (
                                    <td className="text-center">
                                      {item?.referenceCode}
                                    </td>
                                  )} */}
                                  <td>{item?.itemName}</td>
                                  <td>{item?.uoMname}</td>
                                  <td>{item?.description}</td>
                                  {rfqData?.referenceTypeName ===
                                    "with reference" && (
                                    <td className="text-center">
                                      {item?.referenceQuantity}
                                    </td>
                                  )}
                                  <td className="text-center">
                                    {item?.rfqquantity || ""}
                                  </td>
                                  <td className="text-center">
                                    {rfqData?.totalBidder || ""}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="rfq-supplier-details">
                      <h3 className="mt-2">Supplier List</h3>
                      <div className="mt-2">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered table-font-size-sm rfq-table">
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>Sl</th>
                                <th>Supplier Name</th>
                                <th>Supplier Address</th>
                                <th style={{ width: "120px" }}>Contact No</th>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rfqData?.partnerList?.length > 0 &&
                                rfqData?.partnerList?.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.businessPartnerName}</td>
                                    <td>{item?.businessPartnerAddress}</td>
                                    <td>{item?.contactNumber}</td>
                                    <td>{item?.email}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="termsAndConditions">
                      <h3 className="mt-2">Terms & Conditions</h3>
                      <p>{rfqData?.termsAndConditions}</p>
                    </div>
                    <div className="footer-section">
                      <div className="row">
                        <div className="col-lg-6">
                          <b>Created By: {rfqCreatedBy}</b>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end">
                          <b>
                            Print Date-Time: {_dateTimeFormatter(new Date())}
                          </b>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
