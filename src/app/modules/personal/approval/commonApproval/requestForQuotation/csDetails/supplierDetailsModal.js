/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { _dateFormatter } from '../../../../../_helper/_dateFormate';
import Loading from '../../../../../_helper/_loading';
import IViewModal from '../../../../../_helper/_viewModal';
import useAxiosGet from '../../../../../_helper/customHooks/useAxiosGet';
import { InventoryTransactionReportViewTableRow } from '../../../../../inventoryManagement/warehouseManagement/invTransaction/report/tableRow';
import { PurchaseOrderViewTableRow } from '../../../../../procurement/purchase-management/purchaseOrder/report/tableRow';

export function SupplierDetailsModal({ selectedSupplier }) {
  const [viewData, getViewData, loader] = useAxiosGet();
  const [isInvTransModal, setIsInvTransModal] = useState(false);
  const [isPOModal, setIsPOModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
    getViewData(
      `/procurement/RequestForQuotation/GetSupplierLastDetails?businessUnitId=${selectedSupplier?.intBusinessUnitId}&businessPartnerId=${selectedSupplier?.intBusinessPartnerId}`,
    );
  }, [selectedSupplier?.intBusinessUnitId]);
  return (
    <div>
      {loader && <Loading />}
      <h1 className="mt-3">{'Supplier Details'}</h1>

      <div className="table-responsive">
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
              <td className="text-center">
                {selectedSupplier?.strBusinessPartnerCode || ''}
              </td>
              <td>
                <span className="pl-2">
                  {selectedSupplier?.strBusinessPartnerName || ''}
                </span>
              </td>
              <td>
                <span className="pl-2">
                  {selectedSupplier?.strContactNumber || ''}
                </span>
              </td>
              <td>
                <span className="pl-2">{selectedSupplier?.strEmail || ''}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <div className="table-responsive">
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
              {viewData?.map((item, index) => (
                <>
                  <tr>
                    <td className="text-left">
                      <span
                        className="pl-2"
                        style={{
                          color: 'blue',
                          textDecoration: 'underline',
                        }}
                        onClick={() => {
                          setIsPOModal(true);
                          setCurrentItem(item);
                        }}
                      >
                        {item?.purchaseOrderNo}
                      </span>
                    </td>
                    <td>
                      <span className="pl-2">
                        {item?.purchaseOrderDate
                          ? _dateFormatter(item?.purchaseOrderDate)
                          : ''}
                      </span>
                    </td>
                    <td>
                      <span
                        className="pl-2"
                        style={{
                          color: 'blue',
                          textDecoration: 'underline',
                        }}
                        onClick={() => {
                          setIsInvTransModal(true);
                          setCurrentItem(item);
                        }}
                      >
                        {item?.inventoryTransactionCode || ''}
                      </span>
                    </td>
                    <td>
                      <span className="pl-2">
                        {item?.inventoryTransactionDate
                          ? _dateFormatter(item?.inventoryTransactionDate)
                          : ''}
                      </span>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <IViewModal
        show={isPOModal}
        onHide={() => {
          setIsPOModal(false);
          setCurrentItem({});
        }}
        title="View Purchase Order"
      >
        <PurchaseOrderViewTableRow
          poId={currentItem?.purchaseOrderId}
          orId={currentItem?.purchaseOrderTypeId}
          isHiddenBackBtn={true}
        />
      </IViewModal>
      <IViewModal
        show={isInvTransModal}
        onHide={() => {
          setIsInvTransModal(false);
          setCurrentItem({});
        }}
      >
        <InventoryTransactionReportViewTableRow
          Invid={currentItem?.inventoryTransactionId}
          grId={currentItem?.inventoryTransectionGroupId || 0}
          currentRowData={currentItem}
        />
      </IViewModal>
    </div>
  );
}
