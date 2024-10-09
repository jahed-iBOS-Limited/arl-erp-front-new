import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { imarineBaseUrl } from "../../../../../App";
import "./style.css";
import * as Yup from "yup";
import { Formik } from "formik";
const validationSchema = Yup.object().shape({});
function ConfirmModal({ rowClickData }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  useEffect(() => {
    if (bookingRequestId) {
      // setShipBookingRequestGetById(
      //   `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
      // );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);


  return (
    <div className="confirmModal">
      {shipBookingRequestLoading && <Loading />}
      <Formik
          enableReinitialize={true}
          initialValues={{
            strCardNumber: "",
            shipment: "",
            entryCode: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
            <>
            </>
          )}
        </Formik>
    </div>
  );
}

export default ConfirmModal;
