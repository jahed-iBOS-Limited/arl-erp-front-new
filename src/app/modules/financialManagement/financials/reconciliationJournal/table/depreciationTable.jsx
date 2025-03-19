import React from 'react';
import numberWithCommas from '../../../../_helper/_numberWithCommas';
import { _dateFormatter } from '../../../../_helper/_dateFormate';

const DepreciationTable = ({ journalData }) => {
   return (
      <>
          <div className="table-responsive">
          <table
            id={'depreciation'}
            className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5"
         >
            <thead className="bg-secondary">
               <tr>
                  <th className='positionSticky'>SL</th>
                  <th>Asset Code</th>
                  <th>Asset Description</th>
                  <th>Salvage Value</th>
                  <th>Asset Value</th>
                  <th style={{ width: '100px' }}>Depriciation Rate</th>
                  <th>Accumulate Depriciation</th>
                  <th>Net value</th>
                  <th>Last Depriciation Run Date</th>
                  <th style={{ width: '100px' }}>Depriciation Amount</th>
               </tr>
            </thead>
            <tbody>
               <>
                  {journalData?.map((item, index) => (
                     <tr key={index}>
                        <td className="text-center positionSticky">{index + 1}</td>
                        <td className="text-center">{item?.strAssetCode}</td>
                        <td className="text-center">
                           {item?.strAssetDescription}
                        </td>
                        <td className="text-right">{item?.numSalvageValue}</td>
                        <td className="text-right">
                           {numberWithCommas(
                              Math.round(item?.numAcquisitionValue)
                           )}
                        </td>
                        <td className="text-right">{item?.numDepRate || 0}</td>
                        <td className="text-right">
                           {numberWithCommas(
                              Math.round(item?.numTotalDepValue)
                           )}
                        </td>
                        <td className="text-right">
                           {numberWithCommas(Math.round(item?.numNetValue))}
                        </td>
                        <td className="text-center">
                           {_dateFormatter(item?.dteDepRunDate)}
                        </td>
                        <td className="text-right">
                           {numberWithCommas(Math.round(item?.numDepAmount))}
                        </td>
                     </tr>
                  ))}
                  <tr>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td className="text-right font-weight-bold">Total</td>
                     <td className="text-right font-weight-bold">
                        {numberWithCommas(
                           Math.round(
                              journalData?.reduce(
                                 (acc, item) => acc + item.numDepAmount,
                                 0
                              )
                           )
                        )}
                     </td>
                  </tr>
               </>
            </tbody>
         </table>
      </div>
      </>
   );
};
export default DepreciationTable;
