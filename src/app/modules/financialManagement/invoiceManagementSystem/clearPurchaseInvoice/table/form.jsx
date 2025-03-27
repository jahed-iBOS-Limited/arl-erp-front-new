

import React from "react";
import { Formik, Form } from "formik";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";

import * as Yup from "yup";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import GridData from "./grid";

export default function HeaderForm() {
  const history = useHistory();
  let receivepaymentAuthData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );


  let { profileData, selectedBusinessUnit } = receivepaymentAuthData;

  const backHandler = () => {
    history.goBack();
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        //initialValues={initData}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right cj">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Clear Purchase Invoice"}>
                </CardHeader>
                <CardBody>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="content_box d-flex response-content-box mb-1"></div>
                    </div>
                  </div>
                  <GridData />
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
