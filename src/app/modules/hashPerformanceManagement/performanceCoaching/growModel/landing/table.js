import { Table } from '@material-ui/core';
import { Formik } from 'formik';
import html2pdf from 'html2pdf.js';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   Card,
   CardBody,
   CardHeader,
   CardHeaderToolbar,
   ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import TextArea from '../../../../_helper/TextArea';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import { quaterDDL } from '../../../hashPerformanceCommon';
import { getYearDDL } from '../../../performancePlanning/helper';
import '../growModel.scss';
import { createGrowModel, getGrowCoachingModelWorksheet } from '../helper';
import GrowModelPdf from './pdfFile';

const initData = {
   quarterDDLgroup: '',
   yearDDLgroup: '',
   goal: '',
   reality: '',
   obstacles: '',
   options: '',
   wayForward: '',
};

const GrowModel = () => {
   const [yearDDL, setYearDDL] = useState([]);
   const [loading, setLoading] = useState(null);
   const [rowDto, setRowDto] = useState({});
   //const [dataset, setDataSet] = useState({})

   //  const ModifiedValues = {
   //     quarterDDLgroup: {
   //        label: rowDto?.quarter,
   //        value: rowDto?.quarterId,
   //     },
   //     yearDDLgroup: {
   //        label: rowDto?.year,
   //        value: rowDto?.yearId,
   //     },
   //     goal: rowDto?.goal || '',
   //     reality: rowDto?.reality || '',
   //     obstacles: rowDto?.obstacles || '',
   //     options: rowDto?.options || '',
   //     wayForward: rowDto?.wayForward || '',
   //  };

   const { selectedBusinessUnit, profileData } = useSelector(state => {
      return state.authData;
   }, shallowEqual);

   const {
      employeeId,
      employeeFullName,
      accountId,
      designationId,
      actionBy,
   } = profileData;

   useEffect(() => {
      getYearDDL(accountId, setYearDDL);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const saveHandler = (values, rowDto) => {
      if (
         !rowDto.goal &&
         !rowDto.reality &&
         !rowDto.obstacles &&
         !rowDto.options &&
         !rowDto.wayForward
      ) {
         return toast.warn('Please add at least one Field.');
      }
      const payload = {
         growModelId: rowDto?.growModelId || 0,
         employeeId: employeeId,
         employeeName: employeeFullName,
         designationId: designationId,
         businessUnitId: selectedBusinessUnit?.value,
         workplaceGroupId: rowDto?.workplaceGroupId || 0,
         yearId: rowDto?.yearId || values?.yearDDLgroup?.value,
         year: rowDto?.year || values?.yearDDLgroup?.label,
         quarterId: rowDto?.quarterId || values.quarterDDLgroup.value,
         quarter: rowDto?.quarter || values.quarterDDLgroup.label,
         goal: rowDto.goal,
         reality: rowDto.reality,
         obstacles: rowDto.obstacles,
         options: rowDto.options,
         wayForward: rowDto.wayForward,
         isActive: true,
         actionDate: new Date(),
         actionBy: actionBy,
      };
      createGrowModel(payload, setLoading);
   };

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
   const editData = (name, value) => {
      const data = { ...rowDto };
      data[name] = value;
      setRowDto(data);
   };

   return (
      <Formik
         enableReinitialize={true}
         initialValues={initData}
         onSubmit={() => {
            //saveHandler()
            //console.log('submit', rowData);
         }}
      >
         {({ values, setFieldValue, errors, touched }) => (
            <>
               <Card>
                  {true && <ModalProgressBar />}
                  <CardHeader title="GROW Coaching Model Worksheet">
                     <CardHeaderToolbar>
                        <button
                           type="button"
                           className="btn btn-primary mr-3"
                           onClick={e => pdfExport('Grow Model')}
                        >
                           Export PDF
                        </button>
                        <button
                           type="submit"
                           style={{ cursor: 'pointer' }}
                           disabled={
                              !values?.yearDDLgroup || !values?.quarterDDLgroup
                           }
                           className="btn btn-primary mr-2"
                           onClick={() => {
                              saveHandler(values, rowDto);
                           }}
                        >
                           Save
                        </button>
                     </CardHeaderToolbar>
                  </CardHeader>
                  <CardBody>
                     {loading && <Loading />}
                     <div>
                        <div className="row">
                           <div className="col-lg-4 mt-2">
                              <div>
                                 <strong>Name</strong>:{' '}
                                 <span>{employeeFullName}</span>
                              </div>
                              <div>
                                 <strong>Enroll</strong>:{' '}
                                 <span>{employeeId}</span>
                              </div>
                           </div>
                           <div className="col-lg-4 mt-2">
                              <div>
                                 <strong>Designation</strong>:{' '}
                                 <span>{rowDto?.designation || ''}</span>
                              </div>
                              <div>
                                 <strong>Location</strong>:{' '}
                                 <span>{rowDto?.workplaceGroup || ''}</span>
                              </div>
                           </div>
                        </div>
                        <hr />
                        <div
                           id="element-to-hide"
                           data-html2canvas-ignore="true"
                           className="form-group row mb-4 global-form"
                        >
                           <div className="col-lg-3">
                              <NewSelect
                                 name="yearDDLgroup"
                                 options={yearDDL || []}
                                 value={values?.yearDDLgroup}
                                 label="Year"
                                 onChange={valueOption => {
                                    setFieldValue('yearDDLgroup', valueOption);
                                    if (values?.quarterDDLgroup?.value) {
                                       getGrowCoachingModelWorksheet(
                                          employeeId,
                                          valueOption?.value,
                                          values?.quarterDDLgroup?.value || 0,
                                          setLoading,
                                          setRowDto
                                       );
                                    }
                                 }}
                                 placeholder="Year"
                                 isSearchable={true}
                                 isDisabled={false}
                              />
                           </div>
                           <div className="col-lg-3">
                              <NewSelect
                                 name="quarterDDLgroup"
                                 options={quaterDDL || []}
                                 value={values?.quarterDDLgroup}
                                 label="Quarter"
                                 onChange={valueOption => {
                                    setFieldValue(
                                       'quarterDDLgroup',
                                       valueOption
                                    );
                                    getGrowCoachingModelWorksheet(
                                       employeeId,
                                       values?.yearDDLgroup?.value || 0,
                                       valueOption?.value,
                                       setLoading,
                                       setRowDto
                                    );
                                 }}
                                 placeholder="Quarter"
                                 isSearchable={true}
                                 isDisabled={false}
                              />
                           </div>
                        </div>
                        <div className="growModel">
                           <div className="text-center d-none">
                              <strong>GROW Coaching Model Worksheet</strong>
                           </div>
                           <Table className="global-table">
                              <tr>
                                 <td className="table-row-width p-2">
                                    <strong>Goal</strong>
                                    <br />
                                    <span>
                                       What do you want to accomplish?How will
                                       you know when it isachieved?
                                    </span>
                                 </td>
                                 <td>
                                    <TextArea
                                       value={rowDto?.goal}
                                       name="goal"
                                       rows="4"
                                       onChange={e => {
                                          // setFieldValue('goal', e.target.value);
                                          editData("goal", e.target.value);
                                       }}
                                    ></TextArea>
                                 </td>
                              </tr>
                              <tr>
                                 <td className="table-row-width p-2">
                                    <strong>Reality</strong>
                                    <br />
                                    <span>
                                       What’s happening now in terms of the
                                       goal?How far am I away from the goal?
                                    </span>
                                 </td>
                                 <td>
                                    <TextArea
                                       value={rowDto?.reality}
                                       name="reality"
                                       rows="4"
                                       onChange={e => {
                                          // setFieldValue(
                                          //    'reality',
                                          //    e.target.value
                                          // );
                                          editData("reality", e.target.value);
                                       }}
                                    ></TextArea>
                                 </td>
                              </tr>
                              <tr>
                                 <td className="table-row-width p-2">
                                    <strong>Obstacles</strong>
                                    <br />
                                    <span>
                                       What is standing in the way –Me? Other
                                       people?Lack of skills, knowledge,
                                       expertise? Physical environment?
                                    </span>
                                 </td>
                                 <td>
                                    <TextArea
                                       value={rowDto?.obstacles}
                                       name="obstacles"
                                       rows="4"
                                       onChange={e => {
                                          // setFieldValue(
                                          //    'obstacles',
                                          //    e.target.value
                                          // );
                                          editData("obstacles", e.target.value);
                                       }}
                                    ></TextArea>
                                 </td>
                              </tr>
                              <tr>
                                 <td className="table-row-width p-2">
                                    <strong>Options</strong>
                                    <br />
                                    <span>
                                       What options do I have to resolve the
                                       issues or obstacles?", field: "options
                                    </span>
                                 </td>
                                 <td>
                                    <TextArea
                                       value={rowDto?.options}
                                       name="options"
                                       rows="4"
                                       onChange={e => {
                                          // setFieldValue(
                                          //    'options',
                                          //    e.target.value
                                          // );
                                          editData("options", e.target.value);
                                       }}
                                    ></TextArea>
                                 </td>
                              </tr>
                              <tr>
                                 <td className="table-row-width p-2">
                                    <strong>Way Forward/Will</strong>
                                    <br />
                                    <span>Which option will I commit to?</span>
                                 </td>
                                 <td>
                                    <TextArea
                                       value={rowDto?.wayForward}
                                       name="wayForward"
                                       rows="4"
                                       onChange={e => {
                                          // setFieldValue(
                                          //    'wayForward',
                                          //    e.target.value
                                          // );
                                          editData("wayForward", e.target.value);
                                       }}
                                    ></TextArea>
                                 </td>
                              </tr>
                           </Table>
                        </div>
                        <div id="pdf-section" className="growModel mx-5 d-none">
                           <GrowModelPdf singleData={rowDto} />
                        </div>
                     </div>
                  </CardBody>
               </Card>
            </>
         )}
      </Formik>
   );
};

export default GrowModel;
