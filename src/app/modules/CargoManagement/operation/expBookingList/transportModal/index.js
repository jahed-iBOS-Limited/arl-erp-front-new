import { IconButton } from '@material-ui/core';
import { FieldArray, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { shallowEqual, useSelector } from 'react-redux';
import { imarineBaseUrl } from '../../../../../App';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import useAxiosPut from '../../../../_helper/customHooks/useAxiosPut';
import './style.css';
import axios from 'axios';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
const validationSchema = Yup.object().shape({
  pickupLocation: Yup.string().required('Pickup Location is required'),
  noOfPallets: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 1,
    then: Yup.string().required('No of Pallets is required'),
  }),
  airLineOrShippingLine: Yup.string().required('This field is required'),
  carton: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 1,
    then: Yup.string().required('Carton is required'),
  }),
  gsa: Yup.string().when('transportPlanning', {
    is: (val) => [1, 2, 3].includes(val?.value),
    then: Yup.string().required('GSA is required'),
  }),
  vesselName: Yup.string().when('transportPlanning', {
    is: (val) => [2].includes(val?.value),
    then: Yup.string().required('Vessel Name is required'),
  }),
  subidhaAccessNumber: Yup.string().when('transportPlanning', {
    is: (val) => [4].includes(val?.value),
    then: Yup.string().required('Subidha Access Number is required'),
  }),
  voyagaNo: Yup.string().when('transportPlanning', {
    is: (val) => [2].includes(val?.value),
    then: Yup.string().required('Voyage Number is required'),
  }),
  arrivalDateTime: Yup.string().when('transportPlanning', {
    is: (val) => [2].includes(val?.value),
    then: Yup.string().required('Arrival Date & Time is required'),
  }),
});
const truckTypeDDL = [
  {
    value: 1,
    label: 'Overseas',
  },
  {
    value: 2,
    label: 'Local',
  },
];
function TransportModal({ rowClickData, CB }) {
  const tradeTypeId = rowClickData?.tradeTypeId || 1;
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const [
    ,
    SaveShippingTransportPlanning,
    shippingTransportPlanningLoading,
  ] = useAxiosPost();
  const [
    ,
    editShippingTransportPlanning,
    shippingTransportPlanningEditLoading,
  ] = useAxiosPut();
  const bookingRequestId = rowClickData?.bookingRequestId;

  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const bookingData = shipBookingRequestGetById || {};
  const [gsaDDL, setGSADDL] = useAxiosGet();
  const [
    airServiceProviderDDLData,
    getAirServiceProviderDDL,
    ,
    setAirServiceProviderDDL,
  ] = useAxiosGet();
  const [truckSize, getTruckSize] = useAxiosGet();
  const [
    airPortShortCodeDDL,
    getAirPortShortCodeDDL,
    ,
    setAirPortShortCodeDDL,
  ] = useAxiosGet();
  const [poNumberDDL, setPoNumberDDL] = React.useState([]);
  const [styleDDL, setStyleDDL] = React.useState([]);
  const [colorDDL, setColorDDL] = React.useState([]);
  const formikRef = React.useRef(null);

  const defaultDataSet = (objData, transportPlanning) => {
    const data = objData || {};

    //1=Air, 2=Sea,
    // const transportPlanningModeId =
    //   transportPlanning?.transportPlanningModeId || 0;

    const modeOfTransportName = transportPlanning?.modeOfTransport;
    const modeOfTransportId = transportPlanning?.modeOfTransportId;
    const typeId = modeOfTransportName === 'Air' ? 6 : 5;

    const totalNumberOfPackages = data?.rowsData?.reduce(
      (acc, item) => acc + (+item?.totalNumberOfPackages || 0),
      0,
    );

    const shipperOrshipperId =
      tradeTypeId === 1 ? objData?.shipperId : objData?.consigneeId;

    //====== common data set===
    GetAirServiceProviderDDLFunc(shipperOrshipperId, typeId, modeOfTransportId);
    const modeOfTransportObj = modeOfTransportId
      ? {
          value: modeOfTransportId,
          label: modeOfTransportName,
        }
      : '';
    formikRef.current.setFieldValue(
      `rows[0].transportId`,
      transportPlanning?.transportId || 0,
    );
    formikRef.current.setFieldValue(
      `rows[0].transportPlanning`,
      modeOfTransportObj,
    );
    formikRef.current.setFieldValue(
      `transportPlanningMode`,
      modeOfTransportObj,
    );
    formikRef.current.setFieldValue(
      `rows[0].pickupLocation`,
      transportPlanning?.pickupLocation || data?.pickupPlace || '',
    );
    formikRef.current.setFieldValue(
      `rows[0].airLineOrShippingLine`,
      transportPlanning?.airLineOrShippingLine
        ? {
            value: transportPlanning?.airLineOrShippingLineId || 0,
            label: transportPlanning?.airLineOrShippingLine,
          }
        : '',
    );
    formikRef.current.setFieldValue(
      `rows[0].gsa`,
      transportPlanning?.gsaId
        ? {
            value: transportPlanning?.gsaId || 0,
            label: transportPlanning?.gsaName,
          }
        : '',
    );

    formikRef.current.setFieldValue(
      `rows[0].estimatedTimeOfDepart`,
      transportPlanning?.estimatedTimeOfDepart
        ? moment(transportPlanning?.estimatedTimeOfDepart).format('YYYY-MM-DD')
        : '',
    );
    formikRef.current.setFieldValue(
      `rows[0].strSbNo`,
      transportPlanning?.strSbNo || '',
    );
    formikRef.current.setFieldValue(
      `rows[0].dteSbDate`,
      transportPlanning?.dteSbDate
        ? moment(transportPlanning?.dteSbDate).format('YYYY-MM-DD')
        : '',
    );
    formikRef.current.setFieldValue(
      `rows[0].airTransportRow`,
      transportPlanning?.airTransportRow?.map((item) => ({
        ...item,
        planRowId: item?.planRowId || 0,
        truckType: item?.truckType || '',
        fromPort: item?.fromPort || '',
        toPort: item?.toPort || '',
        flightNumber: item?.flightNumber || '',
        flightDate: item?.flightDate
          ? moment(item?.flightDate).format('YYYY-MM-DD')
          : '',
      })) || [],
    );

    //==== Air data set ===
    if (modeOfTransportName === 'Air') {
      //noOfPallets, iatanumber, carton,
      formikRef.current.setFieldValue(
        `rows[0].noOfPallets`,
        transportPlanning?.noOfPallets || '',
      );
      formikRef.current.setFieldValue(
        `rows[0].iatanumber`,
        transportPlanning?.iatanumber || '',
      );
      formikRef.current.setFieldValue(
        `rows[0].carton`,
        transportPlanning?.carton || totalNumberOfPackages || 0,
      );
      formikRef.current.setFieldValue(
        `rows[0].rate`,
        transportPlanning?.rate || 0,
      );
    }

    //==== Sea data set ===
    if (['Sea', 'Land'].includes(modeOfTransportName)) {
      //noOfContainer, vesselName, voyagaNo, arrivalDateTime, berthDate, cutOffDate ,subidhaAccessDate,subidhaAccessNumber
      formikRef.current.setFieldValue(
        `rows[0].noOfContainer`,
        transportPlanning?.noOfContainer || '',
      );
      formikRef.current.setFieldValue(
        `rows[0].vesselName`,
        transportPlanning?.vesselName || '',
      );
      formikRef.current.setFieldValue(
        `rows[0].subidhaAccessNumber`,
        transportPlanning?.subidhaAccessNumber || '',
      );
      formikRef.current.setFieldValue(
        `rows[0].voyagaNo`,
        transportPlanning?.voyagaNo || '',
      );
      formikRef.current.setFieldValue(
        `rows[0].arrivalDateTime`,
        transportPlanning?.arrivalDateTime
          ? moment(transportPlanning?.arrivalDateTime).format('YYYY-MM-DD')
          : '',
      );
      formikRef.current.setFieldValue(
        `rows[0].berthDate`,
        transportPlanning?.berthDate
          ? moment(transportPlanning?.berthDate).format('YYYY-MM-DD')
          : '',
      );
      formikRef.current.setFieldValue(
        `rows[0].cutOffDate`,
        transportPlanning?.cutOffDate
          ? moment(transportPlanning?.cutOffDate).format('YYYY-MM-DD')
          : '',
      );
      formikRef.current.setFieldValue(
        `rows[0].subidhaAccessDate`,
        transportPlanning?.subidhaAccessDate
          ? moment(transportPlanning?.subidhaAccessDate).format('YYYY-MM-DD')
          : '',
      );
      formikRef.current.setFieldValue(
        `rows[0].containerDesc`,
        transportPlanning?.containerDesc?.map((item) => ({
          ...item,
          containerNumber: item?.containerNumber || '',
          sealNumber: item?.sealNumber || '',
          size: item?.size || '',
          quantity: item?.quantity || 0,
          rate: item?.rate || 0,
          cbm: item?.cbm || 0,
          kgs: item?.kgs || 0,
          mode: '',
          poNumber: item?.poNumber || '',
          style: item?.style || '',
          color: item?.color || '',
          containerDescId: item?.containerDescId || 0,
        })) || [],
      );

      const getUniqueOptions = (key) => {
        try {
          const values = new Set();
          data.rowsData.forEach((row) => {
            if (row.dimensionRow && row.dimensionRow.length > 0) {
              row.dimensionRow.forEach((dim) => {
                if (dim[key]) {
                  values.add({
                    ...dim,
                    label: dim[key],
                    value: dim[key],
                  });
                }
              });
            }
          });
          return Array.from(values).map((item) => ({
            ...item,
            value: item?.value,
            label: item?.label,
          }));
        } catch (error) {
          return [];
        }
      };

      // Dropdown options
      const colorOptions = getUniqueOptions('color');
      const styleOptions = getUniqueOptions('style');
      const poNumberOptions = getUniqueOptions('poNumber');
      setPoNumberDDL(poNumberOptions);
      setStyleDDL(styleOptions);
      setColorDDL(colorOptions);
    }
  };

  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
        (resData) => {
          if (formikRef.current) {
            const data = resData || {};

            const transportPlanningAir =
              data?.transportPlanning?.find((i) => {
                return i?.transportPlanningModeId === 1;
              }) || {};

            const transportPlanningSea =
              data?.transportPlanning?.find((i) => {
                return i?.transportPlanningModeId === 2;
              }) || {};

            //  modeOfTransport: "Sea-Air"
            if (data?.modeOfTransportId === 3) {
              defaultDataSet(data, {
                ...transportPlanningAir,
                modeOfTransportId: 1,
                modeOfTransport: 'Air',
              });
            }
            if (data?.modeOfTransportId === 1) {
              defaultDataSet(data, {
                ...transportPlanningAir,
                modeOfTransportId: 1,
                modeOfTransport: 'Air',
              });
            }
            if (data?.modeOfTransportId === 2) {
              defaultDataSet(data, {
                ...transportPlanningSea,
                modeOfTransportId: 2,
                modeOfTransport: 'Sea',
              });
            }
            if (data?.modeOfTransportId === 4) {
              defaultDataSet(data, {
                ...transportPlanningSea,
                modeOfTransportId: 4,
                modeOfTransport: 'Land',
              });
            }
          }
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAirPortShortCodeDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetAirPortShortCodeDDL`,
      (resData) => {
        const getShortCode = resData?.map((i) => {
          return {
            ...i,
            label: i?.code,
          };
        });
        setAirPortShortCodeDDL(getShortCode);
      },
    );
    getTruckSize(`${imarineBaseUrl}/domain/ShippingService/GetTruckSize`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const GetAirServiceProviderDDLFunc = (
    shipperOrshipperId,
    typeId,
    modeOfTransportId,
  ) => {
    // tradeTypeId  = 1 export
    if (tradeTypeId === 1) {
      getAirServiceProviderDDL(
        `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeShipperDDL?shipperId=${shipperOrshipperId}&participntTypeId=${typeId}`,
        (res) => {
          setAirServiceProviderDDL(res);
        },
      );
      setGSADDL(
        `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeShipperDDL?shipperId=${shipperOrshipperId}&participntTypeId=7`,
      );
    }
    // tradeTypeId  = 2 import
    if (tradeTypeId === 2) {
      // modeOfTransportId 1=Air, 2=Sea, 3=Sea-Air, 4=Land
      if (modeOfTransportId === 4) {
        // getAirServiceProviderDDL(
        //   `${imarineBaseUrl}/domain/ShippingService/GetTruckSize`,
        //   (res) => {
        //     setAirServiceProviderDDL(res);
        //   },
        // );
      } else {
        getAirServiceProviderDDL(
          `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeCongineeDDL?consigneeId=${shipperOrshipperId}&participntTypeId=${typeId}`,
          (res) => {
            setAirServiceProviderDDL(res);
          },
        );
        setGSADDL(
          `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeCongineeDDL?consigneeId=${shipperOrshipperId}&participntTypeId=7`,
        );
      }
    }
  };
  const saveHandler = (values, cb) => {
    const row = values?.rows[0];
    const transportId = row?.transportId || 0;
    const payload = {
      bookingId: bookingRequestId || 0,
      pickupLocation: row?.pickupLocation || '',
      pickupDate: new Date(),
      vehicleInfo: row?.vehicleInfo || '',
      noOfPallets: row?.noOfPallets || 0,
      carton: row?.carton || 0,
      iatanumber: row?.iatanumber || '',
      noOfContainer: row?.noOfContainer || 0,
      airLineOrShippingLine: row?.airLineOrShippingLine?.label || '',
      airLineOrShippingLineId: row?.airLineOrShippingLine?.value || 0,
      vesselName: row?.vesselName || '',
      subidhaAccessNumber: row?.subidhaAccessNumber || '',
      voyagaNo: row?.voyagaNo || '',
      ...(row?.arrivalDateTime && {
        arrivalDateTime: moment(row?.arrivalDateTime).format('YYYY-MM-DD'),
      }),
      ...(row?.berthDate && {
        berthDate: moment(row?.berthDate).format('YYYY-MM-DD'),
      }),
      ...(row?.cutOffDate && {
        cutOffDate: moment(row?.cutOffDate).format('YYYY-MM-DD'),
      }),
      ...(row?.subidhaAccessDate && {
        subidhaAccessDate: moment(row?.subidhaAccessDate).format('YYYY-MM-DD'),
      }),
      ...(row?.estimatedTimeOfDepart && {
        estimatedTimeOfDepart: moment(row?.estimatedTimeOfDepart).format(
          'YYYY-MM-DD',
        ),
      }),
      gsaName: row?.gsa?.label || '',
      gsaId: row?.gsa?.value || 0,
      mawbnumber: row?.mawbnumber || '',
      transportMode: row?.transportMode?.label || 0,
      transportId: transportId,
      strSbNo: row?.strSbNo || '',
      ...(row?.dteSbDate && {
        dteSbDate: moment(row?.dteSbDate).format('YYYY-MM-DD'),
      }),
      isActive: true,
      rate: row?.rate || 0,
      containerDesc: row?.containerDesc?.map((item) => ({
        containerNumber: item?.containerNumber || '',
        sealNumber: item?.sealNumber || '',
        size: item?.size || '',
        quantity: item?.quantity || 0,
        rate: item?.rate || 0,
        cbm: item?.cbm,
        kgs: item?.kgs || 0,
        mode: '',
        poNumber: item?.poNumber || '',
        style: item?.style || '',
        color: item?.color || '',
        containerDescId: item?.containerDescId || 0,
        transportId: transportId,
        isActive: true,
        createdBy: profileData?.userId || 0,
        createdAt: new Date(),
      })),
      airTransportRow: row?.airTransportRow?.map((item) => ({
        planRowId: item?.planRowId || 0,
        transportId: transportId,
        truckType: item?.truckType || '',
        fromPort: item?.fromPort || '',
        toPort: item?.toPort || '',
        flightNumber: item?.flightNumber || '',
        flightDate: moment(item?.flightDate).format('YYYY-MM-DD'),
        isActive: true,
      })),
      transportPlanningModeName: values?.transportPlanningMode?.label || '',
      transportPlanningModeId: values?.transportPlanningMode?.value || 0,
    };
    if (transportId) {
      editShippingTransportPlanning(
        `${imarineBaseUrl}/domain/ShippingService/EditShippingTransportPlanning`,
        payload,
        CB,
        'Transport Planning Saved Successfully',
      );
    } else {
      SaveShippingTransportPlanning(
        `${imarineBaseUrl}/domain/ShippingService/SaveShippingTransportPlanning`,
        payload,
        CB,
        'Transport Planning Saved Successfully',
      );
    }
  };
  return (
    <div className="confirmModal">
      {(shippingTransportPlanningLoading ||
        shipBookingRequestLoading ||
        shippingTransportPlanningEditLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          rows: [
            {
              pickupLocation: '',
              pickupDate: '',
              vehicleInfo: '',
              noOfPallets: '',
              carton: '',
              noOfContainer: '',
              airLineOrShippingLine: '',
              iatanumber: '',
              vesselName: '',
              subidhaAccessNumber: '',
              voyagaNo: '',
              departureDateTime: '',
              arrivalDateTime: '',
              transportMode: '',
              berthDate: '',
              cutOffDate: '',
              subidhaAccessDate: '',
              estimatedTimeOfDepart: '',
              containerDesc: [],
              airTransportRow: [],
              truckType: '',
              fromPort: '',
              toPort: '',
              flightDate: '',
              flightNumber: '',
              scheduleVesselName: '',
              gsa: '',
              mawbnumber: '',
              rate: '',
            },
          ],
          transportPlanningMode: '',
        }}
        validationSchema={Yup.object({
          rows: Yup.array().of(validationSchema), // Use the existing validation schema for each row
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <Form className="form form-label-right">
            <div className="d-flex justify-content-between align-items-center">
              {/* Save button add */}
              {shipBookingRequestGetById?.modeOfTransportId === 3 ? (
                <div className="col-lg-4 mb-2 mt-5">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="transportPlanningMode"
                      checked={values?.transportPlanningMode?.value === 1}
                      className="mr-1 pointer"
                      style={{ position: 'relative', top: '2px' }}
                      onChange={(e) => {
                        const transportPlanningAir =
                          bookingData?.transportPlanning?.find((i) => {
                            return i?.transportPlanningModeId === 1;
                          }) || {};

                        resetForm();

                        defaultDataSet(bookingData, {
                          ...transportPlanningAir,
                          modeOfTransportId: 1,
                          modeOfTransport: 'Air',
                        });
                      }}
                      required
                    />
                    Air
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="transportPlanningMode"
                      checked={values?.transportPlanningMode?.value === 2}
                      className="mr-1 pointer"
                      style={{ position: 'relative', top: '2px' }}
                      onChange={(e) => {
                        const transportPlanningSea =
                          bookingData?.transportPlanning?.find((i) => {
                            return i?.transportPlanningModeId === 2;
                          }) || {};

                        resetForm();
                        defaultDataSet(bookingData, {
                          ...transportPlanningSea,
                          modeOfTransportId: 2,
                          modeOfTransport: 'Sea',
                        });
                      }}
                      required
                    />
                    Sea
                  </label>
                </div>
              ) : (
                <div> </div>
              )}

              <div className="">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </div>
            <FieldArray name="rows">
              {({ push, remove }) => (
                <>
                  {values?.rows.map((row, index) => (
                    <div key={index}>
                      <div className="form-group row global-form">
                        {/* Transport Planning Type */}
                        <div className="col-lg-3">
                          <NewSelect
                            name={`rows[${index}].transportPlanning`}
                            options={[
                              {
                                value: 1,
                                label: 'Air',
                              },
                              {
                                value: 2,
                                label: 'Sea',
                              },
                              {
                                value: 3,
                                label: 'Sea-Air',
                              },
                              {
                                value: 4,
                                label: 'Land',
                              },
                            ]}
                            value={values?.rows?.[index].transportPlanning}
                            label="Transport Planning Type"
                            onChange={(valueOption) => {
                              setFieldValue(
                                `rows[${index}].transportPlanning`,
                                valueOption,
                              );
                            }}
                            placeholder="Transport Planning Type"
                            errors={errors}
                            touched={touched}
                            isDisabled={true}
                          />
                        </div>

                        {/* Pickup Location */}
                        <div className="col-lg-3">
                          <InputField
                            value={values?.rows?.[index]?.pickupLocation || ''}
                            label="Pickup Location"
                            name={`rows[${index}].pickupLocation`}
                            type="text"
                            onChange={(e) =>
                              setFieldValue(
                                `rows[${index}].pickupLocation`,
                                e.target.value,
                              )
                            }
                            placeholder="Pickup Location"
                          />
                          {errors?.rows &&
                            errors?.rows?.[index]?.pickupLocation &&
                            touched.rows && (
                              <div className="text-danger">
                                {errors?.rows?.[index]?.pickupLocation}
                              </div>
                            )}
                        </div>

                        {values?.rows?.[0]?.transportPlanning?.value === 4 ? (
                          <>
                            <div className="col-lg-3">
                              <label>Transporter </label>
                              <SearchAsyncSelect
                                selectedValue={
                                  values?.rows?.[index].airLineOrShippingLine
                                }
                                handleChange={(valueOption) => {
                                  setFieldValue(
                                    `rows[${index}].airLineOrShippingLine`,
                                    valueOption,
                                  );
                                }}
                                loadOptions={(v) => {
                                  let url = '';
                                  url = `${imarineBaseUrl}/domain/ShippingService/CommonPartnerTypeDDL?search=${v}&businessPartnerType=1&cargoType=0`;
                                  if (v?.length < 2) return [];
                                  return axios
                                    .get(url)
                                    .then((res) => res?.data);
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Air Line */}
                            <div className="col-lg-3">
                              <NewSelect
                                name={`rows[${index}].airLineOrShippingLine`}
                                options={airServiceProviderDDLData || []}
                                value={
                                  values?.rows?.[index].airLineOrShippingLine
                                }
                                label={
                                  values?.rows?.[index]?.transportPlanning
                                    ?.value === 1
                                    ? 'Air Line'
                                    : 'Shipping Line' || ''
                                }
                                onChange={(valueOption) => {
                                  setFieldValue(
                                    `rows[${index}].airLineOrShippingLine`,
                                    valueOption,
                                  );
                                }}
                                placeholder={
                                  values?.rows?.[index]?.transportPlanning
                                    ?.value === 1
                                    ? 'Air Line'
                                    : 'Shipping Line' || ''
                                }
                                errors={errors}
                                touched={touched}
                              />
                              {errors?.rows &&
                                errors?.rows?.[index]?.airLineOrShippingLine &&
                                touched.rows && (
                                  <div className="text-danger">
                                    {
                                      errors?.rows?.[index]
                                        ?.airLineOrShippingLine
                                    }
                                  </div>
                                )}
                            </div>
                          </>
                        )}

                        {/* GSA */}
                        {[1, 2, 3].includes(
                          values?.rows?.[0]?.transportPlanning?.value,
                        ) && (
                          <div className="col-lg-3">
                            <NewSelect
                              options={gsaDDL || []}
                              label="GSA"
                              name={`rows[${index}].gsa`}
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].gsa`,
                                  valueOption,
                                );
                              }}
                              placeholder="GSA"
                              errors={errors}
                              value={values?.rows?.[index]?.gsa || ''}
                              touched={touched}
                            />
                            {errors?.rows &&
                              errors?.rows?.[index]?.gsa &&
                              touched.rows && (
                                <div className="text-danger">
                                  {errors?.rows?.[index]?.gsa}
                                </div>
                              )}
                          </div>
                        )}

                        {/* for AIR */}
                        {values?.rows?.[0]?.transportPlanning?.value === 1 && (
                          <>
                            {/* No of Pallet */}
                            <div className="col-lg-3">
                              <InputField
                                value={values?.rows?.[index]?.noOfPallets || ''}
                                label="No of Pallet"
                                name={`rows[${index}].noOfPallets`}
                                type="number"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].noOfPallets`,
                                    e.target.value,
                                  )
                                }
                              />
                              {errors?.rows &&
                                errors?.rows?.[index]?.noOfPallets &&
                                touched.rows && (
                                  <div className="text-danger">
                                    {errors?.rows?.[index]?.noOfPallets}
                                  </div>
                                )}
                            </div>

                            {/* iatanumber */}
                            <div className="col-lg-3">
                              <InputField
                                value={values?.rows?.[index]?.iatanumber || ''}
                                label="IATA Number"
                                name={`rows[${index}].iatanumber`}
                                type="number"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].iatanumber`,
                                    e.target.value,
                                  )
                                }
                              />
                              {errors?.rows?.[index]?.iatanumber &&
                                touched.rows && (
                                  <div className="text-danger">
                                    {errors.rows?.[index].iatanumber}
                                  </div>
                                )}
                            </div>
                            {/* Carton */}
                            <div className="col-lg-3">
                              <InputField
                                value={values?.rows?.[index]?.carton || ''}
                                label="Carton"
                                name={`rows[${index}].carton`}
                                type="number"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].carton`,
                                    e.target.value,
                                  )
                                }
                              />
                              {errors?.rows &&
                                errors?.rows?.[index]?.carton &&
                                touched.rows && (
                                  <div className="text-danger">
                                    {errors?.rows?.[index]?.carton}
                                  </div>
                                )}
                            </div>
                          </>
                        )}

                        {/* for SEA and land */}
                        {[2, 4].includes(
                          values?.rows?.[0]?.transportPlanning?.value,
                        ) && (
                          <>
                            {/* no Of Container */}
                            <div className="col-lg-3">
                              <InputField
                                value={
                                  values?.rows?.[index]?.noOfContainer || ''
                                }
                                // label="No of Container"
                                label={
                                  values?.rows?.[index]?.transportPlanning
                                    ?.value === 4
                                    ? 'No of Truck'
                                    : 'No of Container'
                                }
                                name={`rows[${index}].noOfContainer`}
                                type="number"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].noOfContainer`,
                                    e.target.value,
                                  )
                                }
                              />
                              {errors?.rows &&
                                errors?.rows?.[index]?.noOfContainer &&
                                touched.rows && (
                                  <div className="text-danger">
                                    {errors?.rows?.[index]?.noOfContainer}
                                  </div>
                                )}
                            </div>
                            {/* Vessel name */}
                            {values?.rows?.[0]?.transportPlanning?.value ===
                              2 && (
                              <div className="col-lg-3">
                                <InputField
                                  value={
                                    values?.rows?.[index]?.vesselName || ''
                                  }
                                  label="Vessel Name"
                                  name={`rows[${index}].vesselName`}
                                  type="text"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].vesselName`,
                                      e.target.value,
                                    )
                                  }
                                />
                                {errors?.rows &&
                                  errors?.rows?.[index]?.vesselName &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors?.rows?.[index]?.vesselName}
                                    </div>
                                  )}
                              </div>
                            )}
                            {/*  Subidha Access Number*/}
                            {values?.rows?.[0]?.transportPlanning?.value ===
                              4 && (
                              <div className="col-lg-3">
                                <InputField
                                  value={
                                    values?.rows?.[index]
                                      ?.subidhaAccessNumber || ''
                                  }
                                  label="Subidha Access Number"
                                  name={`rows[${index}].subidhaAccessNumber`}
                                  type="text"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].subidhaAccessNumber`,
                                      e.target.value,
                                    )
                                  }
                                />
                                {errors?.rows &&
                                  errors?.rows?.[index]?.subidhaAccessNumber &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {
                                        errors?.rows?.[index]
                                          ?.subidhaAccessNumber
                                      }
                                    </div>
                                  )}
                              </div>
                            )}

                            {/* Voyage Number */}
                            {values?.rows?.[0]?.transportPlanning?.value ===
                              2 && (
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows?.[index]?.voyagaNo || ''}
                                  label="Voyage Number"
                                  name={`rows[${index}].voyagaNo`}
                                  type="text"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].voyagaNo`,
                                      e.target.value,
                                    )
                                  }
                                />
                                {errors?.rows &&
                                  errors?.rows?.[index]?.voyagaNo &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors?.rows?.[index]?.voyagaNo}
                                    </div>
                                  )}
                              </div>
                            )}

                            {/* Arrival Date & Time */}
                            <div className="col-lg-3">
                              <InputField
                                value={
                                  values?.rows?.[index]?.arrivalDateTime || ''
                                }
                                label={
                                  values?.rows?.[index]?.transportPlanning
                                    ?.value === 4
                                    ? 'Estimated Arrival Date At Land Port'
                                    : 'Estimated Arrival Date & Time'
                                }
                                name={`rows[${index}].arrivalDateTime`}
                                type="date"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].arrivalDateTime`,
                                    e.target.value,
                                  )
                                }
                              />
                              {errors?.rows &&
                                errors?.rows?.[index]?.arrivalDateTime &&
                                touched.rows && (
                                  <div className="text-danger">
                                    {errors?.rows?.[index]?.arrivalDateTime}
                                  </div>
                                )}
                            </div>
                            {/* BerthDate  */}
                            {values?.rows?.[0]?.transportPlanning?.value ===
                              2 && (
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows?.[index]?.berthDate || ''}
                                  label="Estimated Berth Date"
                                  name={`rows[${index}].berthDate`}
                                  type="date"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].berthDate`,
                                      e.target.value,
                                    )
                                  }
                                />
                                {errors?.rows &&
                                  errors?.rows?.[index]?.berthDate &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors?.rows?.[index]?.berthDate}
                                    </div>
                                  )}
                              </div>
                            )}

                            {/* CutOffDate */}
                            {values?.rows?.[0]?.transportPlanning?.value ===
                              2 && (
                              <div className="col-lg-3">
                                <InputField
                                  value={
                                    values?.rows?.[index]?.cutOffDate || ''
                                  }
                                  label={'Estimated Cut Off Date'}
                                  name={`rows[${index}].cutOffDate`}
                                  type="date"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].cutOffDate`,
                                      e.target.value,
                                    )
                                  }
                                />
                                {errors?.rows &&
                                  errors?.rows?.[index]?.cutOffDate &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors?.rows?.[index]?.cutOffDate}
                                    </div>
                                  )}
                              </div>
                            )}
                            {/* Subidha Access Date */}
                            {values?.rows?.[0]?.transportPlanning?.value ===
                              4 && (
                              <div className="col-lg-3">
                                <InputField
                                  value={
                                    values?.rows?.[index]?.subidhaAccessDate ||
                                    ''
                                  }
                                  label={'Subidha Access Date'}
                                  name={`rows[${index}].subidhaAccessDate`}
                                  type="date"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].subidhaAccessDate`,
                                      e.target.value,
                                    )
                                  }
                                />
                                {errors?.rows &&
                                  errors?.rows?.[index]?.subidhaAccessDate &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors?.rows?.[index]?.subidhaAccessDate}
                                    </div>
                                  )}
                              </div>
                            )}
                          </>
                        )}

                        {/* EstimatedTimeOfDepart */}
                        <div className="col-lg-3">
                          <InputField
                            value={
                              values?.rows?.[index]?.estimatedTimeOfDepart || ''
                            }
                            label={
                              values?.rows?.[index]?.transportPlanning
                                ?.value === 4
                                ? 'Date of Depart'
                                : 'Estimated Time Of Depart'
                            }
                            type="date"
                            onChange={(e) =>
                              setFieldValue(
                                `rows[${index}].estimatedTimeOfDepart`,
                                e.target.value,
                              )
                            }
                          />
                          {errors?.rows &&
                            errors?.rows?.[index]?.estimatedTimeOfDepart &&
                            touched.rows && (
                              <div className="text-danger">
                                {errors?.rows?.[index]?.estimatedTimeOfDepart}
                              </div>
                            )}
                        </div>
                        {/* S.B No */}
                        <div className="col-lg-3">
                          <InputField
                            value={values?.rows?.[index]?.strSbNo || ''}
                            label="S.B No"
                            name={`rows[${index}].strSbNo`}
                            type="text"
                            onChange={(e) =>
                              setFieldValue(
                                `rows[${index}].strSbNo`,
                                e.target.value,
                              )
                            }
                          />
                          {errors?.rows &&
                            errors?.rows?.[index]?.strSbNo &&
                            touched.rows && (
                              <div className="text-danger">
                                {errors?.rows?.[index]?.strSbNo}
                              </div>
                            )}
                        </div>

                        {/* S.B Date */}
                        <div className="col-lg-3">
                          <InputField
                            value={values?.rows?.[index]?.dteSbDate || ''}
                            label="S.B Date"
                            name={`rows[${index}].dteSbDate`}
                            type="date"
                            onChange={(e) =>
                              setFieldValue(
                                `rows[${index}].dteSbDate`,
                                e.target.value,
                              )
                            }
                          />
                          {errors?.rows &&
                            errors?.rows?.[index]?.dteSbDate &&
                            touched.rows && (
                              <div className="text-danger">
                                {errors?.rows?.[index]?.dteSbDate}
                              </div>
                            )}
                        </div>
                        {[1].includes(
                          values?.rows?.[0]?.transportPlanning?.value,
                        ) && (
                          <div className="col-lg-3">
                            <InputField
                              value={values?.rows?.[index]?.rate || ''}
                              label="Rate"
                              name={`rows[${index}].rate`}
                              type="number"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].rate`,
                                  e.target.value,
                                )
                              }
                            />
                            {errors?.rows?.[index]?.rate && touched.rows && (
                              <div className="text-danger">
                                {errors?.rows?.[index]?.rate}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* container details  for sea and land */}
                      {[2, 4].includes(
                        values?.rows[0]?.transportPlanning?.value,
                      ) && (
                        <div className="form-group row global-form">
                          {/* PO Number */}
                          <div className="col-lg-2">
                            <NewSelect
                              name={`rows[${index}].poNumber`}
                              options={poNumberDDL || []}
                              value={values?.rows?.[index]?.poNumber}
                              label="PO Number"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].poNumber`,
                                  valueOption,
                                );
                                setFieldValue(`rows[${index}].style`, '');
                                setFieldValue(`rows[${index}].color`, '');
                                setFieldValue(
                                  `rows[${index}].quantity`,
                                  valueOption?.numberOfPackage || '',
                                );
                                setFieldValue(
                                  `rows[${index}].cbm`,
                                  valueOption?.perUnitCbm || '',
                                );
                                setFieldValue(
                                  `rows[${index}].kgs`,
                                  valueOption?.perUnitGrossWeight || '',
                                );
                              }}
                              placeholder="Select"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {/* Style */}
                          <div className="col-lg-2">
                            <NewSelect
                              name={`rows[${index}].style`}
                              options={
                                styleDDL?.filter(
                                  (i) =>
                                    i?.bookingRequestRowId ===
                                    values?.rows?.[index]?.poNumber
                                      ?.bookingRequestRowId,
                                ) || []
                              }
                              value={values?.rows?.[index]?.style}
                              label="Style"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].style`,
                                  valueOption,
                                );
                              }}
                              placeholder="Select"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {/* Color */}
                          <div className="col-lg-2">
                            <NewSelect
                              name={`rows[${index}].color`}
                              options={
                                colorDDL?.filter(
                                  (i) =>
                                    i?.bookingRequestRowId ===
                                    values?.rows?.[index]?.poNumber
                                      ?.bookingRequestRowId,
                                ) || []
                              }
                              value={values?.rows?.[index]?.color || ''}
                              label="Color"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].color`,
                                  valueOption,
                                );
                              }}
                              placeholder="Select"
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          {/* Container No */}
                          <div className="col-lg-2">
                            <InputField
                              value={
                                values?.rows?.[index]?.containerNumber || ''
                              }
                              label={
                                values?.rows?.[index]?.transportPlanning
                                  ?.value === 4
                                  ? 'Truck No'
                                  : 'Container No'
                              }
                              name={`rows[${index}].containerNumber`}
                              type="text"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].containerNumber`,
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          {/* Seal No */}
                          {values?.rows?.[0]?.transportPlanning?.value ===
                            2 && (
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows?.[index]?.sealNumber || ''}
                                label="Seal No"
                                name={`rows[${index}].sealNumber`}
                                type="text"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].sealNumber`,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          )}

                          {/* Size */}
                          <div className="col-lg-2">
                            {/* <InputField
                            value={values?.rows?.[index]?.size || ''}
                            label="Container Size"
                            name={`rows[${index}].size`}
                            type="text"
                            onChange={(e) =>
                              setFieldValue(
                                `rows[${index}].size`,
                                e.target.value,
                              )
                            }
                          /> */}
                            <NewSelect
                              name={`rows[${index}].size`}
                              options={
                                values?.rows?.[0]?.transportPlanning?.value ===
                                4
                                  ? truckSize
                                  : [
                                      { value: '20', label: '20” FR OGG' },
                                      { value: '40', label: '40” FR OGG' },
                                      { value: '40H', label: '40H FR OGH' },
                                      { value: '20', label: '20” FR IGG' },
                                      { value: '40', label: '40” FR IGG' },
                                      { value: '40H', label: '40H FR IGG' },
                                      { value: '20', label: '20” OT' },
                                      { value: '40', label: '40” OT' },
                                      { value: '40H', label: '40H OT' },
                                    ]
                              }
                              value={values?.rows?.[index]?.size}
                              label={
                                values?.rows?.[index]?.transportPlanning
                                  ?.value === 4
                                  ? 'Truck Size'
                                  : 'Container Size'
                              }
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].size`,
                                  valueOption,
                                );
                              }}
                              placeholder="Select"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {/* Rate */}
                          {values?.rows?.[0]?.transportPlanning?.value ===
                            2 && (
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows?.[index]?.rate || ''}
                                label="Rate"
                                name={`rows[${index}].rate`}
                                type="number"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].rate`,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          )}

                          {/* CBM */}
                          <div className="col-lg-2">
                            <InputField
                              value={values?.rows?.[index]?.cbm || ''}
                              label="CBM"
                              name={`rows[${index}].cbm`}
                              type="number"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].cbm`,
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          {/* KGS */}
                          <div className="col-lg-2">
                            <InputField
                              value={values?.rows?.[index]?.kgs || ''}
                              label={
                                [3].includes(
                                  values?.rows[0]?.transportPlanning?.value,
                                )
                                  ? 'Chargeable Weight'
                                  : 'KGS'
                              }
                              name={`rows[${index}].kgs`}
                              type="number"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].kgs`,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          {/* Quantity */}
                          {values?.rows?.[0]?.transportPlanning?.value ===
                            2 && (
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows?.[index]?.quantity || ''}
                                label="Cartoon Quantity"
                                name={`rows[${index}].quantity`}
                                type="number"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].quantity`,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          )}
                          <div className="col-lg-2 pt-4">
                            <button
                              onClick={() => {
                                if (
                                  values?.transportPlanningMode?.value === 4
                                ) {
                                  if (
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.poNumber ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.style ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.color ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.containerNumber ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.size ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.cbm ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.kgs
                                  ) {
                                    toast.error('Please fill all fields');
                                    return;
                                  }
                                }
                                if (
                                  values?.transportPlanningMode?.value === 2
                                ) {
                                  if (
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.poNumber ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.style ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.color ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.containerNumber ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.sealNumber ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.size ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.rate ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.quantity ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.cbm ||
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.kgs
                                  ) {
                                    toast.error('Please fill all fields');
                                    return;
                                  }
                                }
                                const containerDesc =
                                  formikRef.current?.values?.rows?.[index]
                                    ?.containerDesc || [];
                                containerDesc.push({
                                  poNumber:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.poNumber?.label,
                                  style:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.style?.label,
                                  color:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.color?.label,
                                  containerNumber:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.containerNumber,
                                  sealNumber:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.sealNumber,
                                  size:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.size?.label,
                                  quantity:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.quantity,
                                  rate:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.rate,
                                  cbm:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.cbm,
                                  kgs:
                                    formikRef.current?.values?.rows?.[index]
                                      ?.kgs,
                                });
                                setFieldValue(
                                  `rows[${index}].containerDesc`,
                                  containerDesc,
                                );
                                setFieldValue(`rows[${index}].poNumber`, '');
                                setFieldValue(`rows[${index}].style`, '');
                                setFieldValue(`rows[${index}].color`, '');
                                setFieldValue(
                                  `rows[${index}].containerNumber`,
                                  '',
                                );
                                setFieldValue(`rows[${index}].sealNumber`, '');
                                setFieldValue(`rows[${index}].size`, '');
                                setFieldValue(`rows[${index}].rate`, '');
                                setFieldValue(`rows[${index}].quantity`, '');
                                setFieldValue(`rows[${index}].cbm`, '');
                                setFieldValue(`rows[${index}].kgs`, '');
                              }}
                              className="btn btn-primary"
                              type="button"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                      {/* containerDesc table */}
                      <div className="pt-4">
                        {formikRef.current?.values?.rows?.[index]?.containerDesc
                          ?.length > 0 && (
                          <table
                            table
                            className="table table-bordered global-table"
                          >
                            <thead>
                              <tr>
                                <th>PO Number</th>
                                <th>Style</th>
                                <th>Color</th>
                                <th>
                                  {values?.rows?.[index]?.transportPlanning
                                    ?.value === 4
                                    ? 'Truck No'
                                    : 'Container No'}
                                </th>
                                {values?.rows?.[index]?.transportPlanning
                                  ?.value === 2 && <th>Seal No</th>}
                                <th>Size</th>
                                {values?.rows?.[index]?.transportPlanning
                                  ?.value === 2 && <th>Rate</th>}
                                {values?.rows?.[index]?.transportPlanning
                                  ?.value === 2 && <th>Quantity</th>}
                                <th>CBM</th>
                                <th>KGS</th>
                                <th
                                  style={{
                                    width: '70px',
                                  }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {formikRef.current?.values?.rows[
                                index
                              ]?.containerDesc?.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item?.poNumber}</td>
                                    <td>{item?.style}</td>
                                    <td>{item?.color}</td>
                                    <td>{item?.containerNumber}</td>
                                    {values?.rows?.[index]?.transportPlanning
                                      ?.value === 2 && (
                                      <td>{item?.sealNumber}</td>
                                    )}
                                    <td>{item?.size}</td>
                                    {values?.rows?.[index]?.transportPlanning
                                      ?.value === 2 && <td>{item?.rate}</td>}
                                    {values?.rows?.[index]?.transportPlanning
                                      ?.value === 2 && (
                                      <td>{item?.quantity}</td>
                                    )}
                                    <td>{item?.cbm}</td>
                                    <td>{item?.kgs}</td>
                                    <td>
                                      <IconButton
                                        onClick={() => {
                                          const containerDesc =
                                            formikRef.current?.values?.rows[0]
                                              ?.containerDesc || [];
                                          containerDesc.splice(index, 1);
                                          setFieldValue(
                                            `rows[${0}].containerDesc`,
                                            containerDesc,
                                          );
                                        }}
                                        color="error"
                                        size="small"
                                      >
                                        <IDelete />
                                      </IconButton>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                      {/* Flight Schedule */}
                      <div className="form-group row global-form">
                        <div className="col-lg-12">
                          <p style={{ fontSize: 16, fontWeight: 600 }}>
                            {[2].includes(
                              values?.rows[0]?.transportPlanning?.value,
                            )
                              ? 'Shipping Schedule'
                              : [4].includes(
                                  values?.rows[0]?.transportPlanning?.value,
                                )
                              ? 'Transport Schedule'
                              : 'Flight Schedule'}
                          </p>
                        </div>
                        {/* truck type ddl */}
                        {values?.rows[0]?.transportPlanning?.value === 4 && (
                          <div className="col-lg-3">
                            <NewSelect
                              name={`rows[${index}].truckType`}
                              options={truckTypeDDL || []}
                              value={values?.rows?.[index]?.truckType}
                              label="Truck Type"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].truckType`,
                                  valueOption,
                                );
                              }}
                              placeholder="Truck Type"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )}
                        {/* From date */}
                        <div className="col-lg-3">
                          {[2, 4].includes(
                            values?.rows[0]?.transportPlanning?.value,
                          ) ? (
                            <InputField
                              label="From"
                              type="text"
                              name="fromPort"
                              value={
                                values?.rows?.[index]?.fromPort?.label || ''
                              }
                              onChange={(e) =>
                                setFieldValue(`rows[${index}].fromPort`, {
                                  label: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <>
                              {' '}
                              <NewSelect
                                name="fromPort"
                                options={airPortShortCodeDDL || []}
                                value={values?.rows?.[index]?.fromPort || ''}
                                label="From"
                                onChange={(valueOption) => {
                                  setFieldValue(
                                    `rows[${index}].fromPort`,
                                    valueOption,
                                  );
                                }}
                                placeholder="From"
                                errors={errors}
                                touched={touched}
                              />
                            </>
                          )}
                        </div>
                        <div className="col-lg-3">
                          {[2, 4].includes(
                            values?.rows[0]?.transportPlanning?.value,
                          ) ? (
                            <InputField
                              label="To"
                              type="text"
                              name="toPort"
                              value={values?.rows?.[index]?.toPort?.label || ''}
                              onChange={(e) =>
                                setFieldValue(`rows[${index}].toPort`, {
                                  label: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <NewSelect
                              name="toPort"
                              options={airPortShortCodeDDL || []}
                              value={values?.rows?.[index]?.toPort || ''}
                              label="To"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].toPort`,
                                  valueOption,
                                );
                              }}
                              placeholder="To"
                              errors={errors}
                              touched={touched}
                            />
                          )}
                        </div>
                        {/* for sea 2 , for air 1 */}
                        <div className="col-lg-3">
                          <InputField
                            label={
                              values?.rows[0]?.transportPlanning?.value === 2
                                ? 'Vessel Name'
                                : values?.rows[0]?.transportPlanning?.value ===
                                  4
                                ? 'Truck No'
                                : 'Flight Number'
                            }
                            type="text"
                            name="flightNumber"
                            value={values?.rows?.[index]?.flightNumber || ''}
                            onChange={(e) =>
                              setFieldValue(
                                `rows[${index}].flightNumber`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            label="Date"
                            type="date"
                            name="flightDate"
                            value={values?.rows?.[index]?.flightDate || ''}
                            onChange={(e) =>
                              setFieldValue(
                                `rows[${index}].flightDate`,
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="col-lg-2 pt-4">
                          <button
                            onClick={() => {
                              if (
                                !formikRef.current?.values?.rows?.[index]
                                  ?.fromPort ||
                                !formikRef.current?.values?.rows?.[index]
                                  ?.toPort ||
                                !formikRef.current?.values?.rows?.[index]
                                  ?.flightDate
                              ) {
                                toast.error('Please fill all fields');
                                return;
                              } else {
                                if (
                                  !formikRef.current?.values?.rows?.[index]
                                    ?.flightNumber
                                ) {
                                  toast.error(
                                    values?.rows[0]?.transportPlanning
                                      ?.value === 4
                                      ? 'Please fill Truck No'
                                      : 'Please fill Flight Number',
                                  );
                                  return;
                                }
                                if (
                                  values?.rows[0]?.transportPlanning?.value ===
                                  4
                                ) {
                                  if (
                                    !formikRef.current?.values?.rows?.[index]
                                      ?.truckType
                                  ) {
                                    toast.error('Please fill Truck Type');
                                    return;
                                  }
                                }
                              }
                              const containerDesc =
                                formikRef.current?.values?.rows?.[index]
                                  ?.airTransportRow || [];
                              containerDesc.push({
                                truckType:
                                  formikRef.current?.values?.rows?.[index]
                                    ?.truckType?.label || '',
                                fromPort:
                                  formikRef.current?.values?.rows?.[index]
                                    ?.fromPort?.label || '',
                                toPort:
                                  formikRef.current?.values?.rows?.[index]
                                    ?.toPort?.label || '',
                                flightDate:
                                  formikRef.current?.values?.rows?.[index]
                                    ?.flightDate,
                                flightNumber:
                                  formikRef.current?.values?.rows?.[index]
                                    ?.flightNumber || '',
                                scheduleVesselName:
                                  formikRef.current?.values?.rows?.[index]
                                    ?.scheduleVesselName || '',
                              });
                              setFieldValue(
                                `rows[${index}].airTransportRow`,
                                containerDesc,
                              );
                              setFieldValue(`rows[${index}].truckType`, '');
                              setFieldValue(`rows[${index}].fromPort`, '');
                              setFieldValue(`rows[${index}].toPort`, '');
                              setFieldValue(`rows[${index}].flightDate`, '');
                              setFieldValue(`rows[${index}].flightNumber`, '');
                            }}
                            className="btn btn-primary"
                            type="button"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      {/* Flight Schedule table */}
                      <div className="pt-4">
                        {formikRef.current?.values?.rows?.[index]
                          ?.airTransportRow?.length > 0 && (
                          <table
                            table
                            className="table table-bordered global-table"
                          >
                            <thead>
                              <tr>
                                <th>SL</th>
                                {values?.rows[0]?.transportPlanning?.value ===
                                  4 && <th>Truck Type</th>}
                                <th>From</th>
                                <th>To</th>
                                <th>Date</th>
                                <th>
                                  {values?.rows[0]?.transportPlanning?.value ===
                                  2
                                    ? 'Vessel Name'
                                    : values?.rows[0]?.transportPlanning
                                        ?.value === 4
                                    ? 'Truck No'
                                    : 'Flight Number'}
                                </th>

                                <th style={{ width: '30px' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formikRef.current?.values?.rows[
                                index
                              ]?.airTransportRow?.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    {values?.rows[0]?.transportPlanning
                                      ?.value === 4 && (
                                      <td>{item?.truckType}</td>
                                    )}
                                    <td>{item?.fromPort}</td>
                                    <td>{item?.toPort}</td>
                                    <td>{item?.flightDate}</td>
                                    <td>{item?.flightNumber}</td>
                                    <td>
                                      <IconButton
                                        onClick={() => {
                                          const containerDesc =
                                            formikRef.current?.values?.rows[0]
                                              ?.airTransportRow || [];
                                          containerDesc.splice(0, 1);
                                          setFieldValue(
                                            `rows[${0}].airTransportRow`,
                                            containerDesc,
                                          );
                                        }}
                                        color="error"
                                        size="small"
                                      >
                                        <IDelete />
                                      </IconButton>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TransportModal;
