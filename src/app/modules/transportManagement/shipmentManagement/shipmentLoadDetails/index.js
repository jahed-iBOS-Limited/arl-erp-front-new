import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { landingInitData } from "./helper";

export default function ShipmentLoadDetailsLandingPage() {
  // hook
  const history = useHistory();

  // save handler
  const saveHandler = (values, cb) => {};

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(landingInitData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm
            title="Shipment Load Details"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push({
                        pathname:
                          "/transport-management/shipmentmanagement/ShipmentLoadDetails/create",
                      });
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div>Landing here...</div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
