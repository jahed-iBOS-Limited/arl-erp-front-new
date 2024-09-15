import { Form, Formik } from "formik";
import React from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {};
export default function Recap() {
  const saveHandler = (values, cb) => {};
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
          <IForm title="Recap" isHiddenReset isHiddenBack isHiddenSave>
            <Form>
              <div>Landing here...</div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
