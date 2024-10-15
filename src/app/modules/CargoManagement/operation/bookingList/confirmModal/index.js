import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import "./style.css";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
const validationSchema = Yup.object().shape({
  bookingAmount: Yup.number().required("Booking Amount is required"),
  airWaybillNumber: Yup.string().required("This field is required"),
  departureDateTime: Yup.date().required("Departure Date & Time is required"),
  arrivalDateTime: Yup.date().required("Arrival Date & Time is required"),
  flightNumber: Yup.string().required("This field is required"),

  transitInformation: Yup.object()
    .shape({
      value: Yup.number(),
      label: Yup.string(),
    })
    .nullable()
    .when("transportPlanningType", {
      is: "Sea",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) =>
        schema
          .shape({
            value: Yup.number().required("Transit Information is required"),
            label: Yup.string().required("Transit Information is required"),
          })
          .typeError("Transit Information is required"),
    }),

  freightForwarderRepresentative: Yup.string().required(
    "Freight Forwarder Representative is required"
  ),

  modeOfTransport: Yup.object()
    .shape({
      value: Yup.number().required("Transport Mode is required"),
      label: Yup.string().required("Transport Mode is required"),
    })
    .nullable()
    .typeError("Transport Mode is required"),
});

function ConfirmModal({ rowClickData, CB }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [, SaveBookingConfirm, bookingConfirmLoading, ,] = useAxiosPut();
  const [transportModeDDL, setTransportModeDDL] = useAxiosGet();
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const formikRef = React.useRef(null);
  
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
        (resData) => {
          if (formikRef.current) {
            const data = resData?.[0] || {};
            formikRef.current.setFieldValue(
              "transportPlanningType",
              data?.modeOfTransport
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
  const bookingData = shipBookingRequestGetById?.[0] || {};

  const saveHandler = (values, cb) => {
    const paylaod = {
      bookingRequestId: bookingRequestId || 0,
      departureDateTime:
        moment(values?.departureDateTime).format("YYYY-MM-DDTHH:mm:ss") ||
        new Date(),
      arrivalDateTime:
        moment(values?.arrivalDateTime).format("YYYY-MM-DDTHH:mm:ss") ||
        new Date(),
      flightNumber: values?.flightNumber || "",
      transitInformation: values?.transitInformation?.label || "",
      awbnumber: values?.airWaybillNumber || "",
      bookingAmount: values?.bookingAmount || 0,
      primaryContactPerson: values?.freightForwarderRepresentative || "",
      isConfirm: true,
      confirmDate: new Date(),
      modeOfTransport: values?.modeOfTransport?.label || 0,
    };

    if (paylaod) {
      SaveBookingConfirm(
        `${imarineBaseUrl}/domain/ShippingService/SaveBookingConfirm`,
        paylaod,
        CB
      );
    }
  };

  return (
    <div className="confirmModal">
      {(bookingConfirmLoading || shipBookingRequestLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          bookingAmount: "",
          airWaybillNumber: "",
          departureDateTime: "",
          arrivalDateTime: "",
          flightNumber: "",
          transitInformation: "",
          freightForwarderRepresentative: "",
          modeOfTransport: "",
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
                <div className="d-flex justify-content-end my-1">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              <div className="form-group row global-form mt-0">
                {/*  Booking Amount*/}
                <div className="col-lg-3">
                  <InputField
                    value={values?.bookingAmount}
                    label="Booking Amount"
                    name="bookingAmount"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("bookingAmount", e.target.value)
                    }
                  />
                </div>
                {/* Air Waybill (AWB) Number */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.airWaybillNumber}
                    label={
                      values?.transportPlanningType === "Sea"
                        ? "HAWB"
                        : "Air Waybill (AWB) Number"
                    }
                    name="airWaybillNumber"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("airWaybillNumber", e.target.value)
                    }
                  />
                </div>

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
                {/* Flight Number */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.flightNumber}
                    label={
                      values?.transportPlanningType === "Sea"
                        ? "Vessel Name"
                        : "Flight Number"
                    }
                    name="flightNumber"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("flightNumber", e.target.value)
                    }
                  />
                </div>
                {/* Transit Information */}
                {values?.transportPlanningType !== "Sea" && (
                  <>
                    {" "}
                    <div className="col-lg-3">
                      <NewSelect
                        name="transitInformation"
                        options={[
                          {
                            value: 1,
                            label: "Direct Flight",
                          },
                          {
                            value: 2,
                            label: "No Transits",
                          },
                        ]}
                        value={values?.transitInformation}
                        label="Transit Information"
                        onChange={(valueOption) => {
                          setFieldValue("transitInformation", valueOption);
                        }}
                        placeholder="Transit Information"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )}

                {/* freight forwarder representative */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.freightForwarderRepresentative}
                    label="Freight Forwarder Representative"
                    name="freightForwarderRepresentative"
                    type="text"
                    onChange={(e) =>
                      setFieldValue(
                        "freightForwarderRepresentative",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* Transport Mode */}
                <div className="col-lg-3">
                  <NewSelect
                    name="modeOfTransport"
                    options={
                      transportModeDDL?.filter((item) => {
                        if (values?.transportPlanningType === "Sea") {
                          return [17, 18].includes(item?.value);
                        } else {
                          return [19, 20].includes(item?.value);
                        }
                      }) || []
                    }
                    value={values?.modeOfTransport}
                    label="Transport Mode"
                    onChange={(valueOption) => {
                      setFieldValue("modeOfTransport", valueOption);
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

export default ConfirmModal;
