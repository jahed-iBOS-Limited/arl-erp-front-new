import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {};
export default function ItemRateUpdate() {
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
            title="Item Rate Update"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
             <>
            
             </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
