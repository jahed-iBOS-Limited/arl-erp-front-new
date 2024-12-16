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
import './style.css';
import useAxiosPut from '../../../../_helper/customHooks/useAxiosPut';
const validationSchema = Yup.object().shape({
  pickupLocation: Yup.string().required('Pickup Location is required'),
  noOfPallets: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 1,
    then: Yup.string().required('No of Pallets is required'),
  }),
  airLine: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 1,
    then: Yup.string().required('Air Line is required'),
  }),
  carton: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 1,
    then: Yup.string().required('Carton is required'),
  }),
  // noOfContainer: Yup.string().when('transportPlanning', {
  //   is: (val) => val?.value === 2,
  //   then: Yup.string().required('No of Container is required'),
  // }),
  shippingLine: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 2,
    then: Yup.string().required('Shipping Line is required'),
  }),
  vesselName: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 2,
    then: Yup.string().required('Vessel Name is required'),
  }),
  voyagaNo: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 2,
    then: Yup.string().required('Voyage Number is required'),
  }),
  arrivalDateTime: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 2,
    then: Yup.string().required('Arrival Date & Time is required'),
  }),
  transportMode: Yup.object()
    .shape({
      label: Yup.string().required('Transport Mode is required'),
      value: Yup.number().required('Transport Mode is required'),
    })
    .nullable()
    .typeError('Transport Mode is required'),
});
function TransportModal({ rowClickData, CB }) {
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
  // const bookingData = shipBookingRequestGetById || {};
  const [transportModeDDL, setTransportModeDDL] = useAxiosGet();
  const [gsaDDL, setGSADDL] = useAxiosGet();
  const [
    airServiceProviderDDLData,
    getAirServiceProviderDDL,
    ,
    setAirServiceProviderDDL,
  ] = useAxiosGet();
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
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
        (resData) => {
          if (formikRef.current) {
            const data = resData || {};
            const isAirType = data?.modeOfTransport === 'Air';
            const totalNumberOfPackages = data?.rowsData?.reduce(
              (acc, item) => acc + (+item?.totalNumberOfPackages || 0),
              0,
            );
            const transportPlanning = data?.transportPlanning || {};
            formikRef.current.setFieldValue(`rows[0].transportPlanning`, {
              ...(data?.modeOfTransport === 'Air'
                ? { value: 1, label: 'Air' }
                : { value: 2, label: 'Sea' }),
            });
            formikRef.current.setFieldValue(
              `rows[0].pickupLocation`,
              transportPlanning?.pickupLocation || data?.pickupPlace || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].noOfPallets`,
              transportPlanning?.noOfPallets || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].shippingLine`,
              isAirType
                ? ''
                : transportPlanning?.airLineOrShippingLine
                ? {
                    value: transportPlanning?.airLineOrShippingLineId || 0,
                    label: transportPlanning?.airLineOrShippingLine,
                  }
                : '',
            );
            formikRef.current.setFieldValue(
              `rows[0].airLine`,
              isAirType
                ? transportPlanning?.airLineOrShippingLine
                  ? {
                      value: transportPlanning?.airLineOrShippingLineId || 0,
                      label: transportPlanning?.airLineOrShippingLine,
                    }
                  : ''
                : '',
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
              `rows[0].noOfContainer`,
              transportPlanning?.noOfContainer || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].vesselName`,
              transportPlanning?.vesselName || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].voyagaNo`,
              transportPlanning?.voyagaNo || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].arrivalDateTime`,
              transportPlanning?.arrivalDateTime || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].berthDate`,
              transportPlanning?.berthDate || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].cutOffDate`,
              transportPlanning?.cutOffDate || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].estimatedTimeOfDepart`,
              transportPlanning?.estimatedTimeOfDepart
                ? moment(transportPlanning?.estimatedTimeOfDepart).format(
                    'YYYY-MM-DDTHH:mm:ss',
                  )
                : '',
            );
            formikRef.current.setFieldValue(
              `rows[0].transportMode`,
              transportPlanning?.transportMode
                ? {
                    value: transportPlanning?.transportModeId || 0,
                    label: transportPlanning?.transportMode,
                  }
                : data?.confTransportMode
                ? { value: 0, label: data?.confTransportMode }
                : '',
            );
            formikRef.current.setFieldValue(
              `rows[0].gsa`,
              transportPlanning?.gsaName
                ? {
                    value: transportPlanning?.gsaId || 0,
                    label: transportPlanning?.gsaName,
                  }
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
                fromPort: item?.fromPort || '',
                toPort: item?.toPort || '',
                flightNumber: item?.flightNumber || '',
                flightDate: item?.flightDate
                  ? moment(item?.flightDate).format('YYYY-MM-DD')
                  : '',
              })) || [],
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
                const values = [];
                data.rowsData.forEach((row) => {
                  if (row.dimensionRow && row.dimensionRow.length > 0) {
                    row.dimensionRow.forEach((dim) => {
                      if (dim[key] && !values.includes(dim[key])) {
                        values.push(dim[key]);
                      }
                    });
                  }
                });
                return values.map((value) => ({ value, label: value }));
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
        },
      );
      GetAirServiceProviderDDL(rowClickData?.modeOfTransport === 'Sea' ? 1 : 2);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTransportModeDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetModeOfTypeListDDL?categoryId=${4}`,
    );
    setGSADDL(
      `${imarineBaseUrl}/domain/ShippingService/GetAirServiceProviderDDL?typeId=${3}`,
    );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const GetAirServiceProviderDDL = (typeId) => {
    getAirServiceProviderDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetAirServiceProviderDDL?typeId=${typeId}`,
      (res) => {
        setAirServiceProviderDDL(res);
      },
    );
  };
  const saveHandler = (values, cb) => {
    const bookingData = shipBookingRequestGetById || {};
    const transportId = bookingData?.transportPlanning?.transportId || 0;
    const row = values?.rows[0];
    const payload = {
      bookingId: bookingRequestId || 0,
      pickupLocation: row?.pickupLocation || '',
      pickupDate: new Date(),
      vehicleInfo: row?.vehicleInfo || '',
      noOfPallets: row?.noOfPallets || 0,
      carton: row?.carton || 0,
      iatanumber: row?.iatanumber || '',
      noOfContainer: row?.noOfContainer || 0,
      airLineOrShippingLine:
        row?.airLine?.label || row?.shippingLine?.label || '',
      airLineOrShippingLineId:
        row?.airLine?.value || row?.shippingLine?.value || 0,
      vesselName: row?.vesselName || '',
      voyagaNo: row?.voyagaNo || '',
      ...(row?.arrivalDateTime && {
        arrivalDateTime: moment(row?.arrivalDateTime).format(
          'YYYY-MM-DDTHH:mm:ss',
        ),
      }),
      ...(row?.berthDate && {
        berthDate: moment(row?.berthDate).format('YYYY-MM-DDTHH:mm:ss'),
      }),
      ...(row?.cutOffDate && {
        cutOffDate: moment(row?.cutOffDate).format('YYYY-MM-DDTHH:mm:ss'),
      }),
      ...(row?.estimatedTimeOfDepart && {
        estimatedTimeOfDepart: moment(row?.estimatedTimeOfDepart).format(
          'YYYY-MM-DDTHH:mm:ss',
        ),
      }),
      gsaName: row?.gsa?.label || '',
      gsaId: row?.gsa?.value || 0,
      mawbnumber: row?.mawbnumber || '',
      transportMode: row?.transportMode?.label || 0,
      transportId: transportId,
      strSbNo: row?.strSbNo || '',
      ...(row?.dteSbDate && {
        dteSbDate: moment(row?.dteSbDate).format('YYYY-MM-DDTHH:mm:ss'),
      }),
      isActive: true,
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
        fromPort: item?.fromPort || '',
        toPort: item?.toPort || '',
        flightNumber: item?.flightNumber || '',
        flightDate: moment(item?.flightDate).format('YYYY-MM-DDTHH:mm:ss'),
        isActive: true,
      })),
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
        `${imarineBaseUrl}/domain/ShippingService/SaveShippingTransportPlanning'
        }`,
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
              airLine: '',
              shippingLine: '',
              iatanumber: '',
              vesselName: '',
              voyagaNo: '',
              departureDateTime: '',
              arrivalDateTime: '',
              transportMode: '',
              berthDate: '',
              cutOffDate: '',
              estimatedTimeOfDepart: '',
              containerDesc: [],
              airTransportRow: [],
              fromPort: '',
              toPort: '',
              flightDate: '',
              flightNumber: '',
              scheduleVesselName: '',
              gsa: '',
              mawbnumber: '',
            },
          ],
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
          <>
            {console.log(values, 'values')}
            {/* <h1>{JSON.stringify(errors)}</h1> */}
            <Form className="form form-label-right">
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end">
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
                              options={
                                [
                                  {
                                    value: 1,
                                    label: 'Air',
                                  },
                                  {
                                    value: 2,
                                    label: 'Sea',
                                  },
                                ] || []
                              }
                              value={values.rows[index].transportPlanning}
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
                              value={values?.rows[index]?.pickupLocation || ''}
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
                          {/* Pickup date */}
                          {/* <div className="col-lg-3">
                            <InputField
                              value={values?.rows[index]?.pickupDate || ''}
                              label="Estimated Pickup Date"
                              name={`rows[${index}].pickupDate`}
                              type="date"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].pickupDate`,
                                  e.target.value,
                                )
                              }
                            />
                            {errors?.rows &&
                              errors?.rows?.[index]?.pickupDate &&
                              touched.rows && (
                                <div className="text-danger">
                                  {errors?.rows?.[index]?.pickupDate}
                                </div>
                              )}
                          </div> */}
                          {/* Vehicle info */}
                          {/* <div className="col-lg-3">
                            <InputField
                              value={values.rows[index]?.vehicleInfo || ''}
                              label="Vehicle Info"
                              name={`rows[${index}].vehicleInfo`}
                              type="text"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].vehicleInfo`,
                                  e.target.value,
                                )
                              }
                            />
                            {errors?.rows &&
                              errors?.rows?.[index]?.vehicleInfo &&
                              touched.rows && (
                                <div className="text-danger">
                                  {errors?.rows?.[index]?.vehicleInfo}
                                </div>
                              )}
                          </div> */}

                          {/* for AIR */}
                          {values?.rows[0]?.transportPlanning?.value === 1 && (
                            <>
                              {/* No of Pallet */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.noOfPallets || ''}
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
                              {/* Air Line */}
                              <div className="col-lg-3">
                                <NewSelect
                                  name={`rows[${index}].airLine`}
                                  options={airServiceProviderDDLData || []}
                                  value={values.rows[index].airLine}
                                  label="Air Line"
                                  onChange={(valueOption) => {
                                    setFieldValue(
                                      `rows[${index}].airLine`,
                                      valueOption,
                                    );
                                  }}
                                  placeholder="Air line"
                                  errors={errors}
                                  touched={touched}
                                />
                                {errors?.rows &&
                                  errors?.rows?.[index]?.airLine &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors?.rows?.[index]?.airLine}
                                    </div>
                                  )}
                              </div>
                              {/* GSA */}
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
                                  value={values?.rows?.[index]?.gsa}
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
                              {/* iatanumber */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.iatanumber || ''}
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
                                {errors.rows &&
                                  errors.rows[index]?.iatanumber &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors.rows[index].iatanumber}
                                    </div>
                                  )}
                              </div>
                              {/* Carton */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.carton || ''}
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

                          {/* for SEA */}
                          {values?.rows?.[0]?.transportPlanning?.value ===
                            2 && (
                            <>
                              {/* no Of Container */}
                              <div className="col-lg-3">
                                <InputField
                                  value={
                                    values?.rows[index]?.noOfContainer || ''
                                  }
                                  label="No of Container"
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
                              {/* Shipping line */}
                              <div className="col-lg-3">
                                <NewSelect
                                  options={airServiceProviderDDLData || []}
                                  label="Shipping Line"
                                  name={`rows[${index}].shippingLine`}
                                  onChange={(valueOption) => {
                                    setFieldValue(
                                      `rows[${index}].shippingLine`,
                                      valueOption,
                                    );
                                  }}
                                  placeholder="Shipping Line"
                                  errors={errors}
                                  touched={touched}
                                  value={values?.rows?.[index]?.shippingLine}
                                />
                                {errors?.rows &&
                                  errors?.rows?.[index]?.shippingLine &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors?.rows?.[index]?.shippingLine}
                                    </div>
                                  )}
                              </div>

                              {/* GSA */}
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
                                  touched={touched}
                                  value={values?.rows?.[index]?.gsa}
                                />
                                {errors?.rows &&
                                  errors?.rows?.[index]?.gsa &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors?.rows?.[index]?.gsa}
                                    </div>
                                  )}
                              </div>
                              {/* Vessel name */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.vesselName || ''}
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
                              {/* Voyage Number */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.voyagaNo || ''}
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
                              {/* Arrival Date & Time */}
                              <div className="col-lg-3">
                                <InputField
                                  value={
                                    values?.rows[index]?.arrivalDateTime || ''
                                  }
                                  label="Estimated Arrival Date & Time"
                                  name={`rows[${index}].arrivalDateTime`}
                                  type="datetime-local"
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
                            </>
                          )}

                          {/* Departure Date & Time */}
                          {/* <div className="col-lg-3">
                  <InputField
                    value={values?.departureDateTime}
                    label="Departure Date & Time"
                    name="departureDateTime"
                    type="datetime-local"
                    onChange={(e) =>
                      setFieldValue("departureDateTime", e.target.value)
                    }
                  />
                </div> */}

                          {/* Transport Mode */}
                          <div className="col-lg-3">
                            <NewSelect
                              name={`rows[${index}].transportMode`}
                              // options={transportModeDDL || []}
                              options={
                                transportModeDDL?.filter((item) => {
                                  if (
                                    values?.transportPlanning?.label === 'Air'
                                  ) {
                                    return [19, 20, 30, 31].includes(
                                      item?.value,
                                    );
                                  } else {
                                    return [17, 18, 30, 31].includes(
                                      item?.value,
                                    );
                                  }
                                }) || []
                              }
                              value={values?.rows[index]?.transportMode}
                              label="Transport Mode"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].transportMode`,
                                  valueOption,
                                );
                              }}
                              placeholder="Transport Mode"
                              errors={errors}
                              touched={touched}
                            />
                            {errors?.rows &&
                              errors?.rows?.[index]?.transportMode &&
                              touched.rows &&
                              touched.rows[index]?.transportMode && (
                                <div className="text-danger">
                                  {errors?.rows?.[index]?.transportMode.label ||
                                    errors?.rows?.[index]?.transportMode}
                                </div>
                              )}
                          </div>
                          {values?.rows?.[0]?.transportPlanning?.value ===
                            2 && (
                            <>
                              {/* BerthDate  */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.berthDate || ''}
                                  label="Estimated Berth Date"
                                  name={`rows[${index}].berthDate`}
                                  type="datetime-local"
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
                              {/* CutOffDate */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.cutOffDate || ''}
                                  label="Estimated Cut Off Date"
                                  name={`rows[${index}].cutOffDate`}
                                  type="datetime-local"
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
                            </>
                          )}

                          {/* EstimatedTimeOfDepart */}
                          <div className="col-lg-3">
                            <InputField
                              value={
                                values?.rows[index]?.estimatedTimeOfDepart || ''
                              }
                              label="Estimated Time Of Depart"
                              name={`rows[${index}].estimatedTimeOfDepart`}
                              type="datetime-local"
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
                              value={values?.rows[index]?.strSbNo || ''}
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
                              value={values?.rows[index]?.dteSbDate || ''}
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
                        </div>
                        {/* container details  for sea */}
                        {values?.rows[0]?.transportPlanning?.value === 2 && (
                          <div className="form-group row global-form">
                            {/* PO Number */}
                            <div className="col-lg-2">
                              <NewSelect
                                name={`rows[${index}].poNumber`}
                                options={poNumberDDL || []}
                                value={values?.rows[index]?.poNumber}
                                label="PO Number"
                                onChange={(valueOption) => {
                                  setFieldValue(
                                    `rows[${index}].poNumber`,
                                    valueOption,
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
                                options={styleDDL || []}
                                value={values?.rows[index]?.style}
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
                                options={colorDDL || []}
                                value={values?.rows[index]?.color || ''}
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
                                  values?.rows[index]?.containerNumber || ''
                                }
                                label="Container No"
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
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows[index]?.sealNumber || ''}
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

                            {/* Size */}
                            <div className="col-lg-2">
                              {/* <InputField
                                value={values?.rows[index]?.size || ''}
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
                                options={[
                                  { value: '20', label: '20” FR OGG' },
                                  { value: '40', label: '40” FR OGG' },
                                  { value: '40H', label: '40H FR OGH' },
                                  { value: '20', label: '20” FR IGG' },
                                  { value: '40', label: '40” FR IGG' },
                                  { value: '40H', label: '40H FR IGG' },
                                  { value: '20', label: '20” OT' },
                                  { value: '40', label: '40” OT' },
                                  { value: '40H', label: '40H OT' },
                                ]}
                                value={values?.rows[index]?.size}
                                label="Container Size"
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
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows[index]?.rate || ''}
                                label="Cartoon Rate"
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

                            {/* rate */}
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows[index]?.quantity || ''}
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

                            {/* CBM */}
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows[index]?.cbm || ''}
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
                                value={values?.rows[index]?.kgs || ''}
                                label="KGS"
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
                            <div className="col-lg-2 pt-4">
                              <button
                                onClick={() => {
                                  if (
                                    !formikRef.current?.values?.rows[index]
                                      ?.poNumber ||
                                    !formikRef.current?.values?.rows[index]
                                      ?.style ||
                                    !formikRef.current?.values?.rows[index]
                                      ?.color ||
                                    !formikRef.current?.values?.rows[index]
                                      ?.containerNumber ||
                                    !formikRef.current?.values?.rows[index]
                                      ?.sealNumber ||
                                    !formikRef.current?.values?.rows[index]
                                      ?.size ||
                                    !formikRef.current?.values?.rows[index]
                                      ?.rate ||
                                    !formikRef.current?.values?.rows[index]
                                      ?.quantity ||
                                    !formikRef.current?.values?.rows[index]
                                      ?.cbm ||
                                    !formikRef.current?.values?.rows[index]?.kgs
                                  ) {
                                    toast.error('Please fill all fields');
                                    return;
                                  }
                                  const containerDesc =
                                    formikRef.current?.values?.rows[index]
                                      ?.containerDesc || [];
                                  containerDesc.push({
                                    poNumber:
                                      formikRef.current?.values?.rows[index]
                                        ?.poNumber?.label,
                                    style:
                                      formikRef.current?.values?.rows[index]
                                        ?.style?.label,
                                    color:
                                      formikRef.current?.values?.rows[index]
                                        ?.color?.label,
                                    containerNumber:
                                      formikRef.current?.values?.rows[index]
                                        ?.containerNumber,
                                    sealNumber:
                                      formikRef.current?.values?.rows[index]
                                        ?.sealNumber,
                                    size:
                                      formikRef.current?.values?.rows[index]
                                        ?.size?.label,
                                    quantity:
                                      formikRef.current?.values?.rows[index]
                                        ?.quantity,
                                    rate:
                                      formikRef.current?.values?.rows[index]
                                        ?.rate,
                                    cbm:
                                      formikRef.current?.values?.rows[index]
                                        ?.cbm,
                                    kgs:
                                      formikRef.current?.values?.rows[index]
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
                                  setFieldValue(
                                    `rows[${index}].sealNumber`,
                                    '',
                                  );
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
                          {formikRef.current?.values?.rows[index]?.containerDesc
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
                                  <th>Container No</th>
                                  <th>Seal No</th>
                                  <th>Size</th>
                                  <th>Rate</th>
                                  <th>Quantity</th>
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
                                      <td>{item?.sealNumber}</td>
                                      <td>{item?.size}</td>
                                      <td>{item?.rate}</td>
                                      <td>{item?.quantity}</td>
                                      <td>{item?.cbm}</td>
                                      <td>{item?.kgs}</td>
                                      <td>
                                        <IconButton
                                          onClick={() => {
                                            const containerDesc =
                                              formikRef.current?.values?.rows[
                                                index
                                              ]?.containerDesc || [];
                                            containerDesc.splice(index, 1);
                                            setFieldValue(
                                              `rows[${index}].containerDesc`,
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
                              {values?.rows[0]?.transportPlanning?.value === 2
                                ? 'Shipping Schedule'
                                : 'Flight Schedule'}
                            </p>
                          </div>
                          {/* From date */}
                          <div className="col-lg-3">
                            {/* <InputField
                              label="From"
                              type="text"
                              name="fromPort"
                              value={values?.rows[index]?.fromPort || ''}
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].fromPort`,
                                  e.target.value,
                                )
                              }
                            /> */}
                            <NewSelect
                              name="fromPort"
                              options={airPortShortCodeDDL || []}
                              value={values?.rows[index]?.fromPort || ''}
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
                          </div>
                          <div className="col-lg-3">
                            {/* <InputField
                              label="To"
                              type="text"
                              name="toPort"
                              value={values?.rows[index]?.toPort || ''}
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].toPort`,
                                  e.target.value,
                                )
                              }
                            /> */}
                            <NewSelect
                              name="toPort"
                              options={airPortShortCodeDDL || []}
                              value={values?.rows[index]?.toPort || ''}
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
                          </div>
                          {/* for sea 2 , for air 1 */}
                          <div className="col-lg-3">
                            <InputField
                              label={
                                values?.rows[0]?.transportPlanning?.value === 2
                                  ? 'Vessel Name'
                                  : 'Flight Number'
                              }
                              type="text"
                              name="flightNumber"
                              value={values?.rows[index]?.flightNumber || ''}
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
                              value={values?.rows[index]?.flightDate || ''}
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
                                  !formikRef.current?.values?.rows[index]
                                    ?.fromPort ||
                                  !formikRef.current?.values?.rows[index]
                                    ?.toPort ||
                                  !formikRef.current?.values?.rows[index]
                                    ?.flightDate
                                ) {
                                  toast.error('Please fill all fields');
                                  return;
                                }
                                if (
                                  values?.rows[0]?.transportPlanning?.value ===
                                  2
                                ) {
                                } else {
                                  if (
                                    !formikRef.current?.values?.rows[index]
                                      ?.flightNumber
                                  ) {
                                    toast.error('Flight Number is required');
                                    return;
                                  }
                                }
                                const containerDesc =
                                  formikRef.current?.values?.rows[index]
                                    ?.airTransportRow || [];
                                containerDesc.push({
                                  fromPort:
                                    formikRef.current?.values?.rows[index]
                                      ?.fromPort?.label || '',
                                  toPort:
                                    formikRef.current?.values?.rows[index]
                                      ?.toPort?.label || '',
                                  flightDate:
                                    formikRef.current?.values?.rows[index]
                                      ?.flightDate,
                                  flightNumber:
                                    formikRef.current?.values?.rows[index]
                                      ?.flightNumber || '',
                                  scheduleVesselName:
                                    formikRef.current?.values?.rows[index]
                                      ?.scheduleVesselName || '',
                                });
                                setFieldValue(
                                  `rows[${index}].airTransportRow`,
                                  containerDesc,
                                );
                                setFieldValue(`rows[${index}].fromPort`, '');
                                setFieldValue(`rows[${index}].toPort`, '');
                                setFieldValue(`rows[${index}].flightDate`, '');
                                setFieldValue(
                                  `rows[${index}].flightNumber`,
                                  '',
                                );
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
                          {formikRef.current?.values?.rows[index]
                            ?.airTransportRow?.length > 0 && (
                            <table
                              table
                              className="table table-bordered global-table"
                            >
                              <thead>
                                <tr>
                                  <th>SL</th>
                                  <th>From</th>
                                  <th>To</th>
                                  <th>Date</th>
                                  {values?.rows[0]?.transportPlanning?.value ===
                                  2 ? (
                                    <th>Vessel Name</th>
                                  ) : (
                                    <th>Flight Number</th>
                                  )}
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formikRef.current?.values?.rows[
                                  index
                                ]?.airTransportRow?.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{item?.fromPort}</td>
                                      <td>{item?.toPort}</td>
                                      <td>{item?.flightDate}</td>
                                      <td>{item?.flightNumber}</td>
                                      <td>
                                        <IconButton
                                          onClick={() => {
                                            const containerDesc =
                                              formikRef.current?.values?.rows[
                                                index
                                              ]?.airTransportRow || [];
                                            containerDesc.splice(index, 1);
                                            setFieldValue(
                                              `rows[${index}].airTransportRow`,
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

                        {/* <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px',
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                              push({
                                transportPlanning:
                                  shipBookingRequestGetById?.modeOfTransport ===
                                  'Air'
                                    ? { value: 1, label: 'Air' }
                                    : { value: 2, label: 'Sea' },
                                pickupLoaction: '',
                                stuffingDate: '',
                                vehicleInfo: '',
                                noOfPallet: '',
                                airLine: '',
                                carton: '',
                                continer: '',
                                shippingLine: '',
                                vesselName: '',
                                voyagaNo: '',
                                arrivalDateTime: '',
                                transportMode: '',
                                estimatedTimeOfDepart: '',
                                berthDate: '',
                                cutOffDate: '',
                                iatanumber: '',
                                containerDesc: [],
                                containerNumber: '',
                                sealNumber: '',
                                size: '',
                                quantity: '',
                                rate: '',
                                cbm: '',
                                kgs: '',
                                gsa: '',
                              })
                            }
                          >
                            <i class="fa fa-plus" aria-hidden="true"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => remove(index)}
                            disabled={values?.rows?.length === 1}
                            title="Remove"
                          >
                            <i class="fa fa-minus" aria-hidden="true"></i>
                          </button>
                        </div> */}
                        {/* <br />
                        <Divider /> */}
                      </div>
                    ))}
                  </>
                )}
              </FieldArray>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default TransportModal;
