import React from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import InputField from "../../../../_helper/_inputField";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import Loading from "../../../../_helper//_loading";
import { imarineBaseUrl } from "../../../../../App";
import { commonBookingRequestStatusUpdate } from "../helper";
const validationSchema = Yup.object().shape({
  date: Yup.date().required("Date is required"),
});
function CommonStatusUpdateModal({ CB, rowClickData }) {
  const [
    ,
    getBookingRequestStatusUpdate,
    bookingRequestloading,
  ] = useAxiosPut();

  const saveHandler = (values) => {
    const commonPaylaod = commonBookingRequestStatusUpdate(rowClickData);
    const payload = {
      ...commonPaylaod,
      bookingRequestId: rowClickData?.bookingRequestId,
      [rowClickData.isUpdateDate]: values?.date,
      [rowClickData.isUpdateKey]: true,
    };
    getBookingRequestStatusUpdate(
      `${imarineBaseUrl}/domain/ShippingService/BookingRequestStatusUpdate`,
      payload,
      () => {
        CB();
      }
    );
    getBookingRequestStatusUpdate();
  };
  return (
    <div className="commonStatusUpdateModal">
      {bookingRequestloading && <Loading />}
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

                <>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </>
              </div>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label={`${rowClickData?.title} Date`}
                    name="date"
                    type="datetime-local"
                    onChange={(e) => setFieldValue("date", e.target.value)}
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

export default CommonStatusUpdateModal;
