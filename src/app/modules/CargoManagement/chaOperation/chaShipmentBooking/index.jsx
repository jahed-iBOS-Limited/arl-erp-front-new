import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import ICustomCard from "../../../_helper/_customCard";

const validationSchema = Yup.object().shape({});

export default function ChaShipmentBooking() {
  let history = useHistory();
  const formikRef = React.useRef(null);
  const saveHandler = (values, cb) => {};

  return (
    <ICustomCard
      title="CHA Shipment Booking List"
      createHandler={() => {
        history.push(
          "/cargoManagement/cha-operation/cha-shipment-booking/create"
        );
      }}
      backHandler={() => {
        history.goBack();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={{}}
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
            {/* <h1>
                            {JSON.stringify(errors)}
                        </h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                }}
              >
                <div className="form-group row global-form">
                  {/* form fields here */}
                  <h3>This page is under construction. Please visit later!</h3>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
