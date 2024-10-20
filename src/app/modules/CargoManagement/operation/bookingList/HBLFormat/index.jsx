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
        <div className="text-center">
          <h1>HOUSE BILL OF LADING (HBL)</h1>
          <p>HBL Numbe: {bookingData?.hblnumber}</p>
          <p>
            Date: {moment(bookingData?.hbldate).format("DD-MM-YYYY hh:mm:ss")}
          </p>
        </div>
        <div class="section">
          <div class="shipper">
            <h3>Shipper</h3>
            <p>
              <span>Name: </span>
              {bookingData?.shipperName}
            </p>
            <p>
              <spn>Address: </spn>
              {bookingData?.shipperAddress}
            </p>
            <p>Phone: {bookingData?.shipperContact}</p>
            <p>Email: {bookingData?.shipperEmail}</p>
          </div>
          <div class="bill-info">
            <h3>Consignee Information:</h3>
            <p>
              <span>Name: </span>
              {bookingData?.consigneeName}
            </p>
            <p>
              <spn>Address: </spn>
              {bookingData?.consigneeAddress}
            </p>
            <p>Phone: {bookingData?.consigneeContact}</p>
            <p>Email: {bookingData?.consigneeEmail} </p>
          </div>
        </div>

        <div class="section">
          <div class="consignee">
            <h3>Freight Forwarder Details</h3>
            <p>
              <span>
                Name:
                {bookingData?.freightForwarderName}
              </span>
            </p>
            <p>
              <spn>Address: {bookingData?.freightForwarderAddress}</spn>
            </p>
            <p>Phone: {bookingData?.freightForwarderContact}</p>
            <p>Email: {bookingData?.freightForwarderEmail}</p>
          </div>
          <div class="notify-party">
            <h3>Notify Party</h3>
            <p>
              <span>Name: {bookingData?.notifyParty}</span>
            </p>
            <p>
              <spn>
                Address:
                {bookingData?.notifyPartyAddress}
              </spn>
            </p>
            <p>Phone: {bookingData?.notifyPartyContact}</p>
            <p>Email: {bookingData?.notifyPartyEmail}</p>
          </div>
        </div>
        <div class="section">
          <div class="place-receipt">
            <h3>Place of Receipt</h3>
            <p>{bookingData?.originAddress}</p>
          </div>
          <div class="port-loading">
            <h3>Port of Loading</h3>
            <p>{bookingData?.portOfLoading}</p>
          </div>
          <div class="vessel">
            <h3>Vessel/Voyage No.</h3>
            <p>{bookingData?.vesselName}</p>
          </div>
          <div class="port-discharge">
            <h3>Port of Discharge</h3>
            <p>{bookingData?.portOfDischarge}</p>
          </div>
        </div>
        <div>
          <div className="table-responsive">
            <table className="table table-striped global-table">
              <thead>
                <tr>
                  <th> Marks & Numbers Container & Seal Numbers</th>
                  <th>No.of Packages</th>
                  <th>
                    Description of Packages and Goods Particular Furnished to
                    Shipper
                  </th>
                  <th>Gross Weight Kilos</th>
                  <th>Measure ment cbm</th>
                </tr>
              </thead>
              <tbody>
                {bookingData?.rowsData?.map((row, index) => (
                  <tr key={index}>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div class="footer">
          <div>NIL MARKS</div>
          <div>
            <p>STC: </p>
            <p>FREIGHT PREPAID</p>
            <p>ALL DESTINATION CHARGES ARE CONSIGNEE'S ACCOUNT</p>
          </div>
        </div>
        <div className="section mt-3">
          <div>
            <h6>Declaration:</h6>
            <p className="note">
              The shipper hereby declares that the particulars provided are true
              and correct and that they have verified the contents, weights, and
              measurements of the cargo.
            </p>
          </div>
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

        <div className="section-buttom">
          <h6>Terms and Conditions:</h6>
          <br />
          <p className="note">
            1. This House Bill of Lading is subject to the terms and conditions
            of the carrier.
          </p>
          <p className="note">
            2. The carrier is not responsible for any discrepancies in the cargo
            description provided by the shipper.
          </p>
          <p className="note">
            3. The liability of the carrier is limited to the extent mentioned
            in the carriage contract.
          </p>
          <p className="note">
            4. This HBL is non-negotiable and serves only as a receipt of goods.
          </p>
          <div className="signature-line50"></div>
        </div>
      </div>
    </>
  );
};

export default HBLFormat;
