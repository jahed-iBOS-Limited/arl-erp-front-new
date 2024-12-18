import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import logisticsLogo from './logisticsLogo.png';
import './style.css';
import { shallowEqual, useSelector } from 'react-redux';
import Loading from '../../../../_helper/_loading';
import { useReactToPrint } from 'react-to-print';

const validationSchema = Yup.object().shape({});
export default function MasterHBLModal({
  selectedRow,
  isPrintView,
  CB,
  sipMasterBlid,
}) {
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const [isPrintViewMode] = useState(isPrintView || false);
  // /domain/ShippingService/GetHBLList
  const [, getHBLList, isLoadingGetHBLList] = useAxiosPost();
  const [, SaveShipMasterBl, SaveShipMasterBlLoading] = useAxiosPost();
  const [msterBLDDL, getMasterBLDDL] = useAxiosGet();
  const [
    getShipMasteBlById,
    GetShipMasterBlById,
    shipMasterBlByIdLoaidng,
  ] = useAxiosGet();

  const formikRef = React.useRef();

  const GetShipMasterBlByIdApi = () => {
    ///domain/ShippingService/GetShipMasterBlById?BlId=3
    GetShipMasterBlById(
      `${imarineBaseUrl}/domain/ShippingService/GetShipMasterBlById?BlId=${sipMasterBlid}`,
      (data) => {
        if (data) {
          const obj = {
            ...data,
            intSipMasterBlid: data?.intSipMasterBlid,
            strShipper: data?.strShipper || '',
            strConsignee: data?.strConsignee || '',
            strNotifyParty: data?.strNotifyParty || '',
            strShippingAgentReferences: data?.strShippingAgentReferences || '',
            strOceanVessel: data?.strOceanVessel || '',
            strVoyageNo: data?.strVoyageNo || '',
            strPortOfLoading: data?.strPortOfLoading || '',
            strPlaceOfReceipt: data?.strPlaceOfReceipt || '',
            strPreCarriageBy: data?.strPreCarriageBy || '',
            strPortOfDischarge: data?.strPortOfDischarge || '',
            strPlaceOfDelivery: data?.strPlaceOfDelivery || '',
            strNumberOfBl: data?.strNumberOfBl || '',
            strMarksAndNumbers: data?.strMarksAndNumbers || '',
            strNoOfPackages: data?.strNoOfPackages || '',
            strDescriptionOfPackagesAndGoods:
              data?.strDescriptionOfPackagesAndGoods || '',
            strGrossWeightOrMeasurement:
              data?.strGrossWeightOrMeasurement || '',
            strFreightPayableAt: data?.strFreightPayableAt || '',
            strExRate: data?.strExRate || '',
            strPlaceAndDateOfIssue: data?.strPlaceAndDateOfIssue || '',
            strSignature: data?.strSignature || '',
            strNoOfOriginalBl: data?.strNoOfOriginalBl || '',
            strMasterHBLNo:
              data?.hblNos?.map((item) => item?.hblnumber).join(', ') || '',
          };
          Object.keys(obj).forEach((key) => {
            formikRef.current.setFieldValue(key, obj[key]);
          });
        }
      },
    );
  };

  useEffect(() => {
    if (isPrintViewMode) {
      GetShipMasterBlByIdApi();
    } else {
      const payload = selectedRow?.map((item) => {
        return {
          bookingReqestId: item?.bookingRequestId,
        };
      });
      getHBLList(
        `${imarineBaseUrl}/domain/ShippingService/GetHBLList`,
        payload,
        (hblRestData) => {
          const firstIndex = hblRestData[0];
          const subtotalGrossWeight = hblRestData?.reduce((subtotal, item) => {
            const rows = item?.rowsData || [];
            const weightSubtotal = rows?.reduce(
              (sum, row) => sum + (row?.totalGrossWeightKG || 0),
              0,
            );
            return subtotal + weightSubtotal;
          }, 0);
          const totalVolumeCBM = hblRestData?.reduce((subtotal, item) => {
            const rows = item?.rowsData || [];
            const volumeSubtotal = rows?.reduce(
              (sum, row) => sum + (row?.totalVolumeCBM || 0),
              0,
            );
            return subtotal + volumeSubtotal;
          }, 0);

          const totalNumberOfPackages = hblRestData?.reduce(
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

          const strDescriptionOfPackagesAndGoods = hblRestData
            .map((item) =>
              item.rowsData
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

          const obj = {
            intSipMasterBlid: 0,
            strShipper: '',
            strConsignee: `${firstIndex?.freightAgentReference}\n${firstIndex?.deliveryAgentDtl?.zipCode}, ${firstIndex?.deliveryAgentDtl?.state}, ${firstIndex?.deliveryAgentDtl?.city}, ${firstIndex?.deliveryAgentDtl?.country}, ${firstIndex?.deliveryAgentDtl?.address}`,
            strNotifyParty: `${firstIndex?.notifyPartyDtl1?.participantsName}\n${firstIndex?.notifyPartyDtl1?.zipCode}, ${firstIndex?.notifyPartyDtl1?.state}, ${firstIndex?.notifyPartyDtl1?.city}, ${firstIndex?.notifyPartyDtl1?.country}, ${firstIndex?.notifyPartyDtl1?.address}`,
            strMasterHBLNo:
              hblRestData
                ?.map((item, index) => {
                  return item?.hblnumber;
                })
                .join(', ') || '',
            strShippingAgentReferences: `${firstIndex?.shipperName}\n${firstIndex?.shipperAddress}\n${firstIndex?.shipperContactPerson}\n`,
            strOceanVessel: `${firstIndex?.transportPlanning?.vesselName ||
              ''} / ${firstIndex?.transportPlanning?.voyagaNo || ''}`,
            strVoyageNo: '',
            strPortOfLoading: firstIndex?.portOfLoading || '',
            strPlaceOfReceipt: firstIndex?.pickupPlace || '',
            strPreCarriageBy: firstIndex?.transportPlanning?.vesselName || '',
            strPortOfDischarge: firstIndex?.portOfDischarge || '',
            strPlaceOfDelivery: firstIndex?.finalDestinationAddress || '',
            strNumberOfBl: '',
            strMarksAndNumbers: '',
            strNoOfPackages: `${totalNumberOfPackages} Cartons`,
            strDescriptionOfPackagesAndGoods: strDescriptionOfPackagesAndGoods,
            strGrossWeightOrMeasurement: `${subtotalGrossWeight} Kgs\n${totalVolumeCBM} CBM`,
            strFreightPayableAt: '',
            strExRate: '',
            strPlaceAndDateOfIssue: '',
            strSignature: '',
            strNoOfOriginalBl: '',
          };
          Object.keys(obj).forEach((key) => {
            formikRef.current.setFieldValue(key, obj[key]);
          });
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getMasterBLDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetMasterBLDDL?typeId=2`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    const bookingRequestList = selectedRow?.map((item) => {
      return {
        bookingReqestId: item?.bookingRequestId,
      };
    });
    const puayload = {
      intSipMasterBlid: 0,
      strShipper: '',
      strConsignee: values?.strConsignee || '',
      strNotifyParty: values?.strNotifyParty || '',
      strMasterBlNo: values?.strMasterBlNo?.label || '',
      strShippingAgentReferences: values?.strShippingAgentReferences || '',
      strOceanVessel: values?.strOceanVessel || '',
      strVoyageNo: values?.strVoyageNo || '',
      strPortOfLoading: values?.strPortOfLoading || '',
      strPlaceOfReceipt: values?.strPlaceOfReceipt || '',
      strPreCarriageBy: values?.strPreCarriageBy || '',
      strPortOfDischarge: values?.strPortOfDischarge || '',
      strPlaceOfDelivery: values?.strPlaceOfDelivery || '',
      strNumberOfBl: values?.strNumberOfBl || '',
      strMarksAndNumbers: values?.strMarksAndNumbers || '',
      strNoOfPackages: values?.strNoOfPackages || '',
      strDescriptionOfPackagesAndGoods:
        values?.strDescriptionOfPackagesAndGoods || '',
      strGrossWeightOrMeasurement: values?.strGrossWeightOrMeasurement || '',
      strFreightPayableAt: values?.strFreightPayableAt || '',
      strExRate: values?.strExRate || '',
      strPlaceAndDateOfIssue: values?.strPlaceAndDateOfIssue || '',
      strSignature: values?.strSignature || '',
      strNoOfOriginalBl: values?.strNoOfOriginalBl || '',
      isActive: true,
      intCreatedBy: profileData?.userId,
      dteCreatedAt: new Date(),
      dteServerTime: new Date(),
      bookingReqest: bookingRequestList || [],
    };

    //domain/ShippingService/SaveShipMasterBl
    SaveShipMasterBl(
      `${imarineBaseUrl}/domain/ShippingService/SaveShipMasterBl`,
      puayload,
      (data) => {
        if (data) {
          CB();
        }
      },
    );
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Master-BL-${getShipMasteBlById?.strMasterBlNo || ''}`,
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
            {(SaveShipMasterBlLoading ||
              shipMasterBlByIdLoaidng ||
              isLoadingGetHBLList) && <Loading />}
            {console.log('values', values)}
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
              <div
                style={{
                  display: 'grid',
                  gap: 5,
                }}
              >
                {!isPrintViewMode && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="strMasterBlNo"
                      options={msterBLDDL || []}
                      value={values?.strMasterBlNo}
                      label="MBL Number"
                      onChange={(valueOption) => {
                        let value = {
                          ...valueOption,
                          value: 0,
                          label: valueOption?.label || '',
                        };
                        setFieldValue('strMasterBlNo', value);
                      }}
                      errors={errors}
                      touched={touched}
                      isCreatableSelect={true}
                    />
                  </div>
                )}

                <div className="masterhblContainer" ref={componentRef}>
                  <div className="airandConsigneeInfo">
                    <div className="top borderBottom">
                      <div className="leftSide borderRight">
                        <div className="shipperInfo borderBottom">
                          <img
                            src={logisticsLogo}
                            alt=""
                            style={{
                              height: 50,
                              width: '35%',
                              objectFit: 'contain',
                              paddingLeft: 10,
                            }}
                          />
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              paddingLeft: 10,
                              marginTop: 10,
                            }}
                          >
                            Akij Logistics Limited
                          </div>{' '}
                          <div style={{ fontWeight: 400, paddingLeft: 10 }}>
                            Bir Uttam Mir Shawkat Sarak, Dhaka 1208
                          </div>
                        </div>
                        <div className="consigneeInfo borderBottom">
                          <p className="textTitle">Consignee:</p>
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
                        </div>
                        <div className="notifyParty borderBottom">
                          <p className="textTitle">Notify Party:</p>
                          <p>
                            {values?.strNotifyParty
                              ? values?.strNotifyParty
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
                        </div>
                        <div className="preCarriageInfo borderBottom">
                          <div className="firstColumn">
                            <p className="textTitle">Pre-Carriage By:</p>
                            {isPrintViewMode ? (
                              <>
                                <p>{values?.strPreCarriageBy || ''}</p>
                              </>
                            ) : (
                              <>
                                {' '}
                                <div className="col-lg-12">
                                  <NewSelect
                                    name="strPreCarriageBy"
                                    options={[]}
                                    value={
                                      values?.strPreCarriageBy
                                        ? {
                                            value: 0,
                                            label: values?.strPreCarriageBy,
                                          }
                                        : ''
                                    }
                                    label=""
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        'strPreCarriageBy',
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
                          <div className="rightSide">
                            <p className="textTitle">Place of Receipt:</p>
                            {isPrintViewMode ? (
                              <>
                                <p>{values?.strPlaceOfReceipt || ''}</p>
                              </>
                            ) : (
                              <>
                                {' '}
                                <div className="col-lg-12">
                                  <NewSelect
                                    name="strPlaceOfReceipt"
                                    options={[]}
                                    value={
                                      values?.strPlaceOfReceipt
                                        ? {
                                            value: 0,
                                            label: values?.strPlaceOfReceipt,
                                          }
                                        : ''
                                    }
                                    label=""
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        'strPlaceOfReceipt',
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
                        <div className="oceanVesselInfo">
                          <div className="firstColumn">
                            <p className="textTitle">Ocean Vessel:</p>
                            {isPrintViewMode ? (
                              <>
                                <p>{values?.strOceanVessel || ''}</p>
                              </>
                            ) : (
                              <>
                                {' '}
                                <div className="col-lg-12">
                                  <NewSelect
                                    name="strOceanVessel"
                                    options={[]}
                                    value={
                                      values?.strOceanVessel
                                        ? {
                                            value: 0,
                                            label: values?.strOceanVessel,
                                          }
                                        : ''
                                    }
                                    label=""
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        'strOceanVessel',
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
                          <div className="rightSide">
                            <p className="textTitle">Port of Loading:</p>
                            {isPrintViewMode ? (
                              <>
                                <p>{values?.strPortOfLoading || ''}</p>
                              </>
                            ) : (
                              <>
                                {' '}
                                <div className="col-lg-12">
                                  <NewSelect
                                    name="strPortOfLoading"
                                    options={[]}
                                    value={
                                      values?.strPortOfLoading
                                        ? {
                                            value: 0,
                                            label: values?.strPortOfLoading,
                                          }
                                        : ''
                                    }
                                    label=""
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        'strPortOfLoading',
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
                      <div className="rightSide">
                        <div className="rightSideMiddleContent">
                          <p>
                            <b>
                              {values?.strMasterBlNo?.label ||
                                values?.strMasterBlNo}
                            </b>
                          </p>
                          <div style={{ height: 40 }}></div>
                          <h1>BILL OF LADING</h1>
                          <div
                            style={{
                              minHeight: 80,
                              width: '90%',
                              border: '1px solid black',
                            }}
                          >
                            <div
                              style={{
                                display: 'grid',
                                padding: 5,
                              }}
                            >
                              <p>
                                <b> B/L No:</b>
                              </p>
                              <p>{values?.strMasterHBLNo}</p>
                            </div>
                          </div>
                          <h1 style={{ marginTop: 10, marginBottom: 10 }}>
                            ORIGINAL
                          </h1>
                          <p></p>
                        </div>
                        <div className="rightSideBottom">
                          <p className="textTitle" style={{ paddingBottom: 5 }}>
                            Shipping Line Details:
                          </p>
                          <div style={{ paddingLeft: 5 }}>
                            {isPrintViewMode ? (
                              <p>
                                {values?.strShippingAgentReferences
                                  ? values?.strShippingAgentReferences
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
                                name="strShippingAgentReferences"
                                rows={4}
                                cols={40}
                                value={values?.strShippingAgentReferences}
                                onChange={(e) => {
                                  console.log(JSON.stringify(e.target.value));
                                  setFieldValue(
                                    'strShippingAgentReferences',
                                    e.target.value,
                                  );
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="middle">
                      <div className="firstRow borderBottom">
                        <div className="firstColumn borderRight">
                          <p className="textTitle">Port of Discharge:</p>
                          {isPrintViewMode ? (
                            <>
                              <p>{values?.strPortOfDischarge || ''}</p>
                            </>
                          ) : (
                            <>
                              {' '}
                              <div className="col-lg-12">
                                <NewSelect
                                  name="strPortOfDischarge"
                                  options={[]}
                                  value={
                                    values?.strPortOfDischarge
                                      ? {
                                          value: 0,
                                          label: values?.strPortOfDischarge,
                                        }
                                      : ''
                                  }
                                  label=""
                                  onChange={(valueOption) => {
                                    setFieldValue(
                                      'strPortOfDischarge',
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
                        <div className="secondColumn">
                          <div className="item borderRight">
                            <p className="textTitle">Place Of Delivery</p>
                            {isPrintViewMode ? (
                              <>
                                <p>{values?.strPlaceOfDelivery || ''}</p>
                              </>
                            ) : (
                              <>
                                {' '}
                                <div className="col-lg-12">
                                  <NewSelect
                                    name="strPlaceOfDelivery"
                                    options={[]}
                                    value={
                                      values?.strPlaceOfDelivery
                                        ? {
                                            value: 0,
                                            label: values?.strPlaceOfDelivery,
                                          }
                                        : ''
                                    }
                                    label=""
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        'strPlaceOfDelivery',
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
                          <div className="item borderRight">
                            <p className="textTitle">Freight payable at</p>
                            {isPrintViewMode ? (
                              <>
                                <p>{values?.strFreightPayableAt || ''}</p>
                              </>
                            ) : (
                              <>
                                {' '}
                                <div className="col-lg-12">
                                  <NewSelect
                                    name="strFreightPayableAt"
                                    options={[]}
                                    value={
                                      values?.strFreightPayableAt
                                        ? {
                                            value: 0,
                                            label: values?.strFreightPayableAt,
                                          }
                                        : ''
                                    }
                                    label=""
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        'strFreightPayableAt',
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
                        <div className="thirdColumn">
                          <p className="textTitle">Number of Original B/L:</p>
                        </div>
                      </div>
                      <div className="secondRow borderBottom textTitle">
                        <div className="firstColumn borderRight">
                          <p>Marks &amp; Numbers</p>
                          <p>Container &amp; Seal Numbers</p>
                        </div>
                        <div className="secondColumn">
                          <div className="item borderRight">
                            <p>No. of Packages</p>
                          </div>
                          <div className="item borderRight">
                            <p>Description of Packages and Goods</p>
                            <p>Particularly Furnished by Shipper</p>
                          </div>
                        </div>
                        <div className="thirdColumn">
                          <div className="item ">
                            <p>Gross weight /Measurement</p>
                          </div>
                          {/* <div className="item">
                            <p>Measurement</p>
                            <p>CBM</p>
                          </div> */}
                        </div>
                      </div>
                      <div className="thirdRow">
                        <div className="firstColumn">
                          <div
                            style={{
                              textTransform: 'uppercase',
                            }}
                          >
                            {isPrintViewMode ? (
                              <>
                                {values?.strMarksAndNumbers
                                  ? values?.strMarksAndNumbers
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
                                  name="strMarksAndNumbers"
                                  value={values?.strMarksAndNumbers}
                                  rows={4}
                                  cols={40}
                                  onChange={(e) => {
                                    console.log(JSON.stringify(e.target.value));
                                    setFieldValue(
                                      'strMarksAndNumbers',
                                      e.target.value,
                                    );
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="secondColumn">
                          <div className="item borderRight">
                            <p>
                              {isPrintViewMode ? (
                                <>
                                  {values?.strNoOfPackages
                                    ? values?.strNoOfPackages
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
                                    value={values?.strNoOfPackages}
                                    name="strNoOfPackages"
                                    rows={3}
                                    cols={40}
                                    onChange={(e) => {
                                      setFieldValue(
                                        'strNoOfPackages',
                                        e.target.value,
                                      );
                                    }}
                                  />
                                </>
                              )}
                            </p>
                          </div>
                          <div
                            className="item borderRight"
                            style={{
                              textTransform: 'uppercase',
                            }}
                          >
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
                                  rows={30}
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
                        <div className="thirdColumn">
                          <div className="item ">
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
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '13px',
                        borderTop: '1px solid',
                      }}
                    >
                      <div
                        style={{
                          width: '300px',
                        }}
                      >
                        <p
                          style={{
                            textAlign: 'center',
                            marginBottom: 15,
                          }}
                        >
                          Laden on board
                        </p>

                        <p>Date</p>
                      </div>
                      <div>
                        <p
                          style={{
                            width: '300px',
                            borderBottom: '1px dashed',
                            marginTop: '120px',
                            marginBottom: '15px',
                          }}
                        >
                          By
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
