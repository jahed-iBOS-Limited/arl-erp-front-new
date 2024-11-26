import { Divider, IconButton } from "@material-ui/core";
import { FieldArray, Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { imarineBaseUrl } from "../../../../../App";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import "./style.css";
const validationSchema = Yup.object().shape({
  // transportPlanning: Yup.object()
  //   .shape({
  //     label: Yup.string().required('Transport Planning Type is required'),
  //     value: Yup.number().required('Transport Planning Type is required'),
  //   })
  //   .nullable()
  //   .typeError('Transport Planning Type is required'),
  // pickupLoaction: Yup.string().required('Pickup Loaction is required'),
  // stuffingDate: Yup.string().required('Stuffing Date is required'),
  // vehicleInfo: Yup.string().required('Vehicle Info is required'),
  // noOfPallet: Yup.string().when('transportPlanning', {
  //   is: (val) => val?.value === 1,
  //   then: Yup.string().required('No of Pallet is required'),
  // }),
  // airLine: Yup.string().when('transportPlanning', {
  //   is: (val) => val?.value === 1,
  //   then: Yup.string().required('Air Line is required'),
  // }),
  // iatanumber: Yup.string().when('transportPlanning', {
  //   is: (val) => val?.value === 1,
  //   then: Yup.string().required('Iata Number is required'),
  // }),
  // carton: Yup.string().when('transportPlanning', {
  //   is: (val) => val?.value === 1,
  //   then: Yup.string().required('Carton is required'),
  // }),
  // continer: Yup.string().when('transportPlanning', {
  //   is: (val) => val?.value === 2,
  //   then: Yup.string().required('Continer is required'),
  // }),
  // shippingLine: Yup.string().when('transportPlanning', {
  //   is: (val) => val?.value === 2,
  //   then: Yup.string().required('Shipping Line is required'),
  // }),
  // vesselName: Yup.string().when('transportPlanning', {
  //   is: (val) => val?.value === 2,
  //   then: Yup.string().required('Vessel Name is required'),
  // }),
  // // departureDateTime: Yup.string().required("Departure Date & Time is required"),
  // arrivalDateTime: Yup.string().required('Arrival Date & Time is required'),
  // transportMode: Yup.object()
  //   .shape({
  //     label: Yup.string().required('Transport Mode is required'),
  //     value: Yup.number().required('Transport Mode is required'),
  //   })
  //   .nullable()
  //   .typeError('Transport Mode is required'),
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

  const formikRef = React.useRef(null);
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
        (resData) => {
          if (formikRef.current) {
            const data = resData || {};
            const transportPlanning = data?.transportPlanning || {};
            // formikRef.current.setFieldValue(
            //   'transportPlanning',
            //   data?.modeOfTransport === 'Air'
            //     ? { value: 1, label: 'Air' }
            //     : { value: 2, label: 'Sea' },
            // );
            formikRef.current.setFieldValue(`rows[0].transportPlanning`, {
              ...(data?.modeOfTransport === "Air"
                ? { value: 1, label: "Air" }
                : { value: 2, label: "Sea" }),
            });
            formikRef.current.setFieldValue(
              `rows[0].pickupLocation`,
              transportPlanning?.pickupLocation || data?.pickupPlace || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].pickupDate`,
              transportPlanning?.stuffingDate
                ? _dateFormatter(transportPlanning?.stuffingDate)
                : ""
            );
            formikRef.current.setFieldValue(
              `rows[0].vehicleInfo`,
              transportPlanning?.vehicleInfo || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].noOfPallets`,
              transportPlanning?.noOfPallets || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].airLineOrShippingLine`,
              transportPlanning?.airLine || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].iatanumber`,
              transportPlanning?.iatanumber || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].carton`,
              transportPlanning?.carton || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].noOfContainer`,
              transportPlanning?.noOfContainer || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].airLineOrShippingLine`,
              transportPlanning?.airLineOrShippingLine || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].vesselName`,
              transportPlanning?.vesselName || ""
            );
            // formikRef.current.setFieldValue(
            //   "departureDateTime",
            //   transportPlanning?.departureDateTime || ""
            // );

            formikRef.current.setFieldValue(
              `rows[0].arrivalDateTime`,
              transportPlanning?.arrivalDateTime || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].berthDate`,
              transportPlanning?.berthDate || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].cutOffDate`,
              transportPlanning?.cutOffDate || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].estimatedTimeOfDepart`,
              transportPlanning?.estimatedTimeOfDepart || ""
            );
            formikRef.current.setFieldValue(
              `rows[0].transportMode`,
              data?.transportMode
                ? { value: 0, label: data?.confTransportMode }
                : ""
            );
          }
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  useEffect(() => {
    setTransportModeDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetModeOfTypeListDDL?categoryId=${4}`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const bookingData = shipBookingRequestGetById || {};
  const saveHandler = (values, cb) => {
    const modifyItems = values?.items?.map((item) => ({
      containerDescId: 0,
      transportId: 0,
      containerNumber: item?.containerNumber,
      sealNumber: item?.sealNumber,
      size: item?.size,
      quantity: item?.quantity,
      cbm: item?.cbm,
      mode: "",
      kgs: item?.kgs,
    }));
    const payload = values?.rows?.map((row) => ({
      bookingId: bookingRequestId || 0,
      pickupLocation: row?.pickupLocation || "",
      pickupDate: moment(row?.pickupDate).format("YYYY-MM-DDTHH:mm:ss") || new Date(),

      // stuffingDate:
      //   moment(values?.stuffingDate).format("YYYY-MM-DDTHH:mm:ss") ||
      //   new Date(), //! prev 

      vehicleInfo: row?.vehicleInfo || "",
      noOfPallets: row?.noOfPallets || 0,
      carton: row?.carton || 0,
      iatanumber: row?.iatanumber || 0,
      noOfContainer: row?.noOfContainer || 0,
      airLineOrShippingLine: row?.airLine || row?.shippingLine || "",
      vesselName: row?.vesselName || "",
      // departureDateTime:
      //   moment(values?.departureDateTime).format("YYYY-MM-DDTHH:mm:ss") ||
      //   new Date(),
      arrivalDateTime:
        moment(row?.arrivalDateTime).format("YYYY-MM-DDTHH:mm:ss") ||
        new Date(),
      ...(row?.berthDate && {
        berthDate: moment(row?.berthDate).format("YYYY-MM-DDTHH:mm:ss"),
      }),
      ...(row?.cutOffDate && {
        cutOffDate: moment(row?.cutOffDate).format("YYYY-MM-DDTHH:mm:ss"),
      }),
      ...(row?.estimatedTimeOfDepart && {
        estimatedTimeOfDepart: moment(row?.estimatedTimeOfDepart).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
      }),
      transportMode: row?.transportMode?.label || 0,
      isActive: true,
      containerDesc: modifyItems || [],
    }));
    SaveShippingTransportPlanning(
      `${imarineBaseUrl}/domain/ShippingService/SaveShippingTransportPlanning`,
      payload,
      CB
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
              pickupLocation: "",
              pickupDate: "",
              vehicleInfo: "",
              noOfPallets: "",
              carton: "",
              noOfContainer: "",
              airLine: "",
              shippingLine: "",
              iatanumber: "",
              vesselName: "",
              departureDateTime: "",
              arrivalDateTime: "",
              transportMode: "",
              berthDate: "",
              cutOffDate: "",
              estimatedTimeOfDepart: "",
              // containerDesc: [
              //   {
              //     containerNumber: "",
              //     sealNumber: "",
              //     size: "",
              //     quantity: "",
              //     cbm:  "",
              //     mode: "",
              //     kgs:  "",
              //     poNumber: "",
              //     style: "",
              //     color: "",
              //   },
              // ],

              //
              items: [],
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
            <h1>{JSON.stringify(errors)}</h1>
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
                                    label: "Air",
                                  },
                                  {
                                    value: 2,
                                    label: "Sea",
                                  },
                                ] || []
                              }
                              value={values.rows[index].transportPlanning}
                              label="Transport Planning Type"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].transportPlanning`,
                                  valueOption
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
                              value={values?.rows[index]?.pickupLocation || ""}
                              label="Pickup Location"
                              name={`rows[${index}].pickupLocation`}
                              type="text"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].pickupLocation`,
                                  e.target.value
                                )
                              }
                              placeholder="Pickup Location"
                            />
                          </div>
                          {/* Pickup date */}
                          <div className="col-lg-3">
                            <InputField
                              value={values?.rows[index]?.pickupDate || ""}
                              label="Estimated Pickup Date"
                              name={`rows[${index}].pickupDate`}
                              type="date"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].pickupDate`,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          {/* Vehicle info */}
                          <div className="col-lg-3">
                            <InputField
                              value={values.rows[index]?.vehicleInfo || ""}
                              label="Vehicle Info"
                              name={`rows[${index}].vehicleInfo`}
                              type="text"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].vehicleInfo`,
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          {/* for AIR */}
                          {values?.rows[0]?.transportPlanning?.value === 1 && (
                            <>
                              {/* No of Pallet */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.noOfPallets || ""}
                                  label="No of Pallet"
                                  name={`rows[${index}].noOfPallets`}
                                  type="number"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].noOfPallets`,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              {/* Air Line */}
                              <div className="col-lg-3">
                                <InputField
                                  value={
                                    values?.rows[index]
                                      ?.airLine || ""
                                  }
                                  label="Air Line"
                                  name={`rows[${index}].airLine`}
                                  type="text"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].airLine`,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              {/* iatanumber */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.iatanumber || ""}
                                  label="IATA Number"
                                  name={`rows[${index}].iatanumber`}
                                  type="number"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].iatanumber`,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              {/* Carton */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.carton || ""}
                                  label="Carton"
                                  name={`rows[${index}].carton`}
                                  type="number"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].carton`,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </>
                          )}

                          {/* for SEA */}
                          {values?.rows[0]?.transportPlanning?.value === 2 && (
                            <>
                              {/* no Of Container */}
                              <div className="col-lg-3">
                                <InputField
                                  value={
                                    values?.rows[index]?.noOfContainer || ""
                                  }
                                  label="No of Container"
                                  name={`rows[${index}].noOfContainer`}
                                  type="number"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].noOfContainer`,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              {/* Shipping line */}
                              <div className="col-lg-3">
                                <InputField
                                  value={
                                    values?.rows[index]
                                      ?.shippingLine || ""
                                  }
                                  label="Shipping Line"
                                  name={`rows[${index}].shippingLine`}
                                  type="text"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].shippingLine`,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              {/* Vessel name */}
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.rows[index]?.vesselName || ""}
                                  label="Vessel Name"
                                  name={`rows[${index}].vesselName`}
                                  type="text"
                                  onChange={(e) =>
                                    setFieldValue(
                                      `rows[${index}].vesselName`,
                                      e.target.value
                                    )
                                  }
                                />
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
                          {/* Arrival Date & Time */}
                          <div className="col-lg-3">
                            <InputField
                              value={values?.rows[index]?.arrivalDateTime || ""}
                              label="Estimated Arrival Date & Time"
                              name={`rows[${index}].arrivalDateTime`}
                              type="datetime-local"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].arrivalDateTime`,
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          {/* Transport Mode */}
                          <div className="col-lg-3">
                            <NewSelect
                              name={`rows[${index}].transportMode`}
                              // options={transportModeDDL || []}
                              options={
                                transportModeDDL?.filter((item) => {
                                  if (
                                    values?.transportPlanning?.label === "Sea"
                                  ) {
                                    return [17, 18].includes(item?.value);
                                  } else {
                                    return [19, 20].includes(item?.value);
                                  }
                                }) || []
                              }
                              value={values?.rows[index]?.transportMode}
                              label="Transport Mode"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `rows[${index}].transportMode`,
                                  valueOption
                                );
                              }}
                              placeholder="Transport Mode"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {/* BerthDate  */}
                          <div className="col-lg-3">
                            <InputField
                              value={values?.rows[index]?.berthDate || ""}
                              label="Estimated Berth Date"
                              name={`rows[${index}].berthDate`}
                              type="datetime-local"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].berthDate`,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          {/* CutOffDate */}
                          <div className="col-lg-3">
                            <InputField
                              value={values?.rows[index]?.cutOffDate || ""}
                              label="Estimated Cut Off Date"
                              name={`rows[${index}].cutOffDate`}
                              type="datetime-local"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].cutOffDate`,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          {/* EstimatedTimeOfDepart */}
                          <div className="col-lg-3">
                            <InputField
                              value={
                                values?.rows[index]?.estimatedTimeOfDepart || ""
                              }
                              label="Estimated Time Of Depart"
                              name={`rows[${index}].estimatedTimeOfDepart`}
                              type="date"
                              onChange={(e) =>
                                setFieldValue(
                                  `rows[${index}].estimatedTimeOfDepart`,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        {/* container details  for sea */}
                        {values?.rows[0]?.transportPlanning?.value === 2 && (
                          <div className="form-group row global-form">
                            {/* Container No */}
                            <div className="col-lg-2">
                              <InputField
                                value={
                                  values?.rows[index]?.containerNumber || ""
                                }
                                label="Container No"
                                name={`rows[${index}].containerNumber`}
                                type="text"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].containerNumber`,
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Seal No */}
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows[index]?.sealNumber || ""}
                                label="Seal No"
                                name={`rows[${index}].sealNumber`}
                                type="text"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].sealNumber`,
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Size */}
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows[index]?.size || ""}
                                label="Size"
                                name={`rows[${index}].size`}
                                type="text"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].size`,
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* quantity */}
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows[index]?.quantity || ""}
                                label="Quantity"
                                name={`rows[${index}].quantity`}
                                type="number"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].quantity`,
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* CBM */}
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows[index]?.cbm || ""}
                                label="CBM"
                                name={`rows[${index}].cbm`}
                                type="number"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].cbm`,
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* KGS */}
                            <div className="col-lg-2">
                              <InputField
                                value={values?.rows[index]?.kgs || ""}
                                label="KGS"
                                name={`rows[${index}].kgs`}
                                type="number"
                                onChange={(e) =>
                                  setFieldValue(
                                    `rows[${index}].kgs`,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="col-lg-2 pt-4">
                              <button
                                onClick={() => {
                                  if (
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
                                    toast.error("Please fill all fields");
                                    return;
                                  }
                                  const items =
                                    formikRef.current?.values?.rows[index]
                                      ?.items || [];
                                  items.push({
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
                                  setFieldValue(
                                    `rows[${index}].containerNumber`,
                                    ""
                                  );
                                  setFieldValue(
                                    `rows[${index}].sealNumber`,
                                    ""
                                  );
                                  setFieldValue(`rows[${index}].size`, "");
                                  setFieldValue(`rows[${index}].quantity`, "");
                                  setFieldValue(`rows[${index}].cbm`, "");
                                  setFieldValue(`rows[${index}].kgs`, "");
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
                              <table table className="table table-bordered">
                                <thead>
                                  <tr>
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
                                  ]?.items?.map((item, index) => (
                                    <tr key={index}>
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
                                              items
                                            );
                                          }}
                                          color="error"
                                          size="small"
                                        >
                                          <IDelete />
                                        </IconButton>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px",
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                              push({
                                transportPlanning:
                                  shipBookingRequestGetById?.modeOfTransport ===
                                    "Air"
                                    ? { value: 1, label: "Air" }
                                    : { value: 2, label: "Sea" },
                                pickupLoaction: "",
                                stuffingDate: "",
                                vehicleInfo: "",
                                noOfPallet: "",
                                airLine: "",
                                carton: "",
                                continer: "",
                                shippingLine: "",
                                vesselName: "",
                                arrivalDateTime: "",
                                transportMode: "",
                                estimatedTimeOfDepart: "",
                                berthDate: "",
                                cutOffDate: "",
                                iatanumber: "",
                                items: [],
                                containerNumber: "",
                                sealNumber: "",
                                size: "",
                                quantity: "",
                                cbm: "",
                                kgs: "",
                              })
                            }
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => remove(index)}
                            disabled={values?.rows.length === 1}
                            title="Remove"
                          >
                            -
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
