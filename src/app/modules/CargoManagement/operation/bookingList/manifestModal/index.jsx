import moment from "moment";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { imarineBaseUrl } from "../../../../../App";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import logisticsLogo from './logisticsLogo.png';

export default function ManifestModal({ rowClickData }) {
    const { selectedBusinessUnit } = useSelector(
        (state) => state?.authData || {},
        shallowEqual,
    );
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Invoice',
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
    const totalNetWeightKG = bookingData?.rowsData?.reduce((acc, item) => {
        return acc + item?.totalGrossWeightKG;
    }, 0)
    const numberOfPackages = bookingData?.rowsData?.reduce((acc, item) => {
        return acc + item?.totalNumberOfPackages;
    }, 0)
    return (
        <div>
            <div className="d-flex justify-content-end">
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
            <div
                style={{
                    display: 'grid',
                    gap: 15,
                    fontSize: "11px",

                }}
                ref={componentRef}
            >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "center", textAlign: 'center' }}>
                    <img
                        src={logisticsLogo}
                        alt="Logo"
                        style={{
                            height: 25,
                            width: 150,
                        }}
                    />
                    {selectedBusinessUnit?.label}
                    <br />
                    {selectedBusinessUnit?.address}
                </div>
                <span style={{
                    textAlign: "center",
                    fontSize: 14,
                    textDecoration: "underline",
                }}>Cargo Manifest</span>
                {/* top table */}
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black" }}>
                                {bookingData?.modeOfTransport === 'Air'
                                    ? 'Air Freight'
                                    : 'Ocean Freight'}{' '}
                            </th>
                            <th style={{ border: "1px solid black" }}>MASTER AWB NO.</th>
                            <th style={{ border: "1px solid black" }}>PORT OF DISCHARGE</th>
                            <th style={{ border: "1px solid black" }}>TOTAL NO. OF H-SHIP</th>
                            <th style={{ border: "1px solid black" }}>FLIGHT NO.</th>
                            <th style={{ border: "1px solid black" }}>DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: "1px solid black" }}>
                                <div style={{ textAlign: 'start', paddingLeft: 5 }}>
                                    {bookingData?.freightAgentReference} <br />
                                    {bookingData?.deliveryAgentDtl?.zipCode &&
                                        `${bookingData?.deliveryAgentDtl?.zipCode}, `}
                                    <br />
                                    {bookingData?.deliveryAgentDtl?.state &&
                                        `${bookingData?.deliveryAgentDtl?.state}, `}
                                    <br />
                                    {bookingData?.deliveryAgentDtl?.city &&
                                        `${bookingData?.deliveryAgentDtl?.city}, `}
                                    <br />
                                    {bookingData?.deliveryAgentDtl?.country &&
                                        `${bookingData?.deliveryAgentDtl?.country}, `}{' '}
                                    <br />
                                    {bookingData?.deliveryAgentDtl?.address &&
                                        `${bookingData?.deliveryAgentDtl?.address}`}
                                </div>
                            </td>
                            <td style={{ border: "1px solid black", textAlign: 'start', paddingLeft: 5 }}> N/A</td>
                            <td style={{ border: "1px solid black", textAlign: 'start', paddingLeft: 5 }}> {bookingData?.portOfDischarge}</td>
                            <td style={{ border: "1px solid black" }}>N/A</td>
                            <td style={{ border: "1px solid black", textAlign: 'start', paddingLeft: 5 }}>
                                {
                                    bookingData?.transportPlanning?.[0]?.airTransportRow?.[0]?.flightNumber
                                }
                            </td>
                            <td style={{ border: "1px solid black", textAlign: 'start', paddingLeft: 5 }}>
                                {
                                    moment(bookingData?.transportPlanning?.[0]?.airTransportRow?.[0]?.flightDate).format('YYYY-MM-DD')
                                }
                            </td>
                        </tr>

                    </tbody>
                </table>
                {/* bottom table */}
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black", paddingLeft: 5 }}>HAWB NO.</th>
                            <th style={{ border: "1px solid black", paddingLeft: 5 }}>NO OF PKG</th>
                            <th style={{ border: "1px solid black", paddingLeft: 5 }}>WT IN KG</th>
                            <th style={{ border: "1px solid black", paddingLeft: 5 }}>NATURE IF GOODS</th>
                            <th style={{ border: "1px solid black", paddingLeft: 5 }}>PORT OF LOADING</th>
                            <th style={{ border: "1px solid black", paddingLeft: 5 }}>FINAL DEST</th>
                            <th style={{ border: "1px solid black", paddingLeft: 5 }}>NAME & ADDRESS OF SHIPPER</th>
                            <th style={{ border: "1px solid black", paddingLeft: 5 }}>NAME & ADDRESS OF CONSIGNEE</th>
                            <th style={{ border: "1px solid black", paddingLeft: 5 }}>FREIGHT TERMS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: "1px solid black", paddingLeft: 5 }}>
                                {bookingData?.hblnumber}
                            </td>
                            <td style={{ border: "1px solid black", textAlign: 'center', paddingLeft: 5 }}>
                                {numberOfPackages}
                            </td>
                            <td style={{ border: "1px solid black", textAlign: 'center', paddingLeft: 5 }}>
                                {
                                    totalNetWeightKG ? totalNetWeightKG + " KG" : ""
                                }
                            </td>
                            <td style={{ border: "1px solid black", paddingLeft: 5 }}>
                                {bookingData?.rowsData?.map((item, index) => {
                                    return (
                                        <div style={{ display: "grid", gap: 4 }} key={index}>
                                            {item?.descriptionOfGoods} {item?.descriptionOfGoods && " :"}
                                            <div style={{
                                                border: '1px solid black',
                                                width: '60%',
                                                borderBottom: 'none',
                                            }}
                                            />
                                            <div>
                                                PO No:{' '}
                                                {item?.dimensionRow?.map((i, index) => {
                                                    return (
                                                        (i?.poNumber || '') +
                                                        (index < item?.dimensionRow?.length - 1
                                                            ? ','
                                                            : '')
                                                    );
                                                })}

                                                <br />
                                                H.S Code:{' '}
                                                {(item?.hsCode || '') +
                                                    (index < bookingData?.rowsData?.length - 1
                                                        ? ','
                                                        : '')}
                                            </div>

                                        </div>
                                    );
                                })}
                            </td>
                            <td style={{ border: "1px solid black", textAlign: 'start', paddingLeft: 5 }}>
                                {bookingData?.portOfLoading} <br />
                            </td>
                            <td style={{ border: "1px solid black", textAlign: 'start', paddingLeft: 5 }}>
                                {bookingData?.finalDestinationAddress} <br />
                                {bookingData?.fdestCity} <br />
                                {bookingData?.fdestState} {bookingData?.fdestPostalCode && "-"} {bookingData?.fdestPostalCode}<br />
                                {bookingData?.fdestCountry} <br />


                            </td>
                            <td style={{ border: "1px solid black", textAlign: 'start', paddingLeft: 5, maxWidth: 130 }}>
                                {bookingData?.shipperName} <br />
                                {bookingData?.shipperAddress} <br />
                                {bookingData?.shipperContact} <br />
                                {bookingData?.shipperEmail} <br />
                                {bookingData?.shipperState} {bookingData?.shipperPostalCode && "-"} {bookingData?.shipperPostalCode} {bookingData?.shipperCountry && ","} {bookingData?.shipperCountry}
                            </td>
                            <td style={{ border: "1px solid black", textAlign: 'start', paddingLeft: 5 }}>
                                {bookingData?.consigneeName} <br />
                                {bookingData?.consigneeAddress} <br />
                                {bookingData?.consigneeContact} <br />
                                {bookingData?.consigneeEmail} <br />
                                {bookingData?.consigState} {bookingData?.consignPostalCode && "-"} {bookingData?.consignPostalCode} {bookingData?.consigCountry && ","} {bookingData?.consigCountry}
                            </td>
                            <td style={{ border: "1px solid black", textAlign: 'start', paddingLeft: 5, maxWidth: 130 }}>
                                FREIGHT {" "}
                                {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms) ?
                                    'PREPAID' : "COLLECT"}

                            </td>
                        </tr>

                    </tbody>
                </table>
            </div >
        </div>
    )
}

