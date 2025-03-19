import React from 'react';
import Delegate from './delegate';
import DoFirst from './doFirst';
import DontDo from './dontDo';
import Schedule from './schedule';

const EisenHowerPdfFile = ({ singleData }) => {
   const {
      delegate,
      doFirst,
      schedule,
      dontDo,
      header,
   } = singleData;

   console.log("header", header)
   
   return (
      <>
         <h3 className="text-center">
            <strong>Eisenhower Matrix Worksheet</strong>
         </h3>
         <div className="row">
            <div className="col-lg-4 mt-2 ml-3">
               <div>
                  <strong>Name</strong>: <span>{header?.employeeName}</span>
               </div>
               <div>
                  <strong>Enroll</strong>: <span>{header?.employeeId}</span>
               </div>
            </div>
            <div className="col-lg-4">
               <div>
                  <strong>Designation</strong>:{' '}
                  <span>{header?.designation || ''}</span>
               </div>
               <div>
                  <strong>Location</strong>:{' '}
                  <span>{header?.workplaceGroup || ''}</span>
               </div>
            </div>
            <div className="col-lg-3">
               <div>
                  <strong>Year</strong>:{' '}
                  <span>{header?.year || ''}</span>
               </div>
               <div>
                  <strong>Quarter</strong>:{' '}
                  <span>{header?.quarter || ''}</span>
               </div>
            </div>
         </div>

         <div className="rounded p-2">
            <div>
               <div className="d-flex">
                  <div className="w-100 border border-bottom-0 border-dark">
                     <DoFirst doFirst={doFirst} />
                  </div>
                  <div className="w-100 border border-start-0 border-dark">
                     <Schedule schedule={schedule} />
                  </div>
               </div>
               <div className="d-flex">
                  <div className="w-100 border border-end-0 border-dark">
                     <Delegate delegate={delegate} />
                  </div>
                  <div className="w-100 border border-top-0 border-dark">
                     <DontDo dontDo={dontDo} />
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default EisenHowerPdfFile;
