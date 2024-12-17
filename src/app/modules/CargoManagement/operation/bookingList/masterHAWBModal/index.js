import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { useReactToPrint } from 'react-to-print';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import InputField from '../../../../_helper/_inputField';
import NewSelect from '../../../../_helper/_select';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import './HAWBFormat.css';
import logisticsLogo from './logisticsLogo.png';
const validationSchema = Yup.object().shape({});


const MasterHBAWModal = ({
  selectedRow,
  isPrintView
}) => {
  const [hbawListData, getHBAWList,] = useAxiosPost();

  const [isPrintViewMode, setIsPrintViewMode] = useState(isPrintView || false);
  const formikRef = React.useRef();

  const bookingData = {}
  const totalGrossWeightKG = bookingData?.rowsData?.reduce(
    (acc, item) => acc + (+item?.totalGrossWeightKG || 0),
    0,
  );

  const totalVolumetricWeight = bookingData?.rowsData?.reduce(
    (acc, item) => acc + (+item?.totalVolumetricWeight || 0),
    0,
  );

  const totalNumberOfPackages = bookingData?.rowsData?.reduce(
    (acc, item) => acc + (+item?.totalNumberOfPackages || 0),
    0,
  );

  const totalGrossWeight =
    totalVolumetricWeight > totalGrossWeightKG
      ? totalVolumetricWeight
      : totalGrossWeightKG;
  const saveHandler = (values, cb) => { }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Master HBAW`,
    pageStyle: `
        @media print {
          body {
            -webkit-print-color-adjust: exact;

          }
          @page {
            size: portrait !important;
            margin: 50px 30px 30px 30px !important;
          }
        }
      `,
  });
  React.useEffect(() => {
    const payload = selectedRow?.map((item) => {
      return {
        bookingReqestId: item?.bookingRequestId,
      };
    });
    getHBAWList(
      `${imarineBaseUrl}/domain/ShippingService/GetHBLList`,
      payload,
      (hbawRestData) => {
        // // pickupPlaceDDL
        // const pickupPlace = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.pickupPlace,
        //   };
        // });
        // setPickupPlaceDDL(pickupPlace);
        // // portOfLoadingDDL
        // const portOfLoading = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.portOfLoading,
        //   };
        // });
        // setPortOfLoadingDDL(portOfLoading);

        // // finalDestinationAddressDDL
        // const finalDestinationAddress = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.finalDestinationAddress,
        //   };
        // });
        // setFinalDestinationAddressDDL(finalDestinationAddress);

        // // portOfDischargeDDL
        // const portOfDischarge = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.portOfDischarge,
        //   };
        // });
        // setPortOfDischargeDDL(portOfDischarge);
        // // vesselNameDDL
        // const vesselName = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.transportPlanning?.vesselName || '',
        //   };
        // });
        // setVesselNameDDL(vesselName);

        // // voyagaNoDDL
        // const voyagaNo = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.transportPlanning?.voyagaNo || '',
        //   };
        // });
        const firstIndex = hbawRestData[0];
        const totalNumberOfPackages = hbawRestData?.reduce(
          (subtotal, item) => {
            const rows = item?.rowsData || [];
            const packageSubtotal = rows?.reduce(
              (sum, row) => sum + (row?.totalNumberOfPackages || 0),
              0,
            );
            return subtotal + packageSubtotal;
          },
          0,
        );
        const strDescriptionOfPackagesAndGoods = hbawRestData
          ?.map((item) =>
            item?.rowsData
              .map((row) => {
                const description = row?.descriptionOfGoods;
                const hsCode = `H.S Code: ${row?.hsCode}`;
                const poNumbers = `Po No: ${row?.dimensionRow
                  .map((dim) => dim?.poNumber)
                  .join(', ')}`;
                const styles = `Style: ${row?.dimensionRow
                  .map((dim) => dim?.style)
                  .join(',')}`;
                const colors = `Color: ${row?.dimensionRow
                  .map((dim) => dim?.color)
                  .join(',')}`;
                return `${description}\n ${hsCode}\n ${poNumbers}\n ${styles}\n ${colors}\n`;
              })
              .join('\n'),
          )
          .join('\n');
        const subtotalGrossWeight = hbawRestData?.reduce((subtotal, item) => {
          const rows = item?.rowsData || [];
          const weightSubtotal = rows?.reduce(
            (sum, row) => sum + (row?.totalGrossWeightKG || 0),
            0,
          );
          return subtotal + weightSubtotal;
        }, 0);
        const totalVolumeCBM = hbawRestData?.reduce((subtotal, item) => {
          const rows = item?.rowsData || [];
          const volumeSubtotal = rows?.reduce(
            (sum, row) => sum + (row?.totalVolumeCBM || 0),
            0,
          );
          return subtotal + volumeSubtotal;
        }, 0);


        const obj = {
          strConsignee: `${firstIndex?.freightAgentReference ?? ""}\n${firstIndex?.deliveryAgentDtl?.zipCode ?? ""}, ${firstIndex?.deliveryAgentDtl?.state ?? ""}, ${firstIndex?.deliveryAgentDtl?.city ?? ""}, ${firstIndex?.deliveryAgentDtl?.country ?? ""}, ${firstIndex?.deliveryAgentDtl?.address ?? ""}`,
          strGsaName: "",
          strIataCode: "",
          strAccountNumber: "",
          strAirportOfDeparture: "",
          strReferenceNumber: "",
          strOptionalShippingInformation: "",
          strByFirstCarrier: "",
          strAirportOfDestination: "",
          strFlightDate: "",
          strAmountOfInsurance: "",
          strHandlingInformation: "",
          strTotalNumberOfPackages: totalNumberOfPackages,
          strDescriptionOfPackagesAndGoods: strDescriptionOfPackagesAndGoods,
          strGrossWeightOrMeasurement: `${subtotalGrossWeight} Kgs\n${totalVolumeCBM} CBM`,



        };
        Object.keys(obj).forEach((key) => {
          formikRef.current.setFieldValue(key, obj[key]);
        });
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end my-1">
                  {isPrintViewMode ? (
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
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="hawbWrapper" ref={componentRef}>
                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <div className="masterHawbContainer">
                    <div className="shipperAandConsigneeInfo">
                      <div className="top borderBottom">
                        <div className="leftSide borderRight">
                          <div className="shipperInfo borderBottom">
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr'
                            }}>
                              <div>
                                <p className="textTitle">Shipper's Name and Address:</p>
                                <p>TO THE ORDER OF</p>
                                <p>
                                  Akij Logistics Limited
                                </p>
                              </div>
                              <div className='borderLeft borderBottom p-2' >
                                <p className="textTitle">Company Info:</p>
                                <p> Bir Uttam Mir Shawkat Sarak, Dhaka 1208</p>

                              </div>
                            </div>
                          </div>
                          <div className="consigneeInfo borderBottom">
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr'
                            }}>
                              <div>
                                <p className="textTitle">Consignee's Name and Address:</p>
                                <p>TO THE ORDER OF</p>

                              </div>
                              <div className='borderLeft borderBottom p-2' >
                                <p className="textTitle">Delivery Agent:</p>
                                {
                                  isPrintView ? (

                                    <p>
                                      {values?.strConsignee
                                        ? values?.strConsignee
                                          ?.split('\n')
                                          .map((item, index) => {
                                            return (
                                              <>
                                                {item}
                                                <br />
                                              </>
                                            );
                                          })
                                        : ''}
                                    </p>
                                  ) : (
                                    <textarea
                                      name="strConsignee"
                                      value={values?.strConsignee}
                                      rows={4}
                                      cols={40}
                                      onChange={(e) => {
                                        setFieldValue(
                                          'strConsignee',
                                          e.target.value,
                                        );
                                      }}
                                    />
                                  )
                                }
                              </div>
                            </div>
                          </div>
                          {/* GSA Name */}
                          <div>
                            <div style={{
                              height: '70px',
                              borderBottom: '1px solid #000'
                            }}
                            >
                              <p className="textTitle">GSA Name:</p>
                              {isPrintViewMode ? (
                                <>
                                  <p>{values?.strGsaName || ''}</p>
                                </>
                              ) : (
                                <>
                                  {' '}
                                  <div className="col-lg-12">
                                    <NewSelect
                                      name="strGsaName"
                                      options={[]}
                                      value={
                                        values?.strGsaName
                                          ? {
                                            value: 0,
                                            label: values?.strGsaName,
                                          }
                                          : ''
                                      }
                                      label=""
                                      onChange={(valueOption) => {
                                        setFieldValue(
                                          'strGsaName',
                                          valueOption?.label,
                                        );
                                      }}
                                      errors={errors}
                                      touched={touched}
                                      isCreatableSelect={true}
                                    />
                                  </div>
                                </>
                              )}
                            </div>

                            <div style={{
                              height: "60px"
                            }}>
                              <div style={{ display: 'flex', height: '100%' }}>
                                <div
                                  className="borderRight"
                                  style={{ width: '50%' }}
                                >
                                  <p className="textTitle">Agent IATA Code</p>
                                  {isPrintViewMode ? (
                                    <>
                                      <p>{values?.strIataCode || ''}</p>
                                    </>
                                  ) : (
                                    <>
                                      {' '}
                                      <div className="col-lg-12">
                                        <NewSelect
                                          name="strIataCode"
                                          options={[]}
                                          value={
                                            values?.strIataCode
                                              ? {
                                                value: 0,
                                                label: values?.strIataCode,
                                              }
                                              : ''
                                          }
                                          label=""
                                          onChange={(valueOption) => {
                                            setFieldValue(
                                              'strIataCode',
                                              valueOption?.label,
                                            );
                                          }}
                                          errors={errors}
                                          touched={touched}
                                          isCreatableSelect={true}
                                        />
                                      </div>
                                    </>
                                  )}

                                </div>
                                <div style={{ width: '50%' }}>
                                  <p className="textTitle ">Account Number</p>
                                  {isPrintViewMode ? (
                                    <>
                                      <p>{values?.strAccountNumber || ''}</p>
                                    </>
                                  ) : (
                                    <>
                                      {' '}
                                      <div className="col-lg-12">
                                        <NewSelect
                                          name="strAccountNumber"
                                          options={[]}
                                          value={
                                            values?.strAccountNumber
                                              ? {
                                                value: 0,
                                                label: values?.strAccountNumber,
                                              }
                                              : ''
                                          }
                                          label=""
                                          onChange={(valueOption) => {
                                            setFieldValue(
                                              'strAccountNumber',
                                              valueOption?.label,
                                            );
                                          }}
                                          errors={errors}
                                          touched={touched}
                                          isCreatableSelect={true}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                        <div className="rightSide">
                          <div className="rightSideTop">
                            <div>
                              <p className="textTitle">Not Negotiable</p>
                              <h6 className="airWayBillTitle">AIR WAYBILL</h6>
                              <p>(Air Consigniment Note)</p>
                              <p>Issued by</p>
                            </div>
                            <div>
                              <img src={logisticsLogo} alt="barcode" />
                              <p>
                                <b>Akij Logistics Limited</b>
                              </p>
                            </div>
                          </div>
                          <div className="rightSideBottom" />
                          <div className="rightSideMiddle borderBottom" style={{ paddingBottom: '8px' }}>
                            <p className="rightSideMiddleTitle">
                              Copies 1,2 and 3 of this Air Waybill arc originals and have
                              the same validity
                            </p>
                            <p className="rightSideMiddleContent">
                              It is agreed that the goods described herein are accepted in
                              apparent good order and condition (except as noted) for
                              carriage SUBJECT TO THE CONDITIONS OF CONTRACT ON THE REVERSE
                              HEREOF. ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING
                              ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY
                              INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER, AND SHIPPER
                              AGREES THAT THE SHIPMENT MAY BE CARRIED VIA INTERMEDIATE
                              STOPPING PLACES WHICH THE CARRIER DEEMS APPROPRIATE. THE
                              SHIPPER'S ATTENTION IS DRAWN TO THE NOTICE CONCERNING
                              CARRIER·s LIMITATION OF LIABILITY. Shipper may increase such
                              limitation of liabHity by declaring a higher value for
                              carriage and paying a suppfemental charge if required.
                            </p>
                          </div>
                          <div className="rightSideButtom">
                            <div >
                              <p className="textTitle">Accounting Information</p>
                              <div className="text-center">
                                <br />
                                <h2>
                                  FREIGHT{' '}
                                  {['exw'].includes(bookingData?.incoterms) &&
                                    'COLLECT EXW'}
                                  {['fca', 'fob'].includes(bookingData?.incoterms) &&
                                    'COLLECT'}
                                  {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms) &&
                                    'PREPAID'}
                                  {['dap', 'ddp', 'ddu'].includes(bookingData?.incoterms) &&
                                    'COLLECT DAP/DDP/DDU'}
                                  {['other'].includes(bookingData?.incoterms) && 'COLLECT'}
                                </h2>
                                <br />

                              </div>
                            </div>


                          </div>
                        </div>
                      </div>
                      <div className='borderBottom' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '50px' }}>
                        <div className="borderRight">
                          <div>
                            <p className="textTitle">
                              Airport of Departure and Requested Routing
                            </p>
                            {isPrintViewMode ? (
                              <>
                                <p>{values?.strAirportOfDeparture || ''}</p>
                              </>
                            ) : (
                              <>
                                {' '}
                                <div className="col-lg-12">
                                  <NewSelect
                                    name="strAirportOfDeparture"
                                    options={[]}
                                    value={
                                      values?.strAirportOfDeparture
                                        ? {
                                          value: 0,
                                          label: values?.strAirportOfDeparture,
                                        }
                                        : ''
                                    }
                                    label=""
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        'strAirportOfDeparture',
                                        valueOption?.label,
                                      );
                                    }}
                                    errors={errors}
                                    touched={touched}
                                    isCreatableSelect={true}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '50px' }}>
                          <div className='borderRight'>
                            <p className=" textTitle">Reference Number</p>
                            {
                              isPrintViewMode ? (
                                <>
                                  <p>{values?.strReferenceNumber || ''}</p>
                                </>
                              ) : (
                                <>
                                  {' '}
                                  <div className="col-lg-12">
                                    <InputField
                                      name="strReferenceNumber"
                                      value={values?.strReferenceNumber}
                                      type="text"
                                      onChange={(e) => {
                                        setFieldValue(
                                          'strReferenceNumber',
                                          e.target.value,
                                        );
                                      }}
                                    />
                                  </div>
                                </>
                              )
                            }
                          </div>
                          <div>
                            <p className="textTitle">Optional Shipping Information</p>
                            {
                              isPrintViewMode ? (
                                <>
                                  <p>{values?.strOptionalShippingInformation || ''}</p>
                                </>
                              ) : (
                                <>
                                  {' '}
                                  <div className="col-lg-12">
                                    <textarea
                                      name="strOptionalShippingInformation"
                                      value={values?.strOptionalShippingInformation}
                                      onChange={(e) => {
                                        setFieldValue(
                                          'strOptionalShippingInformation',
                                          e.target.value,
                                        );
                                      }
                                      }
                                    />
                                  </div>
                                </>
                              )
                            }
                          </div>
                        </div>
                        <div />
                      </div>
                      <div className="top borderBottom airInfo">
                        <div className="leftSide borderRight">
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '3fr 2fr',
                              minHeight: '100%',
                            }}
                          >
                            <div className='borderRight'
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 4fr',
                              }}

                            >
                              <div className='borderRight'>
                                <p className='textTitle'>  To</p>

                              </div>
                              <div>
                                <p className='textTitle'>
                                  By First Carrier (Routing and Destination)
                                  {
                                    isPrintViewMode ? (
                                      <>
                                        <p>{values?.strByFirstCarrier || ''}</p>
                                      </>
                                    ) : (
                                      <>
                                        {' '}
                                        <div className="col-lg-12">
                                          <textarea
                                            name="strByFirstCarrier"
                                            value={values?.strByFirstCarrier}
                                            onChange={(e) => {
                                              setFieldValue(
                                                'strByFirstCarrier',
                                                e.target.value,
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )
                                  }
                                </p>
                              </div>
                            </div>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                              }}
                            >
                              <div className='borderRight'>
                                <p className='textTitle'>To</p>
                              </div>
                              <div className='borderRight'>
                                <p className='textTitle'>By</p>
                              </div>
                              <div className='borderRight'>
                                <p className='textTitle'>To</p>
                              </div>
                              <div>
                                <p className='textTitle'>By</p>
                              </div>

                            </div>
                          </div>
                        </div>
                        <div className="rightSide">
                          <div className="rightSideColumnOne borderRight">
                            <div style={{ display: 'flex', height: '100%' }}>
                              <div
                                style={{ display: 'flex', height: '100%' }}
                                className="commonWithOne borderRight"
                              >
                                <div className="hawbCurrency borderRight">
                                  <div className='borderRight'>
                                    <p className="textTitle">Currency</p>
                                    <p>{bookingData?.currency} </p>
                                  </div>
                                  <div>
                                    <p className="textTitle">CHGS Code</p>
                                  </div>
                                </div>
                                <div
                                  className="air-flight-info"
                                  style={{
                                    width: '100%',
                                  }}
                                >
                                  <div className="air-flight-catagory">
                                    <p className="borderBottom textTitle">WT/VAL</p>
                                    <div style={{ display: 'flex', height: '100%' }}>
                                      <p
                                        className="borderRight textTitle"
                                        style={{
                                          width: '50%',
                                        }}
                                      >
                                        {['cif', 'cpt', 'cfr'].includes(
                                          bookingData?.incoterms,
                                        )
                                          ? 'PPD'
                                          : ''}
                                      </p>
                                      <p
                                        className="textTitle"
                                        style={{
                                          width: '50%',
                                        }}
                                      >
                                        {['cif', 'cpt', 'cfr'].includes(
                                          bookingData?.incoterms,
                                        )
                                          ? ''
                                          : 'CCX'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="air-flight-info"
                                style={{
                                  flex: 1,
                                }}
                              >
                                <div className="air-flight-catagory">
                                  <p className="borderBottom textTitle">Other</p>
                                  <div style={{ display: 'flex', height: '100%' }}>
                                    <p
                                      className="borderRight textTitle"
                                      style={{
                                        width: '50%',
                                      }}
                                    >
                                      {['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      )
                                        ? 'PPD'
                                        : ''}
                                    </p>
                                    <p
                                      className="textTitle"
                                      style={{
                                        width: '50%',
                                      }}
                                    >
                                      {['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      )
                                        ? ''
                                        : 'CCX'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              flex: 1,
                            }}
                          >
                            <div style={{ display: 'flex', height: '100%' }}>
                              <div
                                className="borderRight"
                                style={{
                                  width: '50%',
                                }}
                              >
                                <p className="textTitle">Declared Value for Carriage</p>
                              </div>
                              <div
                                style={{
                                  width: '50%',
                                }}
                              >
                                <p className="textTitle">Declared Value for Customs</p>
                                <p>
                                  <b>
                                    {bookingData?.invoiceValue
                                      ? bookingData?.invoiceValue
                                      : 'AS PER INV'}
                                  </b>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div />
                      </div>

                      <div className="top borderBottom airInfo">
                        <div className="leftSide borderRight">
                          <div style={{ display: 'flex', height: '100%' }}>
                            <div
                              className="air-destination-info borderRight"
                              style={{ width: '50%' }}
                            >
                              <p className="textTitle">Airport of Destination</p>
                              {
                                isPrintViewMode ? (
                                  <>
                                    <p>{values?.strAirportOfDestination || ''}</p>
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <div className="col-lg-12">
                                      <NewSelect
                                        name="strAirportOfDestination"
                                        options={[]}
                                        value={
                                          values?.strAirportOfDestination
                                            ? {
                                              value: 0,
                                              label: values?.strAirportOfDestination,
                                            }
                                            : ''
                                        }
                                        label=""
                                        onChange={(valueOption) => {
                                          setFieldValue(
                                            'strAirportOfDestination',
                                            valueOption?.label,
                                          );
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        isCreatableSelect={true}
                                      />
                                    </div>
                                  </>
                                )
                              }
                            </div>
                            <div style={{ width: '50%' }}>
                              <div style={{ display: 'flex', height: '100%' }}>
                                <div className="borderRight" style={{ width: '50%' }}>
                                  <p className="textTitle ">Flight/Date</p>
                                  {
                                    isPrintViewMode ? (
                                      <>
                                        <p>{values?.strFlightDate || ''}</p>
                                      </>
                                    ) : (
                                      <>
                                        {' '}
                                        <div className="col-lg-12">
                                          <InputField
                                            name="strFlightDate"
                                            value={values?.strFlightDate}
                                            type="date"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'strFlightDate',
                                                e.target.value,
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )
                                  }
                                </div>
                                <div className="" style={{ width: '50%' }}>
                                  <p className="textTitle ">Flight/Date</p>
                                  {
                                    isPrintViewMode ? (
                                      <>
                                        <p>{values?.strFlightDate || ''}</p>
                                      </>
                                    ) : (
                                      <>
                                        {' '}
                                        <div className="col-lg-12">
                                          <InputField
                                            name="strFlightDate"
                                            value={values?.strFlightDate}
                                            type="date"
                                            onChange={(e) => {
                                              setFieldValue(
                                                'strFlightDate',
                                                e.target.value,
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rightSide">
                          <div style={{ display: 'flex' }}>
                            <div className="amountofInsurance borderRight commonWithOne">
                              <p className="textTitle">Amount of Insurance</p>
                              {
                                isPrintViewMode ? (
                                  <>
                                    <p>{values?.strAmountOfInsurance || ''}</p>
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <div className="col-lg-12">
                                      <InputField
                                        name="strAmountOfInsurance"
                                        value={values?.strAmountOfInsurance}
                                        type="text"
                                        onChange={(e) => {
                                          setFieldValue(
                                            'strAmountOfInsurance',
                                            e.target.value,
                                          );
                                        }}
                                      />
                                    </div>
                                  </>
                                )
                              }
                            </div>
                            <div>
                              <p>
                                INSURANCE-if Carrier offers insurance and such insurance is
                                requested in accordance with condition on reverse hereof,
                                indicate amount to be insured in figures in box marked
                                amount of insurance
                              </p>
                            </div>
                          </div>
                        </div>
                        <div />
                      </div>
                      <div style={{ minHeight: 50 }} className="borderBottom">
                        <p className="textTitle">Handling Information</p>
                        {
                          isPrintViewMode ? (
                            <>
                              <p>{values?.strHandlingInformation || ''}</p>
                            </>
                          ) : (
                            <>
                              {' '}
                              <div className="col-lg-12">
                                <textarea
                                  name="strHandlingInformation"
                                  value={values?.strHandlingInformation}
                                  onChange={(e) => {
                                    setFieldValue(
                                      'strHandlingInformation',
                                      e.target.value,
                                    );
                                  }}
                                />
                              </div>
                            </>
                          )
                        }
                      </div>
                      {/* cargo info */}
                      <div className="cargoInfo borderBottom">
                        <div>
                          <div
                            style={{ display: 'flex', textAlign: 'center' }}
                            className="borderBottom textTitle"
                          >
                            <div className="noPiecesRcp borderRight">
                              <p>No Of Pieces RCP</p>
                            </div>
                            <div className="grossWeight borderRight">
                              <p>Gross Weight</p>
                            </div>
                            <div className="kgIB borderRight">
                              <p>KG IB</p>
                            </div>
                            <div className="grossWeight borderRight">
                              <p>Rate Class / Community Item No</p>
                            </div>

                            <div className="chargeableWeight borderRight">
                              <p>Chargeable Weight</p>
                            </div>
                            <div className="rateAndCharge borderRight">
                              <p>Rate</p>
                            </div>
                            <div className="total borderRight">
                              <p>Total</p>
                            </div>
                            <div className="natureandQuantityofGoods">
                              <p>
                                Nature and Quantity of Goods <br />
                                (incl, Dimensions or volume)
                              </p>
                            </div>
                          </div>
                        </div>
                        <div style={{ height: '100%', fontWeight: '500' }}>
                          <div style={{ display: 'flex', height: '100%' }}>
                            <div
                              className="noPiecesRcp borderRight"
                              style={{
                                position: 'relative',
                              }}
                            >
                              {
                                isPrintViewMode ? (
                                  <>
                                    <p>{values?.strTotalNumberOfPackages || ''}</p>
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <div className="col-lg-12">
                                      <textarea
                                        name="strTotalNumberOfPackages"
                                        value={values?.strTotalNumberOfPackages}
                                        onChange={(e) => {
                                          setFieldValue(
                                            'strTotalNumberOfPackages',
                                            e.target.value,
                                          );
                                        }}
                                      />
                                    </div>
                                  </>
                                )
                              }

                            </div>
                            <div className="grossWeight borderRight">
                              <>
                                {isPrintViewMode ? (
                                  <>
                                    {values?.strGrossWeightOrMeasurement
                                      ? values?.strGrossWeightOrMeasurement
                                        ?.split('\n')
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ''}
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <textarea
                                      value={values?.strGrossWeightOrMeasurement}
                                      name="strGrossWeightOrMeasurement"
                                      rows={3}
                                      cols={40}
                                      onChange={(e) => {
                                        setFieldValue(
                                          'strGrossWeightOrMeasurement',
                                          e.target.value,
                                        );
                                      }}
                                    />
                                  </>
                                )}
                              </>
                            </div>
                            <div className="kgIB borderRight">
                              <p />
                            </div>
                            <div className="grossWeight borderRight">
                              <p></p>
                            </div>

                            <div className="chargeableWeight borderRight">
                              <p>{totalGrossWeight} KG</p>
                            </div>
                            <div className="rateAndCharge borderRight">
                              {
                                isPrintViewMode ? (
                                  <>
                                    <p>{values?.strRate || ''}</p>
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <div className="col-lg-12">
                                      <InputField
                                        name="strRate"
                                        value={values?.strRate}
                                        type="text"
                                        onChange={(e) => {
                                          setFieldValue(
                                            'strRate',
                                            e.target.value,
                                          );
                                        }}
                                      />
                                    </div>
                                  </>
                                )
                              }
                            </div>
                            <div className="total borderRight">
                              <p>

                              </p>
                            </div>
                            <div className="natureandQuantityofGoods">
                              {isPrintViewMode ? (
                                <>
                                  {values?.strDescriptionOfPackagesAndGoods
                                    ? values?.strDescriptionOfPackagesAndGoods
                                      ?.split('\n')
                                      .map((item, index) => {
                                        return (
                                          <>
                                            {item}
                                            <br />
                                          </>
                                        );
                                      })
                                    : ''}
                                </>
                              ) : (
                                <>
                                  {' '}
                                  <textarea
                                    value={
                                      values?.strDescriptionOfPackagesAndGoods
                                    }
                                    name="strDescriptionOfPackagesAndGoods"
                                    rows={26}
                                    cols={40}
                                    onChange={(e) => {
                                      setFieldValue(
                                        'strDescriptionOfPackagesAndGoods',
                                        e.target.value,
                                      );
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* collect info */}
                      <div className="collectInfo">
                        {/* row item (1) */}
                        <div className="collectItemRow collectItemRowOne borderBottom">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              {/* grap */}
                              <div className="collectChartBox">
                                <span className=" collectChartBoxItem collectChartBoxPrepaid textTitle">
                                  Prepaid
                                </span>
                                <sapn className=" collectChartBoxItem collectChartBoxWC textTitle">
                                  Weight charge
                                </sapn>
                                <span className=" collectChartBoxItem collectChartBoxCollect textTitle">
                                  Collect
                                </span>
                              </div>
                              <div className="collectChartLeft borderRight">
                                <p className="collectChartValue" />
                                {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms) && (

                                  <ReactQuill
                                    modules={{
                                      toolbar: false,
                                    }}
                                    style={{
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  />
                                )}
                              </div>
                              <div className="collectChartRight">
                                <p className="collectChartValue">
                                  {!['cif', 'cpt', 'cfr'].includes(
                                    bookingData?.incoterms,
                                  ) && (
                                      <ReactQuill
                                        modules={{
                                          toolbar: false,
                                        }}
                                        style={{
                                          padding: 0,
                                          margin: 0,
                                        }}
                                      />
                                    )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight">
                            <div>
                              <p className="textTitle">Other charges</p>
                            </div>
                          </div>
                        </div>
                        {/* row item (2) */}
                        <div className="collectItemRow collectItemRowTwo borderBottom">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              {/* grap */}
                              <div
                                className="collectChartBox"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  width: '100%',
                                }}
                              >
                                <span className=" collectChartBoxItem collectChartBoxValuationCharge textTitle">
                                  Valuation charge
                                </span>
                              </div>
                              <div className="collectChartLeft borderRight">
                                <p className="collectChartValue">
                                  {['cif', 'cpt', 'cfr'].includes(
                                    bookingData?.incoterms,
                                  ) && (

                                      <ReactQuill
                                        modules={{
                                          toolbar: false,
                                        }}
                                        style={{
                                          padding: 0,
                                          margin: 0,
                                        }}
                                      />
                                    )}
                                </p>
                              </div>
                              <div className="collectChartRight">
                                <p className="collectChartValue">
                                  {!['cif', 'cpt', 'cfr'].includes(
                                    bookingData?.incoterms,
                                  ) && (
                                      <ReactQuill
                                        modules={{
                                          toolbar: false,
                                        }}
                                        style={{
                                          padding: 0,
                                          margin: 0,
                                        }}
                                      />

                                    )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight">
                            <div>
                              <p className="textTitle">Carriage</p>
                            </div>
                          </div>
                        </div>
                        {/* row item (3) */}
                        <div className="collectItemRow collectItemRowThree borderBottom">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              {/* grap */}
                              <div
                                className="collectChartBox"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  width: '100%',
                                }}
                              >
                                <span className=" collectChartBoxItem collectChartTax textTitle">
                                  Tax
                                </span>
                              </div>
                              <div className="collectChartLeft borderRight">
                                <p className="collectChartValue">
                                  {['cif', 'cpt', 'cfr'].includes(
                                    bookingData?.incoterms,
                                  ) && (

                                      <ReactQuill

                                        modules={{
                                          toolbar: false,
                                        }}
                                        style={{
                                          padding: 0,
                                          margin: 0,
                                        }}
                                      />
                                    )}
                                </p>
                              </div>
                              <div className="collectChartRight">
                                <p className="collectChartValue">
                                  {!['cif', 'cpt', 'cfr'].includes(
                                    bookingData?.incoterms,
                                  ) && (
                                      <ReactQuill
                                        modules={{
                                          toolbar: false,
                                        }}
                                        style={{
                                          padding: 0,
                                          margin: 0,
                                        }}
                                      />
                                    )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight">
                            <div>
                              <p className="textTitle"></p>
                            </div>
                          </div>
                        </div>
                        {/* row item (4) */}
                        <div className="collectItemRow collectItemRowFour borderBottom">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              <div style={{ width: '100%' }}>
                                <div
                                  style={{ display: 'flex', position: 'relative' }}
                                  className="borderBottom totalOtherChargesDueAgent"
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      width: '100%',
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxTotalOtherChargesDueAgent textTitle">
                                      Total Other Charges Due Agent
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    <p className="collectChartValue">
                                      {['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      ) && (
                                          <ReactQuill
                                            modules={{
                                              toolbar: false,
                                            }}
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                            }}
                                          />
                                        )}
                                    </p>
                                  </div>
                                  <div className="collectChartRight">
                                    <p className="collectChartValue">
                                      {!['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      ) && (
                                          <ReactQuill
                                            modules={{
                                              toolbar: false,
                                            }}
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                            }}
                                          />
                                        )}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  style={{ display: 'flex', position: 'relative' }}
                                  className="totalOtherChargesDueCarrier borderBottom"
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      width: '100%',
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxTotalOtherChargesDueCarrier textTitle">
                                      Total OtherCharges Due Carrier
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    <p className="collectChartValue">
                                      {['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      ) && (
                                          <ReactQuill
                                            modules={{
                                              toolbar: false,
                                            }}
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                            }}
                                          />
                                        )}
                                    </p>
                                  </div>
                                  <div className="collectChartRight">
                                    <p className="collectChartValue">
                                      {!['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      ) && (
                                          <ReactQuill
                                            modules={{
                                              toolbar: false,
                                            }}
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                            }}
                                          />
                                        )}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  style={{ display: 'flex', position: 'relative' }}
                                  className="totalOtherChargesDueCarrier"
                                >
                                  {/* grap */}
                                  <div className="collectChartLeft borderRight">
                                    <p className="collectChartValue">
                                      {['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      ) && (
                                          <ReactQuill
                                            modules={{
                                              toolbar: false,
                                            }}
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                            }}
                                          />
                                        )}
                                    </p>
                                  </div>
                                  <div className="collectChartRight">
                                    <p className="collectChartValue">
                                      {!['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      ) && (
                                          <ReactQuill
                                            modules={{
                                              toolbar: false,
                                            }}
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                            }}
                                          />
                                        )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight">
                            <div>
                              <p className="smallTitle">
                                Shipper certifies that the particulars on the face hereof
                                are correct and that insofar as any part of the consignment
                                contains restricted articles, such part is properly
                                described by name and is in proper condition for carriage by
                                air according to the applicable Dangerous Goods Regulations.
                              </p>
                              <h1
                                className="collectChartValue"
                                style={{
                                  textAlign: 'center',
                                  marginTop: 5,
                                  textTransform: 'uppercase',
                                }}
                              >
                                {bookingData?.shipperName}
                              </h1>
                              <hr
                                style={{
                                  borderTop: '1px dotted',
                                  marginTop: 50,
                                  marginBottom: 0,
                                }}
                              />
                              <p className="text-center">
                                <b>Signature of Shipper or his Agent</b>
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* row item (5) */}
                        <div className="collectItemRow collectItemRowFive borderBottom">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              <div style={{ width: '100%' }}>
                                <div
                                  style={{ display: 'flex', position: 'relative' }}
                                  className="borderBottom totalOtherChargesTotalPrepaid"
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      width: '100%',
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxTotalPrepaid textTitle">
                                      Total Prepaid
                                    </span>
                                    {/*  Total Collect*/}
                                    <span className=" collectChartBoxItem collectChartBoxTotalCollect textTitle">
                                      Total Collect{' '}
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    <p className="collectChartValue">
                                      {['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      ) && (
                                          <ReactQuill
                                            modules={{
                                              toolbar: false,
                                            }}
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                            }}
                                          />
                                        )}
                                    </p>
                                  </div>
                                  <div className="collectChartRight">
                                    <p className="collectChartValue">
                                      {!['cif', 'cpt', 'cfr'].includes(
                                        bookingData?.incoterms,
                                      ) && (
                                          <ReactQuill
                                            modules={{
                                              toolbar: false,
                                            }}
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                            }}
                                          />
                                        )}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  style={{ display: 'flex', position: 'relative' }}
                                  className="currencyConversionRate "
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      width: '100%',
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxCurrencyConversionRate textTitle">
                                      Currency Conversion Rate
                                    </span>
                                    {/* CC charges in dest currency */}
                                    <span className=" collectChartBoxItem collectChartBoxCCChargesInDestCurrency textTitle">
                                      CC Charges in Dest Currency{' '}
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    <p className="collectChartValue" />
                                  </div>
                                  <div className="collectChartRight">
                                    <p className="collectChartValue"></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight" style={{ width: '100%' }}>
                            <div
                              className=""
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: 30,
                                marginTop: 5,
                              }}
                            >
                              <p>
                                <b>
                                  {bookingData?.confirmDate &&
                                    moment(bookingData?.confirmDate).format(
                                      'DD-MM-YYYY',
                                    )}{' '}
                                  Dhaka
                                </b>
                              </p>
                              <p>
                                <b>Akij Logistics Limited</b>
                              </p>
                            </div>
                            <hr
                              style={{
                                borderTop: '1px dotted',
                                marginTop: 25,
                                marginBottom: 0,
                              }}
                            />
                            <div
                              className="smallTitle"
                              style={{
                                display: 'flex',
                                gap: 10,
                                textTransform: 'uppercase',
                              }}
                            >
                              <p>Executed on</p>
                              <p>(Date)</p>
                              <p>at</p>
                              <p>(Place)</p>
                              <p>signature of issuing Carrier or its Agent</p>
                            </div>
                          </div>
                        </div>
                        {/* row item (6) */}
                        <div className="collectItemRow collectItemRowSix">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              <div style={{ width: '100%' }}>
                                <div
                                  style={{ display: 'flex', position: 'relative' }}
                                  className="totalOtherChargesChargesAtDestination"
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      width: '100%',
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxChargesAtDestination textTitle">
                                      Charges at Destination
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    <p className="">
                                      For Carrier's use only at Destination
                                    </p>
                                  </div>
                                  <div className="collectChartRight">
                                    <p className="collectChartValue" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight" style={{ width: '100%' }}>
                            <div className="collectChartBox">
                              <span className=" collectChartBoxItem collectChartBoxChargesAtDestination textTitle">
                                Charges at Destination
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div >
            </Form>
          </>
        )}
      </Formik>

    </>
  );
};

export default MasterHBAWModal;
