import React from 'react';
import { _dateFormatter } from '../../../_helper/_dateFormate';

const GrowModelPdf = ({ pdfData, title }) => {
   const { rowData } = pdfData;
   return (
      <>
         <h4 className="texr-secondary text-center mb-5 mt-5">
            {title || "Action Plan Grow Model"}
         </h4>
         <div className="row">
            <div className="col-lg-4 ml-3">
               <div>
                  <strong>Name</strong>: <span>{rowData?.employeeName}</span>
               </div>
               <div>
                  <strong>Enroll</strong>: <span>{rowData?.employeeId}</span>
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
            <div className="col-lg-3">
               <div>
                  <strong>Year</strong>: <span>{rowData?.year || ''}</span>
               </div>
               <div>
                  <strong>Quarter</strong>:{' '}
                  <span>{rowData?.quarter || ''}</span>
               </div>
            </div>
         </div>
         <table style={{ width: '100%' }}>
            <tr>
               <th colSpan={4} className="text-center">
                  GOAL/OBJECTIVE/KPI/BEHAVIOUR
               </th>
            </tr>
            <tr>
               <td className="text-center" colSpan={4}>
                  {rowData.typeReference}
               </td>
            </tr>
            <tr>
               <th
                  colSpan={2}
                  className="text-center"
                  style={{
                     width: '50%',
                  }}
               >
                  CURRENT RESULT
               </th>
               <th colSpan={2} className="text-center">
                  DESIRED RESULT
               </th>
            </tr>
            <tr>
               <td colSpan={2} className="text-center">
                  {rowData.currentResult}
               </td>
               <td colSpan={2} className="text-center">
                  {rowData.desiredResult}
               </td>
            </tr>

            <tr>
               <th className="text-center">SN</th>
               <th className="text-center">LIST OF TASK</th>
               <th className="text-center">START DATE</th>
               <th className="text-center">END DATE</th>
            </tr>
            {rowData?.row?.map((item, index) => {
               return (
                  <tr key={index}>
                     <td className="text-center">{index + 1}</td>
                     <td>{item.activity}</td>
                     <td className="text-center">
                        {_dateFormatter(item.stardDate)}
                     </td>
                     <td className="text-center">
                        {_dateFormatter(item.endDate)}
                     </td>
                  </tr>
               );
            })}
         </table>

         <div style={{ marginTop: '45px' }}>
            <h6 style={{ textAlign: 'right', marginRight: '25px' }}>
               DATE & SIGN
            </h6>
         </div>
      </>
   );
};

export default GrowModelPdf;
