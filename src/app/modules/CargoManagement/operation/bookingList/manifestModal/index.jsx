import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
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
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const bookingData = shipBookingRequestGetById || {};
  const totalNetWeightKG = bookingData?.rowsData?.reduce((acc, item) => {
    return acc + item?.totalGrossWeightKG;
  }, 0);
  const numberOfPackages = bookingData?.rowsData?.reduce((acc, item) => {
    return acc + item?.totalNumberOfPackages;
  }, 0);
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
          fontSize: '11px',
        }}
        ref={componentRef}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
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
          {selectedBusinessUnit?.label}
          <br />
          {selectedBusinessUnit?.address}
        </div>
        <span
          style={{
            textAlign: 'center',
            fontSize: 14,
            textDecoration: 'underline',
          }}
        >
          Cargo Manifest
        </span>
        {/* top table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid black' }}>
                {bookingData?.modeOfTransport === 'Air'
                  ? 'Air Freight'
                  : 'Ocean Freight'}{' '}
              </th>
              <th style={{ border: '1px solid black' }}>MASTER AWB NO.</th>
              <th style={{ border: '1px solid black' }}>PORT OF DISCHARGE</th>
              <th style={{ border: '1px solid black' }}>TOTAL NO. OF H-SHIP</th>
              <th style={{ border: '1px solid black' }}>FLIGHT NO.</th>
              <th style={{ border: '1px solid black' }}>DATE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black' }}>
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
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'start',
                  paddingLeft: 5,
                }}
              >
                {' '}
                N/A
              </td>
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'start',
                  paddingLeft: 5,
                }}
              >
                {' '}
                {bookingData?.portOfDischarge}
              </td>
              <td style={{ border: '1px solid black' }}>N/A</td>
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'start',
                  paddingLeft: 5,
                }}
              >
                {
                  bookingData?.transportPlanning?.airTransportRow?.[0]
                    ?.flightNumber
                }
              </td>
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'start',
                  paddingLeft: 5,
                }}
              >
                {moment(
                  bookingData?.transportPlanning?.airTransportRow?.[0]
                    ?.flightDate,
                ).format('YYYY-MM-DD')}
              </td>
            </tr>
          </tbody>
        </table>
        {/* bottom table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid black', paddingLeft: 5 }}>
                HAWB NO.
              </th>
              <th style={{ border: '1px solid black', paddingLeft: 5 }}>
                NO OF PKG
              </th>
              <th style={{ border: '1px solid black', paddingLeft: 5 }}>
                WT IN KG
              </th>
              <th style={{ border: '1px solid black', paddingLeft: 5 }}>
                NATURE IF GOODS
              </th>
              <th style={{ border: '1px solid black', paddingLeft: 5 }}>
                PORT OF LOADING
              </th>
              <th style={{ border: '1px solid black', paddingLeft: 5 }}>
                FINAL DEST
              </th>
              <th style={{ border: '1px solid black', paddingLeft: 5 }}>
                NAME & ADDRESS OF SHIPPER
              </th>
              <th style={{ border: '1px solid black', paddingLeft: 5 }}>
                NAME & ADDRESS OF CONSIGNEE
              </th>
              <th style={{ border: '1px solid black', paddingLeft: 5 }}>
                FREIGHT TERMS
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', paddingLeft: 5 }}>
                {bookingData?.hblnumber}
              </td>
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'center',
                  paddingLeft: 5,
                }}
              >
                {numberOfPackages}
              </td>
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'center',
                  paddingLeft: 5,
                }}
              >
                {totalNetWeightKG ? totalNetWeightKG + ' KG' : ''}
              </td>
              <td style={{ border: '1px solid black', paddingLeft: 5 }}>
                {bookingData?.rowsData?.map((item, index) => {
                  return (
                    <div style={{ display: 'grid', gap: 4 }} key={index}>
                      {item?.descriptionOfGoods}{' '}
                      {item?.descriptionOfGoods && ' :'}
                      <div
                        style={{
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
                            (index < item?.dimensionRow?.length - 1 ? ',' : '')
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
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'start',
                  paddingLeft: 5,
                }}
              >
                {bookingData?.portOfLoading} <br />
              </td>
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'start',
                  paddingLeft: 5,
                }}
              >
                {bookingData?.finalDestinationAddress} <br />
                {bookingData?.fdestCity} <br />
                {bookingData?.fdestState} {bookingData?.fdestPostalCode && '-'}{' '}
                {bookingData?.fdestPostalCode}
                <br />
                {bookingData?.fdestCountry} <br />
              </td>
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'start',
                  paddingLeft: 5,
                  maxWidth: 130,
                }}
              >
                {bookingData?.shipperName} <br />
                {bookingData?.shipperAddress} <br />
                {bookingData?.shipperContact} <br />
                {bookingData?.shipperEmail} <br />
                {bookingData?.shipperState}{' '}
                {bookingData?.shipperPostalCode && '-'}{' '}
                {bookingData?.shipperPostalCode}{' '}
                {bookingData?.shipperCountry && ','}{' '}
                {bookingData?.shipperCountry}
              </td>
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'start',
                  paddingLeft: 5,
                }}
              >
                {bookingData?.consigneeName} <br />
                {bookingData?.consigneeAddress} <br />
                {bookingData?.consigneeContact} <br />
                {bookingData?.consigneeEmail} <br />
                {bookingData?.consigState}{' '}
                {bookingData?.consignPostalCode && '-'}{' '}
                {bookingData?.consignPostalCode}{' '}
                {bookingData?.consigCountry && ','} {bookingData?.consigCountry}
              </td>
              <td
                style={{
                  border: '1px solid black',
                  textAlign: 'start',
                  paddingLeft: 5,
                  maxWidth: 130,
                }}
              >
                FREIGHT{' '}
                {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms)
                  ? 'PREPAID'
                  : 'COLLECT'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
