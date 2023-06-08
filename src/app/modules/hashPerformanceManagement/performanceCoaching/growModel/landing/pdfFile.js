import { Table } from '@material-ui/core';
import React from 'react';

const GrowModelPdf = pdfData => {

   return (
      <>
         <h4 className="texr-secondary text-center mb-5 mt-5">
            GROW Coaching Model Worksheet
         </h4>
         <div className="row">
            <div className="col-lg-4 ml-3">
               <div>
                  <strong>Name</strong>:{' '}
                  <span>{pdfData?.singleData?.employeeName}</span>
               </div>
               <div>
                  <strong>Enroll</strong>:{' '}
                  <span>{pdfData?.singleData?.employeeId}</span>
               </div>
            </div>
            <div className="col-lg-4">
               <div>
                  <strong>Designation</strong>:{' '}
                  <span>{pdfData?.singleData?.designation || ''}</span>
               </div>
               <div>
                  <strong>Location</strong>:{' '}
                  <span>{pdfData?.singleData?.workplaceGroup || ''}</span>
               </div>
            </div>
            <div className="col-lg-3">
               <div>
                  <strong>Year</strong>:{' '}
                  <span>{pdfData?.singleData?.year || ''}</span>
               </div>
               <div>
                  <strong>Quarter</strong>:{' '}
                  <span>{pdfData?.singleData?.quarter || ''}</span>
               </div>
            </div>
         </div>
         <div className="my-5">
            {/* <div className="text-center">
          <strong>GROW Coaching Model Worksheet</strong>
        </div> */}
            <Table className="global-table">
               <tr>
                  <td className="w-25 p-2">
                     <strong>Goal</strong>
                     <br />
                     <span>
                        What do you want to accomplish?How will you know when it
                        isachieved?
                     </span>
                  </td>
                  <td>
                     <span className="p-2">{pdfData?.singleData?.goal}</span>
                  </td>
               </tr>
               <tr>
                  <td className="p-2">
                     <strong>Reality</strong>
                     <br />
                     <span>
                        What’s happening now in terms of the goal?How far am I
                        away from the goal?
                     </span>
                  </td>
                  <td>
                     <span className="p-2">{pdfData?.singleData?.reality}</span>
                  </td>
               </tr>
               <tr>
                  <td className="p-2">
                     <strong>Obstacles</strong>
                     <br />
                     <span>
                        What is standing in the way –Me? Other people?Lack of
                        skills, knowledge, expertise? Physical environment?
                     </span>
                  </td>
                  <td>
                     <span className="p-2">
                        {pdfData?.singleData?.obstacles}
                     </span>
                  </td>
               </tr>
               <tr>
                  <td className="p-2">
                     <strong>Options</strong>
                     <br />
                     <span>
                        What options do I have to resolve the issues or
                        obstacles?", field: "options
                     </span>
                  </td>
                  <td>
                     <span className="p-2">{pdfData?.singleData?.options}</span>
                  </td>
               </tr>
               <tr>
                  <td className="p-2">
                     <strong>Way Forward/Will</strong>
                     <br />
                     <span>Which option will I commit to?</span>
                  </td>
                  <td>
                     <span className="p-2">
                        {pdfData?.singleData?.wayForward}
                     </span>
                  </td>
               </tr>
            </Table>
         </div>
      </>
   );
};

export default GrowModelPdf;
