import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { imarineBaseUrl } from '../../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';

export default function ShipmentOrderInvoice({ rowClickData }) {
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

  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
      );
    }

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
              src="/logisticsLogo.png"
              alt="akij logistics logo"
              style={{ height: 30, width: 130 }}
            />
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Akij Logistics Ltd.
              </div>
              <div>
                Akij House, 198 Bir Uttam Mir Shawkat Sarak,
                <br /> Tejgaon I/A, Dhaka-1208
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            Shipping Order
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
              <div style={{ borderRight: '1px solid #000000' }}>
                <div>Shipper,</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 4fr',
                    gap: 5,
                    paddingTop: 5,
                  }}
                >
                  <div>SHIPPER NAME</div>
                  <div>: {data?.shipperName}</div>
                  <div>ADDRESS</div>
                  <div>
                    : {data?.shipperAddress}
                    {data?.shipperPostalCode
                      ? data?.shipperPostalCode + ', '
                      : ''}
                    {data?.shipperCity ? data?.shipperCity + ', ' : ''}
                    {data?.shipperCountry ? data?.shipperCountry : ''}
                  </div>
                  <div>CNEE </div>
                  <div>: {data?.consigneeName}</div>
                  <div>POL</div>
                  <div> : {data?.portOfLoading}</div>
                  <div>POD</div>
                  <div>: {data?.portOfDischarge}</div>
                  <div>Quantity </div>
                  <div>
                    :{' '}
                    {data?.rowsData?.reduce((acc, item) => {
                      return acc + (+item.totalNumberOfPackages || 0);
                    }, 0)}{' '}
                  </div>
                  <div>Volume </div>
                  <div>
                    :{' '}
                    {data?.rowsData?.reduce((acc, item) => {
                      return acc + item.totalVolumeCBM;
                    }, 0)}{' '}
                  </div>
                  <div>Local Agent </div>
                  <div>: {data?.freightAgentReference}</div>
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
                    style={{
                      paddingLeft: 5,
                    }}
                  >
                    <div>Ref. No: {data?.bookingRequestCode}</div>
                    <br />
                  </div>
                  <div
                    style={{
                      borderLeft: '1px solid #000000',
                    }}
                  >
                    <div style={{ paddingLeft: 5 }}>
                      <div>Date:</div>
                      {moment(data?.bookingRequestDate).format('DD-MM-YYYY')}
                      <br />
                    </div>
                  </div>
                </div>
                <div style={{ paddingLeft: 5 }}>
                  <div>To,</div>
                  <br />
                  {data?.warehouseName}
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
              <div style={{ borderRight: '1px solid #000000' }}>
                <div>Notify Party </div>

                <div>{data?.notifyParty}</div>
                <div>{data?.notifyParty2}</div>
              </div>
              {/* <div>
                      <div style={{ paddingLeft: 5 }}>
                        <div>Negotiation Party</div>
                        <br />
                        <div>{data?.negotiationParty}</div>
                      </div>
                    </div> */}
            </div>
          </div>
          <div className="mt-4">
            <div
              style={{
                fontWeight: 600,
              }}
            >
              Cargo Information
            </div>
            <div>
              <table>
                <thead
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '10px 0',
                    borderBottom: '1px solid #000000',
                  }}
                >
                  <tr>
                    <th>SL</th>
                    <th>Type of Cargo</th>
                    <th>Des. of Goods</th>
                    <th>HS Code</th>
                    <th>PO Number</th>
                    <th>Style</th>
                    <th>Color</th>
                    <th>Gross Weight (kg)</th>
                    <th>Net Weight (kg)</th>
                    <th>Volume (CBM)</th>
                    {data?.modeOfTransport === 'Air' && (
                      <th>Volumetric Weight</th>
                    )}
                    <th>Dimensions (Length)</th>
                    <th>Dimensions (Width)</th>
                    <th>Dimensions (Height)</th>
                    <th>Carton</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.rowsData?.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        padding: '10px 0',
                        borderBottom: '1px solid #000000',
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{item?.typeOfCargo}</td>
                      <td>{item?.descriptionOfGoods || ''}</td>
                      <td>{item?.hsCode}</td>
                      <td>
                        {item?.dimensionRow?.map((d) => d?.poNumber).join(', ')}
                      </td>
                      <td>
                        {item?.dimensionRow?.map((d) => d?.style).join(', ')}
                      </td>
                      <td>
                        {item?.dimensionRow?.map((d) => d?.color).join(', ')}
                      </td>
                      <td>{item?.totalGrossWeightKG}</td>
                      <td>{item?.totalNetWeightKG}</td>
                      <td>{item?.totalVolumeCBM}</td>
                      {data?.modeOfTransport === 'Air' && (
                        <td>{item?.totalVolumetricWeight}</td>
                      )}
                      <td>{item?.totalDimsLength}</td>
                      <td>{item?.totalDimsWidth}</td>
                      <td>{item?.totalDimsHeight}</td>
                      <td>{item?.totalNumberOfPackages}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={7} align="center">
                      <span className="font-bold">Total</span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {data?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalGrossWeightKG,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {data?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalNetWeightKG,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {data?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalVolumeCBM,
                          0,
                        )}
                      </span>
                    </td>
                    {data?.modeOfTransport === 'Air' && (
                      <td>
                        <span className="font-bold">
                          {data?.rowsData?.reduce(
                            (acc, item) => acc + +item?.totalVolumetricWeight,
                            0,
                          )}
                        </span>
                      </td>
                    )}
                    <td>
                      <span className="font-bold">
                        {data?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalDimsLength,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {data?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalDimsWidth,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {data?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalDimsHeight,
                          0,
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold">
                        {data?.rowsData?.reduce(
                          (acc, item) => acc + +item?.totalNumberOfPackages,
                          0,
                        )}
                      </span>
                    </td>

                    <td colSpan={5}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              textAlign: 'center',
              paddingTop: '50px',
            }}
          >
            Thanking you
          </div>
        </div>
      </div>
    </div>
  );
}
