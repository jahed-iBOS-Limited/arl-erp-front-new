import React, { useEffect, useRef } from "react";
import { imarineBaseUrl } from "../../../../../App";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import NewHBLFormatAir from "./newHBLFormat";
import "./style.css";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
const HBLFormat = ({ rowClickData }) => {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const bookingData = shipBookingRequestGetById || {};

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Customs-RTGS",
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
       
        }
        @page {
          size: portrait !important;
          margin: 15px !important;
        }
      }
    `,
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={handlePrint}
          type="button"
          className="btn btn-primary px-3 py-2"
        >
          <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
          Print
        </button>
      </div>
      {shipBookingRequestLoading && <Loading />}
      <NewHBLFormatAir componentRef={componentRef} bookingData={bookingData}/>
      {/* <HBLFormatInvoice componentRef={componentRef} bookingData={bookingData} /> */}
    </>
  );
};

export default HBLFormat;

export const HBLFormatInvoice = ({ componentRef, bookingData }) => {
  return (
    <>
      <div className="hbl-container" ref={componentRef}>
        <div className="container">
          <div
            className=""
            style={{
              textAlign: "center",
            }}
          >
            <div>
              <h1 className="text-center">HOUSE BILL OF LADING (HBL)</h1>
              <div>
                <span className="section-title">
                  HBL Number: {bookingData?.hblnumber}
                </span>
              </div>
              <div>
                <span className="section-title">
                  Date:{" "}
                  {bookingData?.hbldate &&
                    moment(bookingData?.hbldate).format("YYYY-MM-DD")}
                </span>
              </div>
            </div>
          </div>

          <div className="section-content">
            <div className="section">
              <div>
                <h2>Shipper Information:</h2>
                <div className="input-line"></div>

                <span className="section-title">
                  Name: {bookingData?.shipperName}
                </span>

                <span className="section-title">
                  Address: {bookingData?.shipperAddress}
                </span>

                <span className="section-title">
                  Phone: {bookingData?.shipperContact}
                </span>

                <span className="section-title">
                  Email: {bookingData?.shipperEmail}
                </span>
              </div>
            </div>

            <div className="section">
              <div>
                <h2>Consignee Information:</h2>
                <div className="input-line"></div>

                <span className="section-title">
                  Name: {bookingData?.consigneeName}
                </span>

                <span className="section-title">
                  Address: {bookingData?.consigneeAddress}
                </span>

                <span className="section-title">
                  Phone: {bookingData?.consigneeContact}
                </span>

                <span className="section-title">
                  Email: {bookingData?.consigneeEmail}
                </span>
              </div>
            </div>

            <div className="section">
              <div>
                <h2>Notify Party:</h2>
                <div className="input-line"></div>

                <span className="section-title">
                  Name: {bookingData?.notifyParty}
                </span>
                <span className="section-title">
                  Address: {bookingData?.notifyPartyAddress}
                </span>

                <span className="section-title">
                  Phone: {bookingData?.notifyPartyContact}
                </span>

                <span className="section-title">
                  Email: {bookingData?.notifyPartyEmail}
                </span>
                <span className="section-title">
                  Negotiation Party: {bookingData?.negotiationParty}
                </span>
              </div>
            </div>

            <div className="section">
              <div>
                <h2>Freight Forwarder Details:</h2>
                <div className="input-line"></div>

                <span className="section-title">
                  Company Name: {bookingData?.freightForwarderName}
                </span>

                <span className="section-title">
                  Address: {bookingData?.freightForwarderAddress}
                </span>

                <span className="section-title">
                  Phone: {bookingData?.freightForwarderContact}
                </span>

                <span className="section-title">
                  Email: {bookingData?.freightForwarderEmail}
                </span>
              </div>
            </div>

            <div className="section">
              <div
                style={{
                  width: "50%",
                }}
              >
                <h2>Carrier Details:</h2>
                <div className="input-line"></div>

                <span className="section-title">
                  Carrier Name:{" "}
                  {bookingData?.transportPlanning?.airLineOrShippingLine}
                </span>

                <span className="section-title">
                  Booking Number: {bookingData?.bookingRequestCode}
                </span>

                <span className="section-title">
                  Voyage/Flight No: {bookingData?.flightNumber}
                </span>
              </div>
            </div>

            <div className="section">
              <div>
                <h2>Vessel/Flight Information:</h2>
                <div className="input-line"></div>

                <span className="section-title">
                  Vessel/Flight Name:{" "}
                  {bookingData?.transportPlanning?.vesselName}
                </span>

                <span className="section-title">
                  Departure Port: {bookingData?.portOfLoading}
                </span>

                <span className="section-title">
                  Destination Port: {bookingData?.portOfDischarge}
                </span>

                <span className="section-title">
                  ETD (Estimated Time of Departure):{" "}
                  {bookingData?.departureDateTime &&
                    moment(bookingData?.departureDateTime).format(
                      "YYYY-MM-DD HH:mm"
                    )}
                </span>

                <span className="section-title">
                  ETA (Estimated Time of Arrival):{" "}
                  {bookingData?.arrivalDateTime &&
                    moment(bookingData?.arrivalDateTime).format(
                      "YYYY-MM-DD HH:mm"
                    )}
                </span>
              </div>
            </div>
            <div className="section">
              <div>
                <h2>Cargo Description:</h2>
                <div className="input-line"></div>

                <span className="section-title">
                  Description of Goods: {bookingData?.descriptionOfGoods}
                </span>
                <span className="section-title">
                  No. of Packages: {bookingData?.noOfPackages}
                </span>
                <span className="section-title">
                  Package Type:{bookingData?.packageType}
                </span>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <span className="section-title">
                      Total Weight: {bookingData?.totalWeight}
                    </span>
                  </div>
                  <span className="section-title">kg</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <span className="section-title">
                      Total Volume: {bookingData?.totalVolume}
                    </span>
                  </div>
                  <span className="section-title">cbm</span>
                </div>

                <span className="section-title">
                  Marks & Numbers: {bookingData?.marksAndNumbers}
                </span>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <span className="section-title">
                      Gross Weight: {bookingData?.grossWeight}
                    </span>
                  </div>
                  <span className="section-title">kg</span>
                </div>
              </div>
            </div>

            <div className="section">
              <div>
                <h2>Freight Terms:</h2>
                <div className="input-line"></div>

                <span className="section-title">
                  Freight Prepaid:{" "}
                  {bookingData?.freightCharge === "Prepaid" ? "Yes" : "No"}
                </span>
                <div className="new-line"></div>

                <span className="section-title">
                  Freight Payable at:{" "}
                  {bookingData?.freightCharge === "Collect" ? "Yes" : "No"}
                </span>

                <span className="section-title">
                  Place of Issue: {bookingData?.portOfLoading}
                </span>

                <span className="section-title">
                  Date of Issue:{" "}
                  {bookingData?.hbldate &&
                    moment(bookingData?.hbldate).format("YYYY-MM-DD")}
                </span>
              </div>
            </div>
          </div>
          <div className="section-full">
            <div>
              <h2>Special Instructions:</h2>
              <br />
              <div className="input-line"></div>
              <br />
              <div className="input-line"></div>
              <br />
              <div className="input-line"></div>
            </div>
          </div>
          <div className="section-full mt-2">
            <h2>Declaration:</h2>
            <p className="note">
              The shipper hereby declares that the particulars provided are true
              and correct and that they have verified the contents, weights, and
              measurements of the cargo.
            </p>
          </div>

          <div className="section-full">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <span className="section-title">Shipper Signature:</span>
                <div className="signature-line"></div>
              </div>
              <div>
                <span className="section-title">Date:</span>
                <div className="signature-line"></div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <span className="section-title">
                  Freight Forwarder Signature:
                </span>
                <div className="signature-line"></div>
              </div>
              <div>
                <span className="section-title">Date:</span>
                <div className="signature-line"></div>
              </div>
            </div>
          </div>

          <div className="section-full">
            <h2>Terms and Conditions:</h2>
            <div className="signature-line"></div>

            <p className="note">
              1. This House Bill of Lading is subject to the terms and
              conditions of the carrier.
            </p>
            <p className="note">
              2. The carrier is not responsible for any discrepancies in the
              cargo description provided by the shipper.
            </p>
            <p className="note">
              3. The liability of the carrier is limited to the extent mentioned
              in the carriage contract.
            </p>
            <p className="note">
              4. This HBL is non-negotiable and serves only as a receipt of
              goods.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
