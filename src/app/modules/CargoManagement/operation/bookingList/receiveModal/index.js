import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { imarineBaseUrl } from "../../../../../App";
import "./style.css";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
const validationSchema = Yup.object().shape({
  poNumber: Yup.string().required("PO Number is required"),
  countryofOrigin: Yup.object().shape({
    label: Yup.string().required("Country of Origin is required"),
    value: Yup.string().required("Country of Origin is required"),
  }),
  pickupPlace: Yup.string().required("Pickup Place is required"),
});
function ReceiveModal({ rowClickData, CB }) {
  const [countryList, getCountryList, countryListLoading] = useAxiosGet();

  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const saveHandler = (values, resetForm) => {
    // const paylaod = {};
    // getBookingRequestStatusUpdate(
    //   `${imarineBaseUrl}/domain/ShippingService/SaveBookingConfirm`,
    //   paylaod,
    //   ()=>{
    //     CB()
    //   }
    // );
  };

  useEffect(() => {
    getCountryList(`${imarineBaseUrl}/domain/CreateSignUp/GetCountryList`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookingData = shipBookingRequestGetById?.[0] || {};
  return (
    <div className="confirmModal">
      {(shipBookingRequestLoading || countryListLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          poNumber: "",
          countryofOrigin: "",
          pickupPlace: "",
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
                {/*  PO Number*/}
                <div className="col-lg-3">
                  <InputField
                    value={values?.poNumber}
                    label="PO Number"
                    name="poNumber"
                    type="number"
                    onChange={(e) => setFieldValue("poNumber", e.target.value)}
                  />
                </div>
                {/* Country of Origin */}
                <div className="col-lg-3">
                  <NewSelect
                    name="countryofOrigin"
                    options={countryList || []}
                    value={values?.countryofOrigin}
                    label="Country of Origin"
                    onChange={(valueOption) => {
                      setFieldValue("countryofOrigin", valueOption);
                    }}
                    placeholder="Country of Origin"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Pickup Place */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.pickupPlace}
                    label="Pickup Place"
                    name="pickupPlace"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("pickupPlace", e.target.value)
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

export default ReceiveModal;
