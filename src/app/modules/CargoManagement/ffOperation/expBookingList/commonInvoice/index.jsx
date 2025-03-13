import moment from 'moment';
import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { imarineBaseUrl } from '../../../../../App';
import { amountToWords } from '../../../../_helper/_ConvertnumberToWord';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import * as Yup from 'yup';
import NewSelect from '../../../../_helper/_select';
import logisticsLogo from './logisticsLogo.png';
import './style.css';
const validationSchema = Yup.object().shape({
  collectionParty: Yup.object().shape({
    value: Yup.string().required('Party is required'),
    label: Yup.string().required('Party is required'),
  }),
});

const CommonInvoice = ({ rowClickData, isAirOperation }) => {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const [billingDataFilterData, setBillingDataFilterData] = React.useState([]);
  const formikRef = React.useRef(null);
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    ,
    getCargoBookingInvoice,
    cargoBookingInvoiceLoading,
    ,
  ] = useAxiosPost();
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const [paymentPartyListDDL, setPaymentPartyListDDL] = useState();
  const [invoiceNo, GeiInvoiceNo] = useAxiosGet();
  useEffect(() => {
    commonGetByIdHandler();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);
  const bookingData = {
    ...shipBookingRequestGetById,
  };

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

  const commonGetByIdHandler = () => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}&isAirOperation=${isAirOperation ||
          false}`,
        (resData) => {
          const billingDataList = resData?.billingData
            ?.filter((i) => {
              return (
                i.collectionPartyId &&
                (i?.isAirOperation || false) === (isAirOperation || false)
              );
            })
            ?.map((item) => {
              return {
                ...item,
                value: item?.collectionPartyId,
                label: item?.collectionParty,
                collectionPartyId: item?.collectionPartyId,
              };
            });
          const unique = [
            ...new Map(
              billingDataList.map((item) => [item['collectionPartyId'], item]),
            ).values(),
          ];
          setPaymentPartyListDDL(unique || []);
        },
      );
    }
  };
  const getInvoiceNo = (bookingRequestId, CusomerId) => {
    GeiInvoiceNo(
      `${imarineBaseUrl}/domain/ShippingService/GetInvoiceNo?BookingId=${bookingRequestId}&CusomerId=${CusomerId}`,
    );
  };

  const saveHandler = (values) => {
    console.log(values, 'values');
    const paylaod = {
      businessPartnerId: values?.collectionParty?.value || 0,
      businessPartnerName: values?.collectionParty?.label || '',
      accountId: profileData?.accountId || 0,
      unitId: selectedBusinessUnit?.value || 0,
      bookingDate: new Date(),
      bookingNumber: bookingData?.bookingRequestCode || '',
      paymentTerms: '',
      actionBy: profileData?.userId || 0,
      rowString: billingDataFilterData?.map((item) => {
        return {
          intHeadOfChargeid: item?.headOfChargeId,
          strHeadoffcharges: item?.headOfCharges,
          intCurrencyid: item?.currencyId || 0,
          strCurrency: item?.currency || '',
          numrate: 0,
          numconverstionrate: item?.exchangeRate || 0,
          strUom: '',
          numamount: item?.collectionActualAmount || 0,
          numvatAmount: 0,
          intBillingId: item?.billingId || 0,
        };
      }),
    };
    getCargoBookingInvoice(
      `${imarineBaseUrl}/domain/ShippingService/CargoBookingInvoice`,
      paylaod,
      () => {
        if (formikRef?.current) {
          formikRef.current.resetForm();
        }
      },
      true,
    );
  };

  const getCalculatedDummyAmount = () => {
    return billingDataFilterData?.reduce((acc, cur) => {
      return acc + (+cur?.collectionActualAmount || 0);
    }, 0);
  };
  const getDummyAmountInWords = () => {
    return amountToWords(
      billingDataFilterData?.reduce((acc, cur) => {
        return acc + (+cur?.collectionActualAmount || 0);
      }, 0) || 0,
    );
  };
  // filter by collectionPartyTypeId

  const invoiceTypeHandeler = (valueOption) => {
    const filterData = bookingData?.billingData?.filter((item) => {
      return (
        item?.collectionPartyId === valueOption?.value &&
        item?.collectionActualAmount &&
        !item?.invoiceId &&
        (item?.isAirOperation || false) === (isAirOperation || false)
      );
    });
    if (filterData?.length === 0) {
      const billGenerateFilterData = bookingData?.billingData?.filter(
        (item) => {
          return (
            item?.collectionPartyId === valueOption?.value &&
            item?.collectionActualAmount &&
            item?.invoiceId &&
            (item?.isAirOperation || false) === (isAirOperation || false)
          );
        },
      );
      setBillingDataFilterData(billGenerateFilterData);
    } else {
      setBillingDataFilterData(filterData);
    }
  };

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
  const transportPlanningAir =
    bookingData?.transportPlanning?.find((i) => {
      return [1, 5].includes(i?.transportPlanningModeId);
    }) || '';

  const transportPlanningSea =
    bookingData?.transportPlanning?.find((i) => {
      return i?.transportPlanningModeId === 2;
    }) || '';

  const groupBySize =
    transportPlanningSea?.containerDesc?.length > 0
      ? transportPlanningSea?.containerDesc.reduce((acc, obj) => {
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
    return {
      rate: rate,
    };
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        narration: '',
        collectionParty: '',
      }}
      validationSchema={validationSchema}
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
          <div>
            {/* Save button add */}
            <div className="d-flex justify-content-between align-items-center  py-2">
              <div className="col-lg-3 p-0">
                <NewSelect
                  name="collectionParty"
                  options={paymentPartyListDDL || []}
                  value={values?.collectionParty}
                  label="Partner"
                  onChange={(valueOption) => {
                    setFieldValue('collectionParty', valueOption);
                    getInvoiceNo(bookingRequestId, valueOption?.value);
                    invoiceTypeHandeler(valueOption);
                  }}
                  placeholder="Select Partner"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="d-flex justify-content-end">
                {invoiceNo?.length === 0 && (
                  <button
                    type="button"
                    className="btn btn-primary mr-1"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Generate
                  </button>
                )}

                {/* {invoiceNo?.length > 0 && ( */}
                <button
                  onClick={handlePrint}
                  type="button"
                  className="btn btn-primary px-3 py-2"
                >
                  <i className="mr-1 fa fa-print pointer" aria-hidden="true" />
                  Print
                </button>
                {/* )} */}
              </div>
            </div>
          </div>
          {(shipBookingRequestLoading || cargoBookingInvoiceLoading) && (
            <Loading />
          )}
          <div
            ref={componentRef}
            style={{
              fontSize: 11,
              display: 'grid',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
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
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {selectedBusinessUnit?.label}
                </span>
                <br />
                <span>House - 5, Road - 6, Sector 1, Uttara, Dhaka</span>
              </div>
            </div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                textAlign: 'center',
                backgroundColor: '#DDE3E8',
                padding: 2,
                border: '1px solid #000000',
              }}
            >
              {bookingData?.modeOfTransportId === 4 ? (
                'Freight Invoice: '
              ) : (
                <>
                  {billingDataFilterData?.[0]?.collectionPartyType} INVOICE :{' '}
                </>
              )}
              {invoiceNo || 'N/A'}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '7fr .5fr 7fr',
                // border: "1px solid #000000",
              }}
            >
              <div
                style={{
                  border: '1px solid #000000',
                }}
              >
                <div style={{ padding: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>
                    {/* {bookingData?.consigneeName} */}
                    {values?.collectionParty?.label}
                  </span>
                  <br />
                  <span>
                    {/* {bookingData?.consigneeAddress},{bookingData?.consigState},
                    {bookingData?.consigCountry} */}
                    {values?.collectionParty?.collectionPartyAddress}
                  </span>
                  <br />
                </div>
              </div>
              <div />
              <div style={{ border: '1px solid #000000' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr ',
                  }}
                >
                  <span
                    style={{
                      borderBottom: '1px solid #000000',
                      borderRight: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                      backgroundColor: '#DDE3E8',
                    }}
                  >
                    {' '}
                    INVOICE DATE
                  </span>
                  <span
                    style={{
                      borderBottom: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                    }}
                  >
                    {bookingData?.invoiceDate
                      ? moment(bookingData?.invoiceDate).format('YYYY-MM-DD')
                      : 'N/A'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr ',
                  }}
                >
                  <span
                    style={{
                      borderBottom: '1px solid #000000',
                      borderRight: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                      backgroundColor: '#DDE3E8',
                    }}
                  >
                    SHIPMENT NO
                  </span>
                  <span
                    style={{
                      borderBottom: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                    }}
                  >
                    {bookingData?.hblnumber}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr ',
                  }}
                >
                  <span
                    style={{
                      borderBottom: '1px solid #000000',
                      borderRight: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                      backgroundColor: '#DDE3E8',
                    }}
                  >
                    SALES ORDER NO
                  </span>
                  <span
                    style={{
                      borderBottom: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                    }}
                  >
                    {' '}
                    {bookingData?.bookingRequestCode}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr ',
                  }}
                >
                  <span
                    style={{
                      borderBottom: '1px solid #000000',
                      borderRight: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                      backgroundColor: '#DDE3E8',
                    }}
                  >
                    DUE DATE
                  </span>
                  <span
                    style={{
                      borderBottom: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                    }}
                  >
                    {bookingData?.createdAt
                      ? moment(bookingData?.createdAt).format('YYYY-MM-DD')
                      : 'N/A'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr ',
                  }}
                >
                  <span
                    style={{
                      borderRight: '1px solid #000000',
                      padding: 2,
                      paddingBottom: 20,
                      fontWeight: 600,
                      backgroundColor: '#DDE3E8',
                    }}
                  >
                    TERMS
                  </span>
                  <span style={{ padding: 2, fontWeight: 600 }}>
                    {' '}
                    Pay able immediately Due net{' '}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr ',
                  }}
                >
                  <span
                    style={{
                      borderTop: '1px solid #000000',
                      borderRight: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                      backgroundColor: '#DDE3E8',
                    }}
                  >
                    Trade
                  </span>
                  <span
                    style={{
                      borderTop: '1px solid #000000',
                      padding: 2,
                      fontWeight: 600,
                    }}
                  >
                    Export
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div
                style={{
                  border: '1px solid #000000',
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: '#DDE3E8',
                    padding: 2,
                    borderBottom: '1px solid #000000',
                  }}
                >
                  SHIPMENT DETAILS
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr 1fr ',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      padding: 2,
                      borderRight: '1px solid #000000',
                    }}
                  >
                    <span>Shipper</span>
                    <br />
                    <span>Consignee</span>
                    <br />
                    <span>Port of Loading</span>
                    <br />
                    <span>Port of Discharge</span>
                    <br />
                    <span>IncoTerms</span>
                    <br />
                    <span>ETD</span>
                    <br />
                    {bookingData?.modeOfTransportId !== 4 && (
                      <>
                        {' '}
                        <span>Master Number</span>
                        <br />
                      </>
                    )}

                    {bookingData?.modeOfTransportId === 4 ? (
                      <>
                        <span>Consignment Number</span>
                        <br />
                      </>
                    ) : (
                      <>
                        {' '}
                        <span>House Number</span>
                        <br />
                      </>
                    )}
                    <span>ATA</span>
                  </div>
                  <div
                    style={{
                      textTransform: 'uppercase',
                      padding: 2,
                      borderRight: '1px solid #000000',
                    }}
                  >
                    <span>{bookingData?.shipperName}</span>
                    <br />
                    <span>{bookingData?.consigneeName}</span>
                    <br />
                    <span>{bookingData?.portOfLoading}</span>
                    <br />
                    <span>{bookingData?.portOfDischarge}</span>
                    <br />
                    <span>{bookingData?.incoterms}</span>
                    <br />
                    <span>
                      {bookingData?.dateOfRequest
                        ? moment(bookingData?.dateOfRequest).format(
                            'YYYY-MM-DD',
                          )
                        : 'N/A'}
                    </span>
                    <br />
                    {bookingData?.modeOfTransportId !== 4 && (
                      <>
                        <span>
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
                        </span>
                        <br />
                      </>
                    )}

                    <span>{bookingData?.hblnumber || 'N/A'}</span>
                    <br />
                    <span>
                      {bookingData?.arrivalDateTime
                        ? moment(bookingData?.arrivalDateTime).format(
                            'YYYY-MM-DD HH:mm A',
                          )
                        : 'N/A'}
                    </span>
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      padding: 2,
                      borderRight: '1px solid #000000',
                    }}
                  >
                    <span>LC No.</span>
                    <br />
                    <span>LC Date</span>
                    <br />
                    <span>Place of Delivery</span>
                    <br />
                    <span>Commodity</span>
                    <br />
                    <span>Flight</span>
                    <br />
                    {bookingData?.modeOfTransportId !== 4 && (
                      <>
                        <span>Master Date</span>
                        <br />
                      </>
                    )}

                    {bookingData?.modeOfTransportId === 4 ? (
                      <>
                        <span>Consignment Date</span>
                        <br />
                      </>
                    ) : (
                      <>
                        <span>House Date</span>
                        <br />
                      </>
                    )}
                    <span>Volume</span>
                    <br />
                    <span>Chrg. Wt</span>
                    <br />
                    <span>Rate</span>
                  </div>
                  <div style={{ padding: 2 }}>
                    <span>{bookingData?.lcNo ?? 'N/A'} </span>
                    <br />
                    <span>
                      {bookingData?.lcDate
                        ? moment(bookingData?.lcDate).format(
                            'DD MMM YYYY HH:mm A',
                          )
                        : 'N/A'}
                    </span>
                    <br />
                    <span>{bookingData?.pickupPlace}</span>
                    <br />
                    <span></span>
                    <br />
                    <span></span>
                    <br />
                    {bookingData?.modeOfTransportId !== 4 && (
                      <>
                        <span>
                          {bookingData?.seaMasterBlCode &&
                          bookingData?.airMasterBlCode ? (
                            <>
                              {bookingData?.seaMasterBlDate &&
                                moment(bookingData?.seaMasterBlDate).format(
                                  'YYYY-MM-DD',
                                )}
                              {', '}
                              {bookingData?.airMasterBlDate &&
                                moment(bookingData?.airMasterBlDate).format(
                                  'YYYY-MM-DD',
                                )}{' '}
                            </>
                          ) : bookingData?.seaMasterBlDate ||
                            bookingData?.airMasterBlDate ? (
                            moment(
                              bookingData?.seaMasterBlDate ||
                                bookingData?.airMasterBlDate,
                            ).format('YYYY-MM-DD')
                          ) : (
                            ''
                          )}
                        </span>
                        <br />
                      </>
                    )}

                    <span>
                      {bookingData?.hbldate
                        ? moment(bookingData?.hbldate).format('YYYY-MM-DD')
                        : 'N/A'}
                    </span>
                    <br />
                    <span>{totalVolumetricWeight}</span>
                    <br />
                    <span>{totalChargeableWeight}</span>
                    <br />
                    <span>
                      {transportPlanningAir?.rate}
                      {sumOfRate?.map((item) => item?.rate).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <table
              border="1"
              cellPadding="5"
              cellSpacing="0"
              style={{ width: '100%' }}
            >
              <thead>
                <tr style={{ backgroundColor: '#DDE3E8' }}>
                  <th
                    style={{
                      width: '30px',
                    }}
                  >
                    SL
                  </th>
                  <th>Attribute</th>
                  <th>Amount</th>
                  {/* <th>Actual Amount</th> */}
                </tr>
              </thead>
              <tbody>
                {values?.collectionParty?.value &&
                  billingDataFilterData?.map((row, index) => (
                    <tr key={row?.headOfChargeId}>
                      <td style={{ textAlign: 'right' }}> {index + 1} </td>
                      <td className="align-middle">
                        <label>{row?.headOfCharges}</label>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {row?.collectionActualAmount}
                      </td>
                      {/* <td style={{ textAlign: 'right' }}>
                    {row?.collectionActualAmount}
                  </td> */}
                    </tr>
                  ))}
                <tr
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: '#DDE3E8',
                    textAlign: 'right',
                  }}
                >
                  <td colSpan="2"> Total Amount</td>
                  <td>
                    {' '}
                    {billingDataFilterData?.[0]?.currency}{' '}
                    {getCalculatedDummyAmount()}
                  </td>
                  {/* <td> {getCalculatedActualAmount()}</td> */}
                </tr>
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      textAlign: 'left',
                    }}
                  >
                    {' '}
                    Amount in Words: {billingDataFilterData?.[0]?.currency}{' '}
                    {getDummyAmountInWords()}
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                border: '1px solid #000',
              }}
            >
              <div>
                <div
                  style={{
                    backgroundColor: '#DDE3E8',
                    padding: 2,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Transfer Fund to
                </div>
                <div
                  style={{
                    padding: 2,
                  }}
                >
                  <div>
                    <span>Standard Chartered Bank</span>
                    <br />
                    <span>A/C Name: Akij Logistics Ltd.</span>
                    <br />
                    <span>A/C No. 01-8940247-01</span>
                    <br />
                    <span>Branch: Gulshan</span>
                    <br />
                    <span>Routing: 215261726</span>
                    <br />
                    <span>Swift code: SCBLBDDX</span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  borderLeft: '1px solid #000000',
                }}
              >
                <div
                  style={{
                    padding: 2,
                    paddingBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Beneficiary Details:
                  </span>
                  <br />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {selectedBusinessUnit?.label}
                  </span>
                  <br />
                  <span>House - 5, Road - 6, Sector 1, Uttara, Dhaka</span>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <p>Prepared By: {profileData?.userName} </p>
              {/* <p>Prepared By: </p> */}
            </div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Special Note:</p>
            <span style={{ fontSize: 14, maxWidth: '70%' }}>
              {' '}
              Payment to be made by Payment Order/Electronic transfer only in
              favor of Akij Logistics Ltd. No query/claim will be entertained
              after 07 days from the date of receipt of Invoice. Interest @ 2%
              pe rMonth is chargeable on bill not paid on presentation.
            </span>

            <p style={{ fontSize: 14, fontWeight: 600 }}>Note:</p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                textAlign: 'center',
                backgroundColor: '#DDE3E8',
                padding: 2,
                border: '1px solid #000000',
              }}
            >
              {' '}
              This is a system generated invoice and it does not require any
              company chop and signature
            </p>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CommonInvoice;
