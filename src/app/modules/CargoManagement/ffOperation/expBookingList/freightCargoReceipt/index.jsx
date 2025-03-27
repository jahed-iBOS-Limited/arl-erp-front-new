import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { imarineBaseUrl } from '../../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPut from '../../../../_helper/customHooks/useAxiosPut';
const FreightCargoReceipt = ({ rowClickData }) => {
  const componentRef = useRef();
  const formikRef = React.useRef(null);
  const [, createHblFcrNumber] = useAxiosPut();
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const [transportPlanningData, setTransportPlanningData] = React.useState('');

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
              margin: 50px !important;
            }
          }
        `,
  });

  useEffect(() => {
    if (bookingRequestId) {
      commonGetByIdHandler();
    }

  }, [bookingRequestId]);
  const saveHandler = (values) => {
    createHblFcrNumber(
      `${imarineBaseUrl}/domain/ShippingService/CreateHblFcrNumber?BookingId=${bookingRequestId}&typeId=2`,
      null,
      () => {
        commonGetByIdHandler();
      },
    );
  };
  const commonGetByIdHandler = () => {
    setShipBookingRequestGetById(
      `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
      (resData) => {
        const modeOfTransportId = [2, 3].includes(
          rowClickData?.modeOfTransportId,
        )
          ? 2
          : 1;
        formikRef.current.setFieldValue('billingType', modeOfTransportId);

        const transportPlanningAir =
          resData?.transportPlanning?.find((i) => {
            return [1, 5].includes(i?.transportPlanningModeId);
          }) || '';

        const transportPlanningSea =
          resData?.transportPlanning?.find((i) => {
            return i?.transportPlanningModeId === 2;
          }) || '';

        if ([1, 5].includes(modeOfTransportId)) {
          setTransportPlanningData(transportPlanningAir);
        } else {
          setTransportPlanningData(transportPlanningSea);
        }
      },
    );
  };
  const bookingData = shipBookingRequestGetById || {};
  if (shipBookingRequestLoading)
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Loading />
      </div>
    );

  const groupBySize = transportPlanningData?.containerDesc
    ? transportPlanningData?.containerDesc.reduce((acc, obj) => {
        const key = obj?.size;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {})
    : [];

  const sumOfRate = Object.keys(groupBySize).map((key) => {
    const rate = +groupBySize[key]?.[0]?.rate || 0;
    const containerNo = groupBySize?.[key]?.length;
    return {
      size: key,
      containerNo: containerNo,
      rate: rate,
      total: rate * containerNo,
    };
  });

  const totalGrossWeightKG = bookingData?.rowsData?.reduce(
    (acc, item) => acc + (+item?.totalGrossWeightKG || 0),
    0,
  );

  const totalVolumetricWeight = bookingData?.rowsData?.reduce(
    (acc, item) => acc + (+item?.totalVolumetricWeight || 0),
    0,
  );
  const totalChargeableWeight =
    totalVolumetricWeight > totalGrossWeightKG
      ? totalVolumetricWeight
      : totalGrossWeightKG;

  const hblChargeableRate = +transportPlanningData?.rate || 0;
  const seaAirChargeableRate = +sumOfRate?.[0]?.rate || 0;

  const totalKGS = transportPlanningData?.containerDesc?.reduce((acc, item) => {
    return acc + (+item?.kgs || 0);
  }, 0);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        narration: '',
        paymentParty: '',
        billingType: '',
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm();
        });
      }}
      innerRef={formikRef}
    >
      {({
        errors,
        touched,
        setFieldValue,
        handleSubmit,
        values,
        resetForm,
      }) => (
        <Form className="form form-label-right">
          <div className="">
            {/* Save button add */}

            <div className="d-flex justify-content-between">
              <div>
                {/* {rowClickData?.modeOfTransportId === 3 && (
                  <>
                    {' '}
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="billingType"
                        checked={values?.billingType === 1}
                        className="mr-1 pointer"
                        style={{ position: 'relative', top: '2px' }}
                        onChange={(e) => {
                          setFieldValue('billingType', 1);
                          const transportPlanningAir =
                            bookingData?.transportPlanning?.find((i) => {
                              return i?.transportPlanningModeId === 1;
                            }) || '';
                          setTransportPlanningData(transportPlanningAir);
                        }}
                      />
                      Air
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="billingType"
                        checked={values?.billingType === 2}
                        className="mr-1 pointer"
                        style={{ position: 'relative', top: '2px' }}
                        onChange={(e) => {
                          setFieldValue('billingType', 2);

                          const transportPlanningSea =
                            bookingData?.transportPlanning?.find((i) => {
                              return i?.transportPlanningModeId === 2;
                            }) || '';
                          setTransportPlanningData(transportPlanningSea);
                        }}
                      />
                      Sea
                    </label>
                  </>
                )} */}
              </div>
              <div>
                {!bookingData?.fcrnumber && (
                  <>
                    {' '}
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        saveHandler();
                      }}
                    >
                      Generate
                    </button>
                  </>
                )}

                {bookingData?.fcrnumber && (
                  <>
                    <button
                      onClick={handlePrint}
                      type="button"
                      className="btn btn-primary px-3 py-2"
                    >
                      <i
                        className="mr-1 fa fa-print pointer"
                        aria-hidden="true"
                      ></i>
                      Print
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              display: 'grid',
              gap: 10,
            }}
            ref={componentRef}
          >
            <div>
              <span>To :</span> <br />
              <span
                style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}
              >
                {bookingData?.consigneeName}
              </span>
              <br />
              <span>{bookingData?.consigneeAddress}</span> <br />
              <span>{bookingData?.consigneeContactPerson}</span>
              <br />
              <span>{bookingData?.consigneeContact}</span>
              <br />
            </div>
            <div
              style={{
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <span
                style={{
                  borderBottom: '1px solid #000000',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                TO WHOM IT MAY CONCERN
              </span>{' '}
              <br />
            </div>
            <div>
              <span
                style={{
                  borderBottom: '1px solid #000000',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                SHIPMENT REF. :
              </span>{' '}
              <br />
            </div>

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
                  <span style={{ padding: 2 }}>SHIPPER NAME</span>
                  <span style={{ padding: 2 }}>
                    : {bookingData?.shipperName}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>POL </span>
                  <span style={{ padding: 2 }}>
                    : {bookingData?.portOfLoading}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>POD</span>
                  <span style={{ padding: 2 }}>
                    : {bookingData?.portOfDischarge}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>INCOTERMS</span>
                  <span style={{ padding: 2 }}>: {bookingData?.incoterms}</span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>TRANSPORT CARRIER</span>
                  <span style={{ padding: 2 }}>
                    : {transportPlanningData?.airLineOrShippingLine ?? ''}
                  </span>
                </div>
                {/* <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>M.VSL/FLIGHT NAME</span>
                  <span style={{ padding: 2 }}>
                    : {transportPlanningData?.vesselName}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>F.VSL/FLIGHT NAME</span>
                  <span style={{ padding: 2 }}>
                    : {transportPlanningData?.vesselName}
                  </span>
                </div> */}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>MBL/MAWB NUM</span>
                  <span style={{ padding: 2 }}>
                    :
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
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>HBL/HAWB NUM</span>
                  <span style={{ padding: 2 }}>:{bookingData?.hblnumber}</span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>PALLET/CONTAINER NO.</span>
                  <span style={{ padding: 2 }}>
                    : {transportPlanningData?.noOfPallets} /{' '}
                    {transportPlanningData?.noOfContainer}
                  </span>
                </div>
              </div>
              {/* right side */}
              <div>
                <div
                  style={{
                    display: 'grid',
                    gap: 10,
                    paddingBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 3fr ',
                    }}
                  >
                    <span style={{ padding: 2 }}>L/C NO </span>
                    <span style={{ padding: 2 }}>
                      :
                      {bookingData?.objPurchase?.map((item, index) => {
                        return `${item?.lcnumber || ''}${
                          index < bookingData?.objPurchase?.length - 1
                            ? ','
                            : ''
                        }`;
                      })}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 3fr ',
                    }}
                  >
                    <span style={{ padding: 2 }}>L/C DATE </span>
                    <span style={{ padding: 2 }}>
                      :{' '}
                      {bookingData?.objPurchase?.map((item, index) => {
                        return `${
                          item?.lcdate &&
                          `${moment(item?.lcdate).format('DD MMM YYYY')}`
                        }${
                          index < bookingData?.objPurchase?.length - 1
                            ? ','
                            : ''
                        }`;
                      })}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 3fr ',
                    }}
                  >
                    <span style={{ padding: 2 }}>MODE</span>
                    <span style={{ padding: 2 }}>
                      : {bookingData?.modeOfTransport}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>M.VSL/FLIGHT NUM</span>
                  <span style={{ padding: 2 }}>
                    {' '}
                    :{' '}
                    {bookingData?.transportPlanning
                      ?.flatMap((item) =>
                        item?.airTransportRow?.map((row) => row?.flightNumber),
                      )
                      .join(', ')}
                  </span>
                </div>
                {/* <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr ',
              }}
            >
              <span style={{ padding: 2 }}>ATA</span>
              <span style={{ padding: 2 }}>: 31-12-2023</span>
            </div> */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>MBL/MAWB DATE</span>
                  <span style={{ padding: 2 }}>
                    {/* :{" "}
                    {bookingData?.bldate
                      ? moment(bookingData?.bldate).format("DD MMM YYYY")
                      : ""} */}
                    {bookingData?.seaMasterBlDate &&
                    bookingData?.airMasterBlDate ? (
                      <>
                        {moment(bookingData?.seaMasterBlDate).isValid() &&
                          moment(bookingData?.seaMasterBlDate).format(
                            'DD MMM YYYY',
                          )}{' '}
                        {bookingData?.airMasterBlDate
                          ? ', ' +
                              moment(bookingData?.airMasterBlDate).isValid() &&
                            moment(bookingData?.airMasterBlDate).format(
                              'DD MMM YYYY',
                            )
                          : ''}
                      </>
                    ) : (
                      (moment(bookingData?.seaMasterBlDate).isValid() &&
                        moment(bookingData?.seaMasterBlDate).format(
                          'DD MMM YYYY',
                        )) ||
                      (moment(bookingData?.airMasterBlDate).isValid() &&
                        moment(bookingData?.airMasterBlDate).format(
                          'DD MMM YYYY',
                        ))
                    )}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>HBL/HAWB DATE</span>
                  <span style={{ padding: 2 }}>
                    :{' '}
                    {bookingData?.hbldate
                      ? moment(bookingData?.hbldate).format('DD MMM YYYY')
                      : ''}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 3fr ',
                  }}
                >
                  <span style={{ padding: 2 }}>SEAL NUMBER</span>
                  <span style={{ padding: 2 }}>
                    : {bookingData?.fcrnumber || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <span>
              This is to certify that the freight for the above mentioned
              shipment is as under.
            </span>
            <p>FREIGHT:</p>
            <div
              style={{
                paddingLeft: 25,
              }}
            >
              <span>
                {values?.billingType === 2
                  ? 'Ocean Freight is '
                  : `Air Freight is `}
                {/* if mode "sea = 2" than rate and size show */}
                {rowClickData?.modeOfTransportId === 2 && (
                  <>
                    {sumOfRate?.map((item, index) => {
                      return `${item?.rate}/${item?.size} `;
                    })}
                  </>
                )}
                {/* if mode "air = 1" than rate show */}
                {[1, 5].includes(rowClickData?.modeOfTransportId) && (
                  <>{hblChargeableRate}</>
                )}
                {/* if mode "sea-air = 3" than rate show*/}
                {rowClickData?.modeOfTransportId === 3 && (
                  <>{seaAirChargeableRate}</>
                )}
              </span>{' '}
              <br />
              <span>
                {rowClickData?.modeOfTransportId === 2 && 'Total Container: '}
                {[1, 3].includes(rowClickData?.modeOfTransportId) &&
                  'Total Chargeable Weight:'}
                {/*modeOfTransportId 2 = sea  */}{' '}
                {rowClickData?.modeOfTransportId === 2 && (
                  <>
                    {sumOfRate?.map((item, index) => {
                      return `${item?.containerNo} x ${item?.size} `;
                    })}
                  </>
                )}
                {/* modeOfTransportId 1 = Air and 5=Air-ops */}
                {[1, 3].includes(rowClickData?.modeOfTransportId) && (
                  <>{totalChargeableWeight}</>
                )}
                {/* modeOfTransportId= 3 = sea-air */}
                {rowClickData?.modeOfTransportId === 3 && <>{totalKGS}</>}
              </span>{' '}
              <br />
              <span>
                So, Total{' '}
                {values?.billingType === 2 ? 'Ocean Freight' : `Air Freight`} is
                USD {/*modeOfTransportId 2 = sea  */}{' '}
                {rowClickData?.modeOfTransportId === 2 && (
                  <>
                    {' '}
                    {sumOfRate?.reduce((acc, item) => {
                      return acc + item?.total;
                    }, 0) || 0}
                  </>
                )}
                {/* modeOfTransportId 1 = Air and 5=air-ops */}
                {[1, 3].includes(rowClickData?.modeOfTransportId) && (
                  <>{totalChargeableWeight * hblChargeableRate || 0}</>
                )}
                {/* modeOfTransportId= 3 = sea-air */}
                {<>{totalKGS * seaAirChargeableRate || 0}</>}
              </span>{' '}
              <br />
              <span>
                Goods Description:{' '}
                {bookingData?.rowsData?.map((item, index) => {
                  return `${item?.descriptionOfGoods}${
                    index < bookingData?.rowsData?.length - 1 ? ',' : ''
                  }`;
                })}
              </span>{' '}
              <br />
            </div>
            <span style={{ paddingLeft: 10 }}>Thanks and Best Regards,</span>
            <span>Sincerely Yours</span>
            <div style={{ paddingTop: '5rem' }}>
              <span>For : Akij Logistics Limited</span> <br />
              <span>As Agents</span> <br />
            </div>
            <div style={{ paddingTop: '5rem' }}>
              <div
                style={{
                  borderTop: '1px solid #000000',
                  backgroundColor: '#000000',
                }}
              />
              <div
                style={{
                  display: 'grid',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <span>Akij Logistics Limited</span>
                <span>House - 5, Road - 6, Sector 1, Uttara, Dhaka</span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FreightCargoReceipt;
