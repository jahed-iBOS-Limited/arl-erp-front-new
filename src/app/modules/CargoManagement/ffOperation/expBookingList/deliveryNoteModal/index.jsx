import React, { useEffect, useRef } from 'react';
import { imarineBaseUrl } from '../../../../../../App';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import logisticsLogo from './logisticsLogo.png';
import './style.css';

import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import Loading from '../../../../_helper/_loading';
const tableStyle = {
  fontSize: '12px',
  width: '100%',
  borderCollapse: 'collapse',
};

const cellStyle = {
  border: '1px solid #000',
  padding: '3px',
  textAlign: 'left',
};

export default function DeliveryNoteModal({ rowClickData }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    selectedModeOfTransport,
    setSelectedModeOfTransport,
  ] = React.useState();
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
        (data) => {
          const modeOfTransportId = [2, 3].includes(data?.modeOfTransportId)
            ? 2
            : 1;

          setSelectedModeOfTransport(modeOfTransportId);
        },
      );
    }


  }, [bookingRequestId]);

  const bookingData = shipBookingRequestGetById || {};

  const transportPlanningSea =
    bookingData?.transportPlanning?.find((i) => {
      return i?.transportPlanningModeId === 2;
    }) || '';
  const transportPlanningAir =
    bookingData?.transportPlanning?.find((i) => {
      return [1, 5].includes(i?.transportPlanningModeId);
    }) || '';

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
  const TransportPlanningTable = ({ transportPlanning, modeOfTransport }) => {
    if (modeOfTransport === 'Sea') {
      return (
        <div>
          <table
            border="1"
            cellPadding="5"
            cellSpacing="0"
            style={{ width: '100%' }}
          >
            <thead>
              <tr style={{ backgroundColor: '#D6DADD' }}>
                <th style={cellStyle}>Container No.</th>
                <th style={cellStyle}>Seal No.</th>
                <th style={cellStyle}>Size</th>
                <th style={cellStyle}> Weight</th>
                <th style={cellStyle}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {transportPlanning?.containerDesc?.map((item, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{item?.containerNumber}</td>
                  <td style={cellStyle}>{item?.sealNumber}</td>
                  <td style={cellStyle}>{item?.size}</td>
                  <td style={cellStyle}>{item?.kgs}</td>
                  <td style={cellStyle}>{item?.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else return null;
  };

  const NotifyPartyDetails = ({ notifyParty }) => (
    <>
      {notifyParty?.participantsName && (
        <>
          {notifyParty.participantsName} <br />
        </>
      )}
      {notifyParty?.address && (
        <>
          {notifyParty.address} <br />
        </>
      )}
      {notifyParty?.contactPerson && (
        <>
          {notifyParty.contactPerson} <br />
        </>
      )}
      {notifyParty?.email && (
        <>
          {notifyParty.email} <br />
        </>
      )}
    </>
  );
  return (
    <div>
      <div className="d-flex justify-content-between mt-2">
        <div>
          {rowClickData?.modeOfTransportId === 3 && (
            <div>
              {' '}
              <label className="mr-3">
                <input
                  type="radio"
                  name="billingType"
                  checked={selectedModeOfTransport === 1}
                  className="mr-1 pointer"
                  style={{ position: 'relative', top: '2px' }}
                  onChange={(e) => {
                    setSelectedModeOfTransport(1);
                  }}
                />
                Air
              </label>
              <label>
                <input
                  type="radio"
                  name="billingType"
                  checked={selectedModeOfTransport === 2}
                  className="mr-1 pointer"
                  style={{ position: 'relative', top: '2px' }}
                  onChange={(e) => {
                    setSelectedModeOfTransport(2);
                  }}
                />
                Sea
              </label>
            </div>
          )}
        </div>
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
        className="DeliveryNoteModal"
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
          <span style={{ fontSize: 18, fontWeight: 600 }}>DELIVERY NOTE</span>
          <br />
          <span style={{ fontSize: 16 }}> {selectedBusinessUnit?.label}</span>
          <br />
          <span style={{ fontSize: 14 }}>
            {' '}
            House - 5, Road - 6, Sector 1, Uttara, Dhaka
          </span>{' '}
          <br />
        </div>

        {/* <div style={{ backgroundColor: "#D6DADD", height: "1px" }} /> */}

        <table style={tableStyle}>
          <thead>
            <tr>
              <td
                colSpan="3"
                style={{
                  ...cellStyle,
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                <div>
                  <span>DELIVERY ORDER</span> <br />
                </div>
              </td>
              <td colSpan="3" style={cellStyle}>
                <div>
                  <div>
                    <span>
                      HBL No: <b>{bookingData?.hblnumber}</b>
                    </span>
                  </div>
                  <div>
                    <span>
                      MBL No:{' '}
                      <b>
                        {' '}
                        {bookingData?.seaMasterBlCode &&
                        bookingData?.airMasterBlCode ? (
                          <>
                            {bookingData?.seaMasterBlCode}{' '}
                            {bookingData?.airMasterBlCode
                              ? ', ' + bookingData?.airMasterBlCode
                              : ''}
                          </>
                        ) : (
                          bookingData?.seaMasterBlCode ||
                          bookingData?.airMasterBlCode ||
                          ''
                        )}
                      </b>
                    </span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                rowSpan={5}
                style={{
                  ...cellStyle,
                  textAlign: 'start',
                  verticalAlign: 'top',
                }}
              >
                <strong>Notify Party (Complete Name & Address)</strong>
                <br />
                {bookingData?.notifyPartyDtl1 && (
                  <NotifyPartyDetails
                    notifyParty={bookingData.notifyPartyDtl1}
                  />
                )}
                <hr />
                {bookingData?.notifyPartyDtl2 && (
                  <NotifyPartyDetails
                    notifyParty={bookingData.notifyPartyDtl2}
                  />
                )}
              </td>
              {selectedModeOfTransport === 1 && (
                <td
                  style={{
                    ...cellStyle,
                  }}
                  colSpan="4"
                >
                  <div>
                    <span>
                      <strong>IATA number: </strong>
                    </span>
                    <span>
                      {bookingData?.transportPlanning
                        ?.map((item) => item?.iatanumber)
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </td>
              )}
              {selectedModeOfTransport === 2 && (
                <>
                  <td
                    style={{
                      ...cellStyle,
                    }}
                    colSpan="2"
                  >
                    <div>
                      <span>
                        <strong>Vessel: </strong>
                      </span>
                      <span>
                        {bookingData?.transportPlanning
                          ?.map((item) => item?.vesselName)
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  </td>
                  <td style={cellStyle} colSpan="3">
                    <div>
                      <span>
                        <strong>Voyage No: </strong>
                      </span>
                      <span>
                        {bookingData?.transportPlanning
                          ?.map((item) => item?.voyagaNo)
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  </td>
                </>
              )}
            </tr>
            <tr>
              <td style={cellStyle} colSpan="4">
                <div>
                  <span>
                    <strong> Place of Receipt: </strong>
                  </span>{' '}
                  <span>{bookingData?.originAddress}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={cellStyle} colSpan="4">
                <div>
                  <span>
                    <strong> Port of Loading: </strong>
                  </span>{' '}
                  <span> {bookingData?.portOfLoading}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={cellStyle} colSpan="4">
                <div>
                  <span>
                    <strong> Port of Discharge: </strong>
                  </span>{' '}
                  <span> {bookingData?.portOfDischarge}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={cellStyle} colSpan="4">
                <div>
                  <span>
                    <strong> Place of Delivery: </strong>
                  </span>{' '}
                  <span> {bookingData?.finalDestinationAddress}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                style={{
                  ...cellStyle,
                  verticalAlign: 'top',
                }}
              >
                <div>
                  <span>
                    <strong>CONSIGNEE (Complete Name & Address)</strong> <br />
                    {bookingData?.consigneeName && (
                      <>
                        {bookingData?.consigneeName}
                        <br />
                      </>
                    )}
                    {bookingData?.consigneeAddress && (
                      <>
                        {bookingData?.consigneeAddress}
                        <br />
                      </>
                    )}
                    {bookingData?.consigneeContactPerson && (
                      <>
                        {bookingData?.consigneeContactPerson}
                        <br />
                      </>
                    )}
                    {bookingData?.consigneeContact && (
                      <>
                        {bookingData?.consigneeContact}
                        <br />
                      </>
                    )}
                    {bookingData?.consigneeEmail && (
                      <>{bookingData?.consigneeEmail}</>
                    )}
                  </span>{' '}
                  <br />
                </div>
              </td>
              <td colSpan="4" style={{ ...cellStyle, verticalAlign: 'top' }}>
                <div>
                  <span>
                    <strong> Shipper (Complete Name & Address)</strong>
                    <br />

                    {bookingData?.shipperName && (
                      <>
                        {bookingData?.shipperName}
                        <br />
                      </>
                    )}
                    {bookingData?.shipperAddress && (
                      <>
                        {bookingData?.shipperAddress}
                        <br />
                      </>
                    )}
                    {bookingData?.shipperContactPerson && (
                      <>
                        {bookingData?.shipperContactPerson}
                        <br />
                      </>
                    )}
                    {bookingData?.shipperContact && (
                      <>
                        {bookingData?.shipperContact}
                        <br />
                      </>
                    )}
                    {bookingData?.shipperEmail && (
                      <>{bookingData?.shipperEmail}</>
                    )}
                  </span>{' '}
                  <br />
                </div>
              </td>
            </tr>
            <tr>
              <td style={cellStyle}>Quantity</td>
              <td style={cellStyle}>Package</td>
              <td style={cellStyle}>Description of Goods</td>
              <td style={cellStyle}> Marks & Numbers</td>
              <td style={cellStyle}>Gross Weight</td>
              <td style={cellStyle}>Measurement</td>
            </tr>
            {bookingData?.rowsData?.map((item, index) => (
              <tr key={index}>
                <td style={cellStyle}>{item?.recvQuantity}</td>
                <td style={cellStyle}>{item?.typeOfCargo}</td>
                <td style={cellStyle}>{item?.descriptionOfGoods}</td>
                <td style={cellStyle}>{bookingData?.shippingMark || 'N/A'} </td>
                <td style={cellStyle}>{item?.totalGrossWeightKG}</td>
                <td style={cellStyle}>{item?.totalVolumeCBM}</td>
              </tr>
            ))}

            <tr>
              <td
                colSpan="6"
                style={{
                  height: '1.5rem',
                  //  border: "1px solid #000",
                }}
              />
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        <TransportPlanningTable
          transportPlanning={
            selectedModeOfTransport === 1
              ? transportPlanningAir
              : transportPlanningSea
          }
          modeOfTransport={selectedModeOfTransport === 1 ? 'Air' : 'Sea'}
        />

        {/* signature  */}
        <div
          style={{
            paddingTop: '7rem',
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
