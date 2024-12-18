import React, { useEffect, useRef } from 'react';
import { imarineBaseUrl } from '../../../../../App';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import logisticsLogo from './logisticsLogo.png';
import './style.css';

import moment from 'moment';
import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import Loading from '../../../../_helper/_loading';

export default function DeliveryNoteModal({ rowClickData }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const componentRef = useRef();
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );

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
  console.log(bookingData);
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
  if (shipBookingRequestLoading)
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Loading />
      </div>
    );
  return (
    <div>
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

      <div
        style={{
          fontSize: 11,
          display: 'grid',
          gap: 10,
          position: 'relative',
        }}
        ref={componentRef}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <img
            src={logisticsLogo}
            alt=""
            style={{
              height: 25,
              width: 150,
              objectFit: 'cover',
            }}
          />
        </div>

        <div
          style={{
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600 }}>DELIVERY NOTE</span>
          <br />
          <span> {selectedBusinessUnit?.label}</span>
          <br />
          <span> {selectedBusinessUnit?.address}</span> <br />
        </div>

        <div style={{ backgroundColor: '#D6DADD', height: '1px' }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr ',
            // border: "1px solid #000000",
          }}
        >
          {/* left side  */}
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>
                Booking Request Code{' '}
              </span>
              <span style={{ padding: 2 }}>
                : {bookingData?.bookingRequestCode}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Consignee</span>
              <span style={{ padding: 2 }}>: {bookingData?.consigneeName}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Address</span>
              <span style={{ padding: 2 }}>
                : {bookingData?.consigneeAddress}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>
                Contact Person
              </span>
              <span style={{ padding: 2 }}>
                : {bookingData?.consigneeContactPerson}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Contact No</span>
              <span style={{ padding: 2 }}>
                : {bookingData?.consigneeContact}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Email</span>
              <span style={{ padding: 2 }}>
                : {bookingData?.consigneeEmail}
              </span>
            </div>
          </div>
          {/* right side */}
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Shipper </span>
              <span style={{ padding: 2 }}>: {bookingData?.shipperName}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Address</span>
              <span style={{ padding: 2 }}>
                : {bookingData?.shipperAddress}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>
                contactPerson{' '}
              </span>
              <span style={{ padding: 2 }}>
                : {bookingData?.shipperContactPerson}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Contact </span>
              <span style={{ padding: 2 }}>
                : {bookingData?.shipperContact}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Email </span>
              <span style={{ padding: 2 }}>: {bookingData?.shipperEmail}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Delivery At</span>
              <span style={{ padding: 2 }}>
                :{' '}
                {moment(bookingData?.requestDeliveryDate).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2, fontWeight: 600 }}>Vehicle</span>
              <span style={{ padding: 2 }}>
                : {bookingData?.transportPlanning?.vehicleInfo}
              </span>
            </div>
          </div>
        </div>
        {/* table  */}
        <div
          style={{
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <table
            border="1"
            cellPadding="5"
            cellSpacing="0"
            style={{ width: '100%' }}
          >
            <thead>
              <tr style={{ backgroundColor: '#D6DADD' }}>
                <th>SL</th>
                <th>Attribute</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookingData?.billingData?.map((row, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td>{row?.headOfCharges}</td>
                  <td style={{ textAlign: 'right' }}>{row.chargeAmount}</td>
                </tr>
              ))}
              <tr style={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>
                <td colSpan="2" style={{ textAlign: 'right' }}>
                  {' '}
                  Total
                </td>
                <td>
                  {bookingData?.billingData?.reduce((acc, cur) => {
                    return acc + (+cur?.chargeAmount || 0);
                  }, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* signature  */}
        <div
          style={{
            paddingTop: '5rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
            }}
          >
            <div>
              {' '}
              <span style={{ borderTop: '1px solid #000000', paddingTop: 2 }}>
                Officer
              </span>
            </div>
            <div>
              {' '}
              <span style={{ borderTop: '1px solid #000000', paddingTop: 2 }}>
                Driver's Signature
              </span>
            </div>
            <div
              style={{
                textAlign: 'right',
              }}
            >
              {' '}
              <span style={{ borderTop: '1px solid #000000', paddingTop: 2 }}>
                Receiver's Signature With Seal & Date
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
