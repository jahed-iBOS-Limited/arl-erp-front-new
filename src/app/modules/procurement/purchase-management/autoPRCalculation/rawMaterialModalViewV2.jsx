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
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { shallowEqual, useSelector } from 'react-redux';
import IConfirmModal from '../../../_helper/_confirmModal';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { _todayDate } from '../../../_helper/_todayDate';

export default function RawMaterialAutoPRNewModalViewVersionTwo({
  singleRowDataFromParent,
  values,
}) {

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // state
  const [singleRowData, setSingleRowData] = useState();
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [warehouseStockModalShow, setWarehouseStockModalShow] = useState(false);
  const [, onCreatePr, prLoading] = useAxiosPost();

  // reducer
  const [commonItemDetailsState, commonItemDetailsDispatch] = useReducer(
    commonItemReducer,
    commonItemInitialState,
  );

  const [autoRawMaterialData, getAutoRawMaterialData, loader] = useAxiosGet();

  const getData = () => {
    getAutoRawMaterialData(
      `/procurement/MRPFromProduction/MrpfromProductionScheduleRowLandingNewReq?MrpfromProductionScheduleHeaderId=${singleRowDataFromParent?.mrpfromProductionHeaderId}`,
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {(loader || prLoading) && <Loading />}
      <div>
        {autoRawMaterialData?.length > 0 && (

          <>
            <div className='text-right mr-2 mt-2'>
              <button onClick={() => {
                const postiveClosingBalanceList = autoRawMaterialData?.filter(item => item?.closingBlance > 0);
                if (postiveClosingBalanceList?.length === 0) {
                  return toast.warning('No available stock to create PR')
                }
                IConfirmModal({
                  title: `Purchase Request`,
                  message: `Are you sure you want to create Purchase Request?`,
                  yesAlertFunc: () => {
                    
                    const payload = {
                      "createPurchaseRequestHeader": {
                        "purchaseRequestCode": "",
                        "reffNo": "123456",
                        "purchaseRequestTypeId": 2,
                        "purchaseRequestTypeName": "Standard PR",
                        "accountId": 1,
                        "accountName": "Akij Resource Limited",
                        "businessUnitId": postiveClosingBalanceList[0]?.businessUnitId || 0,
                        "businessUnitName": postiveClosingBalanceList[0]?.businessUnitName || "",
                        "sbuid": postiveClosingBalanceList[0]?.sbuId || 0,
                        "sbuname": postiveClosingBalanceList[0]?.sbuName || "",
                        "purchaseOrganizationId": postiveClosingBalanceList[0]?.intPurchaseOrganizationId || 0,
                        "purchaseOrganizationName": postiveClosingBalanceList[0]?.strPurchaseOrganizationName || "",
                        "plantId": postiveClosingBalanceList[0]?.plantId || 0,
                        "plantName": postiveClosingBalanceList[0]?.plantName || "",
                        "warehouseId": postiveClosingBalanceList[0]?.warehouseId || 0,
                        "warehouseName": postiveClosingBalanceList[0]?.warehouseName || "",
                        "deliveryAddress": postiveClosingBalanceList[0]?.deliveryAddress || "",
                        "supplyingWarehouseId": postiveClosingBalanceList[0]?.warehouseId || 0,
                        "supplyingWarehouseName": postiveClosingBalanceList[0]?.warehouseName || "",
                        "requestDate": _todayDate(),
                        "actionBy": profileData?.userId,
                        "costControlingUnitId": 0,
                        "costControlingUnitName": "",
                        "requiredDate": _todayDate(),
                        "strPurpose": "Requirment for Production"
                      },
                      "createPurchaseRequestRow": postiveClosingBalanceList?.map(item => {
                        return {
                          "itemId": item?.itemId,
                          "uoMid": item?.uoMid,
                          "uoMname": item?.uomName,
                          "numRequestQuantity": item?.closingBlance,
                          "dteRequiredDate": _todayDate(),
                          "billOfMaterialId": 0,
                          "remarks": "Requirment for Production"
                        }
                      })
                    }
                    onCreatePr(
                      '/procurement/PurchaseRequest/CreatePurchaseRequestInfo',
                      payload,
                      (res) => {
                        confirmAlert({
                              // title: title,
                              message: res?.message,
                              buttons: [
                                {
                                  label: "Ok",
                                  onClick: () => {},
                                },
                              ],
                            })
                        getData();
                      },
                      true,
                    );
                  },
                  noAlertFunc: () => { },
                });

              }} className='btn btn-primary'>Create PR</button>
            </div>
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
                    <th>In Transit</th>
                    <th>Open PR</th>
                    <th>Dead Stock</th>
                    <th>Available Stock</th>
                    <th>Schedule Quantity</th>
                    <th>PR Code</th>
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
                          <td className='text-center'><span>{item?.purchaseRequestCode || ""}</span></td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
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
