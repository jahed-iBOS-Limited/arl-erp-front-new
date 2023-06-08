/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import GeneratorRunningHourForm from './From';

const initData = {
   date: _todayDate(),
   shift: '',
   generatorName: '',
   runningLoad: '',
   startTime: '',
   endTime: '',
   totalTime: '',
   numPreviousReading: '',
   numPresentReading: '',
   numGeneration: '',
   strBreakdownType: '',
   numDuration: '',
   strReasonOfStopage: '',
   strStartTime: "",
   strEndTime: "",
};

const validationSchema = Yup.object().shape({
   date: Yup.string().required('Date is required'),
   shift: Yup.object()
      .shape({
         label: Yup.string().required('Shift is required'),
         value: Yup.string().required('Shift is required'),
      })
      .typeError('Shift is required'),
   generatorName: Yup.object()
      .shape({
         label: Yup.string().required('Generator Name is required'),
         value: Yup.string().required('Generator Name is required'),
      })
      .typeError('Shift is required'),
   // runningLoad: Yup.string().required("Running Load is required"),
   startTime: Yup.string().required('Start Time is required'),
   endTime: Yup.string().required('End Time is required'),
});

export default function GeneratorRunningHourCreate() {
   const [isDisabled, setDisabled] = useState(false);
   const [objProps, setObjprops] = useState({});
   const [modifyData, setModifyData] = useState('');
   const [, saveData] = useAxiosPost();
   const params = useParams();
   const location = useLocation();
   const [res, getData, loading, setRes, error] = useAxiosGet();
   const [rowData, setRowData] = useState([]);

   const { profileData } = useSelector(state => {
      return state.authData;
   }, shallowEqual);

   const selectedBusinessUnit = useSelector(state => {
      return state.authData.selectedBusinessUnit;
   }, shallowEqual);



   useEffect(() => {
      setModifyData({
         date: _dateFormatter(location?.state?.dteDate),
         shift: {
            value: location?.state?.strShift,
            label: location?.state?.strShift,
         },
         generatorName: {
            value: location?.state?.strGeneratorName,
            label: location?.state?.strGeneratorName,
         },
         runningLoad: location?.state?.intRunningLoad,
         startTime: location?.state?.tmStartTime,
         endTime: location?.state?.tmEndTime,
         totalTime: location?.state?.tmTotalHour,
         numPreviousReading: location?.state?.numPreviousReading,
         numPresentReading: location?.state?.numPresentReading,
         numGeneration: location?.state?.numGeneration,
         //strRemarks: location?.state?.strRemarks,
      });
   }, [location]);

   const saveHandler = async (values, cb) => {
      saveData(
         `/mes/MSIL/CreateEditElectricalGeneratorRunningHour`,
         {
            sl: 0,
            intGeneratorRunningHourId: +params?.id || 0,
            dteDate: values?.date,
            strShift: values?.shift?.label,
            strGeneratorName: values?.generatorName?.label,
            tmStartTime: params?.id
               ? values?.startTime
               : `${values?.startTime}:00`,
            tmEndTime: params?.id ? values?.endTime : `${values?.endTime}:00`,
            tmTotalHour: values?.totalTime,
            intRunningLoad:
               selectedBusinessUnit?.value === 4 ? 0 : values?.runningLoad,
            intInsertBy: profileData?.userId,
            dteInsertDateTime: _todayDate(),
            intBusinessUnitId: selectedBusinessUnit?.value,
            numGeneration:
               selectedBusinessUnit?.value === 4
                  ? values?.numPresentReading - values?.numPreviousReading
                  : 0,
            numPreviousReading:
               selectedBusinessUnit?.value === 4
                  ? values?.numPreviousReading
                  : 0,
            numPresentReading:
               selectedBusinessUnit?.value === 4
                  ? values?.numPresentReading
                  : 0,
            strRemarks: selectedBusinessUnit?.value === 4 ? '' : '',
            breakDownList: selectedBusinessUnit?.value === 4 ? rowData : [],
         },
         params?.id ? '' : cb,
         true
      );
   };
   const addRowDataData = (values, cb) => {
      let obj = {
         strBreakdownType: values?.strBreakdownType?.label,
         strStartTime: values?.strStartTime,
         strEndTime: values?.strEndTime,
         numDuration: values?.numDuration,
         strReasonOfStopage: values?.strReasonOfStopage || "",
      };
      setRowData([...rowData, obj]);

      cb([...rowData, obj]);
   };

   const removeHandler = (slId, cb) => {
      const data = rowData?.filter((item, index) => index !== slId);
      setRowData([...data]);
      cb([...data]);
   };
   const disableHandler = cond => {
      setDisabled(cond);
   };

   return (
      <IForm
         title={
            params?.id
               ? 'Edit Generator Running Hour Entry Form'
               : 'Generator Running Hour Entry Form'
         }
         getProps={setObjprops}
         isDisabled={isDisabled}
         isHiddenReset={true}
      >
         {isDisabled && <Loading />}
         <GeneratorRunningHourForm
            {...objProps}
            initData={params?.id ? modifyData : {
               ...initData,
               totalTime: selectedBusinessUnit?.value === 4 ? "08:00:00" : '',
            }}
            saveHandler={saveHandler}
            disableHandler={disableHandler}
            validationSchema={validationSchema}
            location={location}
            selectedBusinessUnit={selectedBusinessUnit}
            rowData={rowData}
            setRowData={setRowData}
            addRowDataData={addRowDataData}
            removeHandler={removeHandler}
         />
      </IForm>
   );
}
