import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import "./style.css";
import { imarineBaseUrl } from "../../../../../App";
const validationSchema = Yup.object().shape({
  bookingAmount: Yup.number().required("Booking Amount is required"),
  airWaybillNumber: Yup.string().required("Air Waybill Number is required"),
  departureDateTime: Yup.date().required("Departure Date & Time is required"),
  arrivalDateTime: Yup.date().required("Arrival Date & Time is required"),
  flightNumber: Yup.string().required("Flight Number is required"),
  transitInformation: Yup.string().required("Transit Information is required"),
  freightForwarderRepresentative: Yup.string().required(
    "Freight Forwarder Representative is required"
  ),
});
function ConfirmModal({ rowClickData, CB }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  // const [
  //   shipBookingRequestGetById,
  //   setShipBookingRequestGetById,
  //   shipBookingRequestLoading,
  // ] = useAxiosGet();
  const [
    ,
    getBookingRequestStatusUpdate,
    bookingRequestloading,
  ] = useAxiosPut();
  useEffect(() => {
    if (bookingRequestId) {
      // setShipBookingRequestGetById(
      //   `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
      // );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const saveHandler = (values, cb) => {
    console.log(values, "values");

    const paylaod = {
      bookingRequestId: bookingRequestId || 0,
      departureDateTime: moment(values?.departureDateTime).format("YYYY-MM-DDTHH:mm:ss") || new Date(),
      arrivalDateTime: moment(values?.arrivalDateTime).format("YYYY-MM-DDTHH:mm:ss") || new Date(),
      flightNumber: values?.flightNumber || "",
      transitInformation: values?.transitInformation || "",
      awbnumber: values?.airWaybillNumber || "",
      bookingAmount: values?.bookingAmount || 0,
      primaryContactPerson: values?.freightForwarderRepresentative || "",
      isConfirm: true,
      confirmDate: new Date(),
    };

    if (paylaod) {
      getBookingRequestStatusUpdate(`${imarineBaseUrl}/domain/ShippingService/SaveBookingConfirm`, paylaod, CB);
    }
  };
  return (
    <div className="confirmModal">
      {bookingRequestloading && <Loading />}
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
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
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
                    label="Air Waybill (AWB) Number"
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
                    label="Flight Number"
                    name="flightNumber"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("flightNumber", e.target.value)
                    }
                  />
                </div>
                {/* Transit Information */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.transitInformation}
                    label="Transit Information"
                    name="transitInformation"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("transitInformation", e.target.value);
                    }}
                  />
                </div>
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ConfirmModal;
