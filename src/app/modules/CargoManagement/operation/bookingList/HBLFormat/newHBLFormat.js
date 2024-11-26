import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import './newHBLFormat.css';
//============bookingData data=================
// {
//   "bookingRequestCode": "SINV0102024000063",
//   "bookingRequestId": 3,
//   "shipperId": 102367,
//   "shipperName": "jahed",
//   "shipperAddress": "3039",
//   "shipperContactPerson": "jahed",
//   "shipperContact": "01755263355",
//   "shipperEmail": "jahed@ibos.io",
//   "shipperCountryId": 18,
//   "shipperCountry": "Bangladesh",
//   "shipperStateId": 2,
//   "shipperState": "Chattogram",
//   "consigneeId": 102186,
//   "consigneeName": "Zinthin",
//   "consigneeAddress": "sf",
//   "consigneeContactPerson": "sf",
//   "consigneeContact": "255",
//   "consigneeEmail": "demo@ibos.io",
//   "consigCountryId": 18,
//   "consigCountry": "Bangladesh",
//   "consigStateId": 2,
//   "consigState": "Chattogram",
//   "ponumber": "11",
//   "dateOfRequest": "2024-10-18T00:00:00",
//   "freightAgentReference": "Alice Josnson",
//   "modeOfTransport": "Air",
//   "portOfLoadingId": 0,
//   "portOfLoading": "sf",
//   "portOfDischargeId": 0,
//   "portOfDischarge": "sfs",
//   "originAddress": "dg",
//   "countryOfOriginId": 18,
//   "countryOfOrigin": "Bangladesh",
//   "finalDestinationAddress": "sdf",
//   "fdestCountryId": 18,
//   "fdestCountry": "Bangladesh",
//   "fdestStateId": 1,
//   "fdestState": "Barishal",
//   "modeofStuffings": null,
//   "modeOfDelivery": null,
//   "incoterms": "fob",
//   "requestPickupDate": "2024-10-25T00:00:00",
//   "requestDeliveryDate": "2024-11-01T00:00:00",
//   "isCustomsBrokerage": true,
//   "isCargoInsurance": false,
//   "isWarehouseService": true,
//   "isStoreRentPickupService": false,
//   "isDestiontionHaulage": false,
//   "paymentTermsId": 1,
//   "paymentTerms": "PP/CC",
//   "billingAddress": "sd",
//   "billCountryId": 18,
//   "billCountry": "Bangladesh",
//   "billStateId": 1,
//   "billState": "Barishal",
//   "currencyId": 7,
//   "currency": "AZN",
//   "invoiceValue": 44,
//   "packingListReference": "abc-001",
//   "notifyParty": "XYZ Shipping Co.",
//   "notifyBank": "",
//   "negotiationParty": "sdf",
//   "isPending": false,
//   "isHandOver": false,
//   "handOverDate": "2024-10-24T03:44:54.917",
//   "isReceived": true,
//   "receivedDate": "2024-10-24T03:45:02.387",
//   "isPlaning": false,
//   "planingDate": "2024-10-24T03:44:54.917",
//   "isConfirm": true,
//   "confirmDate": "2024-10-23T15:17:04.51",
//   "confTransportMode": "Air to Air",
//   "isActive": true,
//   "isStuffing": true,
//   "stuffingDate": "2024-10-17T09:44:00",
//   "blnumber": null,
//   "isBl": false,
//   "bldate": "2024-10-24T03:44:54.917",
//   "hblnumber": null,
//   "isHbl": false,
//   "hbldate": null,
//   "fcrnumber": null,
//   "isDispatch": false,
//   "dispatchDate": "2024-10-24T03:44:54.917",
//   "isCustomsClear": false,
//   "customsClearDt": "2024-10-24T03:44:54.917",
//   "createdAt": "2024-10-23T15:14:19.89",
//   "createdBy": 1,
//   "departureDateTime": "2024-10-25T21:16:00",
//   "arrivalDateTime": "2024-10-10T21:16:00",
//   "flightNumber": "11",
//   "transitInformation": "Direct Flight",
//   "awbnumber": "1",
//   "bookingAmount": 10,
//   "countryOfOrginId": 18,
//   "countryOfOrgin": "Bangladesh",
//   "pickupPlace": "sf",
//   "isCharges": false,
//   "isInTransit": null,
//   "inTransitDate": "2024-10-24T03:44:54.917",
//   "isDestPortReceive": false,
//   "destPortReceiveDt": "2024-10-24T03:44:54.917",
//   "isBuyerReceive": false,
//   "buyerReceiveDt": "2024-10-24T03:44:54.917",
//   "modeOfStuffingSeaId": 7,
//   "modeOfStuffingSeaName": "Cartton Measurement",
//   "modeOfDeliveryId": 1,
//   "modeOfDeliveryName": "Door to Door",
//   "warehouseId": 142,
//   "warehouseName": "ACCL Factory",
//   "rowsData": [
//     {
//       "bookingRequestRowId": 3,
//       "bookingRequestHeaderId": 3,
//       "typeOfCargoId": 1,
//       "typeOfCargo": "General Cargo ",
//       "descriptionOfGoods": "10",
//       "hsCode": "0102",
//       "numberOfPackages": 1,
//       "recvQuantity": 100,
//       "grossWeightKG": 1,
//       "netWeightKG": 1,
//       "pugrossWeightKg": 1,
//       "punetWeightKg": 1,
//       "totalVolumeCBM": 1,
//       "totalDimsLength": 1,
//       "totalDimsWidth": 1,
//       "totalDimsHeight": 1,
//       "typeOfLoadingId": 2,
//       "typeOfLoading": "Carton",
//       "loadingQuantity": 1,
//       "isTemperatureControl": true,
//       "temperatureRange": "11",
//       "isSHInstruction": true,
//       "shInstructionText": "11",
//       "isActive": true,
//       "createdAt": "2024-10-23T15:14:19.89",
//       "createdBy": 1,
//       "dimensionRow": [
//         {
//           "dimensionRowId": 3,
//           "bookingRequestRowId": 3,
//           "dimsHeight": 1,
//           "dimsWidth": 1,
//           "dimsLength": 1,
//           "perUnitCbm": 1,
//           "isActive": true,
//           "createdAt": "2024-10-23T15:14:19.89",
//           "createdBy": 1
//         }
//       ]
//     }
//   ],
//   "documents": [
//     {
//       "documentId": 3,
//       "bookingRequestId": 0,
//       "documentTypeId": 2,
//       "documentType": "Shipper’s Declaration for Dangerous Goods",
//       "documentFileId": "638652932580763176_unnamed__1_-removebg-preview.png",
//       "isActive": true,
//       "createdAt": "2024-10-23T15:14:19.89",
//       "createdBy": 1,
//       "documentsNumber": null
//     }
//   ],
//   "billingData": [],
//   "transportPlanning": null
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
                {/* INDITEX-ZARA, LELYSTAD BRANCH NIEUWEZIJDS VOORBURGWAL 307 1012
                RM AMSTERDAM THE NETHERLANDS */}
                <b className="large-font">,,Netherlands</b>
              </p>
            </div>
            <div className="box1_left-box_content-4 small-font">
              Airport of Departure and Requested Routing
              <p className="medium-font" style={{ paddingTop: 3 }}>
                DHAKA
              </p>
            </div>
            <div className="box1_left-box_content-5 small-font">
              <div style={{ width: '50%', borderRight: '1px solid black' }}>
                Airport of Destination
                <p className="medium-font" style={{ paddingTop: 5 }}>
                  LELYSTAD
                </p>
              </div>
              <div style={{ width: '25%', borderRight: '1px solid black' }}>
                Flight/Date
                <br />
                <p className="medium-font" style={{ paddingTop: 12 }}>
                  QR8171
                </p>
              </div>
              <div style={{ width: '25%' }}>
                Flight/Date
                <br />
                <p className="medium-font" style={{ paddingTop: 12 }}>
                  30.04.2022
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
                    COLL XX
                  </div>
                  <div style={{ width: '50%', borderRight: '1px solid black' }}>
                    PPD XX
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
              <p style={{ textAlign: 'center' }}>140</p>
              <p className="medium-font">
                <u>
                  <b>SHIPPING MARKS</b>
                </u>
              </p>
              <p className="small-font">47805-D/1</p>
            </div>
            <div style={{ width: '10%', borderRight: '1px solid black' }}>
              <p style={{ textAlign: 'center' }}>
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + +item?.grossWeightKG,
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
                  (acc, item) => acc + +item?.totalDimsHeight,
                  0,
                )}{' '}
                x
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + +item?.totalDimsWidth,
                  0,
                )}{' '}
                x{' '}
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + +item?.totalDimsLength,
                  0,
                )}
                <br />
                Total CBM :{' '}
                {bookingData?.rowsData?.reduce(
                  (acc, item) => acc + +item?.totalVolumeCBM,
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
                  MENS SHIRT PO# 47805-D/1 STYLE
                </p>
                <p className="medium-font">NO# 1063/407 HS CODE: 62059</p>
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
                    <p>INV.NO.: GG22ZM2422</p>
                    <p>L/C NO.: {bookingData?.lcNo}</p>
                    <p>EXP NO.: 2228-009860-2022</p>
                    <p>S.B.NO.:</p>
                  </div>
                  <p className="medium-font"></p>
                  <div
                    className="medium-font"
                    style={{ flexDirection: 'column' }}
                  >
                    <p>DT: 25.04.2022</p>
                    <p>DT: 21.12.2021</p>
                    <p>DT: 25.04.2022</p>
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
                A/C OF: GLOBUS GARMENTS LIMITED
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
                <p>25.04.2022 </p>
                <p>Dhaka-1213,Bangladesh</p>
                <p>MLL/Dhaka-1213,Bangladesh</p>
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
