import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import InputField from '../../../_helper/_inputField';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';

export default function HrPlanCreateEditModal({ rowDetailsData, valueData, getRowDto, setShow }) {
   const { selectedBusinessUnit, profileData } = useSelector(state => {
      return state?.authData;
   }, shallowEqual);

   const [
      singleData,
      getBySingleData,
      singleDataLoding,
      setSingleData,
   ] = useAxiosGet();
   const [, saveData] = useAxiosPost();
   const [numPlanQty, setNumPlanQty] = useState('');
   const [numBudgetRate, setBudgetRate] = useState('');

   // console.log('rowDetailsData', rowDetailsData)
   // console.log('valueData', valueData)

   useEffect(() => {
      getBySingleData(
         `/fino/BudgetFinancial/GetAllHrPlan?partName=PlanVsBudgetGetById&businessUnitId=${selectedBusinessUnit?.value}&departmentId=${valueData?.department?.value}&designationId=${rowDetailsData?.intDesignationId}&yearId=${valueData?.year?.value}&autoId=${rowDetailsData?.intHeaderId}`
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedBusinessUnit, rowDetailsData]);

   const saveHandler = () => {
      const rowList = singleData?.map(item => ({
         intRowId: item?.intRowId,
         intHeaderId: item?.intHeaderId,
         intDesignationId: rowDetailsData?.intDesignationId,
         intMonthId: item?.monthId,
         strMonthName: item?.monthName,
         numPlanQty: +item?.numPlanQty || 0,
         numBudgetRate: +item?.numBudgetRate || 0,
         numTotalBudget: item?.numTotalBudget,
         intCreatedBy: profileData?.userId,
      }));  

      const payload = {
         intHeaderId: rowDetailsData?.intHeaderId,
         intBusinessUnitId: selectedBusinessUnit?.value,
         intDepartmentId: valueData?.department?.value,
         intYear: valueData?.year?.value,
         intCreatedBy: profileData?.userId,
         hrplanRow: rowList,
      };

       saveData('/fino/BudgetFinancial/HrPlanSave', payload, ()=>{
         getRowDto(
            `/fino/BudgetFinancial/GetAllHrPlan?partName=PlanVsBudgetLanding&businessUnitId=${selectedBusinessUnit?.value}&departmentId=${valueData?.department?.value}&designationId=0&yearId=${valueData?.year?.value}&autoId=0`
         );
         setShow(false)
       }, true);
      console.log("payload", payload)
   };

   const rowDtoHandler = (sl, name, value) => {
      let data = [...singleData];
      let _sl = data[sl];
      _sl[name] = +value;
      const totalBudget = _sl.numPlanQty * _sl.numBudgetRate;
      _sl.numTotalBudget = totalBudget || 0;
      setSingleData(data);
   };
   
   const totalPlanQuantity = singleData?.reduce((acc, curr) => acc + curr.numPlanQty, 0);
   const totalBugetAmount = singleData?.reduce((acc, curr) => acc + curr.numTotalBudget, 0);


   return (
      <>
         <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={saveHandler}>
               Save
            </button>
         </div>
         <div className="row">
            <span className="pl-4">Year : </span>
            <span className="pl-3 bold">{valueData?.year?.label || ''}</span>
            <span className="pl-4">Department : </span>
            <span className="pl-3 bold">
               {valueData?.department?.label || ''}
            </span>
            <span className="pl-4">Designation : </span>
            <span className="pl-3 bold">{rowDetailsData?.strDesignation}</span>
         </div>
         <div className="row">
            <div className="col-lg-12">
               <table className="table table-striped table-bordered  global-table">
                  <thead>
                     <tr>
                        <th>Month</th>
                        <th>Plan Qty</th>
                        <th>Budget Rate</th>
                        <th>Total Budget</th>
                     </tr>
                  </thead>
                  <tbody>
                     {singleData?.map((item, i) => (
                        <tr>
                           <td>{item?.monthName}</td>
                           <td style={{ minWidth: '70px' }}>
                              <InputField
                              name="numPlanQty"
                                 value={
                                    singleData[i]?.numPlanQty
                                       ? singleData[i]?.numPlanQty
                                       : numPlanQty
                                 }
                                 type="number"
                                 onChange={e => {
                                    if(+e.target.value < 0) {
                                       setNumPlanQty('')
                                    }else{
                                       rowDtoHandler(
                                          i,
                                          'numPlanQty',
                                          e.target.value
                                       );
                                    }
                                 }}
                              />
                           </td>
                           <td style={{ minWidth: '70px' }}>
                              <InputField
                              name="numBudgetRate"
                                 value={
                                    singleData[i]?.numBudgetRate
                                       ? singleData[i]?.numBudgetRate
                                       : numBudgetRate
                                 }
                                 type="number"
                                 onChange={e => {
                                   if(+e.target.value < 0) {
                                       setBudgetRate('')
                                    }else{
                                       rowDtoHandler(
                                          i,
                                          'numBudgetRate',
                                          e.target.value
                                       );
                                    }
                                 }}
                              />
                           </td>
                           <td>{item?.numTotalBudget || ''}</td>
                        </tr>
                     ))}
                     <tr>
                        <td className='text-bold'>Grand Total</td>
                        <td className='text-bold'>{totalPlanQuantity}</td>
                        <td></td>
                        <td className='text-bold'>{totalBugetAmount}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </>
   );
}
