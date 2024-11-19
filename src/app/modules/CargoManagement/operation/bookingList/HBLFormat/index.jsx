import React, { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import logisticsLogo from './logisticsLogo.png';
import NewHBLFormatAir from './newHBLFormat';
// {
//   "bookingRequestCode": "SINV0102024000014",
//   "bookingRequestId": 16,
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
//   "shipperCity": null,
//   "shipperPostalCode": null,
//   "consigneeId": 102186,
//   "consigneeName": "Zinthin",
//   "consigneeAddress": "Singapur",
//   "consigneeContactPerson": "zinthin",
//   "consigneeContact": "8801775263355",
//   "consigneeEmail": "demo@ibos.io",
//   "consigCountryId": 18,
//   "consigCountry": "Bangladesh",
//   "consigStateId": 1,
//   "consigState": "Barishal",
//   "consignCity": null,
//   "consignPostalCode": null,
//   "expOrCnfNumber": "new ",
//   "freightAgentReference": "Alice Josnson",
//   "modeOfTransport": "Sea",
//   "portOfLoadingId": 0,
//   "portOfLoading": "10",
//   "portOfDischargeId": 0,
//   "portOfDischarge": "11",
//   "originAddress": "dhaka",
//   "countryOfOriginId": 18,
//   "countryOfOrigin": "Bangladesh",
//   "finalDestinationAddress": "dhaka",
//   "fdestCountryId": 18,
//   "fdestCountry": "Bangladesh",
//   "fdestStateId": 1,
//   "fdestState": "Barishal",
//   "fdestCity": null,
//   "fdestPostalCode": null,
//   "concernSalesPersonId": null,
//   "concernSalesPerson": null,
//   "primaryContactPersonId": null,
//   "primaryContactPerson": null,
//   "modeofStuffings": null,
//   "modeOfDelivery": null,
//   "incoterms": "exw",
//   "typeOfLoadingId": 1,
//   "typeOfLoading": "Pallet",
//   "typeOfLoadingQty": 10.00,
//   "requestPickupDate": "2024-09-30T00:00:00",
//   "requestDeliveryDate": "2024-10-15T00:00:00",
//   "isCustomsBrokerage": true,
//   "isCargoInsurance": true,
//   "isWarehouseService": true,
//   "isStoreRent": true,
//   "isHaulagePickupService": false,
//   "isDestiontionHaulage": true,
//   "freightForwarderTermsIdTermsId": 0,
//   "freightForwarderTermsIdTermsTerms": null,
//   "billingAddress": "10",
//   "billCountryId": 18,
//   "billCountry": "Bangladesh",
//   "billStateId": 1,
//   "billState": "Barishal",
//   "currencyId": 6,
//   "currency": "AUD",
//   "invoiceValue": 10100323.00,
//   "packingListReference": "abc 123",
//   "buyerName": "demobuyer1",
//   "buyerEmail": "demo@ibos.io",
//   "notifyPartyId": null,
//   "notifyParty": "Port Solutions Corp.",
//   "notifyBank": "",
//   "negotiationParty": "10",
//   "isPending": true,
//   "isHandOver": false,
//   "handOverDate": "2024-11-10T09:43:58.817",
//   "isReceived": true,
//   "receivedDate": "2024-11-10T09:45:47.457",
//   "isPlaning": true,
//   "planingDate": "2024-11-10T09:45:42.093",
//   "isConfirm": true,
//   "confirmDate": "2024-11-10T09:46:10.7",
//   "confTransportMode": "Sea to Sea",
//   "isActive": true,
//   "isStuffing": true,
//   "stuffingDate": "2024-11-28T15:45:00",
//   "blnumber": null,
//   "isBl": false,
//   "bldate": "2024-11-10T09:43:58.817",
//   "hblnumber": "ALL-A000002",
//   "isHbl": true,
//   "hbldate": "2024-11-10T09:33:35.387",
//   "fcrnumber": null,
//   "isDispatch": true,
//   "dispatchDate": "2024-11-22T15:44:00",
//   "isCustomsClear": true,
//   "customsClearDt": "2024-11-30T15:44:00",
//   "createdAt": "2024-10-30T07:11:06.137",
//   "createdBy": 0,
//   "departureDateTime": "2024-11-01T15:45:00",
//   "arrivalDateTime": "2024-11-09T15:46:00",
//   "flightNumber": "11",
//   "transitInformation": "",
//   "awbnumber": "",
//   "bookingAmount": 101.00,
//   "countryOfOrginId": 18,
//   "countryOfOrgin": "Bangladesh",
//   "pickupPlace": "10",
//   "isCharges": false,
//   "isInTransit": null,
//   "inTransitDate": "2024-11-10T09:45:50.617",
//   "isDestPortReceive": true,
//   "destPortReceiveDt": "2024-11-10T09:45:50.617",
//   "isBuyerReceive": true,
//   "buyerReceiveDt": "2024-11-10T09:45:50.617",
//   "modeOfStuffingSeaId": 1,
//   "modeOfStuffingSeaName": "CY/CFS",
//   "modeOfDeliveryId": 1,
//   "modeOfDeliveryName": "Door to Door",
//   "warehouseId": 10302,
//   "warehouseName": "MV Akij Moon(WH-PTE-Deck)",
//   "invoiceNumber": null,
//   "invoiceDate": null,
//   "objPurchase": [],
//   "rowsData": [
//       {
//           "bookingRequestRowId": 16,
//           "bookingRequestHeaderId": 16,
//           "typeOfCargoId": 1,
//           "typeOfCargo": "General Cargo ",
//           "descriptionOfGoods": "100",
//           "hsCode": "0101 - Horses, asses, mules and hinnies, live",
//           "totalNumberOfPackages": 40.00,
//           "recvQuantity": 0.00,
//           "totalGrossWeightKG": 2000.00,
//           "totalNetWeightKG": 2000.00,
//           "totalPerUnitNetWeightKG": 50.00,
//           "totalPerUnitGrossWeightKG": 50.00,
//           "totalVolumeCBM": 6000.0,
//           "totalDimsLength": 30.00,
//           "totalDimsWidth": 20.00,
//           "totalDimsHeight": 10.00,
//           "isTemperatureControl": false,
//           "temperatureRange": "",
//           "isSHInstruction": false,
//           "shInstructionText": "",
//           "isActive": true,
//           "createdAt": "2024-11-12T09:55:37.99",
//           "createdBy": 0,
//           "dimensionRow": [
//               {
//                   "dimensionRowId": 16,
//                   "bookingRequestRowId": 16,
//                   "dimsHeight": 10.00,
//                   "dimsWidth": 20.00,
//                   "dimsLength": 30.00,
//                   "perUnitCbm": 6000.0,
//                   "numberOfPackage": 40.00,
//                   "perUnitGrossWeight": 50.00,
//                   "perUnitNetWeight": 50.00,
//                   "isActive": true,
//                   "createdAt": "2024-10-30T07:11:06.137",
//                   "createdBy": 1
//               }
//           ]
//       }
//   ],
//   "documents": [
//       {
//           "documentId": 37,
//           "bookingRequestId": 0,
//           "documentTypeId": 2,
//           "documentType": "Shipper’s Declaration for Dangerous Goods",
//           "documentFileId": "638657694026990622_unnamed__1_-removebg-preview.png",
//           "isActive": true,
//           "createdAt": "2024-11-12T09:55:37.99",
//           "createdBy": 0,
//           "documentsNumber": null
//       }
//   ],
//   "billingData": [
//       {
//           "billingId": 13,
//           "bookingRequestId": 16,
//           "headOfChargeId": 1,
//           "headOfCharges": "Freight",
//           "chargeAmount": 11.00,
//           "consigneeCharge": 1.00,
//           "actualExpense": 1.00,
//           "isActive": true,
//           "billingDate": "2024-11-10T10:12:21.347",
//           "createdBy": 521235,
//           "createdAt": null,
//           "updatedBy": null,
//           "updatedAt": 521235
//       },
//       {
//           "billingId": 14,
//           "bookingRequestId": 16,
//           "headOfChargeId": 2,
//           "headOfCharges": "Local Transportation",
//           "chargeAmount": 443.00,
//           "consigneeCharge": 45.00,
//           "actualExpense": 3443.00,
//           "isActive": true,
//           "billingDate": "2024-11-10T10:12:21.347",
//           "createdBy": 521235,
//           "createdAt": null,
//           "updatedBy": null,
//           "updatedAt": null
//       }
//   ],
//   "transportPlanning": {
//       "transportId": 33,
//       "bookingId": 16,
//       "pickupLocation": "Mirpur",
//       "pickupDate": "2024-11-20T00:00:00",
//       "vehicleInfo": "Car",
//       "noOfPallets": 0,
//       "carton": 0,
//       "noOfContainer": 10,
//       "airLineOrShippingLine": "USA Airlines ",
//       "iatanumber": "0",
//       "vesselName": "DH-Vessel-101",
//       "departureDateTime": null,
//       "arrivalDateTime": "2024-11-15T15:45:00",
//       "transportMode": "Sea to Sea",
//       "berthDate": "2024-10-31T00:00:00",
//       "cutOffDate": "2024-11-27T00:00:00",
//       "estimatedTimeOfDepart": "2024-11-27T00:00:00",
//       "isActive": true,
//       "containerDesc": [
//           {
//               "containerDescId": 8,
//               "transportId": 33,
//               "containerNumber": "1",
//               "sealNumber": "1",
//               "size": "1",
//               "quantity": 1.0,
//               "cbm": 1.00,
//               "mode": "",
//               "kgs": 1.00,
//               "isActive": true,
//               "createdBy": null,
//               "createdAt": "2024-11-10T09:45:42.22"
//           }
//       ]
//   }
// }
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
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const bookingData = shipBookingRequestGetById || {};

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Customs-RTGS',
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
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px',
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
      <NewHBLFormatAir componentRef={componentRef} bookingData={bookingData} />
      {/* <HBLFormatInvoice componentRef={componentRef} bookingData={bookingData} /> */}
    </>
  );
};

