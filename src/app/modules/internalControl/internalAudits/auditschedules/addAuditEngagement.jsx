import { Form, Formik } from "formik";
import React from "react";
import InputField from "../../../_helper/_inputField";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";

const initData = {
  auditEngagementName: "",
};

export default function AddAuditEngagement({ getAuditEngagement }) {
  const [, saveData, loading] = useAxiosPost();

  const saveHandler = (values, resetForm) => {
    saveData(
      `/fino/Audit/CreateAuditEngagementAsync`,
      {
        strAuditEngagementName: values?.auditEngagementName,
        isActive: true,
      },
      () => {
        getAuditEngagement();
        resetForm();
      },
      true
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            {loading && <Loading />}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-6">
                  <InputField
                    value={values?.auditEngagementName}
                    label="Audit Engagement Name"
                    name="auditEngagementName"
                  />
                </div>

                <div style={{ marginTop: "18px" }} className="col-lg-1">
                  <button
                    disabled={!values?.auditEngagementName}
                    onClick={() => {
                      saveHandler(values, resetForm);
                    }}
                    className="btn btn-primary"
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
