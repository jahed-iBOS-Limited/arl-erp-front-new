import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
const initData = {};
export default function AssetLiabilityPlan() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
            title="Asset Liability Plan"
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
                      history.push(
                        "/internal-control/budget/AssetLiabilityPlan/create"
                      );
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
