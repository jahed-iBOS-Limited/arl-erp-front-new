import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import Loading from "../../../../_helper/_loading";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import { HBLFormatInvoice } from "../HBLFormat";
import { useReactToPrint } from "react-to-print";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
const validationSchema = Yup.object().shape({
  // date: Yup.date().required("Date is required"),
});
function HBLCodeGNModal({ CB, rowClickData }) {
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [, createHblFcrNumber, createHblFcrNumberLoading] = useAxiosPut();

  const saveHandler = (values) => {
    createHblFcrNumber(
      `${imarineBaseUrl}/domain/ShippingService/CreateHblFcrNumber?BookingId=${bookingRequestId}&typeId=1`,
      null,
      () => {
        CB();
        commonGetByIdHandler();
      }
    );
  };

  const commonGetByIdHandler = () => {
    setShipBookingRequestGetById(
      `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
    );
  };
  useEffect(() => {
    if (bookingRequestId) {
      commonGetByIdHandler();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const bookingData = shipBookingRequestGetById || {};

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Customs-RTGS",
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
       
        }
        @page {
          size: portrait !important;
          margin: 15px !important;
        }
      }
    `,
  });
  return (
    <div className="commonStatusUpdateModal">
      {(createHblFcrNumberLoading || shipBookingRequestLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          date: "",
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
                  {!bookingData?.hblnumber && (
                    <>
                      {" "}
                      <button type="submit" className="btn btn-primary">
                        Code Generate Save
                      </button>
                    </>
                  )}

                  {bookingData?.hblnumber && (
                    <>
                      <button
                        onClick={handlePrint}
                        type="button"
                        className="btn btn-primary px-3 py-2"
                      >
                        <i
                          className="mr-1 fa fa-print pointer"
                          aria-hidden="true"
                        ></i>
                        Print
                      </button>
                    </>
                  )}
                </div>
              </div>
              {bookingData?.hblnumber && (
                <HBLFormatInvoice
                  componentRef={componentRef}
                  bookingData={bookingData}
                />
              )}
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default HBLCodeGNModal;
