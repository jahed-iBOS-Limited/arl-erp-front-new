/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { moneyInWord } from '../../../../_helper/_convertMoneyToWord';
import Loading from '../../../../_helper/_loading';
import { sendEmailPostApi } from '../helper';
import { excelGenerator } from './excelGenerator';
import { generateExcel } from './excelReportGenarate';

const validationSchema = Yup.object().shape({
   toMail: Yup.string().required('Email is required'),
   subject: Yup.string().required('Subject is required'),
});

export default function EmailViewForm({
   initData,
   selectedBusinessUnit,
   data,
   landingValues,
}) {
   const [loading, setLoading] = useState(false);

   const [total, setTotal] = useState(0);
   const [totalInWords, setTotalInWords] = useState(0);

   useEffect(() => {
      if (data.length > 0) {
         setTotal(
            Number(
               data?.reduce((acc, item) => acc + item?.numAmount, 0).toFixed(2)
            )
         );
      }
   }, [data]);

   useEffect(() => {
      if (total) {
         moneyInWord(total, setTotalInWords);
      }
   }, [total]);

   const adviceName =
      landingValues?.advice?.label === 'IBBL'
         ? 'IBBL_ONLINE'
         : landingValues?.advice?.label === 'IBBL-BEFTN'
         ? 'IBBL_BEFTN'
         : landingValues?.advice?.label;
   const dateFormat = landingValues?.dateTime?.split('/').join('_');
   const fileName = `${selectedBusinessUnit?.buShortName}_${
      total ? total : 0
   }_${adviceName}_${dateFormat}`;

   function saveHandler(values, cb) {
      const promiseLanding = new Promise((resolve, reject) => {
         // if (landingValues?.adviceType?.value === 15) {
         //    console.log("zakat email")
         //    zakatAdvicePlanExcel(data, landingValues, fileName, getZakatBlobData => {
         //       resolve(getZakatBlobData);
         //    });
         // }
         // else{
            if (
               landingValues?.advice?.info === 'ibblBEFTN' ||
               landingValues?.advice?.info === 'ibbl' ||
               landingValues?.advice?.info === 'primeBEFTN' ||
               landingValues?.advice?.info === 'prime' ||
               landingValues?.advice?.info === 'scb' ||
               landingValues?.advice?.info === 'above36Character' ||
               landingValues?.advice?.info === 'below36Character' ||
               landingValues?.advice?.info === 'import'
            ) {
               generateExcel(
                  data,
                  landingValues,
                  total,
                  totalInWords,
                  selectedBusinessUnit,
                  false,
                  getBlobData => {
                     resolve(getBlobData);
                  }
               );
            } else {
               excelGenerator(
                  landingValues,
                  data,
                  selectedBusinessUnit,
                  total,
                  totalInWords,
                  adviceBlobData => {
                     resolve(adviceBlobData);
                  }
               );
            }
         // }
         
      });

      // const promiseAdvice = new Promise((resolve, reject) => {
      //    excelGenerator(
      //       landingValues,
      //       data,
      //       selectedBusinessUnit,
      //       total,
      //       totalInWords,
      //       adviceBlobData => {
      //          resolve(adviceBlobData);
      //       }
      //    );
      // });

      try {
         Promise.all([promiseLanding]).then(attachmentData => {
            sendEmailPostApi(values, attachmentData, fileName, setLoading);
            cb();
         });
      } catch (error) {
         console.log('error', error);
      }
   }

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
                           <input
                              type="text"
                              className="form-control"
                              onChange={handleChange}
                              value={values.toMail}
                              placeholder="To"
                              name="toMail"
                           />
                           <span className="text-danger">
                              {errors.toMail && touched.toMail && errors.toMail}
                           </span>
                        </div>
                        <div className="col-8 form-group mx-auto mt-2">
                           <span>To CC</span>
                           <input
                              type="text"
                              className="form-control"
                              onChange={handleChange}
                              value={values.toCC}
                              placeholder="CC"
                              name="toCC"
                           />
                        </div>
                        <div className="col-8 form-group mx-auto mt-2">
                           <span>To BCC</span>
                           <input
                              type="text"
                              onChange={handleChange}
                              value={values.toBCC}
                              className="form-control"
                              placeholder="BCC"
                              name="toBCC"
                           />
                        </div>
                        <div className="col-8 form-group pt-2 mx-auto mt-2">
                           <span>Subject</span>
                           <input
                              type="text"
                              onChange={handleChange}
                              value={values.subject}
                              className="form-control"
                              placeholder="Subject"
                              name="subject"
                           />
                           <span className="text-danger">
                              {errors.subject &&
                                 touched.subject &&
                                 errors.subject}
                           </span>
                        </div>
                        <div className="col-8 form-group pt-2 mx-auto mt-2">
                           <span>Message Body</span>
                           <textarea
                              className="form-control"
                              onChange={handleChange}
                              value={values.message}
                              id=""
                              cols="30"
                              rows="8"
                              placeholder="Your message"
                              name="message"
                           ></textarea>
                           {errors.message && touched.message && errors.message}
                        </div>
                        <div className="col-8 form-group mx-auto mt-2">
                           {/* <input type="file" 
              ref={imageInputRef} 
              onChange={e => setAttachment(e.target.files[0])}
              className="form-control" name="file" /> */}
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
                           <input
                              type="submit"
                              className="btn btn-primary"
                              value="Send Message"
                           ></input>
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </Formik>
   );
}
