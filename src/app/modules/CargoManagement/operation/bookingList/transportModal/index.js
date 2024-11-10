import { Divider, IconButton } from "@material-ui/core";
import { Form, Formik } from "formik";
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
  transportPlanning: Yup.object()
    .shape({
      label: Yup.string().required("Transport Planning Type is required"),
      value: Yup.number().required("Transport Planning Type is required"),
    })
    .nullable()
    .typeError("Transport Planning Type is required"),
  pickupLoaction: Yup.string().required("Pickup Loaction is required"),
  pickupDate: Yup.string().required("Pickup Date is required"),
  vehicleInfo: Yup.string().required("Vehicle Info is required"),
  noOfPallet: Yup.string().when("transportPlanning", {
    is: (val) => val?.value === 1,
    then: Yup.string().required("No of Pallet is required"),
  }),
  airLine: Yup.string().when("transportPlanning", {
    is: (val) => val?.value === 1,
    then: Yup.string().required("Air Line is required"),
  }),
  iatanumber: Yup.string().when("transportPlanning", {
    is: (val) => val?.value === 1,
    then: Yup.string().required("Iata Number is required"),
  }),
  carton: Yup.string().when("transportPlanning", {
    is: (val) => val?.value === 1,
    then: Yup.string().required("Carton is required"),
  }),
  continer: Yup.string().when("transportPlanning", {
    is: (val) => val?.value === 2,
    then: Yup.string().required("Continer is required"),
  }),
  shippingLine: Yup.string().when("transportPlanning", {
    is: (val) => val?.value === 2,
    then: Yup.string().required("Shipping Line is required"),
  }),
  vesselName: Yup.string().when("transportPlanning", {
    is: (val) => val?.value === 2,
    then: Yup.string().required("Vessel Name is required"),
  }),
  // departureDateTime: Yup.string().required("Departure Date & Time is required"),
  arrivalDateTime: Yup.string().required("Arrival Date & Time is required"),
  transportMode: Yup.object()
    .shape({
      label: Yup.string().required("Transport Mode is required"),
      value: Yup.number().required("Transport Mode is required"),
    })
    .nullable()
    .typeError("Transport Mode is required"),
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
            formikRef.current.setFieldValue(
              "transportPlanning",
              data?.modeOfTransport === "Air"
                ? { value: 1, label: "Air" }
                : { value: 2, label: "Sea" }
            );
            formikRef.current.setFieldValue(
              "pickupLoaction",
              transportPlanning?.pickupLocation || data?.pickupPlace || ""
            );
            formikRef.current.setFieldValue(
              "pickupDate",
              transportPlanning?.pickupDate
                ? _dateFormatter(transportPlanning?.pickupDate)
                : ""
            );
            formikRef.current.setFieldValue(
              "vehicleInfo",
              transportPlanning?.vehicleInfo || ""
            );
            formikRef.current.setFieldValue(
              "noOfPallet",
              transportPlanning?.noOfPallets || ""
            );
            formikRef.current.setFieldValue(
              "airLine",
              transportPlanning?.airLine || ""
            );
            formikRef.current.setFieldValue(
              "iatanumber",
              transportPlanning?.iatanumber || ""
            );
            formikRef.current.setFieldValue(
              "carton",
              transportPlanning?.carton || ""
            );
            formikRef.current.setFieldValue(
              "continer",
              transportPlanning?.noOfContainer || ""
            );
            formikRef.current.setFieldValue(
              "shippingLine",
              transportPlanning?.airLineOrShippingLine || ""
            );
            formikRef.current.setFieldValue(
              "vesselName",
              transportPlanning?.vesselName || ""
            );
            // formikRef.current.setFieldValue(
            //   "departureDateTime",
            //   transportPlanning?.departureDateTime || ""
            // );
            formikRef.current.setFieldValue(
              "arrivalDateTime",
              transportPlanning?.arrivalDateTime || ""
            );
            formikRef.current.setFieldValue(
              "berthDate ",
              transportPlanning?.berthDate || ""
            );
            formikRef.current.setFieldValue(
              "cutOffDate",
              transportPlanning?.cutOffDate || ""
            );
            formikRef.current.setFieldValue(
              "estimatedTimeOfDepart",
              transportPlanning?.estimatedTimeOfDepart || ""
            );
            formikRef.current.setFieldValue(
              "transportMode",
              data?.confTransportMode
                ? {
                  value: 0,
                  label: data?.confTransportMode,
                }
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

    }))
    const payload = {
      bookingId: bookingRequestId || 0,
      pickupLocation: values?.pickupLoaction || "",
      pickupDate:
        moment(values?.pickupDate).format("YYYY-MM-DDTHH:mm:ss") || new Date(),
      vehicleInfo: values?.vehicleInfo || "",
      noOfPallets: values?.noOfPallet || 0,
      carton: values?.carton || 0,
      iatanumber: values?.iatanumber || 0,
      noOfContainer: values?.continer || 0,
      airLineOrShippingLine: values?.airLine || values?.shippingLine || "",
      vesselName: values?.vesselName || "",
      // departureDateTime:
      //   moment(values?.departureDateTime).format("YYYY-MM-DDTHH:mm:ss") ||
      //   new Date(),
      arrivalDateTime:
        moment(values?.arrivalDateTime).format("YYYY-MM-DDTHH:mm:ss") ||
        new Date(),
      ...(values?.berthDate && { berthDate: moment(values?.berthDate).format("YYYY-MM-DDTHH:mm:ss") }),
      ...(values?.cutOffDate && { cutOffDate: moment(values?.cutOffDate).format("YYYY-MM-DDTHH:mm:ss") }),
      ...(values?.estimatedTimeOfDepart && { estimatedTimeOfDepart: moment(values?.estimatedTimeOfDepart).format("YYYY-MM-DDTHH:mm:ss") }),
      transportMode: values?.transportMode?.label || 0,
      isActive: true,
      containerDesc: modifyItems || [],
    };


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
          transportPlanning: "",
          pickupLoaction: "",
          pickupDate: "",
          vehicleInfo: "",
          noOfPallet: "",
          airLine: "",
          carton: "",
          continer: "",
          shippingLine: "",
          vesselName: "",
          // departureDateTime: "",
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

        }}
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
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              <div className="form-group row global-form">
                {/* Transport Planning Type */}
                <div className="col-lg-3">
                  <NewSelect
                    name="transportPlanning"
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
                    value={values?.transportPlanning}
                    label="Transport Planning Type"
                    onChange={(valueOption) => {
                      setFieldValue("transportPlanning", valueOption);
                      setFieldValue("noOfPallet", "");
                      setFieldValue("airLine", "");
                      setFieldValue("carton", "");
                      setFieldValue("iatanumber", "");
                      setFieldValue("continer", "");
                      setFieldValue("shippingLine", "");
                      setFieldValue("vesselName", "");
                    }}
                    placeholder="Transport Planning Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>

                {/* Pickup Loaction */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.pickupLoaction}
                    label="Pickup Loaction"
                    name="pickupLoaction"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("pickupLoaction", e.target.value)
                    }
                  />
                </div>
                {/* Pickup date */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.pickupDate}
                    label="Estimated Pickup Date"
                    name="pickupDate"
                    type="date"
                    onChange={(e) =>
                      setFieldValue("pickupDate", e.target.value)
                    }
                  />
                </div>
                {/* Vehicle info */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.vehicleInfo}
                    label="Vehicle Info"
                    name="vehicleInfo"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("vehicleInfo", e.target.value)
                    }
                  />
                </div>

                {/* for AIR */}
                {values?.transportPlanning?.value === 1 && (
                  <>
                    {/* No of Pallet */}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.noOfPallet}
                        label="No of Pallet"
                        name="noOfPallet"
                        type="number"
                        onChange={(e) =>
                          setFieldValue("noOfPallet", e.target.value)
                        }
                      />
                    </div>
                    {/* Air Line */}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.airLine}
                        label="Air Line"
                        name="airLine"
                        type="text"
                        onChange={(e) =>
                          setFieldValue("airLine", e.target.value)
                        }
                      />
                    </div>
                    {/* iatanumber */}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.iatanumber}
                        label="IATA Number"
                        name="iatanumber"
                        type="number"
                        onChange={(e) =>
                          setFieldValue("iatanumber", e.target.value)
                        }
                      />
                    </div>
                    {/* Carton */}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.carton}
                        label="Carton"
                        name="carton"
                        type="number"
                        onChange={(e) =>
                          setFieldValue("carton", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}

                {/* for SEA */}
                {values?.transportPlanning?.value === 2 && (
                  <>
                    {/* Continer */}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.continer}
                        label="Continer"
                        name="continer"
                        type="number"
                        onChange={(e) =>
                          setFieldValue("continer", e.target.value)
                        }
                      />
                    </div>
                    {/* Shipping line */}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.shippingLine}
                        label="Shipping Line"
                        name="shippingLine"
                        type="text"
                        onChange={(e) =>
                          setFieldValue("shippingLine", e.target.value)
                        }
                      />
                    </div>
                    {/* Vessel name */}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.vesselName}
                        label="Vessel Name"
                        name="vesselName"
                        type="text"
                        onChange={(e) =>
                          setFieldValue("vesselName", e.target.value)
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
                    value={values?.arrivalDateTime}
                    label="Estimated Arrival Date & Time"
                    name="arrivalDateTime"
                    type="datetime-local"
                    onChange={(e) =>
                      setFieldValue("arrivalDateTime", e.target.value)
                    }
                  />
                </div>

                {/* Transport Mode */}
                <div className="col-lg-3">
                  <NewSelect
                    name="transportMode"
                    // options={transportModeDDL || []}
                    options={
                      transportModeDDL?.filter((item) => {
                        if (values?.transportPlanning?.label === "Sea") {
                          return [17, 18].includes(item?.value);
                        } else {
                          return [19, 20].includes(item?.value);
                        }
                      }) || []
                    }
                    value={values?.transportMode}
                    label="Transport Mode"
                    onChange={(valueOption) => {
                      setFieldValue("transportMode", valueOption);
                    }}
                    placeholder="Transport Mode"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* BerthDate  */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.berthDate}
                    label="Estimated Berth Date"
                    name="berthDate"
                    type="date"
                    onChange={(e) =>
                      setFieldValue("berthDate", e.target.value)
                    }
                  />
                </div>
                {/* CutOffDate */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.cutOffDate}
                    label="Estimated Cut Off Date"
                    name="cutOffDate"
                    type="date"
                    onChange={(e) =>
                      setFieldValue("cutOffDate", e.target.value)
                    }
                  />
                </div>
                {/* EstimatedTimeOfDepart */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.estimatedTimeOfDepart}
                    label="Estimated Time Of Depart"
                    name="estimatedTimeOfDepart"
                    type="date"
                    onChange={(e) =>
                      setFieldValue("estimatedTimeOfDepart", e.target.value)
                    }
                  />
                </div>
              </div>
              <Divider />
              {/* container details  for sea */}
              {values?.transportPlanning?.value === 2 && <div className="form-group row global-form">
                {/* Container No */}
                <div className="col-lg-2">
                  <InputField
                    value={values?.containerNumber || ""}
                    label="Container No"
                    name="containerNumber"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('containerNumber', e.target.value)
                    }
                  />
                </div>

                {/* Seal No */}
                <div className="col-lg-2">
                  <InputField
                    value={values?.sealNumber || ""}
                    label="Seal No"
                    name="sealNumber"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('sealNumber', e.target.value)
                    }
                  />
                </div>

                {/* Size */}
                <div className="col-lg-2">
                  <InputField
                    value={values?.size || ""}
                    label="Size"
                    name="size"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('size', e.target.value)
                    }
                  />
                </div>

                {/* quantity */}
                <div className="col-lg-2">
                  <InputField
                    value={values?.quantity || ""}
                    label="Quantity"
                    name="quantity"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('quantity', e.target.value)
                    }
                  />
                </div>

                {/* CBM */}
                <div className="col-lg-2">
                  <InputField
                    value={values?.cbm || ""}
                    label="CBM"
                    name="cbm"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('cbm', e.target.value)
                    }
                  />
                </div>

                {/* KGS */}
                <div className="col-lg-2">
                  <InputField
                    value={values?.kgs || ""}
                    label="KGS"
                    name="kgs"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('kgs', e.target.value)
                    }
                  />
                </div>
                <div className="col-lg-2 pt-4">
                  <button
                    onClick={() => {
                      if (!formikRef.current?.values?.containerNumber || !formikRef.current?.values?.sealNumber || !formikRef.current?.values?.size || !formikRef.current?.values?.quantity || !formikRef.current?.values?.cbm || !formikRef.current?.values?.kgs) {
                        toast.error('Please fill all fields');
                        return;
                      }
                      const items = formikRef.current?.values?.items || [];
                      items.push({
                        containerNumber: formikRef.current?.values?.containerNumber,
                        sealNumber: formikRef.current?.values?.sealNumber,
                        size: formikRef.current?.values?.size,
                        quantity: formikRef.current?.values?.quantity,
                        cbm: formikRef.current?.values?.cbm,
                        kgs: formikRef.current?.values?.kgs,
                      });
                      setFieldValue('items', items);
                      setFieldValue('containerNumber', '');
                      setFieldValue('sealNumber', '');
                      setFieldValue('size', '');
                      setFieldValue('quantity', '');
                      setFieldValue('cbm', '');
                      setFieldValue('kgs', '');

                    }}
                    className="btn btn-primary"
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>
              }
              {/* items table */}
              <div className="pt-4">
                {formikRef.current?.values?.items.length > 0 && <table table className="table table-bordered">
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
                    {
                      formikRef.current?.values?.items?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {item?.containerNumber}
                          </td>
                          <td>
                            {item?.sealNumber}
                          </td>
                          <td>
                            {item?.size}
                          </td>
                          <td>
                            {item?.quantity}
                          </td>
                          <td>
                            {item?.cbm}
                          </td>
                          <td>
                            {item?.kgs}
                          </td>
                          <td>
                            <IconButton
                              onClick={() => {
                                const items = formikRef.current?.values?.items || [];
                                items.splice(index, 1);
                                setFieldValue('items', items);
                              }}
                              color="error"
                              size="small"
                            >
                              <IDelete />
                            </IconButton>
                          </td>
                        </tr>
                      ))
                    }

                  </tbody>
                </table>
                }
              </div>

            </Form>
          </>
        )}
      </Formik>
    </div >
  );
}

export default TransportModal;
