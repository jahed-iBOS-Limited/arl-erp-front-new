import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";
const initData = {};
export default function ScheduleStatusModal() {
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
              title="Schedule Complete Status"
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
                        console.log("Save button")
                      }}
                    >
                      Save
                    </button>
                  </div>
                );
              }}
            >
              <Form>
              <div className="row mt-10">
                <div className="col-lg-4">
                    <InputField
                      value={values?.completeDate}
                      label="Complete Date"
                      type="date"
                      name="completeDate"
                      onChange={(e) => {
                        setFieldValue("completeDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                        <InputField
                          value={values?.remarks}
                          label="Remarks"
                          name="remarks"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("remarks", e.target.value);
                          }}
                        />
                      </div>
                </div>
              </Form>
            </IForm>
        </>
      )}
    </Formik>
  );
}