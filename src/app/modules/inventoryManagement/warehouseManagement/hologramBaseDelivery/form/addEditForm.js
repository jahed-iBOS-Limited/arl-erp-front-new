import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAvailableBalance_Action,
  getPartnerBalance_action,
  GetSalesConfigurationBalanceCheck_acion,
  getUndeliveryValues_action,
} from "../../../../salesManagement/orderManagement/salesOrder/_redux/Actions";
import { isUniq } from "../../../../_helper/uniqChecker";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  GetCategoryDDLAction,
  GetDataBySalesOrderAction,
  getDeliveryById,
  GetDeliveryTypeAction,
  GetSalesOrderListDDLAction,
  getShipToPartner_Action,
  GetWarehouseDDLAction,
  saveCreateDelivery,
  saveEditedDelivery,
} from "../../delivery/_redux/Actions";
import { getInfoBySOCode } from "../helper";
import Form from "./form";

const initData = {
  soCode: "",
  salesOrder: "",
  warehouse: "",
  soldToParty: "",
  deliveryType: "",
  deliveryDate: _todayDate(),
  mode: "",
  carType: "",
  bagType: "",
  deliveryMode: "",
  category: "",
  itemLists: [],
};

const HologramBaseDeliveryForm = () => {
  const { state } = useLocation();
  const { type, id } = useParams();
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryCode, setDeliveryCode] = useState("");

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const {
    warehouseDDL,
    salesOrderList,
    deliveryTypeDDL,
    categoryDDL,
    singleData,
  } = useSelector((state) => {
    return state?.delivery;
  }, shallowEqual);

  const {
    partnerBalance,
    availableBalance,
    undeliveryValues,
    isBalanceCheck,
  } = useSelector((state) => {
    return state?.salesOrder;
  }, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (buId && accId) {
      dispatch(GetCategoryDDLAction(accId, buId));
      dispatch(GetDeliveryTypeAction());
      dispatch(GetSalesConfigurationBalanceCheck_acion(accId, buId));
      dispatch(GetWarehouseDDLAction(accId, buId, state?.shipPoint?.value));
    }
    if (id) {
      dispatch(getDeliveryById(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId]);

  const barcodeHandler = (soCode, values, setFieldValue) => {
    getInfoBySOCode(accId, buId, soCode, setLoading, (resData) => {
      const {
        row,
        salesOrderCode,
        salesOrderId,
        soldToPartnerId,
        soldToPartnerName,
      } = resData;
      setFieldValue("soldToParty", {
        value: soldToPartnerId,
        label: soldToPartnerName,
      });
      setFieldValue("salesOrder", {
        value: salesOrderId,
        label: salesOrderCode,
      });
      dispatch(getPartnerBalance_action(soldToPartnerId));
      dispatch(getUndeliveryValues_action(soldToPartnerId));
      dispatch(GetSalesOrderListDDLAction(buId, soldToPartnerId, 0));
      setRows(row);
      dispatch(
        GetDataBySalesOrderAction(
          salesOrderId,
          values?.warehouse?.value,
          setLoading
        )
      );
      dispatch(
        getShipToPartner_Action(accId, buId, salesOrderId, setFieldValue)
      );
    });
  };

  const addBtnHandler = (values, setValues) => {
    console.log(salesOrderList?.objRow, "objRow =================== ");
    if (salesOrderList?.objRow?.length > 0) {
      const modifiedSalesOrderList = [];
      if (salesOrderList?.objRow?.length > 0) {
        salesOrderList.objRow.forEach((ele, idx) => {
          const obj = {
            ...ele.objRowData,
            warehouse: values?.warehouse?.label,
            warehouseId: values?.warehouse?.value,
            shipToParty: values?.shipToParty?.label,
            deliveryQty: ele?.objRowData?.pendingQty || "",
            salesOrderId: values?.salesOrder?.value,
            salesOrder: values?.salesOrder?.label,
            salesOrderRowId: ele.objRowData.rowId,
            objLocation: ele?.objLocation,
            amount: ele.objRowData.numItemPrice * ele.objRowData.pendingQty,
            specification: ele.objRowData.specification,
            selectLocation: ele?.objLocation?.[0] || "",
            vatAmount:
              ele?.objRowData?.vatItemPrice * ele?.objRowData?.pendingQty,
            isItemShow: true,
          };
          if (ele?.objRowData?.isTradeFreeItem) {
            const itemFindIdx = modifiedSalesOrderList?.findIndex(
              (i) => i?.itemId === ele?.objRowData?.itemAgainstOffer
            );
            if (itemFindIdx !== -1) {
              const prvOffer =
                modifiedSalesOrderList[itemFindIdx]?.offerItemList || [];
              modifiedSalesOrderList[itemFindIdx] = {
                ...modifiedSalesOrderList[itemFindIdx],
                offerItemList: [...prvOffer, obj],
              };
            }
          } else {
            modifiedSalesOrderList.push(obj);
          }
        });
      }

      if (
        isUniq("salesOrderId", values?.salesOrder?.value, values?.itemLists)
      ) {
        const itemList = [...values?.itemLists, ...modifiedSalesOrderList];
        setValues({
          ...values,
          itemLists: itemList,
        });
        const orderIdList = itemList?.map((itm) => itm?.salesOrderId);
        dispatch(
          getAvailableBalance_Action(values?.soldToParty?.value, orderIdList, 2)
        );
        dispatch(
          GetSalesOrderListDDLAction(
            buId,
            values?.soldToParty?.value,
            values?.shipToParty?.value
          )
        );
      }
    } else {
      toast.warning("Data not found");
    }
  };

  const remover = (idx, setValues, values) => {
    let ccdata = values?.itemLists?.filter((itm, index) => index !== idx);
    setValues({
      ...values,
      itemLists: ccdata,
    });
    const orderIdList = ccdata?.map((itm) => itm?.salesOrderId);
    dispatch(
      getAvailableBalance_Action(values?.soldToParty?.value, orderIdList, 2)
    );
  };

  const is_BalanceCheck =
    isBalanceCheck?.balanceCheckOnDelivery &&
    !isBalanceCheck?.balanceCheckOnOrder;

  const isAvailableBalance = (array) => {
    // if Day Limit true
    if (partnerBalance?.isDayLimit) {
      if (availableBalance < 0) {
        // toast.warning("Balance not available", { toastId: 465656 });
        return false;
      }
    } else {
      // if Day Limit false
      if (is_BalanceCheck) {
        if (array?.length > 0 && availableBalance > 0) {
          const totalQty = array?.reduce((acc, cur) => acc + +cur?.amount, 0);
          if (availableBalance < totalQty) {
            toast.warning("Balance not available", { toastId: 465656 });
            return true;
          }
        } else {
          return true;
        }
      }
    }

    return false;
  };

  const responseDataCB = (deliveryCode) => {
    setDeliveryCode(deliveryCode);
  };

  const saveHandler = async (values, cb) => {
    console.log("clicked");
    if (values && accId && buId) {
      let list = [];
      if (values?.itemLists?.length > 0) {
        values.itemLists.forEach((allItm) => {
          list.push(allItm);
          if (allItm?.offerItemList?.length > 0) {
            allItm.offerItemList.forEach((offerItem) => {
              if (+offerItem?.deliveryQty > 0) {
                list.push(offerItem);
              }
            });
          }
        });
      }
      const rowData = list?.map((itm) => {
        return {
          rowId: itm.deliveryRowId || 0,
          salesOrderId: itm?.salesOrderId || itm?.rowId || 0,
          salesOrderRowId: itm?.salesOrderRowId || 0,
          itemId: itm?.itemId || 0,
          itemCode: itm?.itemCode || "",
          itemName: itm?.itemName || "",
          intUomId: itm?.uomId || 0,
          uomName: itm.uomName || "",
          quantity: +itm.deliveryQty || 0,
          locationId: itm?.selectLocation?.value || 0,
          locationName: itm?.selectLocation?.label || "",
          transportRate: itm?.transportRate || 0,
          salesOrder: itm?.salesOrder,
          specification: itm?.specification || "",
          vatAmount: itm?.vatAmount || 0,
        };
      });

      if (id) {
        const payload = {
          headerData: {
            // deliveryId: singleData?.objDeliveryHeaderLandingDTO?.deliveryId,
            // shipToPartyId:
            //   singleData?.objDeliveryHeaderLandingDTO?.shipToPartnerId,
            // shipToPartyName:
            //   singleData?.objDeliveryHeaderLandingDTO?.shipToPartnerName,
            // shipPointId: singleData?.objDeliveryHeaderLandingDTO?.shipPointId,
            actionBy: userId,
            lastActionDateTime: _todayDate(),
          },
          rowData: rowData,
        };
        if (rowData?.length > 0) {
          dispatch(saveEditedDelivery(payload, setLoading, history));
        } else {
          toast.warning("You must have to add atleast one item");
        }
      } else {
        const payload = {
          objHeader: {
            deliveryId: 0,
            deliveryTypeId: values.deliveryType.value,
            deliveryType: values.deliveryType.label,
            shipToPartyId: values.shipToParty.value,
            shipToPartyName: values.shipToParty.label,
            shipPointId: state?.shipPoint?.value,
            deliveryDate: values?.deliveryDate,
            actionBy: userId,
            warehouseId: values.warehouse.value,
          },
          objRow: rowData,
          objShipRequest: {
            deliveryDate: values?.deliveryDate,
            mode: values?.mode?.label,
            carType: values?.carType?.label,
            bagType: values?.bagType?.label || "",
            category: values?.category?.label,
            deliveryMode: values?.deliveryMode?.label,
            strRequestNo: rowData[rowData.length - 1].salesOrder,
            vehicleNo: "",
          },
        };

        if (rowData?.length > 0) {
          dispatch(
            saveCreateDelivery({
              data: payload,
              cb,
              responseDataCB,
              setDisabled: setLoading,
            })
          );
        } else {
          toast.warning("You must have to add atleast one item");
        }
      }
    } else {
      setLoading(false);
    }
  };

  const title = `Create Hologram Base Delivery`;
  console.log(singleData, "singleData");
  return (
    <>
      {loading && <Loading />}
      <Form
        buId={buId}
        rows={rows}
        title={title}
        viewType={type}
        remover={remover}
        saveHandler={saveHandler}
        categoryDDL={categoryDDL}
        deliveryCode={deliveryCode}
        warehouseDDL={warehouseDDL}
        addBtnHandler={addBtnHandler}
        salesOrderList={salesOrderList}
        barcodeHandler={barcodeHandler}
        partnerBalance={partnerBalance}
        deliveryTypeDDL={deliveryTypeDDL}
        availableBalance={availableBalance}
        undeliveryValues={undeliveryValues}
        initData={id ? singleData : initData}
        isAvailableBalance={isAvailableBalance}
      />
    </>
  );
};

export default HologramBaseDeliveryForm;
