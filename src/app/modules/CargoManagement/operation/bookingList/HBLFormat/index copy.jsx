import React, { useEffect, useRef } from "react";
import { imarineBaseUrl } from "../../../../../App";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
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
          border: 1px solid black !important; // Add this 
       
        }
        @page {
          size: portrait !important;
          margin: 50px !important;
        }
      }
    `,
  });

  //   {
  //     "bookingRequestCode": "SINV0102024000011",
  //     "bookingRequestId": 31,
  //     "shipperId": 102185,
  //     "shipperName": "Hamim Group",
  //     "shipperAddress": "Dhaka3",
  //     "shipperContactPerson": "hm mahamud",
  //     "shipperContact": "01989597797",
  //     "shipperEmail": "hmikbalbd88@gmail.com",
  //     "consigneeId": 102186,
  //     "consigneeName": "Zinthin",
  //     "consigneeAddress": "Singapur",
  //     "consigneeContactPerson": "zinthin",
  //     "consigneeContact": "98959744765",
  //     "consigneeEmail": "zinthin@gmail.com",
  //     "ponumber": "201",
  //     "dateOfRequest": "2024-10-12T00:00:00",
  //     "freightAgentReference": "Freight Forwarder/Agent Reference",
  //     "modeOfTransport": null,
  //     "portOfLoadingId": 0,
  //     "portOfLoading": "Port of Loading (POL)",
  //     "portOfDischargeId": 0,
  //     "portOfDischarge": "Port of Discharge (POD)",
  //     "originAddress": "Origin Address",
  //     "countryOfOriginId": 1,
  //     "countryOfOrigin": "Afghanistan",
  //     "finalDestinationAddress": "Final Destination Address",
  //     "modeofStuffings": null,
  //     "modeOfDelivery": null,
  //     "incoterms": "exw",
  //     "requestPickupDate": "2024-10-12T00:00:00",
  //     "requestDeliveryDate": "2024-10-12T00:00:00",
  //     "isCustomsBrokerage": true,
  //     "isCargoInsurance": false,
  //     "isWarehouseService": false,
  //     "isDistributionDelivery": true,
  //     "freightCharge": "Prepaid",
  //     "additionalCharge": "",
  //     "paymentTermsId": 3,
  //     "paymentTerms": "CC/PP",
  //     "billingAddress": "Billing Address",
  //     "currencyId": 2,
  //     "currency": "DZD",
  //     "freightForwarderName": "",
  //     "invoiceValue": 10000.00,
  //     "notifyParty": "Notify Party",
  //     "notifyBank": null,
  //     "negotiationParty": "Negotiation Party",
  //     "primaryContactPerson": "100",
  //     "telephone": "",
  //     "contactEmail": "",
  //     "isPending": false,
  //     "isHandOver": false,
  //     "handOverDate": "2024-10-17T12:28:16.537",
  //     "isReceived": false,
  //     "receivedDate": "2024-10-17T12:28:16.537",
  //     "isPlaning": true,
  //     "planingDate": "2024-10-19T16:08:34.747",
  //     "isConfirm": true,
  //     "confirmDate": "2024-10-19T16:05:55.417",
  //     "confTransportMode": "Air to Sea",
  //     "isActive": true,
  //     "isPickup": true,
  //     "pickupDate": "2024-10-11T18:31:00",
  //     "blnumber": "1111",
  //     "isBl": true,
  //     "bldate": "2024-10-19T16:08:50.207",
  //     "hblnumber": "AHBL0102024000011",
  //     "isHbl": true,
  //     "hbldate": "2024-10-19T16:08:53.21",
  //     "fcrnumber": null,
  //     "isDispatch": true,
  //     "dispatchDate": "2024-10-11T18:28:00",
  //     "isCustomsClear": false,
  //     "customsClearDt": "2024-10-17T12:28:16.537",
  //     "createdAt": "2024-10-17T05:32:30.193",
  //     "createdBy": 549825,
  //     "departureDateTime": "2024-10-25T22:05:00",
  //     "arrivalDateTime": "2024-10-25T22:05:00",
  //     "flightNumber": "10",
  //     "transitInformation": "Direct Flight",
  //     "awbnumber": "100",
  //     "bookingAmount": 100.00,
  //     "countryOfOrginId": 1,
  //     "countryOfOrgin": "Afghanistan",
  //     "pickupPlace": "Pickup Place",
  //     "isCharges": false,
  //     "isInTransit": null,
  //     "inTransitDate": "2024-10-17T12:31:35.953",
  //     "isDestPortReceive": false,
  //     "destPortReceiveDt": "2024-10-17T12:31:35.953",
  //     "isBuyerReceive": false,
  //     "buyerReceiveDt": "2024-10-17T12:31:35.953",
  //     "modeOfStuffingSeaId": 0,
  //     "modeOfStuffingSeaName": "",
  //     "modeOfDeliveryId": 1,
  //     "modeOfDeliveryName": "Door to Door",
  //     "warehouseId": null,
  //     "warehouseName": null,
  //     "rowsData": [],
  //     "documents": [
  //         {
  //             "documentId": 10042,
  //             "bookingRequestId": 0,
  //             "documentTypeId": 6,
  //             "documentType": "Bill of Lading (BL)",
  //             "documentFileId": "638649509279032686_logo-top.png",
  //             "isActive": true,
  //             "createdAt": "2024-10-19T16:08:50.127",
  //             "createdBy": 521235,
  //             "documentsNumber": null
  //         }
  //     ],
  //     "billingData": [
  //         {
  //             "billingId": 29,
  //             "bookingRequestId": 31,
  //             "headOfChargeId": 1,
  //             "headOfCharges": "Air Fireght",
  //             "chargeAmount": 10.00,
  //             "isActive": true,
  //             "billingDate": "2024-10-19T16:09:03.967",
  //             "createdBy": 521235,
  //             "createdAt": null,
  //             "updatedBy": null,
  //             "updatedAt": null
  //         },
  //         {
  //             "billingId": 30,
  //             "bookingRequestId": 31,
  //             "headOfChargeId": 2,
  //             "headOfCharges": "Local Transportation",
  //             "chargeAmount": 10.00,
  //             "isActive": true,
  //             "billingDate": "2024-10-19T16:09:03.967",
  //             "createdBy": 521235,
  //             "createdAt": null,
  //             "updatedBy": null,
  //             "updatedAt": null
  //         }
  //     ],
  //     "transportPlanning": {
  //         "transportId": 10004,
  //         "bookingId": 31,
  //         "pickupLocation": "10",
  //         "pickupDate": "2024-10-17T00:00:00",
  //         "vehicleInfo": "10",
  //         "noOfPallets": 0,
  //         "carton": 0,
  //         "noOfContainer": 1,
  //         "airLineOrShippingLine": "1",
  //         "vesselName": "11",
  //         "departureDateTime": "2024-10-25T22:08:00",
  //         "arrivalDateTime": "2024-10-25T22:08:00",
  //         "transportMode": "Air to Sea",
  //         "isActive": true
  //     }
  // }
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

          <div className="section">
            <div>
              <h2>Shipper Information:</h2>
              <div className="input-line70"></div>

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
              <div className="input-line70"></div>

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
            <div
            >
              <h2>Notify Party:</h2>
              <div className="input-line70"></div>

              <span className="section-title">Name:</span>
              <span className="section-title">Address:</span>

              <span className="section-title">Phone:</span>

              <span className="section-title">Email:</span>
            </div>
          </div>

          <div className="section">
            <div
            >
              <h2>Freight Forwarder Details:</h2>
              <div className="input-line70"></div>

              <span className="section-title">Company Name:</span>

              <span className="section-title">Address:</span>

              <span className="section-title">Phone:</span>

              <span className="section-title">Email:</span>
            </div>
          </div>

          <div className="section">
            <div
              style={{
                width: "50%",
              }}
            >
              <h2>Carrier Details:</h2>
              <div className="input-line70"></div>

              <span className="section-title">Carrier Name:</span>
              <div className="solid-line"></div>

              <span className="section-title">Booking Number:</span>
              <div className="solid-line"></div>

              <span className="section-title">Voyage/Flight No:</span>
              <div className="solid-line"></div>
            </div>
          </div>

          <div className="section">
            <div
              style={{
                width: "50%",
              }}
            >
              <h2>Vessel/Flight Information:</h2>
              <div className="input-line70"></div>

              <span className="section-title">Vessel/Flight Name:</span>
              <div className="solid-line"></div>

              <span className="section-title">Departure Port:</span>
              <div className="solid-line"></div>

              <span className="section-title">Destination Port:</span>
              <div className="solid-line"></div>

              <span className="section-title">
                ETD (Estimated Time of Departure):
              </span>
              <div className="solid-line"></div>

              <span className="section-title">
                ETA (Estimated Time of Arrival):
              </span>
              <div className="solid-line"></div>
            </div>
          </div>

          <div className="section">
            <div
              style={{
                width: "50%",
              }}
            >
              <h2>Cargo Description:</h2>
              <div className="input-line70"></div>

              <span className="section-title">Description of Goods:</span>
              <div className="solid-line"></div>
              <span className="section-title">No. of Packages:</span>
              <div className="solid-line"></div>

              <span className="section-title">Package Type:</span>
              <div className="solid-line"></div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <span className="section-title">Total Weight:</span>
                  <div className="solid-line"></div>
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
                  <span className="section-title">Total Volume:</span>
                  <div className="solid-line"></div>
                </div>
                <span className="section-title">cbm</span>
              </div>

              <span className="section-title">Marks & Numbers:</span>
              <div className="solid-line"></div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <span className="section-title">Gross Weight:</span>
                  <div className="solid-line"></div>
                </div>
                <span className="section-title">kg</span>
              </div>
            </div>
          </div>

          <div className="section">
            <div
              style={{
                width: "50%",
              }}
            >
              <h2>Freight Terms:</h2>
              <div className="input-line70"></div>

              <span className="section-title">Freight Prepaid:</span>
              <div className="new-line"></div>

              <span className="section-title">Freight Payable at:</span>
              <div className="solid-line"></div>

              <span className="section-title">Place of Issue:</span>
              <div className="solid-line"></div>

              <span className="section-title">Date of Issue:</span>
              <div className="solid-line"></div>
            </div>
          </div>

          <div className="section">
            <div
              style={{
                width: "50%",
              }}
            >
              <h2>Special Instructions:</h2>
              <br />
              <div className="input-line"></div>
              <br />
              <div className="solid-line"></div>
              <br />
              <div className="solid-line"></div>
            </div>
          </div>

          <div className="section">
            <h2>Declaration:</h2>
            <p className="note">
              The shipper hereby declares that the particulars provided are true
              and correct and that they have verified the contents, weights, and
              measurements of the cargo.
            </p>
          </div>

          <div className="section">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <span className="section-title">Shipper Signature:</span>
                <div className="signature-line50"></div>
              </div>
              <div>
                <span className="section-title">Date:</span>
                <div className="signature-line50"></div>
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
                <div className="signature-line50"></div>
              </div>
              <div>
                <span className="section-title">Date:</span>
                <div className="signature-line50"></div>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Terms and Conditions:</h2>
            <br />
            <div className="signature-line50"></div>

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
            <div className="signature-line50"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HBLFormat;
