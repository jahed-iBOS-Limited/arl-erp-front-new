import React from "react";
import { Formik, Form } from "formik";
import JoditEditor from "jodit-react";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { useDispatch } from "react-redux";
import InputField from "../../../../_helper/_inputField";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  isEdit,
  setOpen,
}) {
  const dispatch = useDispatch();

  const config = {
    toolbarSticky: true,
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {console.log("Values =>", values)}
            <div className="row">
              <div className="col-lg-12">
                <div
                  className={"global-form"}
                  style={{ paddingBottom: "10px" }}
                >
                  <Form className="form form-label-right addCircular">
                    <div className="col-lg-12" style={{ marginTop: "10px" }}>
                      {/* Title Field*/}
                      <InputField
                        value={values?.title || ""}
                        label="Job Title"
                        placeholder="Title"
                        name="title"
                        type="text"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div
                      className="col-lg-3 fixPadding"
                      style={{ marginTop: "10px" }}
                    >
                      <InputField
                        value={values?.deadline}
                        style={{ paddinTop: "18px" }}
                        label="Deadline"
                        placeholder="Deadline"
                        name="deadline"
                        type="date"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <button
                      onClick={() => setOpen(true)}
                      type="button"
                      className="btn btn-primary ml-2 customUploadBtn"
                    >
                      {/* Upload Description as Image (optional) */}
                      Upload Circular (optional)
                    </button>

                    {isEdit && values?.jobImagePath && (
                      <div
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.jobImagePath)
                          );
                        }}
                        className="custom_viewBtn d-inline-block btn btn-primary ml-2 customUploadBtn"
                      >
                        <IView clickHandler={() => {}} />
                      </div>
                    )}

                    {/* Text Editor */}
                    <div className="col-lg-12" style={{ marginTop: "10px" }}>
                      <label>Job Description</label>
                      <JoditEditor
                        value={values?.description || ""}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) =>
                          setFieldValue("description", newContent)
                        } // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{ display: "none" }}
                      ref={btnRef}
                      onSubmit={() => handleSubmit()}
                    ></button>

                    <button
                      type="reset"
                      style={{ display: "none" }}
                      ref={resetBtnRef}
                      onSubmit={() => resetForm(initData)}
                    ></button>
                  </Form>
                </div>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
