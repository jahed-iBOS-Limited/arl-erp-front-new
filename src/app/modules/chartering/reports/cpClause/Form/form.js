import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import { validationSchema } from "../helper";
import ReactQuill from "react-quill";
import "./style.css";
import FormikInput from "../../../_chartinghelper/common/formikInput";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  cpData,
}) {
  const history = useHistory();

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "align",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, cpData: cpData?.varDataFile || "" }}
        validationSchema={validationSchema}
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
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row" style={{ padding: "0 12em 0 12em" }}>
                  <div className="col-lg-6">
                    <label>File Name</label>
                    <FormikInput
                      value={values?.fileName}
                      name="fileName"
                      placeholder="fileName"
                      type="text"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6"></div>

                  <div className="col-lg-6 mt-5">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6 mt-5">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      value={values?.fileName}
                      name="fileName"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                </div>
                <div className="col-lg-12 editor mt-3">
                  <ReactQuill
                    // theme=""
                    onChange={(e) => {
                      setFieldValue("cpData", e);
                    }}
                    value={values?.cpData}
                    modules={modules}
                    formats={formats}
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
