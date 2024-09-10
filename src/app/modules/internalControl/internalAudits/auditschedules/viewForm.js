import React, { memo } from "react";
import { Form, Formik } from "formik";
import ReactQuill from "react-quill";

const ViewForm = memo(({ scheduleData, setSingleScheduleData }) => {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        onSubmit={(values, { resetForm }) => {}}
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
          <Form id="createForm" className="">
            <div className="row">
              <div className="col-12">
                <label>Audit Objective</label>
                <ReactQuill
                  placeholder="Write the audit objective here"
                  value={scheduleData?.strAuditObjective || ""}
                  onChange={(value) =>
                    setSingleScheduleData((prev) => ({
                      ...prev,
                      strAuditObjective: value,
                    }))
                  }
                />
              </div>

              <div className="col-12 mt-3">
                <label>Scope of Audit</label>
                <ReactQuill
                  placeholder="Write the scope of the audit here"
                  value={scheduleData?.strScopeOfAudit || ""}
                  onChange={(value) =>
                    setSingleScheduleData((prev) => ({
                      ...prev,
                      strScopeOfAudit: value,
                    }))
                  }
                />
              </div>
              <div className="col-12 mt-3">
                <label>General Scope Of Work</label>
                <ReactQuill
                  placeholder="Write the general scope Of work here"
                  value={scheduleData?.strGeneralScopeOfWork || ""}
                  onChange={(value) =>
                    setSingleScheduleData((prev) => ({
                      ...prev,
                      strGeneralScopeOfWork: value,
                    }))
                  }
                />
              </div>
              <div className="col-12 mt-3">
                <label>Action Plan</label>
                <ReactQuill
                  placeholder="Write the action plan here"
                  value={scheduleData?.strActionPlan || ""}
                  onChange={(value) =>
                    setSingleScheduleData((prev) => ({
                      ...prev,
                      strActionPlan: value,
                    }))
                  }
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
});

export default ViewForm;
