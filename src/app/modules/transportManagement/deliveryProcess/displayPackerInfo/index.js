import { Form, Formik } from "formik";
import React from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import Dashboard from "./dashboard";
const initData = {};
export default function DisplayPackerInfo() {
  const saveHandler = (values, cb) => {};

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {() => (
        <>
          {false && <Loading />}
          <IForm
            title="Display Packer Info"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div>
                <Dashboard />
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
