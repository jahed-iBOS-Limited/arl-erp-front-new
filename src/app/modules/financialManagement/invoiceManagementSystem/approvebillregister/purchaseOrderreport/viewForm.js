/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";
import { sendEmailPostApi } from "../../../../procurement/purchase-management/purchaseOrder/helper"
import * as Yup from "yup";
import { Formik } from "formik";


const validationSchema = Yup.object().shape({
  toMail: Yup.string().required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

export default function ViewForm({
  initData
}) {

  
  const imageInputRef = useRef();

  function saveHandler(values, cb) {
    sendEmailPostApi(values).then(() => {
      cb()
      imageInputRef.current.value = ""
    })

  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
        handleChange,
        setFieldValue,
        isValid,
      }) => (
        <div>
          <div className="container">
            <form enctype="multipart/form-data" onSubmit={handleSubmit}>
              <div className="row pt-5 mx-auto">
                <div className="col-8 form-group pt-2 mx-auto mt-2">
                  <input type="email" className="form-control"
                    onChange={handleChange}
                    value={values.toMail}
                    placeholder="To" name="toMail" />
                  <span className="text-danger">{errors.toMail && touched.toMail && errors.toMail}</span>
                </div>
                <div className="col-8 form-group mx-auto mt-2">
                  <input type="text" className="form-control"
                    onChange={handleChange}
                    value={values.toCC}
                    placeholder="CC" name="toCC" />
                </div>
                <div className="col-8 form-group mx-auto mt-2">
                  <input type="text"
                    onChange={handleChange}
                    value={values.toBCC}
                    className="form-control" placeholder="BCC" name="toBCC" />
                </div>
                <div className="col-8 form-group pt-2 mx-auto mt-2">
                  <input type="text"
                    onChange={handleChange}
                    value={values.subject}
                    className="form-control" placeholder="Subject" name="subject" />
                  <span className="text-danger">{errors.subject && touched.subject && errors.subject}</span>
                </div>
                <div className="col-8 form-group pt-2 mx-auto mt-2">
                  <textarea className="form-control"
                    onChange={handleChange}
                    value={values.message}
                    id="" cols="30" rows="8" placeholder="Your message" name="message"></textarea>
                  {errors.message && touched.message && errors.message}
                </div>
                <div className="col-8 form-group mx-auto mt-2">
                  <input type="file"
                    onChange={e => setFieldValue("attachment",e.target.files[0])}
                    className="form-control" ref={imageInputRef}  name="attachment" />
                </div>
                <div className="col-8 pt-3 mx-auto">
                  <input type="submit" className="btn btn-primary" value="Send Message"></input>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
}
