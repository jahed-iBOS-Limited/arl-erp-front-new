/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Formik } from "formik";
import TextArea from "../../../../_helper/TextArea";
import Loading from "../../../../_helper/_loading";
const initData = {
  remarks: "",
};

export default function CancelProductionRequest({ cancelHandler, id, value }) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          cancelHandler(id, { ...values, ...value },setLoading);
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <>
            <div className="d-flex justify-content-between mt-2">
              <h3>Production Request Cancel</h3>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => handleSubmit()}
              >
                Done
              </button>
            </div>
            <form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-12">
                  <label>Remarks</label>
                  <TextArea
                    rows={4}
                    value={values?.remarks}
                    name="remarks"
                    placeholder="Remarks"
                    errors={errors}
                    touched={touched}
                    label="Remarks"
                  />
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
