import React, { useEffect } from 'react';

export function ItemReferenceModal() {
   // const [viewData, getViewData, loader, setViewData] = useAxiosGet();

   useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <div>
         {/* {loader && <Loading />} */}
         <h1 className="mt-3">{'Item Reference'}</h1>

         <div className="mt-5">
            <table className="table table-striped table-bordered global-table">
               <thead>
                  <tr>
                     <th>Reference No</th>
                     <th>Reference Date</th>
                     <th>Qty</th>
                     <th>Remarks</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td className="text-center">{''}</td>
                     <td></td>
                     <td></td>
                     <td></td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   );
}
