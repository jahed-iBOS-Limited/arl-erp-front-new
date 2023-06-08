/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { sendEmailPostApi } from "../helper";
import Loading from "../../../../../_helper/_loading";


const validationSchema = Yup.object().shape({
  toMail: Yup.string().required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

export default function ViewForm({
  initData
}) {

  
  //const [headerAttachment, setHeaderAttachment] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const [attachment, setAttachment] = useState("");
  const imageInputRef = useRef();


  function saveHandler(values, cb) {
    sendEmailPostApi(values, attachment, setLoading).then(() => {
      cb()
      imageInputRef.current.value = ""
    })
    };
  

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
         // resetForm(initData);
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
          {loading && <Loading />}
          <div className="container">
            <form enctype="multipart/form-data" onSubmit={handleSubmit}>
              <div className="row pt-5 mx-auto">
                <div className="col-8 form-group pt-2 mx-auto mt-2">
                  <span>To Mail</span>
                  <input type="text" className="form-control"
                    onChange={handleChange}
                    value={values.toMail}
                    placeholder="To" name="toMail" />
                  <span className="text-danger">{errors.toMail && touched.toMail && errors.toMail}</span>
                </div>
                <div className="col-8 form-group mx-auto mt-2">
                  <span>To CC</span>
                  <input type="text" className="form-control"
                    onChange={handleChange}
                    value={values.toCC}
                    placeholder="CC" name="toCC" />
                </div>
                <div className="col-8 form-group mx-auto mt-2">
                  <span>To BCC</span>
                  <input type="text"
                    onChange={handleChange}
                    value={values.toBCC}
                    className="form-control" placeholder="BCC" name="toBCC" />
                </div>
                <div className="col-8 form-group pt-2 mx-auto mt-2">
                  <span>Subject</span>
                  <input type="text"
                    onChange={handleChange}
                    value={values.subject}
                    className="form-control" placeholder="Subject" name="subject" />
                  <span className="text-danger">{errors.subject && touched.subject && errors.subject}</span>
                </div>
                <div className="col-8 form-group pt-2 mx-auto mt-2">
                  <span>Message Body</span>
                  <textarea className="form-control"
                    onChange={handleChange}
                    value={values.message}
                    id="" cols="30" rows="8" placeholder="Your message" name="message"></textarea>
                  {errors.message && touched.message && errors.message}
                </div>
                <div className="col-8 form-group mx-auto mt-2">
              <input type="file" 
              ref={imageInputRef} 
              onChange={e => setAttachment(e.target.files[0])}
              className="form-control" name="file" />
            </div>
                {/* <div className="col-lg-8 d-flex form-group pt-2 mx-auto mt-2">
                                 <div className={'image-upload-box with-img mt-4'} >
                                    <button
                                       className="btn btn-primary"
                                       onClick={onButtonCVClick}
                                       type="button"
                                       style={{
                                          marginLeft: '10px',
                                          height: '30px',
                                       }}
                                    >
                                       Attachment
                                    </button>
                                    <input
                                       onChange={e => {
                                          // e.stopPropagation();
                                          if (e.target.files?.[0]) {
                                            console.log("e.target.files?.[0]", e.target.files?.[0])
                                            // let formData = new FormData();
                                            // formData.append("files", e.target.files?.[0]);

                                            // console.log("formData", formData)

                                            //setHeaderAttachment(e.target.files?.[0])
                                             attachment_action(
                                                e.target.files,
                                                setLoading
                                             )
                                                .then(data => {
                                                   setHeaderAttachment(
                                                      data?.[0]?.id
                                                   );
                                                })
                                                .catch(error => {
                                                   setHeaderAttachment('');
                                                });
                                          }
                                       }}
                                       type="file"
                                       ref={inputCVFile}
                                       id="file"
                                       style={{ display: 'none' }}
                                    />
                                 </div>
                                 {headerAttachment && 
                                  <div className='mt-5 ml-5'>
                                    <IView
                                      title={'Attachment'}
                                      style={{fontSize:"30px !important"}}
                                      classes={'text-primary'}
                                      clickHandler={() => {
                                         dispatch(
                                            getDownlloadFileView_Action(headerAttachment ? headerAttachment : "")
                                         );
                                      }}
                                    />
                                  </div>
                                 }
                              </div> */}
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
