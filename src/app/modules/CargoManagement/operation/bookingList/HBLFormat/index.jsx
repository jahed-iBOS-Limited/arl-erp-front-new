import React from 'react';
import './style.css';
import logisticsLogo from './logisticsLogo.png';
import moment from 'moment';
import { convertNumberToWords } from '../../../../_helper/_convertMoneyToWord';

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
//   "expCnfType": null,
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
//   "refInvoiceNo": null,
//   "refInvoiceDate": null,
//   "buyerName": "",
//   "buyerEmail": "",
//   "buyerAddress": "",
//   "buyerAddress2": null,
//   "notifyPartyId": null,
//   "notifyParty": "Global Logistics Ltd.",
//   "notifyParty2Id": null,
//   "notifyParty2": null,
//   "notifyBank": "",
//   "notifyBankAddr": null,
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
//           "infoType": null,
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
//           "voyagaNo": null,
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
export const HBLFormatInvoice = ({ componentRef, bookingData }) => {
  const totalNumberOfPackages = bookingData?.rowsData?.reduce((acc, item) => {
    return acc + (+item?.totalNumberOfPackages || 0);
  }, 0);
  return (
    <div ref={componentRef}>
      <div className="hblContainer">
        <div className="airandConsigneeInfo">
          <div className="top borderBottom">
            <div className="leftSide borderRight">
              <div className="shipperInfo borderBottom">
                <p className="textTitle">Shipper:</p>
                <p>{bookingData?.shipperName}</p>
                <p>{bookingData?.shipperAddress}</p>
                <p>{bookingData?.shipperContactPerson}</p>
                <p>{bookingData?.shipperContact}</p>
                <p>{bookingData?.shipperEmail}</p>
                <p>
                  {bookingData?.shipperState} ,{bookingData?.shipperCountry}
                </p>
              </div>
              <div className="consigneeInfo borderBottom">
                <p className="textTitle">Consignee:</p>
                <p>{bookingData?.consigneeName}</p>
                <p>{bookingData?.consigneeAddress}</p>
                <p>{bookingData?.consigneeContactPerson}</p>
                <p>{bookingData?.consigneeContact}</p>
                <p>
                  {bookingData?.consigState}, {bookingData?.consigCountry}
                </p>
                <p>{bookingData?.consigneeEmail}</p>
              </div>
              <div className="notifyParty borderBottom">
                <p className="textTitle">Notify Party:</p>
                <p>{bookingData?.notifyPartyDtl1?.participantsName}</p>
                <p>
                  {bookingData?.notifyPartyDtl1?.zipCode &&
                    `${bookingData?.notifyPartyDtl1?.zipCode}, `}
                  {bookingData?.notifyPartyDtl1?.state &&
                    `${bookingData?.notifyPartyDtl1?.state}, `}
                  {bookingData?.notifyPartyDtl1?.city &&
                    `${bookingData?.notifyPartyDtl1?.city}, `}
                  {bookingData?.notifyPartyDtl1?.country &&
                    `${bookingData?.notifyPartyDtl1?.country}, `}
                  {bookingData?.notifyPartyDtl1?.address}
                </p>
              </div>
              <div className="preCarriageInfo borderBottom">
                <div className="firstColumn leftSide">
                  <p className="textTitle">Pre-Carriage By:</p>
                  <p>
                    {bookingData?.transportPlanning?.map((item, index) => {
                      return (
                        <>
                          {item?.vesselName}{' '}
                          {index < bookingData?.transportPlanning?.length - 1
                            ? ','
                            : ''}
                        </>
                      );
                    })}
                  </p>
                </div>
                <div className="rightSide">
                  <p className="textTitle">Place of Receipt:</p>
                  <p>{bookingData?.pickupPlace}</p>
                </div>
              </div>
              <div className="oceanVesselInfo">
                <div className="firstColumn leftSide">
                  <p className="textTitle">Ocean Vessel:</p>
                  <p>
                    {bookingData?.transportPlanning?.map((item, index) => {
                      return (
                        <>
                          {item?.vesselName} / {item?.voyagaNo} <br />
                          {index < bookingData?.transportPlanning?.length - 1
                            ? ','
                            : ''}
                        </>
                      );
                    })}
                  </p>
                </div>
                <div className="rightSide">
                  <p className="textTitle">Port of Loading:</p>
                  <p> {bookingData?.portOfLoading}</p>
                </div>
              </div>
            </div>
            <div className="rightSide">
              <div className="rightSideTop">
                <div className="leftSide borderRight">
                  <p className="textTitle">Date of Issue:</p>
                  <p>
                    {bookingData?.createdAt &&
                      moment(bookingData?.createdAt).format('DD-MM-YYYY')}
                  </p>
                </div>
                <div className="rightSide">
                  <p className="textTitle">B/L Number:</p>
                  <p>{bookingData?.hblnumber}</p>
                </div>
              </div>
              <div className="rightSideMiddleContent">
                <img
                  src={logisticsLogo}
                  alt=""
                  style={{ height: 100, width: 150, objectFit: 'contain' }}
                />
                <h1>Akij Logistics Limited</h1>
                <h3>Bir Uttam Mir Shawkat Sarak, Dhaka 1208</h3>
              </div>
              <div className="rightSideBottom">
                <p className="textTitle" style={{ paddingBottom: 5 }}>
                  For delivery of goods please apply to:
                </p>
                <div style={{ paddingLeft: 5 }}>
                  <p>
                    {bookingData?.freightAgentReference} <br />
                  </p>
                  {bookingData?.deliveryAgentDtl?.zipCode &&
                    `${bookingData?.deliveryAgentDtl?.zipCode}, `}
                  {bookingData?.deliveryAgentDtl?.state &&
                    `${bookingData?.deliveryAgentDtl?.state}, `}
                  {bookingData?.deliveryAgentDtl?.city &&
                    `${bookingData?.deliveryAgentDtl?.city}, `}
                  {bookingData?.deliveryAgentDtl?.country &&
                    `${bookingData?.deliveryAgentDtl?.country}, `}{' '}
                  {bookingData?.deliveryAgentDtl?.address &&
                    `${bookingData?.deliveryAgentDtl?.address}`}
                </div>
              </div>
            </div>
          </div>
          <div className="middle">
            <div className="firstRow borderBottom">
              <div className="firstColumn borderRight">
                <p className="textTitle">Port of Discharge:</p>
                <p>{bookingData?.portOfDischarge}</p>
              </div>
              <div className="secondColumn">
                <div className="item borderRight">
                  <p className="textTitle">Final Destination:</p>
                  <p>{bookingData?.finalDestinationAddress}</p>
                </div>
                <div className="item borderRight">
                  <p className="textTitle">Freight payable at</p>
                </div>
              </div>
              <div className="thirdColumn">
                <p className="textTitle">Number of Original B/L:</p>
              </div>
            </div>
            <div className="secondRow borderBottom textTitle">
              <div className="firstColumn borderRight">
                <p>Marks &amp; Numbers</p>
                <p>Container &amp; Seal Numbers</p>
              </div>
              <div className="secondColumn">
                <div className="item borderRight">
                  <p>No. of Packages</p>
                </div>
                <div className="item borderRight">
                  <p>Description of Packages and Goods</p>
                  <p>Particularly Furnished by Shipper</p>
                </div>
              </div>
              <div className="thirdColumn">
                <div className="item borderRight">
                  <p>Gross weight</p>
                  <p>KG</p>
                </div>
                <div className="item">
                  <p>Measurement</p>
                  <p>CBM</p>
                </div>
              </div>
            </div>
            <div className="thirdRow borderBottom">
              <div className="firstColumn borderRight">
                <div
                  style={{
                    textTransform: 'uppercase',
                  }}
                >
                  <p>Style No.</p>
                  <p>Short Name Size</p>
                  <p>Colour/Aty</p>
                  <p>Qty Per Carton</p>
                </div>
              </div>
              <div className="secondColumn">
                <div className="item borderRight">
                  <p>
                    {/* totalNumberOfPackages sum */}
                    {totalNumberOfPackages}
                    <br />
                    Cartons
                  </p>
                </div>
                <div
                  className="item borderRight"
                  style={{
                    textTransform: 'uppercase',
                  }}
                >
                  <p>
                    {' '}
                    {totalNumberOfPackages} Cartons (
                    {totalNumberOfPackages &&
                      convertNumberToWords(totalNumberOfPackages)}{' '}
                    Cartons only)
                  </p>
                  <p>Description Of Goods:</p>

                  {bookingData?.rowsData?.map((item, index) => {
                    return (
                      <>
                        <p>{item?.descriptionOfGoods}</p>
                        <p>
                          Po No:{' '}
                          {item?.dimensionRow?.map((i, index) => {
                            return (
                              i?.poNumber +
                              (index < item?.dimensionRow?.length - 1
                                ? ','
                                : '')
                            );
                          })}
                        </p>
                        <p>
                          Color:{' '}
                          {item?.dimensionRow?.map((i, index) => {
                            return (
                              i?.color +
                              (index < item?.dimensionRow?.length - 1
                                ? ','
                                : '')
                            );
                          })}
                        </p>
                        <p>
                          H.S Code:{' '}
                          {item?.hsCode +
                            (index < bookingData?.rowsData?.length - 1
                              ? ','
                              : '')}
                        </p>
                        <br />
                      </>
                    );
                  })}

                  <br />
                  <p>Invoice No: {bookingData?.invoiceNumber}</p>
                  <p>
                    {bookingData?.infoType === 'lc'
                      ? 'LC No'
                      : bookingData?.infoType === 'tt'
                      ? 'TT No'
                      : 'S/C No'}
                    :{' '}
                    {bookingData?.objPurchase?.map((item, index) => {
                      return `${item?.lcnumber || ''} : ${item?.lcdate &&
                        `${moment(item?.lcdate).format('DD-MM-YYYY')}`}${
                        index < bookingData?.objPurchase?.length - 1 ? ',' : ''
                      }`;
                    })}
                  </p>
                  <p>
                    Exp No:
                    {bookingData?.expOrCnfNumber} :{' '}
                    {bookingData?.expOrCnfDate &&
                      `${moment(bookingData?.expOrCnfDate).format(
                        'DD-MM-YYYY',
                      )}`}
                  </p>
                  <br />
                  <table
                    style={{
                      width: '250px',
                    }}
                  >
                    <>
                      <tr>
                        <td>Conainer No</td>
                        <td>Seal No</td>
                        <td>Size</td>
                        <td>Mode</td>
                      </tr>
                      {bookingData?.transportPlanning?.map((item) => {
                        return item?.containerDesc?.map((i, index) => {
                          return (
                            <tr key={Math.random()}>
                              <td>{i?.containerNumber}</td>
                              <td>{i?.sealNumber}</td>
                              <td>{i?.size}</td>
                              <td>
                                {bookingData?.modeOfStuffingSeaName || ''}
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </>
                  </table>
                </div>
              </div>
              <div className="thirdColumn">
                <div className="item borderRight">
                  <p>
                    {/* totalGrossWeightKG sum */}
                    {bookingData?.rowsData?.reduce((acc, item) => {
                      return acc + (+item?.totalGrossWeightKG || 0);
                    }, 0)}{' '}
                    KGS
                  </p>
                </div>
                <div
                  className="item"
                  style={{
                    position: 'relative',
                  }}
                >
                  <p>
                    {/* totalVolumeCBM sum */}
                    {bookingData?.rowsData?.reduce((acc, item) => {
                      return acc + (+item?.totalVolumeCBM || 0);
                    }, 0)}{' '}
                    CBM
                  </p>
                  <div
                    style={{
                      fontWeight: 500,
                      position: 'absolute',
                      top: '79px',
                      left: '-67px',
                      zIndex: 9,
                      fontSize: '13px',
                    }}
                  >
                    <p>Shipped On Board</p>
                    <p>
                      Date:{' '}
                      {bookingData?.transportPlanning?.[0]
                        ?.estimatedTimeOfDepart &&
                        moment(
                          bookingData?.transportPlanning?.[0]
                            ?.estimatedTimeOfDepart,
                        ).format('DD-MM-YYYY')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="bottomLeft borderRight">
              <div className="bottomFirstColumn borderBottom">
                <div className="firstColumn">
                  <p className="textTitle text-center">
                    Freight and Disbursment
                  </p>
                  <h3
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    {' '}
                    FREIGHT{' '}
                    {['exw'].includes(bookingData?.incoterms) && 'COLLECT EXW'}
                    {['fca', 'fob'].includes(bookingData?.incoterms) &&
                      'COLLECT'}
                    {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms) &&
                      'PREPAID'}
                    {['dap', 'ddp', 'ddu'].includes(bookingData?.incoterms) &&
                      'COLLECT DAP/DDP/DDU'}
                    {['other'].includes(bookingData?.incoterms) && 'COLLECT'}
                  </h3>
                </div>
              </div>
              <div className="bottomSecondColumn borderBottom">
                <div className="firstColumn">
                  <p
                    className="textTitle"
                    style={{
                      fontSize: '14px',
                      padding: '10px',
                    }}
                  >
                    TOTAL PREPAID
                  </p>
                </div>
              </div>
              <div className="bottomThirdColumn">
                <div className="firstColumn">
                  <p
                    className="textTitle"
                    style={{
                      fontSize: '14px',
                      padding: '10px',
                    }}
                  >
                    TOTAL COLLECT
                  </p>
                </div>
              </div>
            </div>
            <div className="bottomRight">
              <div
                className="thirdColumn"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p className="textTitle">
                    Received by Akij Logistics Limited. for shipment by ocean
                    vessel, between port of loading and port of discharge, and
                    for arrangement or procurement of pre-carriage from place of
                    acceptance and/or on carriage to place of delivery as
                    indicated above: the goods as specified above in apparent
                    good order and condition unless otherwise stated. The goods
                    to be delivered at the above mentioned port of discharge or
                    place of delivery whichever applies. Subject to Akij
                    Logistics Limited. terms contained on the reverse side
                    hereof, to which the Shipper agrees by accepting this Bill
                    of Lading. In witness whereof three (3) original Bills of
                    Lading have been signed, if not otherwise stated above, one
                    of which being accomplished the other(s) to be void.
                  </p>
                  <br />
                  <p
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Dhaka, Bangladesh
                  </p>
                </div>
                <p
                  style={{
                    borderTop: '1px solid',
                    padding: '0px 20px',
                    display: 'flex',
                    justifyContent: 'end',
                    width: '240px',
                    fontSize: '14px',
                    marginBottom: '23px',
                    alignSelf: 'flex-end',
                    marginRight: '20px',
                  }}
                >
                  Stamp and authorized signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
