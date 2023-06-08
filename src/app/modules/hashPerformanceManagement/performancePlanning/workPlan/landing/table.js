import React, { useState } from 'react';
import {
   Card,
   CardBody,
   CardHeader,
   CardHeaderToolbar,
   Input,
   ModalProgressBar,
} from './../../../../../../_metronic/_partials/controls';
import { Field, Form, Formik } from 'formik';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import NewSelect from '../../../../_helper/_select';
import { _todayDate } from '../../../../_helper/_todayDate';
import { quaterDDL } from '../../../hashPerformanceCommon';
import { addWorkPlan, commonYearDDL, workPlan_landing_api } from '../../helper';
import { WorkPlanTable } from './WorkPlanTable';
import './workplantable.css';
import IClose from '../../../../_helper/_helperIcons/_close';
import InputField from '../../../../_helper/_inputField';
import IEdit from '../../../../_helper/_helperIcons/_edit';
import image from './assets/workplanImage.jpg';
import ImageViewer from './staticImageViewerModal';

const html2pdf = require('html2pdf.js');
const initData = {
   activityName: '',
   frequencyDDL: {
      label: 'Daily',
      value: 1,
   },
   priorityDDL: {
      label: 'Do First (1)',
      value: 1,
      name: 'Do First',
   },
   quarterDDLgroup: {
      label: 'Q1',
      value: 1,
   },
   yearDDLgroup: {
      label: '2021-2022',
      value: 12,
   },
};

const validationSchema = Yup.object().shape({
   quarterDDLgroup: Yup.object()
      .shape({
         label: Yup.string().required('Quarter is required'),
         value: Yup.string().required('Quarter is required'),
      })
      .typeError('Quarter is required'),
   yearDDLgroup: Yup.object()
      .shape({
         label: Yup.string().required('Priority is required'),
         value: Yup.string().required('Priority is required'),
      })
      .typeError('Year is required'),
});

