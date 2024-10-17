import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import Loading from "../../../../_helper/_loading";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
const validationSchema = Yup.object().shape({
  // date: Yup.date().required("Date is required"),
});
function HBLCodeGNModal({ CB, rowClickData }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [, createHblFcrNumber, createHblFcrNumberLoading] = useAxiosPut();

  const saveHandler = (values) => {
    console.log('object1')
    createHblFcrNumber(
      `${imarineBaseUrl}/domain/ShippingService/CreateHblFcrNumber?BookingId=${bookingRequestId}&typeId=1`,
      null,
      () => {
        console.log('object')
        CB();
      }
    );
  };
  return (
    <div className="commonStatusUpdateModal">
      {createHblFcrNumberLoading && <Loading />}
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
              {/* <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label={`${rowClickData?.title} Date`}
                    name="date"
                    type="datetime-local"
                    onChange={(e) => setFieldValue("date", e.target.value)}
                  />
                </div>
              </div> */}
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default HBLCodeGNModal;
