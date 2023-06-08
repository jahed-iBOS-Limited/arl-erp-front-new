/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import GridData from "./grid";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
};

export default function HeaderForm({ rowDto, createHandler, setPositionHandler, pageNo, setPageNo, pageSize, setPageSize, loader }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Personal Information"}>
                <CardHeaderToolbar>
                  {/* <button onClick={createHandler} className="btn btn-primary">
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <GridData setPositionHandler={setPositionHandler} pageNo={pageNo} setPageNo={setPageNo} pageSize={pageSize} setPageSize={setPageSize} rowDto={rowDto} loader={loader} />
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
