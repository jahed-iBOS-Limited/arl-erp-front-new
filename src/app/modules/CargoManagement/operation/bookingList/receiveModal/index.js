import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import BookingDetailsInfo from "../bookingDetails/bookingDetailsInfo";
import "./style.css";
const validationSchema = Yup.object().shape({
  recvQuantity: Yup.number().required("Receive Quantity is required"),
});
function ReceiveModal({ rowClickData, CB }) {
  const [, getRecvQuantity, recvQuantityLoading] = useAxiosPut();
  const bookingRequestId = rowClickData?.bookingRequestId;

  const formikRef = React.useRef(null);
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
        (data) => {
          const bookingData = data?.[0] || {};
          const packagingQuantity = bookingData?.rowsData?.reduce(
            (acc, item) => {
              return acc + (+item.packagingQuantity || 0);
            },
            0
          );
          if (formikRef.current) {
            formikRef.current.setFieldValue("recvQuantity", packagingQuantity);
          }
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const saveHandler = (values, resetForm) => {
    const paylaod = {
      updthd: {
        bookingId: bookingRequestId,
      },
      updtrow: [
        {
          bookingId: bookingRequestId,
          bookingRowId:  0,
          receivedQuantity: values.recvQuantity || 0,
        },
      ],
    };
    getRecvQuantity(
      `${imarineBaseUrl}/domain/ShippingService/createReceiveProcess`,
      paylaod,
      () => {
        CB();
      }
    );
  };

  const bookingData = shipBookingRequestGetById?.[0] || {};
  return (
    <div className="confirmModal">
      {(shipBookingRequestLoading || recvQuantityLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          recvQuantity: "",
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
                <div className="col-lg-4">
                  <InputField
                    value={bookingData?.recvQuantity}
                    label="Receive Quantity"
                    name="recvQuantity"
                    placeholder="Receive Quantity"
                  />
                </div>
              </div>
              <BookingDetailsInfo bookingData={bookingData} />
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ReceiveModal;
