import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import "./style.css";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
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
  departureDateTime: Yup.string().required("Departure Date & Time is required"),
  arrivalDateTime: Yup.string().required("Arrival Date & Time is required"),
  transportMode: Yup.object()
    .shape({
      label: Yup.string().required("Transport Mode is required"),
      value: Yup.number().required("Transport Mode is required"),
    })
    .nullable()
    .typeError("Transport Mode is required"),
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
        console.log("data?.modeOfTransport ", data?.modeOfTransport );  
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
            formikRef.current.setFieldValue(
              "departureDateTime",
              transportPlanning?.departureDateTime || ""
            );
            formikRef.current.setFieldValue(
              "arrivalDateTime",
              transportPlanning?.arrivalDateTime || ""
            );
            formikRef.current.setFieldValue(
              "transportMode",
              data?.confTransportMode
                ? {
                    value: data?.confTransportMode,
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
    const payload = {
      bookingId: bookingRequestId || 0,
      pickupLocation: values?.pickupLoaction || "",
      pickupDate:
        moment(values?.pickupDate).format("YYYY-MM-DDTHH:mm:ss") || new Date(),
      vehicleInfo: values?.vehicleInfo || "",
      noOfPallets: values?.noOfPallet || 0,
      carton: values?.carton || 0,
      noOfContainer: values?.continer || 0,
      airLineOrShippingLine: values?.airLine || values?.shippingLine || "",
      vesselName: values?.vesselName || "",
      departureDateTime:
        moment(values?.departureDateTime).format("YYYY-MM-DDTHH:mm:ss") ||
        new Date(),
      arrivalDateTime:
        moment(values?.arrivalDateTime).format("YYYY-MM-DDTHH:mm:ss") ||
        new Date(),
      transportMode: values?.transportMode?.label || 0,
      isActive: true,
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
          departureDateTime: "",
          arrivalDateTime: "",
          transportMode: "",
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
                    type="number"
                    onChange={(e) =>
                      setFieldValue("pickupLoaction", e.target.value)
                    }
                  />
                </div>
                {/* Pickup date */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.pickupDate}
                    label="Pickup Date"
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
                <div className="col-lg-3">
                  <InputField
                    value={values?.departureDateTime}
                    label="Departure Date & Time"
                    name="departureDateTime"
                    type="datetime-local"
                    onChange={(e) =>
                      setFieldValue("departureDateTime", e.target.value)
                    }
                  />
                </div>
                {/* Arrival Date & Time */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.arrivalDateTime}
                    label="Arrival Date & Time"
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default TransportModal;