// {
//     "bookingRequestCode": "SINV0122024000012",
//     "bookingRequestId": 20,
//     "shipperId": 102367,
//     "shipperName": "jahed",
//     "shipperAddress": "3039",
//     "shipperContactPerson": "jahed",
//     "shipperContact": "01755263355",
//     "shipperEmail": "jahed@ibos.io",
//     "shipperCountryId": 18,
//     "shipperCountry": "Bangladesh",
//     "shipperStateId": 0,
//     "shipperState": "Chattogram",
//     "shipperCity": "",
//     "shipperPostalCode": "",
//     "shipperBankId": 1,
//     "shipperBank": "AGRANI BANK LTD",
//     "buyerBank": "SIBL new",
//     "consigneeId": 1,
//     "consigneeName": "Mamunuzzaman Mamun",
//     "consigneeAddress": "Dhaka, Bangladesh",
//     "consigneeContactPerson": "Mamun",
//     "consigneeContact": "01929554466",
//     "consigneeEmail": "mamun@ibos.io",
//     "consigCountryId": 18,
//     "consigCountry": "Bangladesh",
//     "consigStateId": 0,
//     "consigState": "Dhaka",
//     "consignCity": "Dhaka",
//     "consignPostalCode": "1214",
//     "expOrCnfNumber": "Exp-002",
//     "expCnfType": "EXP",
//     "expOrCnfDate": "2024-12-20T00:00:00",
//     "freightAgentReference": "Emdadul Haque",
//     "modeOfTransport": "Air",
//     "portOfLoadingId": 0,
//     "portOfLoading": "POL-001",
//     "portOfDischargeId": 0,
//     "portOfDischarge": "POD-001",
//     "originAddress": "Mongla",
//     "countryOfOriginId": 18,
//     "countryOfOrigin": "Bangladesh",
//     "finalDestinationAddress": "dhaka",
//     "fdestCountryId": 18,
//     "fdestCountry": "Bangladesh",
//     "fdestStateId": 0,
//     "fdestState": "feni",
//     "fdestCity": "feni",
//     "fdestPostalCode": "feni",
//     "concernSalesPersonId": 0,
//     "concernSalesPerson": "",
//     "primaryContactPersonId": 0,
//     "primaryContactPerson": "",
//     "modeofStuffings": null,
//     "modeOfDelivery": null,
//     "incoterms": "exw",
//     "typeOfLoadingId": 0,
//     "typeOfLoading": "",
//     "typeOfLoadingQty": 1.000000,
//     "requestPickupDate": "2024-12-28T00:00:00",
//     "requestDeliveryDate": "2024-12-20T00:00:00",
//     "isCustomsBrokerage": false,
//     "isCargoInsurance": false,
//     "isWarehouseService": false,
//     "isStoreRent": false,
//     "isHaulagePickupService": false,
//     "isDestiontionHaulage": false,
//     "isLocalTransportation": false,
//     "freightForwarderTermsId": 1,
//     "freightForwarderTerms": "PP/CC",
//     "billingAddress": "",
//     "billCountryId": 0,
//     "billCountry": "",
//     "billStateId": 0,
//     "billState": "",
//     "currencyId": 141,
//     "currency": "BDT",
//     "invoiceValue": 11.000000,
//     "packingListReference": "sdf",
//     "refInvoiceNo": "001",
//     "refInvoiceDate": "2024-12-19T00:00:00",
//     "buyerName": "",
//     "buyerEmail": "",
//     "buyerAddress": "",
//     "buyerAddress2": "Dhaka, Bangladesh",
//     "notifyPartyId": 3,
//     "notifyParty": "Jahed Hossain",
//     "notifyParty2Id": 0,
//     "notifyParty2": "",
//     "notifyBank": "",
//     "notifyBankAddr": "Lalmatia mohammad pur",
//     "negotiationParty": "",
//     "isPending": false,
//     "isHandOver": false,
//     "handOverDate": null,
//     "isReceived": false,
//     "receivedDate": null,
//     "isPlaning": true,
//     "planingDate": "2024-12-05T04:33:51.977",
//     "isConfirm": true,
//     "confirmDate": "2024-12-05T04:27:54.747",
//     "confTransportMode": "Sea to Sea",
//     "isActive": true,
//     "isStuffing": false,
//     "stuffingDate": null,
//     "blnumber": null,
//     "isBl": false,
//     "bldate": null,
//     "hblnumber": "ALL-A000002",
//     "isHbl": true,
//     "hbldate": "2024-12-05T04:27:58.33",
//     "fcrnumber": null,
//     "isDispatch": false,
//     "dispatchDate": null,
//     "isCustomsClear": false,
//     "customsClearDt": null,
//     "createdAt": "2024-12-05T04:21:00.727",
//     "createdBy": 1,
//     "departureDateTime": "2024-12-05T10:27:00",
//     "arrivalDateTime": "2024-12-05T10:27:00",
//     "flightNumber": "",
//     "transitInformation": "Direct Flight",
//     "awbnumber": "",
//     "bookingAmount": 0.000000,
//     "countryOfOrginId": 18,
//     "countryOfOrgin": "Bangladesh",
//     "pickupPlace": "dhaka",
//     "isCharges": false,
//     "isInTransit": null,
//     "inTransitDate": null,
//     "isDestPortReceive": false,
//     "destPortReceiveDt": null,
//     "isBuyerReceive": false,
//     "buyerReceiveDt": null,
//     "modeOfStuffingSeaId": 1,
//     "modeOfStuffingSeaName": "CY/CFS",
//     "modeOfDeliveryId": 1,
//     "modeOfDeliveryName": "Door to Door",
//     "warehouseId": 10640,
//     "warehouseName": "AAFL Central Warehouse (Factory)",
//     "invoiceNumber": null,
//     "invoiceDate": null,
//     "objPurchase": [
//         {
//             "purchaseInfoId": 9,
//             "bookingId": 20,
//             "infoType": "lc",
//             "lcnumber": "lc-001",
//             "lcdate": "2024-12-13T00:00:00",
//             "isActive": true,
//             "createdAt": "2024-12-05T04:26:15.47",
//             "createdBy": 1
//         }
//     ],
//     "rowsData": [
//         {
//             "bookingRequestRowId": 31,
//             "bookingRequestHeaderId": 20,
//             "typeOfCargoId": 1,
//             "typeOfCargo": "General Cargo ",
//             "descriptionOfGoods": "11",
//             "hsCode": "0101 - Horses, asses, mules and hinnies, live",
//             "totalNumberOfPackages": 10.000000,
//             "recvQuantity": 0.000000,
//             "totalGrossWeightKG": 0.000000,
//             "totalNetWeightKG": 0.000000,
//             "totalPerUnitNetWeightKG": 0.000000,
//             "totalPerUnitGrossWeightKG": 0.000000,
//             "totalVolumeCBM": 1.000000,
//             "totalDimsLength": 10.000000,
//             "totalDimsWidth": 10.000000,
//             "totalDimsHeight": 10.000000,
//             "isTemperatureControl": false,
//             "temperatureRange": "",
//             "isSHInstruction": false,
//             "shInstructionText": "",
//             "isActive": true,
//             "createdAt": "2024-12-05T04:21:00.727",
//             "createdBy": 1,
//             "dimensionRow": [
//                 {
//                     "dimensionRowId": 24,
//                     "bookingRequestRowId": 31,
//                     "dimsHeight": 10.000000,
//                     "dimsWidth": 10.000000,
//                     "dimsLength": 10.000000,
//                     "perUnitCbm": 0.600000,
//                     "numberOfPackage": 10.000000,
//                     "perUnitGrossWeight": 0.000000,
//                     "perUnitNetWeight": 0.000000,
//                     "measurementType": "cm",
//                     "poNumber": "po-00",
//                     "style": "st-001",
//                     "color": "red",
//                     "isActive": true,
//                     "createdAt": "2024-12-05T04:21:00.727",
//                     "createdBy": 1
//                 }
//             ]
//         },
//         {
//             "bookingRequestRowId": 32,
//             "bookingRequestHeaderId": 20,
//             "typeOfCargoId": 1,
//             "typeOfCargo": "General Cargo ",
//             "descriptionOfGoods": "dgd",
//             "hsCode": "0101 - Horses, asses, mules and hinnies, live",
//             "totalNumberOfPackages": 10.000000,
//             "recvQuantity": 0.000000,
//             "totalGrossWeightKG": 10.000000,
//             "totalNetWeightKG": 10.000000,
//             "totalPerUnitNetWeightKG": 10.000000,
//             "totalPerUnitGrossWeightKG": 10.000000,
//             "totalVolumeCBM": 1.000000,
//             "totalDimsLength": 10.000000,
//             "totalDimsWidth": 10.000000,
//             "totalDimsHeight": 10.000000,
//             "isTemperatureControl": false,
//             "temperatureRange": "",
//             "isSHInstruction": false,
//             "shInstructionText": "",
//             "isActive": true,
//             "createdAt": "2024-12-05T04:21:00.727",
//             "createdBy": 1,
//             "dimensionRow": []
//         }
//     ],
//     "documents": [
//         {
//             "documentId": 21,
//             "bookingRequestId": 0,
//             "documentTypeId": 11,
//             "documentType": "Matarial Safety Data Sheet (MSDS",
//             "documentFileId": "638688940314129040_FREIGHT CERTIFICATE  (2).pdf",
//             "isActive": true,
//             "createdAt": "2024-12-05T04:21:00.727",
//             "createdBy": 1,
//             "documentsNumber": null
//         }
//     ],
//     "billingData": [],
//     "transportPlanning": [
//         {
//             "transportId": 12,
//             "bookingId": 20,
//             "pickupLocation": "dhaka",
//             "pickupDate": "2024-12-05T04:33:52.63",
//             "vehicleInfo": "",
//             "noOfPallets": 20,
//             "carton": 10,
//             "noOfContainer": 0,
//             "airLineOrShippingLine": "US-Bangladesh",
//             "iatanumber": "1030",
//             "vesselName": "",
//             "voyagaNo": "",
//             "departureDateTime": null,
//             "arrivalDateTime": "2024-12-05T10:33:00",
//             "transportMode": "Sea to Sea",
//             "berthDate": "2024-12-06T10:33:00",
//             "cutOffDate": "2024-12-21T10:33:00",
//             "estimatedTimeOfDepart": "2024-12-19T00:00:00",
//             "isActive": true,
//             "containerDesc": [],
//             "airTransportRow": []
//         }
//     ],
//     "deliveryAgentDtl": {
//         "participantId": 3,
//         "participantCode": " ",
//         "participantTypeId": 3,
//         "participantType": "Notify Party",
//         "participantsName": "Jahed Hossain",
//         "companyName": "iBOS Limited",
//         "contactPerson": "jahed",
//         "contactNumber": "01755551234",
//         "email": "jahed@ibos.io",
//         "countryId": 18,
//         "country": "Bangladesh",
//         "stateId": 102,
//         "state": "Chattogram",
//         "cityId": 103,
//         "city": "Chattogram",
//         "address": "Dhaka, Bangladesh",
//         "zipCode": "1414",
//         "isActive": true,
//         "createdBy": 0,
//         "createdAt": "2024-11-28T06:59:41.503"
//     },
//     "notifyPartyDtl1": {
//         "participantId": 3,
//         "participantCode": " ",
//         "participantTypeId": 3,
//         "participantType": "Notify Party",
//         "participantsName": "Jahed Hossain",
//         "companyName": "iBOS Limited",
//         "contactPerson": "jahed",
//         "contactNumber": "01755551234",
//         "email": "jahed@ibos.io",
//         "countryId": 18,
//         "country": "Bangladesh",
//         "stateId": 102,
//         "state": "Chattogram",
//         "cityId": 103,
//         "city": "Chattogram",
//         "address": "Dhaka, Bangladesh",
//         "zipCode": "1414",
//         "isActive": true,
//         "createdBy": 0,
//         "createdAt": "2024-11-28T06:59:41.503"
//     },
//     "notifyPartyDtl2": null,
//     "saveWaybillData": null
// }