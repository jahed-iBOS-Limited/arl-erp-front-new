/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Formik, Form } from "formik";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
// eslint-disable-next-line no-unused-vars
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

  // eslint-disable-next-line no-unused-vars
  let { profileData, selectedBusinessUnit } = receivepaymentAuthData;
  // eslint-disable-next-line no-unused-vars
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
