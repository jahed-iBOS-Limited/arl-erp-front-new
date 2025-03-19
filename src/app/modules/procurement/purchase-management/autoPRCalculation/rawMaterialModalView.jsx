import React, { useEffect, useReducer, useState } from 'react';
import Loading from '../../../_helper/_loading';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../purchaseOrder/customHooks/useAxiosGet';
import BreakDownModal from './breakdownModal';
import CommonItemDetailsModal from './rawMaterialModals/commonItemDetailsModal';
import {
  commonItemInitialState,
  commonItemReducer,
} from './rawMaterialModals/helper';
import WarehouseStockModal from './rawMaterialModals/warehouseStockModal';

export default function RawMaterialAutoPRNewModalView({
  singleRowDataFromParent,
  values,
}) {
  // state
  const [singleRowData, setSingleRowData] = useState();
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [warehouseStockModalShow, setWarehouseStockModalShow] = useState(false);

  // reducer
  const [commonItemDetailsState, commonItemDetailsDispatch] = useReducer(
    commonItemReducer,
    commonItemInitialState,
  );

  const [autoRawMaterialData, getAutoRawMaterialData, loader] = useAxiosGet();

  const getData = () => {
    getAutoRawMaterialData(
      `/procurement/MRPFromProduction/MrpfromProductionScheduleRowLanding?MrpfromProductionScheduleHeaderId=${singleRowDataFromParent?.mrpfromProductionHeaderId}`,
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loader && <Loading />}
      <div>
        {autoRawMaterialData?.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>UOM</th>
                  <th>Total QTY</th>
                  <th>Warehouse Stock</th>
                  <th>Floating Stock</th>
                  <th>In Transit</th>
                  <th>Open PR</th>
                  <th>Dead Stock</th>
                  <th>Available Stock</th>
                  <th>Closing Balance</th>
                  <th>Schedule Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {autoRawMaterialData?.length > 0 &&
                  autoRawMaterialData?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="text-center">{item?.itemCode}</td>
                        <td>{item?.itemName}</td>
                        <td className="text-center">{item?.uomName}</td>
                        <td className="text-right">
                          {item?.totalBudgetQty || 0}
                        </td>
                        <td
                          className="text-right text-primary cursor-pointer"
                          onClick={() => {
                            if (!item?.stockQty) return;
                            setWarehouseStockModalShow(true);
                            setSingleRowData(item);
                          }}
                        >
                          {item?.stockQty?.toFixed(2) || 0}
                        </td>
                        <td className="text-right text-primary cursor-pointer">
                          0
                        </td>

                        <td
                          className="text-right text-primary cursor-pointer"
                          onClick={() => {
                            if (!item?.inTransit) return;
                            commonItemDetailsDispatch({
                              type: 'OpenPo',
                              payload: { singleRowData: item },
                            });
                          }}
                        >
                          {item?.inTransit?.toFixed(2) || 0}
                        </td>

                        <td
                          className="text-right text-primary cursor-pointer"
                          onClick={() => {
                            if (!item?.openPrqty) return;
                            commonItemDetailsDispatch({
                              type: 'OpenPR',
                              payload: { singleRowData: item },
                            });
                          }}
                        >
                          {item?.openPrqty?.toFixed(2) || 0}
                        </td>
                        <td className="text-right">{item?.deadStock || 0}</td>
                        <td className="text-right">{item?.avaiableBlance}</td>
                        <td className="text-right">
                          {item?.closingBlance || 0}
                        </td>
                        <td className="text-center">
                          {item?.totalScheduleQty?.toFixed(2) || 0}
                        </td>
                        <td className="text-center">
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setSingleRowData(item);
                              setShowBreakdownModal(true);
                            }}
                          >
                            <i
                              style={{ fontSize: '16px' }}
                              className="fa fa-plus-square text-primary mr-2"
                            />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <IViewModal
        show={showBreakdownModal}
        onHide={() => {
          setShowBreakdownModal(false);
          setSingleRowData({});
        }}
      >
        <BreakDownModal
          singleRowData={singleRowData}
          setShowBreakdownModal={setShowBreakdownModal}
          setSingleRowData={setSingleRowData}
          callBack={() => {
            getData();
          }}
        />
      </IViewModal>

      {/* Warehouse Stock Details Modal */}
      <IViewModal
        show={warehouseStockModalShow}
        onHide={() => {
          setWarehouseStockModalShow(false);
          setSingleRowData({});
        }}
      >
        <WarehouseStockModal
          objProp={{
            singleRowData,
            setSingleRowData,
            values,
          }}
        />
      </IViewModal>

      {/* Common Item Details Modal */}
      <IViewModal
        show={commonItemDetailsState?.modalShow}
        onHide={() => {
          commonItemDetailsDispatch({ type: 'Close' });
        }}
      >
        <CommonItemDetailsModal
          objProp={{
            commonItemDetailsState,
            commonItemDetailsDispatch,
            values,
          }}
        />
      </IViewModal>
    </>
  );
}
