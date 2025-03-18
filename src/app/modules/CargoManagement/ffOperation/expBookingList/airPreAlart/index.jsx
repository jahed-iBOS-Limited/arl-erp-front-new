import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';

export default function AirPreAlert({ rowClickData }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
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

  const data = shipBookingRequestGetById || {};

  const transportPlanningAir =
    data?.transportPlanning?.find((i) => {
      return [1, 5].includes(i?.transportPlanningModeId);
    }) || '';

  const transportPlanningSea =
    data?.transportPlanning?.find((i) => {
      return i?.transportPlanningModeId === 2;
    }) || '';

  const transportPlanningLand =
    data?.transportPlanning?.find((i) => {
      return i?.transportPlanningModeId === 4;
    }) || '';

  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

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
      {shipBookingRequestLoading && <Loading />}
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
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <div></div>
            <div> Akij Logistics Ltd</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {transportPlanningAir && (
              <CommonHeaderInfo
                bookingData={data}
                transportPlanning={transportPlanningAir}
                transportPlanningMode={1}
              />
            )}
            {transportPlanningSea && (
              <CommonHeaderInfo
                bookingData={data}
                transportPlanning={transportPlanningSea}
                transportPlanningMode={2}
              />
            )}
            {transportPlanningLand && (
              <CommonHeaderInfo
                bookingData={data}
                transportPlanning={transportPlanningLand}
                transportPlanningMode={4}
              />
            )}
          </div>
          {transportPlanningAir && (
            <CommonTransportRow
              bookingData={data}
              transportPlanning={transportPlanningAir}
              transportPlanningMode={1}
            />
          )}
          {transportPlanningSea && (
            <CommonTransportRow
              bookingData={data}
              transportPlanning={transportPlanningSea}
              transportPlanningMode={2}
            />
          )}
          {transportPlanningLand && (
            <CommonTransportRow
              bookingData={data}
              transportPlanning={transportPlanningLand}
              transportPlanningMode={4}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const CommonHeaderInfo = ({
  transportPlanning,
  transportPlanningMode,
  bookingData,
}) => {
  return (
    <div
      style={{
        flex: 1,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        <div>
          {transportPlanningMode === 1
            ? 'AIR'
            : transportPlanningMode === 2
            ? 'SEA'
            : 'Land'}{' '}
          {bookingData?.tradeTypeId === 1 ? 'Export ' : 'Import '}
          Pre Alert{' '}
        </div>
      </div>
      <div>
        <br />
        <span>Shipper : </span>
        <span>{bookingData?.shipperName}</span>
        <br />

        <span>Consignee : </span>
        <span>{bookingData?.consigneeName}</span>
        <br />

        {transportPlanningMode === 4 ? (
          <></>
        ) : (
          <>
            <span>HAWB Number : </span>
            <span>{bookingData?.hblnumber}</span>
            <br />

            <span>MAWB Number : </span>
            <span>{bookingData?.mawbnumber}</span>
            <br />
          </>
        )}

        <span>Origin : </span>
        <span>{bookingData?.countryOfOrigin}</span>
        <br />

        <span>PO Number : </span>
        <span>
          {bookingData?.rowsData?.map((row) => {
            return (
              row?.dimensionRow
                ?.map((itm) => {
                  return itm?.poNumber;
                })
                .join(', ') || ''
            );
          })}
        </span>
        <br />

        <span>Style : </span>
        <span>
          {bookingData?.rowsData?.map((row) => {
            return (
              row?.dimensionRow
                ?.map((itm) => {
                  return itm?.style;
                })
                .join(', ') || ''
            );
          })}{' '}
        </span>
        <br />

        <span>Color : </span>
        <span>
          {bookingData?.rowsData?.map((row) => {
            return (
              row?.dimensionRow
                ?.map((itm) => {
                  return itm?.color;
                })
                .join(', ') || ''
            );
          })}{' '}
        </span>
        <br />

        <span>Total Carton :</span>
        <span> {transportPlanning?.carton}</span>
        <br />
        <span>Final Destination :</span>
        <span>{bookingData?.finalDestinationAddress}</span>
        <br />
      </div>
    </div>
  );
};

const CommonTransportRow = ({ transportPlanning, transportPlanningMode }) => {
  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'center',
        }}
      >
        <thead>
          <tr>
            {transportPlanningMode === 4 && (
              <th style={{ border: '1px solid black' }}>Truck Type</th>
            )}
            <th style={{ border: '1px solid black' }}>From</th>
            <th style={{ border: '1px solid black' }}>To</th>
            <th style={{ border: '1px solid black' }}>
              {transportPlanningMode === 1 ? 'Flight Number' : 'Vessel Name'}
            </th>
            <th style={{ border: '1px solid black' }}>DATE</th>
          </tr>
        </thead>
        <tbody>
          {transportPlanning?.airTransportRow?.map((item, index) => (
            <tr key={index}>
              {transportPlanningMode === 4 && (
                <td style={{ border: '1px solid black' }}>{item?.truckType}</td>
              )}
              <td style={{ border: '1px solid black' }}>{item?.fromPort}</td>
              <td style={{ border: '1px solid black' }}>{item.toPort}</td>
              <td style={{ border: '1px solid black' }}>{item.flightNumber}</td>
              <td style={{ border: '1px solid black' }}>
                {moment(item.flightDate).format('YYYY-MM-DD')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
