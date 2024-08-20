import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import Dashboard from "./dashboard";
const initData = {};
export default function DisplayPackerInfo() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm
            title="Display Packer Info"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div><Dashboard/></div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
