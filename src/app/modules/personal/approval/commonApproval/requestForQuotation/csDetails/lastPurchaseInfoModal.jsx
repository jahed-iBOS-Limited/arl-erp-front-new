/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import useAxiosGet from '../../../../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../../../../_helper/_dateFormate';
import Loading from '../../../../../_helper/_loading';
import IViewModal from '../../../../../_helper/_viewModal';
import { InventoryTransactionReportViewTableRow } from '../../../../../inventoryManagement/warehouseManagement/invTransaction/report/tableRow';

export function LastPurchaseInfoModal({ selectedItem }) {
   const [
      lastPurchaseInfo,
      getLastPurchaseInfo,
      getLoading,
      setLastPurchaseInfo,
   ] = useAxiosGet([]);
   const [isShowModalTwo, setIsShowModalTwo] = React.useState(false);
   const [currentRowData, setCurrentRowData] = React.useState({});

   useEffect(() => {
      getLastPurchaseInfo(
         `/procurement/RequestForQuotation/GetItemsLastPurchaseInformation?itemId=${selectedItem?.intItemId}`
      );
   }, [selectedItem?.intItemId]);
   return (
      <div>
         {getLoading && <Loading />}
         <h1 className="mt-3">{'Last Purchase Details'}</h1>

         <div className="mt-5">
            <p>Item Name: {lastPurchaseInfo?.itemName || ''}</p>
         </div>

         <div className="mt-2">
           <div className="table-responsive">
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
                     <td className="text-center">{1}</td>
                     <td className="text-center">
                        <p
                           style={{
                              color: 'blue',
                              textDecoration: 'underline',
                           }}
                           onClick={() => {
                              setIsShowModalTwo(true);
                              setCurrentRowData(lastPurchaseInfo);
                           }}
                        >
                           {lastPurchaseInfo?.inventoryTransactionCode || ''}
                        </p>
                     </td>
                     <td>
                        {lastPurchaseInfo?.inventoryTransactionDate
                           ? _dateFormatter(
                                lastPurchaseInfo?.inventoryTransactionDate
                             )
                           : ''}
                     </td>
                     <td>{lastPurchaseInfo?.grnQuantity || ''}</td>
                     <td>{lastPurchaseInfo?.purchaseRate || ''}</td>
                     <td>{`${lastPurchaseInfo?.businessPartnerName ||
                        ''}(${lastPurchaseInfo?.businessPartnerCode ||
                        ''})`}</td>
                  </tr>
               </tbody>
            </table>
           </div>
         </div>
         <IViewModal
            show={isShowModalTwo}
            onHide={() => setIsShowModalTwo(false)}
         >
            <InventoryTransactionReportViewTableRow
               Invid={lastPurchaseInfo?.inventoryTransactionId}
               grId={0} // need discussion
               currentRowData={currentRowData}
            />
         </IViewModal>
      </div>
   );
}
