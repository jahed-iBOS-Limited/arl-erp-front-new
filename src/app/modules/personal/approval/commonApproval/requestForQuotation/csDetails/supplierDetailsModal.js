import React, { useEffect } from 'react';

export function SupplierDetailsModal() {
   // const [viewData, getViewData, loader, setViewData] = useAxiosGet();

   useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <div>
         {/* {loader && <Loading />} */}
         <h1 className="mt-3">{'Supplier Details'}</h1>

         <div>
            <table className="table table-striped table-bordered global-table">
               <thead>
                  <tr>
                     <th>Supplier Code</th>
                     <th>Supplier Name</th>
                     <th>Contact No</th>
                     <th>Email Address</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td className="text-center">{''}</td>
                     <td>
                        <span className="pl-2">{''}</span>
                     </td>
                     <td>
                        <span className="pl-2">{''}</span>
                     </td>
                     <td>
                        <span className="pl-2">{''}</span>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>

         <div className="mt-5">
            <table className="table table-striped table-bordered global-table">
               <thead>
                  <tr>
                     <th>PO No</th>
                     <th>PO Date</th>
                     <th>MRR No</th>
                     <th>MRR Date</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td className="text-center">{''}</td>
                     <td>
                        <span className="pl-2">{''}</span>
                     </td>
                     <td>
                        <span className="pl-2">{''}</span>
                     </td>
                     <td>
                        <span className="pl-2">{''}</span>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   );
}
