import React, { useState } from 'react';
import { _dateFormatter } from '../../../../../_helper/_dateFormate';
import { ItemReqViewTableRow } from '../../../../../procurement/purchase-management/purchaseRequestNew/report/tableRow';
import IViewModal from '../../../../../_helper/_viewModal';

export function ItemReferenceModal({ selectedItem }) {
   const [showModal, setShowModal] = useState(false);

   return (
      <div>
         {/* {loader && <Loading />} */}
         <h1 className="mt-3">{'Item Reference'}</h1>

         <div className="mt-5">
           <div className="table-responsive">
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
                     <td className="text-center">
                        <p
                           style={{
                              color: 'blue',
                              textDecoration: 'underline',
                              textAlign: 'center',
                           }}
                           onClick={() => {
                              setShowModal(true);
                           }}
                        >
                           {selectedItem?.itemReferenceInfo?.referenceCode ||
                              ''}
                        </p>
                     </td>
                     <td>
                        {selectedItem?.itemReferenceInfo?.referenceDate
                           ? _dateFormatter(
                                selectedItem?.itemReferenceInfo?.referenceDate
                             )
                           : ''}
                     </td>
                     <td>
                        {selectedItem?.itemReferenceInfo?.referenceQuantity ||
                           ''}
                     </td>
                     <td>
                        {selectedItem?.itemReferenceInfo?.referenceRemarks ||
                           ''}
                     </td>
                  </tr>
               </tbody>
            </table>
           </div>
         </div>
         <IViewModal show={showModal} onHide={() => setShowModal(false)}>
            <ItemReqViewTableRow
               prId={selectedItem?.itemReferenceInfo?.referenceId}
            />
         </IViewModal>
      </div>
   );
}
