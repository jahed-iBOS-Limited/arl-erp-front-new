import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import './newHBLFormat.css';
import moment from 'moment';
//============bookingData data=================
// {
//   "bookingRequestCode": "SINV0112024000014",
//   "bookingRequestId": 9,
//   "shipperId": 0,
//   "shipperName": "tamal",
//   "shipperAddress": "ibos, bangladesh",
//   "shipperContactPerson": "tamal",
//   "shipperContact": "88001329731854",
//   "shipperEmail": "tamal@ibos.io",
//   "shipperCountryId": 18,
//   "shipperCountry": "Bangladesh",
//   "shipperStateId": 0,
//   "shipperState": "dhaka",
//   "shipperCity": "dhaka",
//   "shipperPostalCode": "1000",
//   "shipperBankId": 47,
//   "shipperBank": "UNITED COMMERCIAL BANK LTD",
//   "buyerBank": "Woori Bank",
//   "consigneeId": 102186,
//   "consigneeName": "Zinthin",
//   "consigneeAddress": "Singapur",
//   "consigneeContactPerson": "zinthin",
//   "consigneeContact": "98959744765",
//   "consigneeEmail": "miraj&sons@gmail.com",
//   "consigCountryId": 127,
//   "consigCountry": "Malaysia",
//   "consigStateId": 0,
//   "consigState": "Kualalampur",
//   "consignCity": "Kualalampur",
//   "consignPostalCode": "1000",
//   "expOrCnfNumber": "EXP012364",
//   "expOrCnfDate": "2024-11-01T00:00:00",
//   "freightAgentReference": "Alice Josnson",
//   "modeOfTransport": "Sea",
//   "portOfLoadingId": 0,
//   "portOfLoading": "Mongla",
//   "portOfDischargeId": 0,
//   "portOfDischarge": "Klang",
//   "originAddress": "",
//   "countryOfOriginId": 18,
//   "countryOfOrigin": "Bangladesh",
//   "finalDestinationAddress": "Menara DBKL 1, Jalan Raja Laut 50350 Kuala Lumpur Malaysia",
//   "fdestCountryId": 127,
//   "fdestCountry": "Malaysia",
//   "fdestStateId": 0,
//   "fdestState": "Kualalampur",
//   "fdestCity": "Kualalampur",
//   "fdestPostalCode": "50050",
//   "concernSalesPersonId": 564893,
//   "concernSalesPerson": "Petty Cash (ALL) [ALL-Janata]",
//   "primaryContactPersonId": 564893,
//   "primaryContactPerson": "Petty Cash (ALL) [ALL-Janata]",
//   "modeofStuffings": null,
//   "modeOfDelivery": null,
//   "incoterms": "fob",
//   "typeOfLoadingId": 0,
//   "typeOfLoading": "",
//   "typeOfLoadingQty": 1.00,
//   "requestPickupDate": "2024-11-30T00:00:00",
//   "requestDeliveryDate": "2024-12-20T00:00:00",
//   "isCustomsBrokerage": false,
//   "isCargoInsurance": false,
//   "isWarehouseService": false,
//   "isStoreRent": false,
//   "isHaulagePickupService": false,
//   "isDestiontionHaulage": false,
//   "isLocalTransportation": true,
//   "freightForwarderTermsId": 1,
//   "freightForwarderTerms": "PP/CC",
//   "billingAddress": "",
//   "billCountryId": 0,
//   "billCountry": "",
//   "billStateId": 0,
//   "billState": "",
//   "currencyId": 0,
//   "currency": "",
//   "invoiceValue": 123456.00,
//   "packingListReference": "",
//   "buyerName": "",
//   "buyerEmail": "",
//   "buyerAddress": "",
//   "notifyPartyId": null,
//   "notifyParty": "Global Logistics Ltd.",
//   "notifyBank": "",
//   "negotiationParty": "Singapur",
//   "isPending": false,
//   "isHandOver": false,
//   "handOverDate": "2024-11-28T10:29:25.037",
//   "isReceived": true,
//   "receivedDate": "2024-11-28T00:00:00",
//   "isPlaning": true,
//   "planingDate": "2024-11-28T11:45:47.017",
//   "isConfirm": true,
//   "confirmDate": "2024-11-28T10:28:31.863",
//   "confTransportMode": "Sea to Sea",
//   "isActive": true,
//   "isStuffing": true,
//   "stuffingDate": "2024-11-29T16:29:00",
//   "blnumber": null,
//   "isBl": false,
//   "bldate": "2024-11-28T10:29:25.037",
//   "hblnumber": "ALL-S000003",
//   "isHbl": true,
//   "hbldate": "2024-11-28T11:55:19.743",
//   "fcrnumber": null,
//   "isDispatch": false,
//   "dispatchDate": "2024-11-28T10:29:25.037",
//   "isCustomsClear": false,
//   "customsClearDt": "2024-11-28T10:29:25.037",
//   "createdAt": "2024-11-28T10:09:49.837",
//   "createdBy": 0,
//   "departureDateTime": "2024-12-01T21:00:00",
//   "arrivalDateTime": "2024-12-19T09:00:00",
//   "flightNumber": "123456",
//   "transitInformation": "",
//   "awbnumber": "",
//   "bookingAmount": 0.00,
//   "countryOfOrginId": 18,
//   "countryOfOrgin": "Bangladesh",
//   "pickupPlace": "Tongi",
//   "isCharges": false,
//   "isInTransit": null,
//   "inTransitDate": "2024-11-28T10:29:25.037",
//   "isDestPortReceive": false,
//   "destPortReceiveDt": "2024-11-28T10:29:25.037",
//   "isBuyerReceive": false,
//   "buyerReceiveDt": "2024-11-28T10:29:25.037",
//   "modeOfStuffingSeaId": 3,
//   "modeOfStuffingSeaName": "CFS/CY",
//   "modeOfDeliveryId": 4,
//   "modeOfDeliveryName": "Port to Port",
//   "warehouseId": 10648,
//   "warehouseName": "ALL Factory",
//   "invoiceNumber": null,
//   "invoiceDate": null,
//   "objPurchase": [
//       {
//           "purchaseInfoId": 3,
//           "bookingId": 9,
//           "ponumber": null,
//           "podate": null,
//           "lcnumber": "LC1235456",
//           "lcdate": "2024-11-20T00:00:00",
//           "isActive": true,
//           "createdAt": "2024-11-28T10:09:50.627",
//           "createdBy": 8
//       }
//   ],
//   "rowsData": [
//       {
//           "bookingRequestRowId": 16,
//           "bookingRequestHeaderId": 9,
//           "typeOfCargoId": 1,
//           "typeOfCargo": "General Cargo ",
//           "descriptionOfGoods": "Mens ware",
//           "hsCode": "00000-RMG",
//           "totalNumberOfPackages": 30.00,
//           "recvQuantity": 30.00,
//           "totalGrossWeightKG": 150.00,
//           "totalNetWeightKG": 150.00,
//           "totalPerUnitNetWeightKG": 150.00,
//           "totalPerUnitGrossWeightKG": 150.00,
//           "totalVolumeCBM": 30.0,
//           "totalDimsLength": 25.00,
//           "totalDimsWidth": 18.00,
//           "totalDimsHeight": 30.00,
//           "isTemperatureControl": false,
//           "temperatureRange": "",
//           "isSHInstruction": false,
//           "shInstructionText": "",
//           "isActive": true,
//           "createdAt": "2024-11-28T10:12:30.037",
//           "createdBy": 0,
//           "dimensionRow": [
//               {
//                   "dimensionRowId": 13,
//                   "bookingRequestRowId": 16,
//                   "dimsHeight": 30.00,
//                   "dimsWidth": 18.00,
//                   "dimsLength": 25.00,
//                   "perUnitCbm": 30.0,
//                   "numberOfPackage": 30.00,
//                   "perUnitGrossWeight": 150.00,
//                   "perUnitNetWeight": 150.00,
//                   "measurementType": "cm",
//                   "poNumber": "PO123456",
//                   "style": "Modern",
//                   "color": "Blue",
//                   "isActive": true,
//                   "createdAt": "2024-11-28T10:09:49.84",
//                   "createdBy": 8
//               }
//           ]
//       }
//   ],
//   "documents": [
//       {
//           "documentId": 11,
//           "bookingRequestId": 0,
//           "documentTypeId": 3,
//           "documentType": "Commercial Invoice",
//           "documentFileId": "638683851217574345_upload.png",
//           "isActive": true,
//           "createdAt": "2024-11-28T10:12:31.143",
//           "createdBy": 0,
//           "documentsNumber": null
//       },
//       {
//           "documentId": 12,
//           "bookingRequestId": 0,
//           "documentTypeId": 4,
//           "documentType": "Packing List",
//           "documentFileId": "638683851344024627_Screenshot 2024-09-05 104203.png",
//           "isActive": true,
//           "createdAt": "2024-11-28T10:12:31.147",
//           "createdBy": 0,
//           "documentsNumber": null
//       },
//       {
//           "documentId": 13,
//           "bookingRequestId": 0,
//           "documentTypeId": 8,
//           "documentType": "BIN Certificate",
//           "documentFileId": "638683851438574117_sazzad.jpg",
//           "isActive": true,
//           "createdAt": "2024-11-28T10:12:31.147",
//           "createdBy": 0,
//           "documentsNumber": null
//       },
//       {
//           "documentId": 14,
//           "bookingRequestId": 0,
//           "documentTypeId": 7,
//           "documentType": "CNF Certificate",
//           "documentFileId": "638683851528666960_514672.pdf",
//           "isActive": true,
//           "createdAt": "2024-11-28T10:12:31.147",
//           "createdBy": 0,
//           "documentsNumber": null
//       }
//   ],
//   "billingData": [],
//   "transportPlanning": [
//       {
//           "transportId": 9,
//           "bookingId": 9,
//           "pickupLocation": "Tongi",
//           "pickupDate": "2024-11-26T00:00:00",
//           "vehicleInfo": "rgthyjuk",
//           "noOfPallets": 0,
//           "carton": 0,
//           "noOfContainer": 1,
//           "airLineOrShippingLine": "Jahed Shipping Line",
//           "iatanumber": "0",
//           "vesselName": "Jahed & Sons",
//           "departureDateTime": null,
//           "arrivalDateTime": "2024-11-28T17:43:00",
//           "transportMode": "Air to Sea",
//           "berthDate": "2024-11-21T17:43:00",
//           "cutOffDate": "2024-11-27T17:44:00",
//           "estimatedTimeOfDepart": "2024-12-01T00:00:00",
//           "isActive": true,
//           "containerDesc": [
//               {
//                   "containerDescId": 7,
//                   "transportId": 9,
//                   "containerNumber": "CON12345",
//                   "sealNumber": "5566122",
//                   "size": "20'",
//                   "quantity": 30.0,
//                   "cbm": 30.00,
//                   "mode": "",
//                   "kgs": 150.00,
//                   "poNumber": "",
//                   "style": "",
//                   "color": "",
//                   "isActive": true,
//                   "createdBy": null,
//                   "createdAt": "2024-11-28T11:45:47.05"
//               }
//           ]
//       }
//   ]
// }
// }
function NewHBLFormatAir({ componentRef, bookingData }) {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );

  return (
    <div className="main-container-mgs-air" ref={componentRef}>
      <div className="container">
        <div className="box1">
          {/*--- Section: BOX 1 LEFT BOX ---*/}
          <div className="box1_left-box">
            <div className="box1_left-box_content-1 medium-font line-height word-spacing">
              <span
                className="small-font word-spacing"
                style={{ marginRight: 10 }}
              >
                Shippers Name and Address
              </span>
              TO THE ORDER OF: <br />
              {bookingData?.shipperName} <br />
              {bookingData?.shipperAddress}, {bookingData?.shipperState},{' '}
              {bookingData?.shipperCountry}
            </div>
            <div className="box1_left-box_content-2 medium-font line-height word-spacing">
              <span
                className="small-font word-spacing"
                style={{ marginRight: 10 }}
              >
                Consignee's Name and Address
              </span>
              TO THE ORDER OF: <br />
              {bookingData?.consigneeName} <br />
              {bookingData?.consigneeAddress}, {bookingData?.consigState},{' '}
              {bookingData?.consigCountry}
            </div>
            <div className="box1_left-box_content-3 medium-font line-height word-spacing">
              <span className="small-font word-spacing">Also notify</span>
              <p>
                {bookingData?.notifyParty}
                <br />
                {bookingData?.notifyPartyAddress}
              </p>
            </div>
            <div className="box1_left-box_content-4 small-font">
              Airport of Departure and Requested Routing
              <p className="medium-font" style={{ paddingTop: 3 }}>
                {bookingData?.transportPlanning
                  ?.map((item) => item?.pickupLocation)
                  .join(' - ')}
              </p>
            </div>
            <div className="box1_left-box_content-5 small-font">
              <div style={{ width: '50%', borderRight: '1px solid black' }}>
                Airport of Destination
                <p className="medium-font" style={{ paddingTop: 5 }}>
                  {bookingData?.transportPlanning
                    ?.map((item) => item?.airLineOrShippingLine)
                    .join(' - ')}
                </p>
              </div>
              <div style={{ width: '25%', borderRight: '1px solid black' }}>
                Flight/Date
                <br />
                <p className="medium-font" style={{ paddingTop: 12 }}>
                  {bookingData?.transportPlanning
                    ?.map((item) => {
                      return item?.departureDateTime
                        ? moment(item?.departureDateTime).format('DD.MM.YYYY')
                        : '';
                    })
                    .join(' - ')}
                </p>
              </div>
              <div style={{ width: '25%' }}>
                Flight/Date
                <br />
                <p className="medium-font" style={{ paddingTop: 12 }}>
                  {bookingData?.transportPlanning
                    ?.map((item) => {
                      return item?.arrivalDateTime
                        ? moment(item?.arrivalDateTime).format('DD.MM.YYYY')
                        : '';
                    })
                    .join(' - ')}
                </p>
              </div>
            </div>
          </div>
          {/*--- Section: BOX 1 RIGHT BOX ---*/}
          <div className="box1_right-box">
            <div className="box1_right-box_content-1">
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 0,
                }}
              >
                <span className="small-font">Not negotiable</span>
                <span className="large-font">
                  <b>{bookingData?.hblnumber}</b>
                </span>
              </p>
              <p className="medium-font">
                <b>Air Waybill</b>
              </p>
              <p className="small-font">(Air Consignment Note)</p>
              <p className="small-font">Issued by</p>
              <p
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 25,
                  wordSpacing: 7,
                  padding: '5px 0',
                }}
              >
                {selectedBusinessUnit?.label}
              </p>
              <p
                style={{
                  textAlign: 'center',
                  padding: '0 20px',
                  wordSpacing: '-1px',
                  fontSize: 10,
                }}
              >
                {selectedBusinessUnit?.address}
              </p>
            </div>
            <div className="box1_right-box_content-2 small-font word-spacing">
              Copies 1,2 and 3 of this Air Waybill are originals and have the
              same validity
            </div>
            <div className="box1_right-box_content-3">
              It is agreed that the goods described herein are accepted in
              apparent good order and condition (except as noted) for carriage
              SUBJECT TO THE CONDITIONS OF CONTRACT ON THE REVERSE HEREOF THE
              SHIPPER'S ATTENTION IS DRAWN TO THE NOTICE CONCERNING CARRIERS
              LIMITATION OF LIABILITY. shipper may increase such limitation of
              liability by declaring a higher value for carriage and paying
              supplement charge if required.
            </div>
            <div className="box1_right-box_content-4 small-font word-spacing">
              Accounting Information
              <p
                style={{ display: 'flex', justifyContent: 'center' }}
                className="large-font"
              >
                {bookingData?.paymentTerms?.startsWith('PP')
                  ? 'PREPAID'
                  : 'FREIGHT COLLECT'}
              </p>
            </div>
            <div className="box1_right-box_content-5 small-font word-spacing">
              <div style={{ width: '50%', borderRight: '1px solid black' }}>
                Master Airwaybill No.
                <p>
                  <b>{bookingData?.flightNumber} </b>
                </p>
              </div>
              <div style={{ width: '50%' }}>I.A.T.A Code</div>
            </div>
            <div className="box1_right-box_content-6 small-font word-spacing">
              <div style={{ width: '50%', borderRight: '1px solid black' }}>
                Time &amp; Date Broker Notified
              </div>
              <div style={{ width: '50%' }}>
                Time &amp; Date Cargo Collected
              </div>
            </div>
            <div className="box1_right-box_content-7">
              <div
                className="small-font"
                style={{ width: '20%', borderRight: '1px solid black' }}
              >
                Currency
                <p className="medium-font" style={{ paddingTop: 5 }}>
                  {bookingData?.currency}
                </p>
              </div>
              <div
                className="small-font"
                style={{
                  width: '29.2%',
                  borderRight: '1px solid black',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', height: '50%' }}>
                  <div
                    style={{
                      width: '50%',
                      borderRight: '1px solid black',
                      borderBottom: '1px solid black',
                    }}
                  >
                    WT/VAL
                  </div>
                  <div
                    style={{ width: '50%', borderBottom: '1px solid black' }}
                  >
                    Other
                  </div>
                </div>
                <div style={{ display: 'flex', height: '50%' }}>
                  <div style={{ width: '50%', borderRight: '1px solid black' }}>
                    PPD
                  </div>
                  <div style={{ width: '52%', borderRight: '1px solid black' }}>
                    COLL
                  </div>
                  <div style={{ width: '50%', borderRight: '1px solid black' }}>
                    PPD
                  </div>
                  <div style={{ width: '50%' }}>COLL</div>
                </div>
              </div>
              <div
                className="small-font"
                style={{ width: '40%', borderRight: '1px solid black' }}
              >
                Declared Value for Carriage
                <p className="medium-font" style={{ paddingTop: 5 }}>
                  NVD
                </p>
              </div>
              <div />
            </div>
            <div className="box1_right-box_content-8 small-font">
              <div style={{ width: '30%', borderRight: '1px solid black' }}>
                Amount of Insurance
              </div>
              <div style={{ width: '70%' }}>
                INSURANCE-if Carrier offers insurance and such insurance is
                requested in accordance with condition on reverse hereof,
                indicate amount to be insured in figures in box marked amount of
                insurance.
              </div>
            </div>
          </div>
        </div>
        {/*--- Section: BOX 2 ---*/}
        <div className="box2 small-font">Handling Information</div>
        {/*--- Section: BOX 3 ---*/}
        <div className="box3">
          <div className="box3_heading small-font">
            <div style={{ width: '5%', borderRight: '1px solid black' }}>
              No Pieces RCP
            </div>
            <div style={{ width: '10%', borderRight: '1px solid black' }}>
              Gross Weight
            </div>
            <div style={{ width: '10%', borderRight: '1px solid black' }}>
              Kg lb
            </div>
            <div style={{ width: '10%', borderRight: '1px solid black' }}>
              Chargeable Weight
            </div>
            <div style={{ width: '6%', borderRight: '1px solid black' }}>
              Rate <br />
              <br />
            </div>
            <div
              style={{
                width: '10%',
                borderRight: '1px solid black',
                textAlign: 'center',
              }}
            >
              Total
            </div>
            <div>
              Nature and Quantity of Goods <br />
              (incl, Dimensions or volume)
            </div>
          </div>
          <div className="box3_content">
            <div style={{ width: '5%', borderRight: '1px solid black' }}>
              <p style={{ textAlign: 'center' }}>
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + (+item?.totalNumberOfPackages || 0),
                  0,
                )}
              </p>
              <p className="medium-font">
                <u>
                  <b>SHIPPING MARKS</b>
                </u>
              </p>
              <p className="small-font"></p>
            </div>
            <div style={{ width: '10%', borderRight: '1px solid black' }}>
              <p style={{ textAlign: 'center' }}>
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + (+item?.grossWeightKG || 0),
                  0,
                )}
              </p>
            </div>
            <div style={{ width: '10%', borderRight: '1px solid black' }}>
              <p
                className="medium-font"
                style={{ paddingTop: 20, textAlign: 'center' }}
              >
                <u>
                  <b>DIMENSION</b>
                </u>
              </p>
              <p className="small-font">
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + (+item?.totalDimsHeight || 0),
                  0,
                )}{' '}
                x{' '}
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + (+item?.totalDimsWidth || 0),
                  0,
                )}{' '}
                x{' '}
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + (+item?.totalDimsLength || 0),
                  0,
                )}
                <br />
                Total CBM :{' '}
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + (+item?.totalVolumeCBM || 0),
                  0,
                )}
              </p>
            </div>
            <div style={{ width: '10%', borderRight: '1px solid black' }}>
              <p style={{ textAlign: 'center' }}>3337</p>
            </div>
            <div style={{ width: '6%', borderRight: '1px solid black' }} />
            <div style={{ width: '10%', borderRight: '1px solid black' }} />
            <div style={{ width: '45%' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <p className="small-font">Said to Contain</p>
                <p className="medium-font" style={{ letterSpacing: 'normal' }}>
                  DESCRIPTION OF GOODS : <br />{' '}
                  {bookingData?.rowsData?.reduce(
                    (acc, item) => acc + item?.descriptionOfGoods + ', ',
                    '',
                  )}
                </p>
                <p className="medium-font">
                  HSCode:
                  {bookingData?.rowsData?.reduce(
                    (acc, item) => acc + item?.hsCode + ', ',
                    '',
                  )}
                </p>
                <div
                  style={{
                    display: 'flex',
                    marginTop: 'auto',
                    paddingLeft: 5,
                    paddingBottom: 5,
                    justifyContent: 'space-between',
                  }}
                >
                  <div className="medium-font">
                    <p>INV.NO.: {bookingData?.invoiceNumber}</p>
                    <p>L/C NO.: {bookingData?.lcNo}</p>
                    <p>EXP NO.: {bookingData?.expOrCnfNumber}</p>
                    <p>S.B.NO.: {bookingData?.sbNo}</p>
                  </div>
                  <p className="medium-font"></p>
                  <div
                    className="medium-font"
                    style={{ flexDirection: 'column' }}
                  >
                    <p>
                      DT:
                      {bookingData?.invoiceDate
                        ? moment(bookingData?.invoiceDate).format('DD.MM.YYYY')
                        : ''}
                    </p>
                    <p>
                      DT:
                      {bookingData?.lcDate
                        ? moment(bookingData?.lcDate).format('DD.MM.YYYY')
                        : ''}
                    </p>
                    <p>
                      DT:{' '}
                      {bookingData?.expOrCnfDate
                        ? moment(bookingData?.expOrCnfDate).format('DD.MM.YYYY')
                        : ''}
                    </p>
                    <p>DT:</p>
                  </div>
                  <p />
                  <p />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*--- Section: BOX 4 ---*/}
        <div className="box4">
          {/*--- Section: BOX 4 LEFT BOX  ---*/}
          <div className="box4_Left-box">
            <div className="box4_Left-box_content-1">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '50%',
                  }}
                  className="small-font "
                >
                  <p
                    style={{
                      border: '1px solid black',
                      borderTop: 'none',
                      borderLeft: 'none',
                      height: '100%',
                      alignContent: 'center',
                      padding: '0 20px',
                    }}
                  >
                    Prepaid
                  </p>
                  <p
                    style={{
                      border: '1px solid black',
                      borderTop: 'none',
                      height: '100%',
                      alignContent: 'center',
                      padding: '0 20px',
                    }}
                  >
                    Weight charge
                  </p>
                  <p
                    style={{
                      border: '1px solid black',
                      borderTop: 'none',
                      borderRight: 'none',
                      height: '100%',
                      alignContent: 'center',
                      padding: '0 20px',
                    }}
                  >
                    Collect
                  </p>
                </div>
                <div
                  style={{
                    borderRight: '1px solid black',
                    borderBottom: 'none',
                    height: '50%',
                    width: '50%',
                  }}
                />
              </div>
            </div>
            <div className="box4_Left-box_content-2">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '50%',
                  }}
                  className="small-font "
                >
                  <p
                    style={{
                      border: '1px solid black',
                      borderTop: 'none',
                      height: '100%',
                      alignContent: 'center',
                      padding: '0 20px',
                    }}
                  >
                    Valuation charge
                  </p>
                </div>
                <div
                  style={{
                    borderRight: '1px solid black',
                    borderBottom: 'none',
                    height: '50%',
                    width: '50%',
                  }}
                />
              </div>
            </div>
            <div className="box4_Left-box_content-3">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '50%',
                  }}
                  className="small-font "
                >
                  <p
                    style={{
                      border: '1px solid black',
                      borderTop: 'none',
                      height: '100%',
                      alignContent: 'center',
                      padding: '0 20px',
                    }}
                  >
                    Tax
                  </p>
                </div>
                <div
                  style={{
                    borderRight: '1px solid black',
                    borderBottom: 'none',
                    height: '50%',
                    width: '50%',
                  }}
                />
              </div>
            </div>
            <div className="box4_Left-box_content-4">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '50%',
                  }}
                  className="small-font "
                >
                  <p
                    style={{
                      border: '1px solid black',
                      borderTop: 'none',
                      height: '100%',
                      alignContent: 'center',
                      padding: '0 20px',
                    }}
                  >
                    Total Other Charges Due Agent
                  </p>
                </div>
                <div
                  style={{
                    borderRight: '1px solid black',
                    borderBottom: 'none',
                    height: '50%',
                    width: '50%',
                  }}
                />
              </div>
            </div>
            <div className="box4_Left-box_content-5">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '50%',
                  }}
                  className="small-font "
                >
                  <p
                    style={{
                      border: '1px solid black',
                      borderTop: 'none',
                      height: '100%',
                      alignContent: 'center',
                      padding: '0 20px',
                    }}
                  >
                    Total Other Charges Due Carrier
                  </p>
                </div>
                <div
                  style={{
                    borderRight: '1px solid black',
                    borderBottom: 'none',
                    height: '50%',
                    width: '50%',
                  }}
                />
              </div>
            </div>
            <div className="box4_Left-box_content-6">
              <div style={{ borderRight: '1px solid black', width: '50%' }} />
            </div>
            <div className="box4_Left-box_content-7">
              <div
                style={{
                  borderRight: '1px solid black',
                  width: '50%',
                  alignContent: 'center',
                }}
                className="small-font"
              >
                <p style={{ textAlign: 'center' }}>Total Prepaid</p>
              </div>
              <div
                style={{ alignContent: 'center', margin: '0 auto' }}
                className="small-font"
              >
                Total Collect
              </div>
            </div>
            <div className="box4_Left-box_content-8">
              <div style={{ borderRight: '1px solid black', width: '50%' }} />
              <div>0.00</div>
            </div>
            <div className="box4_Left-box_content-9">
              <div
                style={{
                  borderRight: '1px solid black',
                  width: '50%',
                  alignContent: 'center',
                }}
                className="small-font"
              >
                <p style={{ textAlign: 'center' }}>Currency Conversion Rate</p>
              </div>
              <div
                style={{ alignContent: 'center', margin: '0 auto' }}
                className="small-font"
              >
                Cc charges in dest currency
              </div>
            </div>
            <div className="box4_Left-box_content-10">
              <div style={{ borderRight: '1px solid black', width: '50%' }} />
            </div>
            <div className="box4_Left-box_content-11 small-font">
              <p
                style={{
                  textAlign: 'center',
                  borderRight: '1px solid black',
                  width: '50%',
                }}
              >
                For Carrier's use only at Destination
              </p>
              <p style={{ textAlign: 'center', width: '50%' }}>
                Charges at Destination
              </p>
            </div>
          </div>
          {/*--- Section: BOX 4 RIGHT ---*/}
          <div className="box4_Right-box">
            <div className="box4_Right-box_content-1 small-font">
              Other charges
            </div>
            <div className="box4_Right-box_content-2 small-font">Carriage</div>
            <div className="box4_Right-box_content-3" />
            <div className="box4_Right-box_content-4">
              <p style={{ marginRight: 50 }} className="small-font">
                Shipper certifies that the particulars on the face hereof are
                correct and that insofar as any part of the consignment contains
                restricted articles, such part is properly described by name and
                is in proper condition for carriage by air according to the
                applicable Dangerous Goods Regulations.
              </p>
              <p style={{ textAlign: 'center', paddingTop: 40, fontSize: 13 }}>
                A/C OF: {bookingData?.shipperName}
              </p>
              <hr
                style={{ borderTop: 'dotted 1px', width: '45%', marginTop: 10 }}
              />
              <p style={{ textAlign: 'center', fontSize: 13, marginTop: 3 }}>
                Signature of Shipper or his Agent
              </p>
            </div>
            <div className="box4_Right-box_content-5" />
            <div className="box4_Right-box_content-6">
              <div
                style={{
                  display: 'flex',
                  fontSize: 11,
                  justifyContent: 'space-between',
                  paddingTop: 10,
                  paddingRight: 60,
                }}
              >
                <p></p>
                <p></p>
                <p></p>
              </div>
              <hr
                style={{ borderTop: 'dotted 1px', width: '45%', marginTop: 10 }}
              />
              <p className="small-font" style={{ wordSpacing: 3 }}>
                Executed on (Date) at (Place) signature of issuing Carrier or
                its Agent
              </p>
            </div>
            <div className="box4_Right-box_content-7 small-font">
              <p>Total Collect Charges</p>
              <p>Please Code</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewHBLFormatAir;
