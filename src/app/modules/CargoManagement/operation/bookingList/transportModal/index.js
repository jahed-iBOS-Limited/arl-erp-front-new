import { Divider, IconButton } from '@material-ui/core';
import { FieldArray, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { imarineBaseUrl } from '../../../../../App';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import './style.css';
const validationSchema = Yup.object().shape({
  // transportPlanning: Yup.object()
  //   .shape({
  //     label: Yup.string().required('Transport Planning Type is required'),
  //     value: Yup.number().required('Transport Planning Type is required'),
  //   })
  //   .nullable()
  //   .typeError('Transport Planning Type is required'),
  pickupLocation: Yup.string().required('Pickup Location is required'),
  // stuffingDate: Yup.string().required('Stuffing Date is required'),
  // pickupDate: Yup.string().required('Estimated Pickup Date is required'),
  // vehicleInfo: Yup.string().required('Vehicle Info is required'),
  noOfPallets: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 1,
    then: Yup.string().required('No of Pallets is required'),
  }),
  airLine: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 1,
    then: Yup.string().required('Air Line is required'),
  }),

  // iatanumber: Yup.string().when('transportPlanning', {
  //   is: (val) => val?.value === 1,
  //   then: Yup.string().required('Iata Number is required'),
  // }),
  carton: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 1,
    then: Yup.string().required('Carton is required'),
  }),
  noOfContainer: Yup.string().when('transportPlanning', {
    is: (val) => val?.value === 2,
    then: Yup.string().required('No of Container is required'),
  }),
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
  // // departureDateTime: Yup.string().required("Departure Date & Time is required"),
  // arrivalDateTime: Yup.string().required('Arrival Date & Time is required'),
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
  // containerNumber: Yup.string().required("Container No is required"),
  // sealNumber: Yup.string().required("Seal No is required"),
  // size: Yup.string().required("Size is required"),
  // quantity: Yup.string().required("quantity is required"),
  // cbm: Yup.string().required("CBM is required"),
  // kgs: Yup.string().required("KGS is required"),
});
function TransportModal({ rowClickData, CB }) {
  const [
    ,
    SaveShippingTransportPlanning,
    shippingTransportPlanningLoading,
  ] = useAxiosPost();
  const bookingRequestId = rowClickData?.bookingRequestId;

  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const [transportModeDDL, setTransportModeDDL] = useAxiosGet();
  const [shippingLineDDL, setShippingLineDDL] = useAxiosGet();
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
            const totalNumberOfPackages = data?.rowsData?.reduce(
              (acc, item) => acc + (+item?.totalNumberOfPackages || 0),
              0,
            );
            const transportPlanning = data?.transportPlanning || {};
            // formikRef.current.setFieldValue(
            //   'transportPlanning',
            //   data?.modeOfTransport === 'Air'
            //     ? { value: 1, label: 'Air' }
            //     : { value: 2, label: 'Sea' },
            // );
            formikRef.current.setFieldValue(`rows[0].transportPlanning`, {
              ...(data?.modeOfTransport === 'Air'
                ? { value: 1, label: 'Air' }
                : { value: 2, label: 'Sea' }),
            });
            formikRef.current.setFieldValue(
              `rows[0].pickupLocation`,
              transportPlanning?.pickupLocation || data?.pickupPlace || '',
            );
            // formikRef.current.setFieldValue(
            //   `rows[0].pickupDate`,
            //   transportPlanning?.stuffingDate
            //     ? _dateFormatter(transportPlanning?.stuffingDate)
            //     : '',
            // );
            // formikRef.current.setFieldValue(
            //   `rows[0].vehicleInfo`,
            //   transportPlanning?.vehicleInfo || '',
            // );
            formikRef.current.setFieldValue(
              `rows[0].noOfPallets`,
              transportPlanning?.noOfPallets || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].airLineOrShippingLine`,
              transportPlanning?.airLine || '',
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
              `rows[0].airLineOrShippingLine`,
              transportPlanning?.airLineOrShippingLine || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].vesselName`,
              transportPlanning?.vesselName || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].voyagaNo`,
              transportPlanning?.voyagaNo || '',
            );
            // formikRef.current.setFieldValue(
            //   "departureDateTime",
            //   transportPlanning?.departureDateTime || ""
            // );

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
              transportPlanning?.estimatedTimeOfDepart || '',
            );
            formikRef.current.setFieldValue(
              `rows[0].transportMode`,
              data?.confTransportMode
                ? { value: 0, label: data?.confTransportMode }
                : '',
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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  useEffect(() => {
    setTransportModeDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetModeOfTypeListDDL?categoryId=${4}`,
    );
    setShippingLineDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetAirServiceProviderDDL?typeId=1`,
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const bookingData = shipBookingRequestGetById || {};
  const saveHandler = (values, cb) => {
    const payload = values?.rows?.map((row) => ({
      bookingId: bookingRequestId || 0,
      pickupLocation: row?.pickupLocation || '',
      // pickupDate:
      //   moment(row?.pickupDate).format('YYYY-MM-DDTHH:mm:ss') || new Date(),

      // stuffingDate:
      //   moment(values?.stuffingDate).format("YYYY-MM-DDTHH:mm:ss") ||
      //   new Date(), //! prev
      pickupDate: new Date(),
      vehicleInfo: row?.vehicleInfo || '',
      noOfPallets: row?.noOfPallets || 0,
      carton: row?.carton || 0,
      iatanumber: row?.iatanumber || 0,
      noOfContainer: row?.noOfContainer || 0,
      airLineOrShippingLine: row?.airLine || row?.shippingLine || '',
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
      gsa: row?.gsa || '',
      transportMode: row?.transportMode?.label || 0,
      isActive: true,
      containerDesc: row?.items?.map((item) => ({
        containerNumber: item?.containerNumber,
        sealNumber: item?.sealNumber,
        size: item?.size,
        quantity: item?.quantity,
        cbm: item?.cbm,
        kgs: item?.kgs,
        mode: '',
        poNumber: row?.poNumber?.value || '',
        style: row?.style?.value || '',
        color: row?.color?.value || '',
      })),
    }));
    SaveShippingTransportPlanning(
      `${imarineBaseUrl}/domain/ShippingService/SaveShippingTransportPlanning`,
      payload,
      CB,
    );
  };
  return (
    <div className="confirmModal">
      {(shippingTransportPlanningLoading || shipBookingRequestLoading) && (
        <Loading />
      )}
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
              items: [],
              flightScheduleItems: [],
              scheduleFrom: "",
              scheduleTo: "",
              scheduleDate: "",
              scheduleFlightNumber: "",
              scheduleVesselName: "",
              gsa: "",



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
            {console.log('values', values)}
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
                            {errors.rows &&
                              errors.rows[index]?.pickupLocation &&
                              touched.rows && (
                                <div className="text-danger">
                                  {errors.rows[index].pickupLocation}
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
                            {errors.rows &&
                              errors.rows[index]?.pickupDate &&
                              touched.rows && (
                                <div className="text-danger">
                                  {errors.rows[index].pickupDate}
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
                            {errors.rows &&
                              errors.rows[index]?.vehicleInfo &&
                              touched.rows && (
                                <div className="text-danger">
                                  {errors.rows[index].vehicleInfo}
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
                                {errors.rows &&
                                  errors.rows[index]?.noOfPallets &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors.rows[index].noOfPallets}
                                    </div>
                                  )}
                              </div>
                              {/* Air Line */}
                              <div className="col-lg-3">
                                <NewSelect
                                  name={`rows[${index}].transportPlanning`}
                                  options={
                                    [
                                      {
                                        value: 1,
                                        label: 'Dummy Airline 1',
                                      },
                                      {
                                        value: 2,
                                        label: 'Dummy Airline 2',
                                      },
                                    ] || []
                                  }
                                  value={values.rows[index].airLine}
                                  label="Air Line"
                                  onChange={(valueOption) => {
                                    setFieldValue(
                                      `rows[${index}].airLine`,
                                      valueOption?.label || ""
                                    );
                                  }}
                                  placeholder="Air line"
                                  errors={errors}
                                  touched={touched}
                                />
                                {errors.rows &&
                                  errors.rows[index]?.airLine &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors.rows[index].airLine}
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
                                {errors.rows &&
                                  errors.rows[index]?.carton &&
                                  touched.rows && (
                                    <div className="text-danger">
                                      {errors.rows[index].carton}
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
                                  {errors.rows &&
                                    errors.rows[index]?.noOfContainer &&
                                    touched.rows && (
                                      <div className="text-danger">
                                        {errors.rows[index].noOfContainer}
                                      </div>
                                    )}
                                </div>
                                {/* Shipping line */}
                                <div className="col-lg-3">
                                  {/* <InputField
                                    value={
                                      values?.rows[index]?.shippingLine || ''
                                    }
                                    label="Shipping Line"
                                    name={`rows[${index}].shippingLine`}
                                    type="text"
                                    onChange={(e) =>
                                      setFieldValue(
                                        `rows[${index}].shippingLine`,
                                        e.target.value,
                                      )
                                    }
                                  /> */}
                                  <NewSelect
                                    options={
                                      [
                                        {
                                          value: 1,
                                          label: 'Dummy Shipping line 1',
                                        },
                                        {
                                          value: 2,
                                          label: 'Dummy Shipping line 2',
                                        },
                                      ] || []
                                    }
                                    label="Shipping Line"
                                    name={`rows[${index}].shippingLine`}
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        `rows[${index}].shippingLine`,
                                        valueOption?.label || ""
                                      );
                                    }}
                                    placeholder="Shipping Line"
                                    errors={errors}
                                    touched={touched}
                                  />
                                  {errors.rows &&
                                    errors.rows[index]?.shippingLine &&
                                    touched.rows && (
                                      <div className="text-danger">
                                        {errors.rows[index].shippingLine}
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
                                  {errors.rows &&
                                    errors.rows[index]?.vesselName &&
                                    touched.rows && (
                                      <div className="text-danger">
                                        {errors.rows[index].vesselName}
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
                                  {errors.rows &&
                                    errors.rows[index]?.voyagaNo &&
                                    touched.rows && (
                                      <div className="text-danger">
                                        {errors.rows[index].voyagaNo}
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
                                  {errors.rows &&
                                    errors.rows[index]?.arrivalDateTime &&
                                    touched.rows && (
                                      <div className="text-danger">
                                        {errors.rows[index].arrivalDateTime}
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
                            {errors.rows &&
                              errors.rows[index]?.transportMode &&
                              touched.rows &&
                              touched.rows[index]?.transportMode && (
                                <div className="text-danger">
                                  {errors.rows[index].transportMode.label ||
                                    errors.rows[index].transportMode}
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
                                  {errors.rows &&
                                    errors.rows[index]?.berthDate &&
                                    touched.rows && (
                                      <div className="text-danger">
                                        {errors.rows[index].berthDate}
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
                                  {errors.rows &&
                                    errors.rows[index]?.cutOffDate &&
                                    touched.rows && (
                                      <div className="text-danger">
                                        {errors.rows[index].cutOffDate}
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
                              type="date"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].estimatedTimeOfDepart`,
                                  e.target.value,
                                )
                              }
                            />
                            {errors.rows &&
                              errors.rows[index]?.estimatedTimeOfDepart &&
                              touched.rows && (
                                <div className="text-danger">
                                  {errors.rows[index].estimatedTimeOfDepart}
                                </div>
                              )}
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              options={
                                [
                                  {
                                    value: 1,
                                    label: 'Dummy GSA 1',
                                  },
                                  {
                                    value: 2,
                                    label: 'Dummy GSA 2',
                                  },
                                ] || []
                              }
                              label="GSA"
                              name={`rows[${index}].gsa`}
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].gsa`,
                                  valueOption?.label || ""
                                );
                              }}
                              placeholder="GSA"
                              errors={errors}
                              touched={touched}
                            />
                            {errors.rows &&
                              errors.rows[index]?.gsa &&
                              touched.rows && (
                                <div className="text-danger">
                                  {errors.rows[index].gsa}
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
                                value={
                                  values?.rows[index]?.size
                                    ? {
                                      value: 0,
                                      label: values?.rows[index]?.size,
                                    }
                                    : ''
                                }
                                label="Container Size"
                                onChange={(valueOption) => {
                                  setFieldValue(
                                    `rows[${index}].size`,
                                    valueOption?.label,
                                  );
                                }}
                                placeholder="Select"
                                errors={errors}
                                touched={touched}
                              />
                            </div>

                            {/* quantity */}
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
                                      ?.quantity ||
                                    !formikRef.current?.values?.rows[index]
                                      ?.cbm ||
                                    !formikRef.current?.values?.rows[index]?.kgs
                                  ) {
                                    toast.error('Please fill all fields');
                                    return;
                                  }
                                  const items =
                                    formikRef.current?.values?.rows[index]
                                      ?.items || [];
                                  items.push({
                                    poNumber:
                                      formikRef.current?.values?.rows[index]
                                        ?.poNumber,
                                    style:
                                      formikRef.current?.values?.rows[index]
                                        ?.style,
                                    color:
                                      formikRef.current?.values?.rows[index]
                                        ?.color,
                                    containerNumber:
                                      formikRef.current?.values?.rows[index]
                                        ?.containerNumber,
                                    sealNumber:
                                      formikRef.current?.values?.rows[index]
                                        ?.sealNumber,
                                    size:
                                      formikRef.current?.values?.rows[index]
                                        ?.size,
                                    quantity:
                                      formikRef.current?.values?.rows[index]
                                        ?.quantity,
                                    cbm:
                                      formikRef.current?.values?.rows[index]
                                        ?.cbm,
                                    kgs:
                                      formikRef.current?.values?.rows[index]
                                        ?.kgs,
                                  });
                                  setFieldValue(`rows[${index}].items`, items);
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
                        {/* items table */}
                        <div className="pt-4">
                          {formikRef.current?.values?.rows[index]?.items
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
                                    <th>quantity</th>
                                    <th>CBM</th>
                                    <th>KGS</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {formikRef.current?.values?.rows[
                                    index
                                  ]?.items?.map((item, index) => {
                                    console.log('item', item);
                                    return (
                                      <tr key={index}>
                                        <td>{item?.poNumber?.label}</td>
                                        <td>{item?.style?.label}</td>
                                        <td>{item?.color?.label}</td>
                                        <td>{item?.containerNumber}</td>
                                        <td>{item?.sealNumber}</td>
                                        <td>{item?.size}</td>
                                        <td>{item?.quantity}</td>
                                        <td>{item?.cbm}</td>
                                        <td>{item?.kgs}</td>
                                        <td>
                                          <IconButton
                                            onClick={() => {
                                              const items =
                                                formikRef.current?.values?.rows[
                                                  index
                                                ]?.items || [];
                                              items.splice(index, 1);
                                              setFieldValue(
                                                `rows[${index}].items`,
                                                items,
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
                            <InputField
                              label="From"
                              type="text"
                              name="scheduleFrom"
                              value={values?.rows[index]?.scheduleFrom || ''}
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].scheduleFrom`,
                                  e.target.value,
                                )
                              }

                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="To"
                              type="text"
                              name='scheduleTo'
                              value={values?.rows[index]?.scheduleTo || ''}
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].scheduleTo`,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          {/* for sea 2 , for air 1 */}
                          <div className="col-lg-3">
                            {
                              values?.rows[0]?.transportPlanning?.value === 2 ? (
                                <InputField
                                  label="Vessel Name"
                                  type="text"
                                  name='scheduleVesselName'
                                  value={values?.rows[index]?.scheduleVesselName || ''}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].scheduleVesselName`,
                                      e.target.value,
                                    )
                                  }

                                />
                              ) : (
                                <InputField
                                  label="Flight Number"
                                  type="text"
                                  name='scheduleFlightNumber'
                                  value={values?.rows[index]?.scheduleFlightNumber || ''}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].scheduleFlightNumber`,
                                      e.target.value,
                                    )
                                  }

                                />
                              )
                            }
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Date"
                              type="date"
                              name='scheduleDate'
                              value={values?.rows[index]?.scheduleDate || ''}
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].scheduleDate`,
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
                                    ?.scheduleFrom ||
                                  !formikRef.current?.values?.rows[index]
                                    ?.scheduleTo ||
                                  !formikRef.current?.values?.rows[index]
                                    ?.scheduleDate
                                ) {
                                  toast.error('Please fill all fields');
                                  return;
                                }
                                if (values?.rows[0]?.transportPlanning?.value === 2) {
                                  if (!formikRef.current?.values?.rows[index]?.scheduleVesselName) {
                                    toast.error('Vessel Name is required');
                                    return;
                                  }
                                } else {
                                  if (!formikRef.current?.values?.rows[index]?.scheduleFlightNumber) {
                                    toast.error('Flight Number is required');
                                    return;
                                  }
                                }
                                const items =
                                  formikRef.current?.values?.rows[index]
                                    ?.flightScheduleItems || [];
                                items.push({
                                  scheduleFrom:
                                    formikRef.current?.values?.rows[index]
                                      ?.scheduleFrom,
                                  scheduleTo:
                                    formikRef.current?.values?.rows[index]
                                      ?.scheduleTo,
                                  scheduleDate:
                                    formikRef.current?.values?.rows[index]
                                      ?.scheduleDate,
                                  scheduleFlightNumber:
                                    formikRef.current?.values?.rows[index]
                                      ?.scheduleFlightNumber || '',
                                  scheduleVesselName:
                                    formikRef.current?.values?.rows[index]
                                      ?.scheduleVesselName || ''

                                });
                                setFieldValue(`rows[${index}].flightScheduleItems`, items);
                                setFieldValue(`rows[${index}].scheduleFrom`, '');
                                setFieldValue(`rows[${index}].scheduleTo`, '');
                                setFieldValue(`rows[${index}].scheduleDate`, '');
                                setFieldValue(`rows[${index}].scheduleFlightNumber`, '');
                                setFieldValue(`rows[${index}].scheduleVesselName`, '');
                              }
                              }
                              className="btn btn-primary"
                              type="button"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        {/* Flight Schedule table */}
                        <div className="pt-4">
                          {formikRef.current?.values?.rows[index]?.flightScheduleItems
                            ?.length > 0 && (
                              <table
                                table
                                className="table table-bordered global-table"
                              >
                                <thead>
                                  <tr>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Date</th>
                                    {
                                      values?.rows[0]?.transportPlanning?.value === 2 ? (
                                        <th>Vessel Name</th>
                                      ) : (
                                        <th>Flight Number</th>
                                      )
                                    }
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {formikRef.current?.values?.rows[
                                    index
                                  ]?.flightScheduleItems?.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        <td>{item?.scheduleFrom}</td>
                                        <td>{item?.scheduleTo}</td>
                                        <td>{item?.scheduleDate}</td>
                                        {
                                          values?.rows[0]?.transportPlanning?.value === 2 ? (
                                            <td>{item?.scheduleVesselName}</td>
                                          ) : (
                                            <td>{item?.scheduleFlightNumber}</td>
                                          )
                                        }
                                        <td>
                                          <IconButton
                                            onClick={() => {
                                              const items =
                                                formikRef.current?.values?.rows[
                                                  index
                                                ]?.flightScheduleItems || [];
                                              items.splice(index, 1);
                                              setFieldValue(
                                                `rows[${index}].flightScheduleItems`,
                                                items,
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

                        <div
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
                                items: [],
                                containerNumber: '',
                                sealNumber: '',
                                size: '',
                                quantity: '',
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
                        </div>
                        <br />
                        <Divider />

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