export default HBLFormat;

export const HBLFormatInvoice = ({ componentRef, bookingData }) => {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
      ref={componentRef}
    >
      {/* header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <img
            src={logisticsLogo}
            alt="Logo"
            style={{
              height: 25,
              width: 150,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Akij Logistics Limited
            </div>
            <div>Bir Uttam Mir Shawkat Sarak, Dhaka 1208</div>
          </div>
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          BILL OF LADING
        </div>
      </div>
      <div>
        {/* shipper */}
        <div
          style={{
            borderTop: '1px solid #000000',
            borderBottom: '1px solid #000000',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div>
              <div className="printSectionNoneWithNewLine">
                Shipper/Exporter (Complete Name and Address)
              </div>
              <div>{bookingData?.shipperName}</div>
              <div>{bookingData?.shipperAddress}</div>
              <div>{bookingData?.shipperContactPerson}</div>
              <div>{bookingData?.shipperContact}</div>
              <div>{bookingData?.shipperEmail}</div>
              <div>
                {bookingData?.shipperState} ,{bookingData?.shipperCountry}
              </div>
            </div>
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  borderBottom: '1px solid #000000',
                }}
              >
                <div
                  style={{ paddingLeft: 5, borderLeft: '1px solid #000000' }}
                >
                  <div className="printSectionNoneWithNewLine">
                    Booking Number
                  </div>
                  <div>{bookingData?.bookingRequestCode}</div>
                </div>
                <div
                  style={{
                    borderLeft: '1px solid #000000',
                  }}
                >
                  <div style={{ paddingLeft: 5 }}>
                    <div className="printSectionNoneWithNewLine">
                      Bill of Lading Number
                    </div>
                    <div>{bookingData?.hblnumber}</div>
                  </div>
                </div>
              </div>
              <div style={{ paddingLeft: 5, borderLeft: '1px solid #000000' }}>
                <div className="printSectionNoneWithNewLine">
                  Export References
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
        {/* Consignee */}
        <div
          style={{
            borderBottom: '1px solid #000000',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div>
              <div className="printSectionNoneWithNewLine">
                Consignee (Complete Name and Address)
              </div>
              <div>{bookingData?.consigneeName}</div>
              <div>{bookingData?.consigneeAddress}</div>
              <div>{bookingData?.consigneeContactPerson}</div>
              <div>{bookingData?.consigneeContact}</div>
              <div>
                {bookingData?.consigState}, {bookingData?.consigCountry}
              </div>
              <div>{bookingData?.consigneeEmail}</div>
            </div>
            <div>
              <div
                style={{
                  borderBottom: '1px solid #000000',
                }}
              >
                <div
                  style={{ paddingLeft: 5, borderLeft: '1px solid #000000' }}
                >
                  <div className="printSectionNoneWithNewLine">
                    Forwarding Agent – References (Complete Name and Address)
                  </div>
                  <div>{bookingData?.freightAgentReference}</div>
                  <br />
                </div>
              </div>
              <div style={{ paddingLeft: 5, borderLeft: '1px solid #000000' }}>
                <div className="printSectionNoneWithNewLine">
                  Point and Country of Origin
                </div>
                <div>
                  {bookingData?.originAddress}, {bookingData?.countryOfOrigin}
                </div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
        {/* Notify Party (Complete Name and Address) */}
        <div
          style={{
            borderBottom: '1px solid #000000',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div>
              <div className="printSectionNoneWithNewLine">
                Notify Party (Complete Name and Address)
              </div>
              <div>{bookingData?.notifyParty}</div>
              <br />
              <br />
              <br />
            </div>
            <div>
              <div style={{ paddingLeft: 5, borderLeft: '1px solid #000000' }}>
                <div className="printSectionNoneWithNewLine">
                  For Delivery Please Apply To
                </div>
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            borderBottom: '1px solid #000000',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <div>
                <div className="printSectionNoneWithNewLine">
                  Loading Pier/Terminal
                </div>
                <br />
              </div>
              <div
                style={{
                  borderLeft: '1px solid #000000',
                }}
              >
                <div style={{ paddingLeft: 5 }}>
                  <div className="printSectionNoneWithNewLine">
                    Place of Receipt
                  </div>
                  <div>{bookingData?.pickupPlace} </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <div style={{ paddingLeft: 5, borderLeft: '1px solid #000000' }}>
                <div className="printSectionNoneWithNewLine">
                  Pre-Carriage By
                </div>
                <br />
              </div>
              <div
                style={{
                  borderLeft: '1px solid #000000',
                }}
              >
                <div style={{ paddingLeft: 5 }}>
                  <div className="printSectionNoneWithNewLine">
                    Number of Originals
                  </div>
                  <br />
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        {/* Vessel/Voyage */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid #000000',
          }}
        >
          <div>
            <div
              style={{
                borderBottom: '1px solid #000000',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                }}
              >
                <div>
                  <div className="printSectionNoneWithNewLine">
                    Vessel/Voyage Number
                  </div>
                  <div>{bookingData?.transportPlanning?.vesselName}</div>
                  <div></div>
                  <br />
                </div>
                <div
                  style={{
                    borderLeft: '1px solid #000000',
                  }}
                >
                  <div style={{ paddingLeft: 5 }}>
                    <div className="printSectionNoneWithNewLine">
                      Port of Export
                    </div>
                    <div>{bookingData?.portOfLoading}</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <div>
                <div className="printSectionNoneWithNewLine">
                  Port of Discharge
                </div>
                <div>{bookingData?.portOfDischarge}</div>
              </div>
              <div
                style={{
                  borderLeft: '1px solid #000000',
                }}
              >
                <div style={{ paddingLeft: 5 }}>
                  <div className="printSectionNoneWithNewLine">
                    Container Number
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>
          <div style={{ paddingLeft: 5, borderLeft: '1px solid #000000' }}>
            <div className="printSectionNoneWithNewLine">
              For Delivery Please Apply To
            </div>
            <div>{bookingData?.finalDestinationAddress}</div>
            <br />
            <br />
          </div>
        </div>
        <div
          style={{
            borderBottom: '1px solid #000000',
            textAlign: 'center',
            padding: 5,
          }}
        >
          PARTICULARS FURNISHED BY SHIPPER
        </div>
        {/* table */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 6fr 1fr 1fr',
          }}
        >
          <div
            style={{
              borderRight: '1px solid #000000',
              borderBottom: '1px solid #000000',
              padding: 2,
              textAlign: 'center',
            }}
          >
            Marks and Numbers <br />
            {/* sealNumber */}
            {bookingData?.transportPlanning?.containerDesc?.map(
              (item, index) => `${item?.sealNumber}, <br />`,
            )}
          </div>

          <div
            style={{
              borderRight: '1px solid #000000',
              borderBottom: '1px solid #000000',
              padding: 2,
            }}
          >
            <div
              style={{
                display: 'grid',
                gap: 200,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span>Number/Kinds of Packages</span>
                  {bookingData?.rowsData?.map((item, index) => (
                    <div key={Math.random()}>
                      {item?.totalNumberOfPackages}
                      {index < bookingData?.rowsData?.length - 1 ? ',' : ''}
                      <br />
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div>Description of Goods</div>
                  {bookingData?.rowsData?.map((item, index) => (
                    <div key={Math.random()}>
                      {item?.descriptionOfGoods}, {item?.hsCode}
                      {index < bookingData.rowsData.length - 1 ? ',' : ''}
                      <br />
                    </div>
                  ))}
                  <br />
                </div>
              </div>

              <div>
                These commodities, technologies, or software were exported from
                the United States in accordance with the Export Administration
                Regulations. Diversion contrary to U.S. law prohibited.
              </div>
            </div>
          </div>
          <div
            style={{
              borderRight: '1px solid #000000',
              borderBottom: '1px solid #000000',
              padding: 2,
              textAlign: 'center',
            }}
          >
            Gross Weight <br />
            {bookingData?.rowsData?.map((item, index) => (
              <div key={Math.random()}>
                {item?.totalGrossWeightKG}
                <br />
              </div>
            ))}
          </div>
          <div
            style={{
              borderBottom: '1px solid #000000',
              padding: 2,
              textAlign: 'center',
            }}
          >
            Measurement
            <br />
            {bookingData?.rowsData?.map((item, index) => (
              <div key={Math.random()}>
                {item?.totalVolumeCBM} <br />
              </div>
            ))}
          </div>
        </div>
        {/* table footer section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '7fr 1fr 1fr',
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              borderRight: '1px solid #000000',
              borderBottom: '1px solid #000000',
              padding: 5,
            }}
          >
            Liability Limits for loss or damage to Goods are applicable.
            Carrier’s liability for Goods is limited to $500 per package or
            shipping unit. Excess Liability Coverage is requested by Merchant in
            the amount of _____________________. Merchant understands that there
            is an additional charge for excess liability coverage and you are
            willing to pay such charge. Excess liability coverage cannot exceed
            the actual value of the Goods.
          </div>
          <div
            style={{
              borderRight: '1px solid #000000',
              borderBottom: '1px solid #000000',
              textAlign: 'center',
            }}
          >
            Total
            <br />
            {bookingData?.rowsData?.length > 0 &&
              bookingData?.rowsData?.reduce(
                (acc, cur) => acc + (+cur?.totalGrossWeightKG || 0),
                0,
              )}
          </div>
          <div
            style={{
              borderBottom: '1px solid #000000',
              textAlign: 'center',
            }}
          >
            Total <br />
            {bookingData?.rowsData?.length > 0 &&
              bookingData?.rowsData?.reduce(
                (item, index) => item + (+index?.totalVolumeCBM || 0),
                0,
              )}
          </div>
        </div>
        {/* bottom section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '3fr 2fr ',
            gap: 10,
            padding: 5,
            alignItems: 'center',
          }}
        >
          <div>
            RECEIVED by the Carrier from the Merchant in apparent good order and
            condition unless otherwise indicated, the Goods mentioned above to
            be carried by the Vessel and carriers subject to the Bill of Lading
            from the Place of Receipt or the Port of Export to the Port of
            Discharge or Place of Delivery shown above.
            <br />
            <br />
            If the Goods are shipped by the Merchant in a Container, then this
            Bill of Lading is a receipt and part of the contract for the
            Container and any statements made by the Carrier in this Bill of
            Lading as to the number, good order and condition of the Goods shall
            apply only to the number of such Containers and their exterior
            condition.
            <br />
            <br />
            The Carrier has the right to use feeder ships, barges, airplanes,
            motor carrier, air or rail cars for all or any part of this Carriage
            of the Goods. When the Place of Receipt is an inland point,
            notations in this Bill of Lading such as “On Board,” “Loaded on
            Board,” “Shipped on Board” mean on board the conveyance performing
            the overland or air carriage from the Place of Receipt to the Load
            Port.
            <br />
            <br />
            One original of this Bill of Lading must be surrendered duly
            endorsed in exchange for the Goods. When one of the originals of
            this Bill of Lading has been accomplished, other bills of lading
            will stand void.
          </div>
          <div>
            Carrier:{' '}
            <span
              style={{
                borderBottom: '1px solid #000000',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {bookingData?.transportPlanning?.vehicleInfo}
            </span>
            <br />
            <br />
            <br />
            <br />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                alignItems: 'center',
              }}
            >
              <div>
                By:{' '}
                <span
                  style={{
                    borderBottom: '1px solid #000000',
                    display: 'inline-block',
                    textAlign: 'center',
                    width: '50%',
                  }}
                ></span>
                <span> (As Carrier)</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 5,
                }}
              >
                <div>Date:</div>
                <span
                  style={{
                    borderBottom: '1px solid #000000',
                    display: 'inline-block',
                    textAlign: 'center',
                    width: '100%',
                  }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
