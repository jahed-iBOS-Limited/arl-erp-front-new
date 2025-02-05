import React, { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { imarineBaseUrl } from '../../../../App';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import Loading from '../../../_helper/_loading';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import logisticsLogo from './logisticsLogo.png';
import { convertNumberToWords } from '../../../_helper/_convertMoneyToWord';

export default function ViewInvoice({ clickRowDto }) {
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const [
    singleChaShipmentBooking,
    getSingleChaShipmentBooking,
    singleChaShipmentBookingLoading,
  ] = useAxiosGet();

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

  const tableStyle = {
    fontSize: '12px',
    width: '100%',
    borderCollapse: 'collapse',
  };

  const cellStyle = {
    border: '1px solid #000',
    padding: '2px',
    textAlign: 'left',
  };

  useEffect(() => {
    if (clickRowDto?.chabookingId) {
      getSingleChaShipmentBooking(
        `${imarineBaseUrl}/domain/CHAShipment/GetChaShipmentBookingById?ChaShipmentbookingId=${clickRowDto?.chabookingId}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowDto]);

  if (singleChaShipmentBookingLoading) {
    return <Loading />;
  }

  const totalStyle = {
    fontWeight: 'bold',
    textAlign: 'right',
    padding: '5px',
    border: '1px solid #000',
  };

  //   {
  //     "chabookingId": 1,
  //     "chabookingCode": null,
  //     "accountId": 1,
  //     "businessUnitId": 225,
  //     "hblNo": "123",
  //     "mblNo": "M123",
  //     "hablNo": "",
  //     "mawblNo": "",
  //     "impExpId": 1,
  //     "impExp": "Export",
  //     "carrierId": 89389,
  //     "carrierName": "Haramine Incorporation Limited",
  //     "customerId": 1,
  //     "customerName": "Test",
  //     "modeOfTransportId": 2,
  //     "modeOfTransportName": "Sea",
  //     "ffwId": null,
  //     "ffw": "string",
  //     "shipperId": 0,
  //     "shipperName": "string",
  //     "consigneeId": 0,
  //     "incotermId": 0,
  //     "incotermName": "string",
  //     "consignee": "string",
  //     "fcllclId": 1,
  //     "fcllclName": "FCL",
  //     "portOfReceive": "string",
  //     "portOfLoading": "string",
  //     "portOfDelivery": "string",
  //     "placeOfDelivery": "string",
  //     "depoPlaceId": 1,
  //     "depoPlaceName": "BSMSN Central Warehouse (BEPZA)",
  //     "commodityId": 1,
  //     "commodityName": "TestCommodity1",
  //     "thirdPartyId": 0,
  //     "thirdPartyName": "string",
  //     "cssalesPicId": 0,
  //     "csSalesPic": "string",
  //     "containerQty": 100.000000,
  //     "copyDocReceived": "2025-01-13T00:00:00",
  //     "originCountryId": 0,
  //     "originCountry": "",
  //     "remarks": "string",
  //     "dischargingVesselNo": "string",
  //     "invoiceValue": 10.000000,
  //     "commercialInvoiceNo": "string",
  //     "invoiceDate": "2025-01-13T00:00:00",
  //     "assessed": "string",
  //     "assessedDate": "2025-01-13T00:00:00",
  //     "exp": "string",
  //     "expDate": "2025-01-13T00:00:00",
  //     "quantity": 10,
  //     "billOfEntry": "string",
  //     "billOfEntryDate": "2025-01-13T00:00:00",
  //     "grossWeight": 10.000000,
  //     "cbmWeight": 1.000000,
  //     "netWeight": 10.000000,
  //     "volumetricWeight": 10.000000,
  //     "exchangeRate": 10.000000,
  //     "currency": "string",
  //     "eta": "2025-01-13T00:00:00",
  //     "ata": "2025-01-13T00:00:00",
  //     "dteCreatedAt": "0001-01-01T00:00:00",
  //     "chaServiceCharges": [
  //         {
  //             "serviceChargeId": 2,
  //             "bookingId": 1,
  //             "headOfChargeId": 1,
  //             "headOfCharges": "Operation",
  //             "collectionRate": 10.000000,
  //             "collectionQty": 10,
  //             "collectionAmount": 10.000000,
  //             "paymentRate": 10.000000,
  //             "paymentQty": 10,
  //             "paymentAmount": 10.000000,
  //             "serviceChargeDate": "2025-01-28T06:35:06.383",
  //             "partyId": 10,
  //             "partyName": "Test1",
  //             "isActive": true,
  //             "createdBy": 0,
  //             "createdAt": "2025-01-28T12:35:52.447",
  //             "updatedAt": null,
  //             "updatedBy": null,
  //             "billRegisterId": null,
  //             "billRegisterCode": null,
  //             "adjustmentJournalId": null,
  //             "invoiceId": null,
  //             "invoiceCode": null
  //         }
  //     ]
  // }

  const totalCollectionAmount = singleChaShipmentBooking?.chaServiceCharges?.reduce(
    (acc, curr) => {
      const collectionQty = +curr?.collectionQty || 0;
      const collectionRate = +curr?.collectionRate || 0;
      const collectionAmount = collectionQty * collectionRate;
      return acc + collectionAmount;
    },
    0,
  );

  return (
    <div>
      <div className="d-flex justify-content-end py-2">
        <button
          onClick={handlePrint}
          type="button"
          className="btn btn-primary px-3 py-2"
        >
          <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
          Print
        </button>
      </div>
      <div
        style={{
          fontSize: 13,
        }}
        ref={componentRef}
      >
        <table style={tableStyle}>
          <thead>
            <tr>
              <td colSpan="4" style={cellStyle}>
                <div>
                  <span>Company: {selectedBusinessUnit?.label}</span> <br />{' '}
                  <hr style={{ margin: '3px 0px' }} />
                  <span>
                    Address: House - 5, Road - 6, Sector 1, Uttara, Dhaka
                  </span>{' '}
                  <hr style={{ margin: '3px 0px' }} />
                  <span>Phone No: N/A</span> <br />
                  <hr style={{ margin: '3px 0px' }} />
                  <span>Email ID: N/A</span> <br />
                  <hr style={{ margin: '3px 0px' }} />
                  <span>BIN: N/A</span> <br />
                </div>
              </td>
              <td colSpan="2" style={{ ...cellStyle, textAlign: 'center' }}>
                <div>
                  <span>
                    Booking Number:{' '}
                    <b>{singleChaShipmentBooking?.chabookingCode}</b>
                  </span>{' '}
                  <br /> <br />
                  <img
                    src={logisticsLogo}
                    alt="Company Logo"
                    style={{ height: '35px' }}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: '#365339',
                  height: '1.5rem',
                  border: '1px solid #000',
                }}
              />
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  border: '1px solid #000',
                  padding: '5px 0',
                  textTransform: 'uppercase',
                }}
              >
                Invoice
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: '#365339',
                  height: '1.5rem',
                  border: '1px solid #000',
                }}
              />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" style={cellStyle}>
                <b>Bill To</b>
              </td>
              <td colSpan="3" style={cellStyle}>
                Invoice No.: {singleChaShipmentBooking?.commercialInvoiceNo}{' '}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Name: {singleChaShipmentBooking?.customerName}
              </td>
              <td style={cellStyle} colSpan="3">
                Date:{' '}
                {singleChaShipmentBooking?.dteCreatedAt
                  ? _dateFormatter(singleChaShipmentBooking?.dteCreatedAt)
                  : ''}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Address: {singleChaShipmentBooking?.customerAddress || 'N/A'}
              </td>
              <td colSpan="3" style={cellStyle}>
                Commodity: {singleChaShipmentBooking?.commodityName}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Port of Delivery: {singleChaShipmentBooking?.portOfDelivery}
              </td>
              <td colSpan="3" style={cellStyle}>
                Weight: {singleChaShipmentBooking?.grossWeight}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                IP/EXP No.: {singleChaShipmentBooking?.exp}
              </td>
              <td colSpan="3" style={cellStyle}>
                Quantity: {singleChaShipmentBooking?.containerQty}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                IP/EXP Date:{' '}
                {singleChaShipmentBooking?.expDate
                  ? _dateFormatter(singleChaShipmentBooking?.expDate)
                  : ''}
              </td>
              <td colSpan="3" style={cellStyle}>
                Delivery Place: {singleChaShipmentBooking?.placeOfDelivery}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                LC No.:{singleChaShipmentBooking?.lcNo || 'N/A'}
              </td>
              <td colSpan="3" style={cellStyle}>
                LC Date:{' '}
                {singleChaShipmentBooking?.lcDate
                  ? _dateFormatter(singleChaShipmentBooking?.lcDate)
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Invoice Value: {singleChaShipmentBooking?.invoiceValue}
              </td>
              <td style={cellStyle} colSpan="3">
                Bill of Entry / Export No.:{' '}
                {singleChaShipmentBooking?.billOfEntry}
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: '#365339',
                  height: '1.5rem',
                  border: '1px solid #000',
                }}
              />
            </tr>

            <tr>
              <th style={cellStyle}>SL.</th>
              <th colSpan="2" style={{ ...cellStyle, textAlign: 'center' }}>
                Description
              </th>
              <th style={{ ...cellStyle, textAlign: 'center' }}>QTY</th>
              <th style={{ ...cellStyle, textAlign: 'center' }}>Rate</th>
              <th style={{ ...cellStyle, textAlign: 'center' }}>Amount</th>
            </tr>
            {singleChaShipmentBooking?.chaServiceCharges?.map((item, index) => {
              const collectionQty = +item?.collectionQty || 0;
              const collectionRate = +item?.collectionRate || 0;
              const collectionAmount = collectionQty * collectionRate;
              return (
                <>
                  <tr key={index}>
                    <td style={cellStyle}>{index + 1}</td>
                    <td colSpan="2" style={cellStyle}>
                      {item?.headOfCharges}
                    </td>
                    <td style={cellStyle}>{item?.collectionQty}</td>
                    <td style={cellStyle}>{item?.collectionRate}</td>
                    <td
                      style={{
                        ...cellStyle,
                      }}
                    >
                      {collectionAmount}
                    </td>
                  </tr>
                </>
              );
            })}
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: '#365339',
                  height: '1.5rem',
                  border: '1px solid #000',
                }}
              />
            </tr>
            <tr>
              <td colSpan="5" style={totalStyle}>
                Sub Total:
              </td>
              <td style={cellStyle}>{totalCollectionAmount}</td>
            </tr>
            <tr>
              <td colSpan="6" style={cellStyle}>
                Amount in words:{' '}
                <span
                  style={{
                    textTransform: 'capitalize',
                  }}
                >
                  {totalCollectionAmount &&
                    convertNumberToWords(totalCollectionAmount || 0)}
                </span>
              </td>
            </tr>
            <tr>
              <td colSpan="6" style={cellStyle}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '50px 50px 5px 50px',
                  }}
                >
                  <div>Prepared By:</div>
                  <div>Checked By:</div>
                  <div>Confirmed By:</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