export default function WorkPlanLanding() {
   const {
      employeeId,
      userName,
      userId,
      designationId,
      defaultBusinessUnit,
   } = useSelector(state => state.authData.profileData);
   const [, setLoading] = useState(false);
   const [, setDisabled] = useState(false);
   const [planList, setPlanList] = useState();
   const [commonDDL, setCommonDDL] = useState([]);
   const [isShowRowItemModal, setIsShowRowItemModal] = useState(false);
   const [showRemoveRowIcon, setShowRemoveRowIcon] = useState(true);
   const [showCheckButton, setShowCheckButton] = useState(false);

   useEffect(() => {
      workPlan_landing_api(employeeId, 12, 1, setPlanList, setLoading);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [employeeId]);

   useEffect(() => {
      commonYearDDL(setLoading, setCommonDDL);
   }, []);

   const removeActivityFromPlanList = index => {
      let updatedPlanList = planList?.row?.filter((item, i) => index !== i);
      setPlanList({
         workPlanHeaderId: planList?.workPlanHeaderId,
         row: updatedPlanList,
      });
   };

   const addHandler = values => {
      if (planList?.row) {
         const modifiedRowDto = [...planList?.row];
         modifiedRowDto.push({
            rowId: 0,
            workPlanHeaderId:
               planList?.workPlanHeaderId > 0 ? planList?.workPlanHeaderId : 0,
            activity: values?.activityName,
            frequencyId: values?.frequencyDDL?.value,
            frequency: values?.frequencyDDL?.label,
            priorityId: values?.priorityDDL?.value,
            priority: values?.priorityDDL?.name,
            comments: values?.comments,
            isActive: true,
            actionDate: _todayDate(),
            actionBy: userId,
            isDisabled: true,
         });
         setPlanList({
            workPlanHeaderId: planList?.workPlanHeaderId,
            row: modifiedRowDto,
         });
      } else {
         const modifiedRowDto = [];
         modifiedRowDto.push({
            rowId: 0,
            workPlanHeaderId:
               planList?.workPlanHeaderId > 0 ? planList?.workPlanHeaderId : 0,
            activity: values?.activityName,
            frequencyId: Number(values?.frequencyDDL?.value),
            frequency: values?.frequencyDDL?.label,
            priorityId: Number(values?.priorityDDL?.value),
            priority: values?.priorityDDL?.name,
            comments: values?.comments,
            isActive: true,
            actionDate: _todayDate(),
            actionBy: userId,
            isDisabled: true,
         });
         setPlanList({
            workPlanHeaderId: planList?.workPlanHeaderId,
            row: modifiedRowDto,
         });
      }
   };

   const saveHandler = (values, cb, confirm) => {
      if (confirm) {
         const rowList = planList?.row?.map(data => {
            return {
               rowId: data?.rowId,
               workPlanHeaderId: data?.workPlanHeaderId || 0,
               activity: data?.activity,
               frequencyId: data?.frequencyId,
               frequency: data?.frequency,
               priorityId: data?.priorityId,
               priority: data?.priority,
               comments: data?.comments,
               isActive: true,
               actionDate: _todayDate(),
               actionBy: userId,
            };
         });
         const payload = {
            sl: 0,
            workPlanHeaderId:
               planList?.workPlanHeaderId > 0 ? planList?.workPlanHeaderId : 0,
            employeeId: Number(employeeId),
            employeeName: userName,
            designationId: Number(designationId),
            businessUnitId: Number(defaultBusinessUnit),
            workplaceGroupId: 0,
            yearId: Number(values?.yearDDLgroup?.value),
            year: values?.yearDDLgroup?.label,
            quarterId: Number(values?.quarterDDLgroup?.value),
            quarter: values?.quarterDDLgroup?.label,
            isActive: true,
            actionDate: _todayDate(),
            actionBy: userId,
            row: rowList,
            isConfirm: true,
         };
         addWorkPlan(
            payload,
            () => {
               workPlan_landing_api(
                  employeeId,
                  payload?.yearId,
                  payload?.quarterId,
                  setPlanList,
                  setLoading
               );
            },
            setDisabled
         );
      } else {
         const rowList = planList?.row?.map(data => {
            return {
               rowId: data?.rowId,
               workPlanHeaderId: data?.workPlanHeaderId || 0,
               activity: data?.activity,
               frequencyId: data?.frequencyId,
               frequency: data?.frequency,
               priorityId: data?.priorityId,
               priority: data?.priority,
               comments: data?.comments,
               isActive: true,
               actionDate: _todayDate(),
               actionBy: userId,
            };
         });
         const payload = {
            sl: 0,
            workPlanHeaderId:
               planList?.workPlanHeaderId > 0 ? planList?.workPlanHeaderId : 0,
            employeeId: Number(employeeId),
            employeeName: userName,
            designationId: Number(designationId),
            businessUnitId: Number(defaultBusinessUnit),
            workplaceGroupId: 0,
            yearId: Number(values?.yearDDLgroup?.value),
            year: values?.yearDDLgroup?.label,
            quarterId: Number(values?.quarterDDLgroup?.value),
            quarter: values?.quarterDDLgroup?.label,
            isActive: true,
            actionDate: _todayDate(),
            actionBy: userId,
            row: rowList,
         };
         addWorkPlan(
            payload,
            () => {
               workPlan_landing_api(
                  employeeId,
                  payload?.yearId,
                  payload?.quarterId,
                  setPlanList,
                  setLoading
               );
            },
            setDisabled
         );
      }
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

   return (
      <Formik
         enableReinitialize={true}
         initialValues={initData}
         validationSchema={validationSchema}
         onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
               resetForm(initData);
               setPlanList([]);
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
               <Form >
                  <Card>
                     {true && <ModalProgressBar />}
                     <CardHeader title="Work Plan">
                        <CardHeaderToolbar>
                           <button
                              type="button"
                              style={{
                                 cursor: 'pointer',
                              }}
                              className={`btn btn-primary mr-2`}
                              disabled={false}
                              onClick={() => {
                                 setIsShowRowItemModal(true);
                              }}
                           >
                              <i
                                 className="mr-1 fa fa-info"
                                 aria-hidden="true"
                              ></i>
                              Help
                           </button>

                           <button
                              type="button"
                              style={{
                                 cursor:
                                    planList?.row?.length < 1
                                       ? 'no-drop'
                                       : 'pointer',
                              }}
                              className={`btn btn-primary mr-2`}
                              disabled={
                                 planList?.row?.length > 0 ? false : true
                              }
                              onClick={() => {
                                 pdfExport('Work plan');
                              }}
                           >
                              <i
                                 className="mr-1 fa fa-download"
                                 aria-hidden="true"
                              ></i>
                              Download PDF
                           </button>
                           <button
                              type="submit"
                              style={{
                                 cursor:
                                    planList?.row?.length < 1
                                       ? 'no-drop'
                                       : 'pointer',
                              }}
                              disabled={
                                 (planList?.row?.length > 0 ? false : true) ||
                                 planList?.isConfirm
                              }
                              className="btn btn-primary mr-2"
                           >
                              Save
                           </button>
                        </CardHeaderToolbar>
                     </CardHeader>
                     <CardBody>
                        <div className="row">
                           <div className="col-lg-4 mt-2">
                              <div>
                                 <strong>Name</strong>: <span>{userName}</span>
                              </div>
                              <div>
                                 <strong>Enroll</strong>:{' '}
                                 <span>{employeeId}</span>
                              </div>
                           </div>
                           <div className="col-lg-4">
                              <div>
                                 <strong>Designation</strong>:{' '}
                                 <span>{planList?.designation || ''}</span>
                              </div>
                              <div>
                                 <strong>Location</strong>:{' '}
                                 <span>{planList?.workplaceGroup || ''}</span>
                              </div>
                           </div>
                        </div>
                        <hr />
                        <div className="form-group row mb-4 global-form">
                           <div className="col-sm-5 col-lg-3">
                              <NewSelect
                                 name="yearDDLgroup"
                                 options={commonDDL}
                                 value={values?.yearDDLgroup}
                                 label="Year"
                                 onChange={valueOption => {
                                    setFieldValue('yearDDLgroup', valueOption);
                                    setFieldValue('quarterDDLgroup', '');
                                    setPlanList([]);
                                 }}
                                 errors={errors}
                                 touched={touched}
                                 placeholder="Year"
                                 isSearchable={true}
                                 isDisabled={false}
                              />
                           </div>
                           <div className="col-sm-5 col-lg-3">
                              <NewSelect
                                 name="quarterDDLgroup"
                                 options={quaterDDL}
                                 value={values?.quarterDDLgroup}
                                 label="Quarter"
                                 onChange={valueOption => {
                                    if (valueOption) {
                                       setFieldValue(
                                          'quarterDDLgroup',
                                          valueOption
                                       );
                                       workPlan_landing_api(
                                          employeeId,
                                          values?.yearDDLgroup?.value,
                                          valueOption?.value,
                                          setPlanList,
                                          setLoading
                                       );
                                    } else {
                                       setPlanList([]);
                                       setFieldValue('quarterDDLgroup', '');
                                    }
                                 }}
                                 errors={errors}
                                 touched={touched}
                                 placeholder="Quarter"
                                 isSearchable={true}
                                 isDisabled={false}
                              />
                           </div>
                           <div className="col-sm-5 col-lg-3"></div>
                           <div className="col-sm-5 col-lg-3 d-flex justify-content-end align-items-center">
                              <button
                                 type="button"
                                 style={{
                                    cursor:
                                       planList?.row?.length < 1
                                          ? 'no-drop'
                                          : 'pointer',
                                 }}
                                 className={`btn btn-primary mr-2`}
                                 disabled={
                                    (planList?.row?.length > 0
                                       ? false
                                       : true) || planList?.isConfirm
                                 }
                                 onClick={() => {
                                    saveHandler(
                                       values,
                                       () => {
                                          resetForm(initData);
                                          setPlanList([]);
                                       },
                                       true
                                    );
                                 }}
                              >
                                 Confirm
                              </button>
                           </div>
                        </div>
                        <hr />
                        <div className="form-group row global-form">
                           <div className="col-sm-5 col-lg-2">
                              <Field
                                 value={values?.activityName}
                                 name="activityName"
                                 component={Input}
                                 placeholder="Activity Name"
                                 label="Activity Name"
                              />
                           </div>
                           <div className="col-sm-5 col-lg-2">
                              <NewSelect
                                 name="frequencyDDL"
                                 options={[
                                    { value: 1, label: 'Daily' },
                                    { value: 2, label: 'Weekly' },
                                    { value: 3, label: 'Monthly' },
                                    { value: 4, label: 'Quarterly' },
                                    { value: 5, label: 'Yearly' },
                                 ]}
                                 value={values?.frequencyDDL}
                                 label="Frequency"
                                 onChange={valueOption => {
                                    setFieldValue('frequencyDDL', valueOption);
                                 }}
                                 errors={errors}
                                 touched={touched}
                                 placeholder="Frequency"
                                 isSearchable={true}
                                 isDisabled={false}
                              />
                           </div>
                           <div className="col-sm-5 col-lg-2">
                              <NewSelect
                                 name="priorityDDL"
                                 options={[
                                    {
                                       value: 1,
                                       label: 'Do First (1)',
                                       name: 'Do First',
                                    },
                                    {
                                       value: 2,
                                       label: 'Schedule (2)',
                                       name: 'Schedule',
                                    },
                                    {
                                       value: 3,
                                       label: 'Delegate (3)',
                                       name: 'Delegate',
                                    },
                                    {
                                       value: 4,
                                       label: "Don't Do (4)",
                                       name: "Don't Do",
                                    },
                                 ]}
                                 value={values?.priorityDDL}
                                 label="Priority"
                                 onChange={valueOption => {
                                    setFieldValue('priorityDDL', valueOption);
                                 }}
                                 errors={errors}
                                 touched={touched}
                                 placeholder="Priority"
                                 isSearchable={true}
                                 isDisabled={false}
                              />
                           </div>
                           <div className="col-sm-5 col-lg-2">
                              <InputField
                                 value={values?.comments}
                                 label="Comments"
                                 placeholder="Comments"
                                 type="string"
                                 name="comments"
                                 onChange={e => {
                                    setFieldValue('comments', e.target.value);
                                 }}
                              />
                           </div>
                           <div className="col-lg-2 d-flex align-items-end">
                              <button
                                 type="button"
                                 className="btn btn-primary"
                                 disabled={
                                    !values?.activityName ||
                                       !values?.frequencyDDL?.label ||
                                       !values?.priorityDDL?.label ||
                                       !values?.quarterDDLgroup?.label ||
                                       !values?.yearDDLgroup?.label ||
                                       planList?.isConfirm
                                       ? true
                                       : false
                                 }
                                 onClick={() => {
                                    if (
                                       planList?.row?.find(
                                          item =>
                                             item.activity ===
                                             values.activityName
                                       )
                                    ) {
                                       return toast.error(
                                          'Activity Name Already Exists'
                                       );
                                    } else {
                                       addHandler(values);
                                    }
                                 }}
                              >
                                 Add
                              </button>
                           </div>
                        </div>

                        <div className="row">
                           <div className="col-lg-12">
                              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                                 <thead>
                                    <tr>
                                       <th style={{ width: '30px' }}>No</th>
                                       <th>Activity</th>
                                       <th style={{ width: '100px' }}>
                                          Frequency
                                       </th>
                                       <th style={{ width: '130px' }}>
                                          Priority
                                       </th>
                                       <th>Comments</th>
                                       {!planList?.isConfirm && (
                                          <th style={{ width: '100px' }}>
                                             Action
                                          </th>
                                       )}
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {planList?.row?.map((item, index) => (
                                       <tr key={index}>
                                          <td>{index + 1}</td>
                                          <td>
                                             <InputField
                                                value={item?.activity}
                                                type="string"
                                                name="activity"
                                                disabled={item.isDisabled}
                                                onChange={e => {
                                                   let data = [...planList.row];
                                                   data[index].activity =
                                                      e.target.value;
                                                   setPlanList({
                                                      ...planList,
                                                      row: data,
                                                   });
                                                }}
                                             />
                                          </td>
                                          <td style={{ minWidth: '150px' }}>
                                             <NewSelect
                                                isDisabled={item.isDisabled}
                                                name="frequencyDDL"
                                                options={[
                                                   { value: 1, label: 'Daily' },
                                                   {
                                                      value: 2,
                                                      label: 'Weekly',
                                                   },
                                                   {
                                                      value: 3,
                                                      label: 'Monthly',
                                                   },
                                                   {
                                                      value: 4,
                                                      label: 'Quarterly',
                                                   },
                                                   {
                                                      value: 5,
                                                      label: 'Yearly',
                                                   },
                                                ]}
                                                value={{
                                                   value: item?.frequencyId,
                                                   label: item?.frequency,
                                                }}
                                                onChange={valueOption => {
                                                   let data = planList?.row?.map(
                                                      (itm, idx) => {
                                                         if (idx === index) {
                                                            itm.frequencyId =
                                                               valueOption?.value;
                                                            itm.frequency =
                                                               valueOption?.label;
                                                         }
                                                         return itm;
                                                      }
                                                   );
                                                   setPlanList({
                                                      ...planList,
                                                      row: data,
                                                   });
                                                }}
                                             />
                                          </td>
                                          <td style={{ minWidth: '150px' }}>
                                             <NewSelect
                                                isDisabled={item.isDisabled}
                                                name="priorityDDL"
                                                options={[
                                                   {
                                                      value: 1,
                                                      label: 'Do First (1)',
                                                      name: 'Do First',
                                                   },
                                                   {
                                                      value: 2,
                                                      label: 'Schedule (2)',
                                                      name: 'Schedule',
                                                   },
                                                   {
                                                      value: 3,
                                                      label: 'Delegate (3)',
                                                      name: 'Delegate',
                                                   },
                                                   {
                                                      value: 4,
                                                      label: "Don't Do (4)",
                                                      name: "Don't Do",
                                                   },
                                                ]}
                                                value={{
                                                   value: item?.priorityId,
                                                   label: item?.priority,
                                                }}
                                                onChange={valueOption => {
                                                   let data = planList?.row?.map(
                                                      (itm, idx) => {
                                                         if (idx === index) {
                                                            itm.priorityId =
                                                               valueOption?.value;
                                                            itm.priority =
                                                               valueOption?.label;
                                                         }
                                                         return itm;
                                                      }
                                                   );
                                                   setPlanList({
                                                      ...planList,
                                                      row: data,
                                                   });
                                                }}
                                             />
                                          </td>
                                          <td>
                                             <InputField
                                                value={item?.comments}
                                                type="string"
                                                name="comments"
                                                disabled={item.isDisabled}
                                                onChange={e => {
                                                   let data = [...planList.row];
                                                   data[index].comments =
                                                      e.target.value;

                                                   setPlanList({
                                                      ...planList,
                                                      row: data,
                                                   });
                                                   console.log(
                                                      'PlanList',
                                                      planList
                                                   );
                                                }}
                                             />
                                          </td>
                                          {!planList?.isConfirm && (
                                             <td
                                                style={{
                                                   height: '35px',
                                                   justifyContent:
                                                      'space-around',
                                                   display: 'flex',
                                                   alignItems: 'center',
                                                }}
                                                className="text-center "
                                             >
                                                {!showCheckButton ? (
                                                   <span
                                                      className="check-icon"
                                                      onClick={() => {
                                                         let updatedList = planList?.row?.map(
                                                            (itm, idx) => {
                                                               if (
                                                                  idx === index
                                                               ) {
                                                                  return {
                                                                     ...itm,
                                                                     isDisabled: false,
                                                                  };
                                                               } else {
                                                                  return itm;
                                                               }
                                                            }
                                                         );
                                                         setPlanList({
                                                            ...planList,
                                                            row: updatedList,
                                                         });

                                                         setShowRemoveRowIcon(
                                                            false
                                                         );
                                                         setShowCheckButton(
                                                            true
                                                         );
                                                      }}
                                                   >
                                                      <IEdit />
                                                   </span>
                                                ) : null}
                                                {showCheckButton ? (
                                                   <span
                                                      className="check-icon pointer"
                                                      onClick={() => {
                                                         let updatedList = planList?.row?.map(
                                                            (itm, idx) => {
                                                               if (
                                                                  idx === index
                                                               ) {
                                                                  return {
                                                                     ...itm,
                                                                     isDisabled: true,
                                                                  };
                                                               } else {
                                                                  return itm;
                                                               }
                                                            }
                                                         );
                                                         setPlanList({
                                                            ...planList,
                                                            row: updatedList,
                                                         });
                                                         setShowRemoveRowIcon(
                                                            true
                                                         );
                                                         setShowCheckButton(
                                                            false
                                                         );
                                                      }}
                                                   >
                                                      <i
                                                         class="fa fa-check-square"
                                                         aria-hidden="true"
                                                      ></i>
                                                   </span>
                                                ) : null}

                                                {showRemoveRowIcon ? (
                                                   <span
                                                      className="close-icon"
                                                      onClick={() => {
                                                         removeActivityFromPlanList(
                                                            index
                                                         );
                                                      }}
                                                   >
                                                      <IClose />
                                                   </span>
                                                ) : null}
                                             </td>
                                          )}
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                        <div
                           id="pdf-section"
                           className="workplan-pdf-export d-none"
                        >
                           <WorkPlanTable
                              planList={planList}
                              planListRow={planList?.row}
                              userName={userName}
                              employeeId={employeeId}
                           />
                        </div>
                        <ImageViewer
                           show={isShowRowItemModal}
                           onHide={() => setIsShowRowItemModal(false)}
                           title="Work Plan"
                           modelSize="md"
                           image={image}
                        >

                        </ImageViewer>
                     </CardBody>
                  </Card>
               </Form>
            </>
         )}
      </Formik>
   );
}
