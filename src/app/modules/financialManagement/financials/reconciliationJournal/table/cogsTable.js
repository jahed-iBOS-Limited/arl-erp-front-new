import React from 'react';
import numberWithCommas from '../../../../_helper/_numberWithCommas';

const COGSTable = ({ journalData }) => {
   return (
      <>
         <table
            id={'cogs'}
            className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5"
         >
            <thead className="bg-secondary">
               <tr>
                  <th>SL</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Profit Center</th>
                  <th>Quantity</th>
                  <th>Avg. COGS</th>
                  <th>Amount</th>
               </tr>
            </thead>
            <tbody>
               <>
                  {journalData?.map((item, index) => (
                     <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{item?.strItemCode}</td>
                        <td>{item?.strItemName}</td>
                        <td>{item?.strProfitCenterName}</td>
                        <td className="text-right">{item?.numQty}</td>
                        <td className="text-right">
                           {item?.numAvgCOGS.toFixed(2)}
                        </td>
                        <td className="text-right">
                           {item?.numValue.toFixed(2)}
                        </td>
                     </tr>
                  ))}
                  <tr>
                     <td colSpan="4" className="text-right font-weight-bold">
                        Total
                     </td>
                     <td className="text-right font-weight-bold">
                        {numberWithCommas(
                           journalData
                              ?.reduce((acc, item) => acc + item.numQty, 0)
                              .toFixed(2)
                        )}
                     </td>
                     <td></td>
                     <td className="text-right font-weight-bold">
                        {numberWithCommas(
                           journalData
                              ?.reduce((acc, item) => acc + item.numValue, 0)
                              .toFixed(2)
                        )}
                     </td>
                  </tr>
               </>
            </tbody>
         </table>
      </>
   );
};
export default COGSTable;
