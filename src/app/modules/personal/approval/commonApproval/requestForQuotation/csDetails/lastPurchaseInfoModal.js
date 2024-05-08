import React, { useEffect } from 'react';

export function LastPurchaseInfoModal() {
   // const [viewData, getViewData, loader, setViewData] = useAxiosGet();

   useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <div>
         {/* {loader && <Loading />} */}
         <h1 className="mt-3">{'Last Purchase Details'}</h1>

         <div className="mt-5">
            <p>Item Name: Test Item</p>
         </div>

         <div className="mt-2">
            <table className="table table-striped table-bordered global-table">
               <thead>
                  <tr>
                     <th>SL</th>
                     <th>GRN No</th>
                     <th>GRN Date</th>
                     <th>GRN Qty</th>
                     <th>Rate</th>
                     <th>Supplier Name/Code</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td className="text-center">{''}</td>
                     <td></td>
                     <td></td>
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
