import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {};
export default function CommercialInvoiceLanding() {
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
              title="Commercial Invoice"
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
                        history.push("/managementExport/exptransaction/commercialinvoice/create");
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