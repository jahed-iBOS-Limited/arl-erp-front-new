import React, { useEffect, useState } from 'react';
import {
   Card,
   CardBody,
   CardHeader,
   CardHeaderToolbar,
   ModalProgressBar,
} from './../../../../../../_metronic/_partials/controls';
import DoFirst from './doFirst';
import Schedule from './schedule';
import Delegate from './delegate';
import DontDo from './dontDo';
import { shallowEqual, useSelector } from 'react-redux';
import '../eisenhoweratrix.scss';
import html2pdf from 'html2pdf.js';
import EisenHowerPdfFile from './pdfFile';
import { getEisenhowerMatrixValue, getYearDDL } from '../../helper';
import { Formik, useFormik } from 'formik';
import NewSelect from '../../../../_helper/_select';
import Loading from '../../../../_helper/_loading';

const initialValues = {
   quarterDDLgroup: ""
};

const EisenhowerMatrix = () => {
   const quarters = [
      { value: '1', label: 'Q1' },
      { value: '2', label: 'Q2' },
      { value: '3', label: 'Q3' },
      { value: '4', label: 'Q4' },
   ];

   const { profileData } = useSelector(state => {
      return state.authData;
   }, shallowEqual);

   const {
      employeeId,
      employeeFullName,
      accountId,
      designationName,
   } = profileData;

   const [rowDto, setRowDto] = useState({});
   const [yearDDL, setYearDDl] = useState([]);
   const [loading, setLoading] = useState(false);

   const pdfExport = fileName => {
      var element = document.getElementById('pdf-section');

      var clonedElement = element.cloneNode(true);

      clonedElement.classList.add('d-block');

      var opt = {
         margin: 20,
         filename: `${fileName}.pdf`,
         image: { type: 'jpeg', quality: 0.98 },
         html2canvas: { scale: 5, dpi: 300, letterRendering: true },
         jsPDF: {
            unit: 'px',
            hotfixes: ['px_scaling'],
            orientation: 'portrait',
         },
      };
      html2pdf()
         .set(opt)
         .from(clonedElement)
         .save();
   };

   const { setFieldValue, values } = useFormik({
      initialValues,
   });

   useEffect(() => {
      getYearDDL(accountId, setYearDDl);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const singleData = {
      employeeFullName,
      designationName,
      doFirst: rowDto?.doFirst,
      schedule: rowDto?.schedule,
      delegate: rowDto?.delegate,
      dontDo: rowDto?.dontDo,
      header: rowDto?.header,
   };

   return (
      <Formik>
         <Card>
         {true && <ModalProgressBar />}
            <CardHeader title="Eisenhower Matrix Worksheet">
               <CardHeaderToolbar>
                  <button
                     type="button"
                     className="btn btn-primary"
                     onClick={e => pdfExport('Eisenhower Matrix')}
                  >
                     Export PDF
                  </button>
               </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
               {loading && <Loading />}
               <div className="row mb-2">
                     <div className="col-lg-4 mt-2">
                        <div>
                           <strong>Name</strong>: <span>{rowDto?.header?.strEmployeeName}</span>
                        </div>
                        <div>
                           <strong>Enroll</strong>: <span>{rowDto?.header?.intEmployeeId}</span>
                        </div>
                     </div>
                     <div className="col-lg-4 mt-2">
                        <div>
                           <strong>Designation</strong>:{' '}
                           <span>{rowDto?.header?.designation || ''}</span>
                        </div>
                        <div>
                           <strong>Location</strong>:{' '}
                           <span>{rowDto?.header?.workplaceGroup || ''}</span>
                        </div>
                     </div>
                  </div>
                  <hr />
                     <div
                        id="element-to-hide"
                        data-html2canvas-ignore="true"
                        className="form-group row mb-4 global-form "
                     >
                        <div className="col-lg-3">
                           <NewSelect
                              name="yearDDLgroup"
                              options={yearDDL || []}
                              value={values?.yearDDLgroup}
                              label="Year"
                              onChange={valueOption => {
                                 setFieldValue('yearDDLgroup', valueOption);
                                 setFieldValue('quarterDDLgroup', "");
                                //  getEisenhowerMatrixValue(
                                //     employeeId,
                                //     valueOption?.value || 0,
                                //     values?.quarterDDLgroup?.value,
                                //     setLoading,
                                //     setRowDto
                                //  );
                                 setRowDto([])
                              }}
                              placeholder="Year"
                              isSearchable={true}
                              isDisabled={false}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="quarterDDLgroup"
                              options={quarters || []}
                              value={values?.quarterDDLgroup}
                              label="Quarter"
                              onChange={valueOption => {
                                 if(valueOption){
                                  setFieldValue('quarterDDLgroup', valueOption);
                                 getEisenhowerMatrixValue(
                                    employeeId,
                                    values?.yearDDLgroup?.value || 0,
                                    valueOption?.value,
                                    setLoading,
                                    setRowDto
                                 );
                                 }else{
                                  setFieldValue("quarterDDLgroup", "")
                                  setRowDto([])
                                 }
                              }}
                              placeholder="Quarter"
                              isSearchable={true}
                              isDisabled={false}
                           />
                        </div>
                     </div>
                  <hr />
               <div className="eisenhower-matrix-wrapper">
                  <div className="bg-secondary p-2">
                     <div>
                        <div className="d-flex">
                           <div className="w-100 m-2">
                              <DoFirst doFirst={rowDto?.doFirst} />
                           </div>
                           <div className="w-100 m-2">
                              <Schedule schedule={rowDto?.schedule} />
                           </div>
                        </div>
                        <div className="d-flex">
                           <div className="w-100 m-2">
                              <Delegate delegate={rowDto?.delegate} />
                           </div>
                           <div className="w-100 m-2">
                              <DontDo dontDo={rowDto?.dontDo} />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div
                  id="pdf-section"
                  className="eisenhower-matrix-wrapper d-none m-5"
               >
                  <EisenHowerPdfFile singleData={singleData} />
               </div>
            </CardBody>
         </Card>
      </Formik>
   );
};

export default EisenhowerMatrix;
