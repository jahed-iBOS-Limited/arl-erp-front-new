import { Formik } from 'formik';
import React, { useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './styles.css';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IClose from '../../../_helper/_helperIcons/_close';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { _todayDate } from '../../../_helper/_todayDate';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { quaterDDL } from '../../hashPerformanceCommon';
import InputField from '../../../_helper/_inputField';
import {
   Card,
   CardBody,
   CardHeader,
   CardHeaderToolbar,
   ModalProgressBar,
} from '../../../../../_metronic/_partials/controls';
import ActionPlanPdfFile from './ActionPlanPdfFile';
const initData = {
   activity: '',
   stardDate: '',
   endDate: '',
   year: '',
   quater: ''
};

export default function ActionPlan() {
   const profileData = useSelector(state => {
      return state.authData.profileData;
   }, shallowEqual);
   const selectedBusinessUnit = useSelector(state => {
      return state.authData.selectedBusinessUnit.value;
   }, shallowEqual);
   const {
      accountId,
      userId,
      employeeId,
      employeeFullName,
      designationId,
      userName,
   } = profileData;
   const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
   const [yearData, getYearData] = useAxiosGet();
   const [
      typeReferenceDDL,
      getTypeReferenceDDL,
      ,
      setTypeReferenceDDL,
   ] = useAxiosGet();
   const [, saveData] = useAxiosPost();
   const closeHandler = index => {
      let updatedData = rowData?.row?.filter((item, i) => index !== i);
      setRowData({
         ...rowData,
         row: updatedData,
      });
   };

   const getReferenceTypeByActionType = (id, year, quater) => {
      if (id) {
         if (id === 1) {
            getTypeReferenceDDL(
               `/pms/CommonDDL/ObjectiveDDL?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit}&StrategicParticularsTypeId=1&emp_dept_sbu_Type=1&yearId=${year}`
            );
         } else if (id === 2) {
            getTypeReferenceDDL(
               `/pms/KPI/GetKPIMasterDataDDL?accountId=${accountId}&bscId=2`
            );
         } else if (id === 3) {
            setTypeReferenceDDL([
               { label: 'Customer Centric', value: 1 },
               { label: 'Innovation', value: 2 },
               { label: 'Ownership', value: 3 },
               { label: 'Positivity', value: 4 },
               { label: 'Service Orientation', value: 5 },
            ]);
         } else if (id === 4) {
            getTypeReferenceDDL(
               `/pms/PerformanceMgmt/GetEisenHowerActionPlanDDL?EmployeeId=${employeeId}&YearId=${year}&QuarterId=${quater}`
            );
         } else {
            setTypeReferenceDDL([]);
         }
      } else {
         setTypeReferenceDDL([]);
      }
   };
   const saveHandler = values => {

      if (!rowData?.row?.length)
         return toast.warn('Please add at least one Data');

      const rowList = rowData?.row?.map(data => {
         return {
            rowId: data?.rowId || 0,
            actionPlanHeaderId: data?.actionPlanHeaderId || 0,
            activity: data?.activity,
            stardDate: data?.stardDate,
            endDate: data?.endDate,
            isActive: true,
            actionDate: _dateFormatter(new Date()),
            actionBy: userId,
         };
      });

      const payload = {
         actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
         employeeId: employeeId,
         employeeName: employeeFullName,
         designationId: designationId,
         businessUnitId: selectedBusinessUnit,
         workplaceGroupId: rowData?.workplaceGroupId || 0,
         typeId: values?.actionPlanType?.value || 0,
         type: values?.actionPlanType?.label || '',
         typeReferenceId:
            rowData?.typeReferenceId || values?.typeReference?.value,
         typeReference: rowData?.typeReference || values?.typeReference?.label,
         yearId: values?.year?.value,
         year: values?.year?.label,
         quarterId: values?.quater?.value,
         quarter: values?.quater?.label || '',
         isActive: true,
         actionDate: _todayDate(),
         actionBy: userId,
         typeGroup: 'WorkPlan',
         currentResult: +values?.currentResult || rowData?.currentResult,
         desiredResult: +values?.desiredResult || rowData?.desiredResult,
         row: rowList,
      };
      saveData(
         `/pms/PerformanceMgmt/PMSActionPlanCreateAndEdit`,
         payload,
         null,
         true
      );
   };

   const addHandler = values => {
      if (values?.activity && values?.stardDate && values?.endDate) {
         if (rowData?.row?.find(item => item?.activity === values?.activity)) {
            toast.error('Activity already exist');
            return;
         } else {
            if (rowData.row) {
               const modifiedData = [...rowData?.row];
               modifiedData.push({
                  rowId: 0,
                  actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
                  activity: values?.activity,
                  stardDate: values?.stardDate,
                  endDate: values?.endDate,
                  isActive: true,
                  actionDate: _dateFormatter(new Date()),
                  actionBy: userId,
               });
               setRowData({
                  actionPlanHeaderId: rowData?.actionPlanHeaderId,
                  employeeName: rowData?.employeeName || '',
                  employeeId: rowData?.employeeId || '',
                  designation: rowData?.designation || '',
                  workplaceGroup: rowData?.workplaceGroup || '',
                  row: modifiedData,
               });
            } else {
               const modifiedData = [];
               modifiedData.push({
                  rowId: 0,
                  actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
                  activity: values?.activity,
                  stardDate: values?.stardDate,
                  endDate: values?.endDate,
                  isActive: true,
                  actionDate: _dateFormatter(new Date()),
                  actionBy: userId,
               });
               setRowData({
                  actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
                  employeeName: rowData?.employeeName || '',
                  employeeId: rowData?.employeeId || '',
                  designation: rowData?.designation || '',
                  workplaceGroup: rowData?.workplaceGroup || '',
                  row: modifiedData,
               });
            }
         }
      } else {
         toast.error('Please fill all the fields');
         return;
      }
   };

   const getApiData = (empId, yearId, quaterId, setFieldValue) => {
      getRowData(
         `/pms/PerformanceMgmt/GetActionPlanRowGrid?EmployeeId=${empId}&YearId=${yearId}&QuarterId=${quaterId}&TypeGroup=WorkPlan`,
         data => {
            setFieldValue('actionPlanType', {
               value: data?.typeId,
               label: data?.type,
            });
            setFieldValue('typeReference', {
               value: data?.typeReferenceId,
               label: data?.typeReference,
            });
            setFieldValue('currentResult', data?.currentResult || 0);
            setFieldValue('desiredResult', data?.desiredResult || 0);
         }
      );
   };

   useEffect(() => {
      getYearData(
         `/pms/CommonDDL/YearDDL?AccountId=${accountId}&BusinessUnitId=4`
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [accountId, selectedBusinessUnit]);

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

   const pdfData = { rowData };

   return (
      <>
         <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={() => {

            }}
         >
            {({ values, setFieldValue, errors, touched }) => (
               <>
                  <Card>
                     {true && <ModalProgressBar />}
                     <CardHeader title={'Action Plan'}>
                        <CardHeaderToolbar>
                           <button
                              disabled={!rowData?.row?.length}
                              id="actionplan-pdf"
                              onClick={e => pdfExport('Action plan')}
                              className="btn btn-primary ml-2"
                              type="button"
                           >
                              <i
                                 className="mr-1 fa fa-download pointer"
                                 aria-hidden="true"
                              ></i>
                              Export PDF
                           </button>

                           <button
                              disabled={
                                 !values?.year ||
                                 !values?.quater ||
                                 !values.typeReference ||
                                 !values.actionPlanType ||
                                 !rowData?.row?.length
                              }
                              onClick={() => {
                                 saveHandler(values);
                              }}
                              className="btn btn-primary ml-2"
                              type="button"
                           >
                              Save
                           </button>
                        </CardHeaderToolbar>
                     </CardHeader>
                     <CardBody>
                        {lodar && <Loading />}
                        <div className="row">
                           <div className="col-lg-4 mt-2">
                              <div>
                                 <strong>Name</strong>:{' '}
                                 <span>{userName}</span>
                              </div>
                              <div>
                                 <strong>Enroll</strong>:{' '}
                                 <span>{employeeId}</span>
                              </div>
                           </div>
                           <div className="col-lg-4">
                              <div>
                                 <strong>Designation</strong>:{' '}
                                 <span>{rowData?.designation || ''}</span>
                              </div>
                              <div>
                                 <strong>Location</strong>:{' '}
                                 <span>{rowData?.workplaceGroup || ''}</span>
                              </div>
                           </div>
                        </div>
                        <hr />
                        <div className="form-group  global-form">
                           <div className="row">
                              <div className="col-lg-2">
                                 <NewSelect
                                    name="year"
                                    options={yearData}
                                    value={values?.year}
                                    label="Year"
                                    onChange={valueOption => {
                                       if (valueOption) {
                                          setFieldValue('year', valueOption);
                                          setFieldValue('quater', '');
                                          setRowData({});
                                       } else {
                                          setFieldValue('year', '');
                                          setFieldValue('quater', '');
                                          setFieldValue('typeReference', '');
                                          setFieldValue('actionPlanType', '');
                                          setFieldValue('currentResult', '');
                                          setFieldValue('desiredResult', '');
                                          setRowData({});
                                       }
                                    }}
                                    placeholder="Year"
                                    errors={errors}
                                 />
                              </div>
                              <div className="col-lg-2">
                                 <NewSelect
                                    name="Quater"
                                    options={quaterDDL}
                                    value={values?.quater}
                                    label="Quater"
                                    onChange={valueOption => {
                                       if (valueOption) {
                                          getApiData(
                                             employeeId,
                                             values?.year?.value,
                                             valueOption?.value,
                                             setFieldValue
                                          );
                                          setFieldValue('quater', valueOption);
                                       } else {
                                          setFieldValue('quater', '');
                                          setFieldValue('actionPlanType', '');
                                          setFieldValue('typeReference', '');
                                          setFieldValue('currentResult', '');
                                          setFieldValue('desiredResult', '');
                                          setRowData({});
                                       }
                                    }}
                                    placeholder="Quater"
                                    errors={errors}
                                    isDisabled={!values.year}
                                 />
                              </div>
                              <div className="col-lg-2">
                                 <NewSelect
                                    name="actionPlanType"
                                    options={[
                                       {
                                          label: 'Objective',
                                          value: 1,
                                       },
                                       {
                                          label: 'KPI',
                                          value: 2,
                                       },
                                       {
                                          label: 'Behavioural',
                                          value: 3,
                                       },
                                       {
                                          label: 'Eisenhower Matrix',
                                          value: 4,
                                       },
                                    ]}
                                    value={values?.actionPlanType}
                                    label="Action Plan Type"
                                    onChange={valueOption => {
                                       if (valueOption) {
                                          setFieldValue(
                                             'actionPlanType',
                                             valueOption
                                          );
                                          setFieldValue('typeReference', '');
                                          getReferenceTypeByActionType(
                                             valueOption?.value,
                                             values?.year?.value,
                                             values.quater.value
                                          );
                                       } else {
                                          setFieldValue('actionPlanType', '');
                                          setFieldValue('typeReference', '');
                                       }
                                    }}
                                    placeholder="Action Plan Type"
                                    errors={errors}
                                    isDisabled={
                                       !values?.year ||
                                       !values?.quater ||
                                       rowData?.row
                                    }
                                 />
                              </div>
                              <div className="col-lg-2">
                                 <NewSelect
                                    name="typeReference"
                                    options={typeReferenceDDL}
                                    value={values?.typeReference}
                                    label="Type Reference"
                                    onChange={valueOption => {
                                       setFieldValue(
                                          'typeReference',
                                          valueOption
                                       );
                                    }}
                                    placeholder="Enter Type Reference"
                                    errors={errors}
                                    isDisabled={
                                       !values?.year ||
                                       !values?.quater ||
                                       rowData?.row ||
                                       !values?.actionPlanType
                                    }
                                 />
                              </div>
                              <div className="col-lg-2">
                                 <InputField
                                    value={values?.currentResult}
                                    label="Current Result"
                                    placeholder="Current Result"
                                    type="number"
                                    name="currentResult"
                                    onChange={e => {
                                       setFieldValue(
                                          'currentResult',
                                          e.target.value
                                       );
                                    }}
                                    disabled={!values?.year || !values?.quater}
                                 />
                              </div>
                              <div className="col-lg-2">
                                 <InputField
                                    value={values?.desiredResult}
                                    label="Desired Result"
                                    placeholder="Desired Result"
                                    type="number"
                                    name="desiredResult"
                                    onChange={e => {
                                       setFieldValue(
                                          'desiredResult',
                                          e.target.value
                                       );
                                    }}
                                    disabled={!values?.year || !values?.quater}
                                 />
                              </div>
                           </div>
                        </div>
                        <hr />
                        <div className="form-group  global-form row">
                           <div className="col-lg-3">
                              <InputField
                                 value={values?.activity}
                                 label="Task name"
                                 placeholder="Activity name"
                                 required
                                 type="string"
                                 name="activity"
                                 onChange={e => {
                                    setFieldValue('activity', e.target.value);
                                 }}
                                 disabled={!values?.year || !values?.quater}
                              />
                           </div>
                           <div className="col-lg-3">
                              <InputField
                                 value={values?.stardDate}
                                 label="Start Date"
                                 placeholder="Start Date"
                                 required
                                 type="date"
                                 name="stardDate"
                                 onChange={e => {
                                    setFieldValue('stardDate', e.target.value);
                                 }}
                                 disabled={!values?.year || !values?.quater}
                              />
                           </div>
                           <div className="col-lg-3">
                              <InputField
                                 value={values?.endDate}
                                 label="End Date"
                                 placeholder="End Date"
                                 required
                                 type="date"
                                 name="endDate"
                                 onChange={e => {
                                    setFieldValue('endDate', e.target.value);
                                 }}
                                 disabled={!values?.year || !values?.quater}
                              />
                           </div>
                           <div className="col-lg-3">
                              <button
                                 disabled={
                                    !values?.activity ||
                                    !values?.stardDate ||
                                    !values?.endDate
                                 }
                                 onClick={() => {
                                    addHandler(values);
                                    setFieldValue('activity', '');
                                    setFieldValue('stardDate', '');
                                    setFieldValue('endDate', '');
                                 }}
                                 className="btn btn-primary mt-5"
                                 type="button"
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
                                       <th style={{ width: '30px' }}>SL</th>
                                       <th>
                                          LIST OF TASKS/ACTIVITIES/BEHAVIOR TO
                                          ACHIEVE RESULT
                                       </th>
                                       <th>START DATE</th>
                                       <th>END DATE</th>
                                       <th>ACTION</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {rowData?.row?.map((item, index) => {
                                       return (
                                          <tr key={index}>
                                             <td>{index + 1}</td>
                                             <td>{item.activity}</td>
                                             <td className="text-center">
                                                {_dateFormatter(item.stardDate)}
                                             </td>
                                             <td className="text-center">
                                                {_dateFormatter(item.endDate)}
                                             </td>
                                             <td className="text-center">
                                                <span
                                                   onClick={() => {
                                                      closeHandler(index);
                                                   }}
                                                >
                                                   <IClose />
                                                </span>
                                             </td>
                                          </tr>
                                       );
                                    })}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                        <div
                           id="pdf-section"
                           className="actionplan-pdf-section d-none"
                        >
                           <ActionPlanPdfFile pdfData={pdfData} />
                        </div>
                     </CardBody>
                  </Card>
               </>
            )}
         </Formik>
      </>
   );
}
