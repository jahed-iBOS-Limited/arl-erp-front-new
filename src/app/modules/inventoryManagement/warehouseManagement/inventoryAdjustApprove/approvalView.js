import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IConfirmModal from "../../../_helper/_confirmModal";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

export default function ApprovalView({
  singleData,
  getRowData,
  setIsShowModal,
}) {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [, approveRectionHandler, saveLoader] = useAxiosPost();
  const [viewData, getViewData] = useAxiosGet();

  useEffect(() => {
    getViewData(
      `/wms/InventoryTransaction/GetPendingAdjustmentRowViewByTransId?intBusinessUnitId=${selectedBusinessUnit?.value}&intInventoryTransactionId=${singleData?.intInventoryTransactionId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  return (
    <>
      {saveLoader && <Loading />}
      <div className="mt-5">
        <div className="text-right my-3">
          <button
            type="button"
            className="btn btn-primary mr-4"
            onClick={() => {
              IConfirmModal({
                message: `Are you sure to Approve?`,
                yesAlertFunc: () => {
                  approveRectionHandler(
                    `/wms/InventoryTransaction/AdjustmentApproval?intInventoryTransactionId=${singleData?.intInventoryTransactionId}&isApprove=true
                                    `,
                    null,
                    () => {
                      setIsShowModal(false);
                      getRowData(
                        `/wms/InventoryTransaction/GetPendingAdjustments?intBusinessUnitId=${selectedBusinessUnit?.value}`
                      );
                    }
                  );
                },
                noAlertFunc: () => { },
              });
            }}
          >
            Approve
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              IConfirmModal({
                message: `Are you sure to Reject?`,
                yesAlertFunc: () => {
                  approveRectionHandler(
                    `/wms/InventoryTransaction/AdjustmentApproval?intInventoryTransactionId=${singleData?.intInventoryTransactionId}&isApprove=false
                                    `,
                    null,
                    () => {
                      setIsShowModal(false);
                      getRowData(
                        `/wms/InventoryTransaction/GetPendingAdjustments?intBusinessUnitId=${selectedBusinessUnit?.value}`
                      );
                    }
                  );
                },
                noAlertFunc: () => { },
              });
            }}
          >
            Reject
          </button>
        </div>
        {viewData?.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Trans Code</th>
                  <th>Trans Type</th>
                  <th>Item</th>
                  <th>UOM Name</th>
                  <th>Trans Qty</th>
                  <th>Trans Value</th>
                  <th>Profit Center</th>
                  <th>Plant</th>
                  <th>Warehouse</th>
                  <th>Inventory Location</th>
                </tr>
              </thead>
              <tbody>
                {viewData?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      {item?.strInventoryTransactionCode}
                    </td>
                    <td>{item?.strTransactionTypeName}</td>
                    <td>{item?.strItemName}</td>
                    <td>{item?.strUoMname}</td>
                    <td className="text-center">
                      {item?.numTransactionQuantity}
                    </td>
                    <td className="text-center">{item?.monTransactionValue}</td>
                    <td>{item?.strProfitCenterName}</td>
                    <td>{item?.strPlantName}</td>
                    <td>{item?.strWarehouseName}</td>
                    <td>{item?.strInventoryLocationName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
