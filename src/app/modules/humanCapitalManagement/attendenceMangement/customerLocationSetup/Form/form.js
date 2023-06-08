import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import RemoteAttendanceMap from "./map";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import { useHistory } from "react-router-dom";
// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  saveHandler,
  mapData,
  isDisabled,
  setMapData,
  state,
}) {
  const history = useHistory();
  const handleRefresh = () => {
    window.location.reload();
  };
  const backHandler = () => {
    history.goBack();
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Customer Location"}>
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={backHandler}
                    className={"btn btn-light"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={isDisabled}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody className="">
                <Form className="form form-label-right">
                  <div className="mt-5 d-flex justify-content-between">
                    <p>
                      <b>Partner Name:</b> {state?.partnerName},{" "}
                      <b>Partner Code:</b> {state?.partnerCode},{" "}
                      <b>Partner Address:</b> {state?.partnerAddress}
                    </p>
                    <button
                      onClick={handleRefresh}
                      className="btn btn-primary ml-2"
                      type="button"
                      disabled={isDisabled}
                    >
                      Location Refresh
                    </button>
                  </div>

                  <RemoteAttendanceMap
                    setMapData={setMapData}
                    mapData={mapData}
                  />
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
