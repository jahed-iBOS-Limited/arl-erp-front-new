import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

const validationSchema = Yup.object().shape({
  costName: Yup.string().required("Cost Name is required"),
});

function CreateCostElementModal({ CB }) {
  const saveHandler = (values, cb) => {
    const paylaod = { ...values };
    console.log(paylaod);

    if (paylaod) {
      //   SaveBookingConfirm(
      //     `${imarineBaseUrl}/domain/ShippingService/SaveBookingConfirm`,
      //     paylaod,
      //     CB
      //   );
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="confirmModal">
      {/* {(bookingConfirmLoading || shipBookingRequestLoading) && <Loading />} */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          costName: "",
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
                <div className="d-flex justify-content-end my-1">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              <div className="form-group row global-form mt-0">
                {/*  Cost Name*/}
                <div className="col-lg-3">
                  <InputField
                    value={values?.costName}
                    label="Cost Name"
                    name="Cost Name"
                    type="text"
                    onChange={(e) => setFieldValue("costName", e.target.value)}
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

export default CreateCostElementModal;
