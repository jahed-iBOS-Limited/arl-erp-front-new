/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  GetShipPointDDLAction,
  GetWarehouseDDLAction,
  GetSoldToPartyDDLAction,
  GetSalesOrderListDDLAction,
  GetDeliveryTypeAction,
  saveCreateDelivery,
  saveEditedDelivery,
  getDeliveryById,
  setDeliverySingleEmpty,
  getSoldToPartner_Action,
  GetCategoryDDLAction,
} from "../_redux/Actions";
import {
  getPartnerBalance_action,
  getUndeliveryValues_action,
  getAvailableBalance_Action,
  SetAvailableBalanceEmpty_Action,
  GetSalesConfigurationBalanceCheck_acion,
} from "./../../../../salesManagement/orderManagement/salesOrder/_redux/Actions";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import { isUniq } from "../../../../_helper/uniqChecker";
import { SetPartnerBalanceEmpty_Action } from "./../../../../salesManagement/orderManagement/salesOrder/_redux/Actions";
import { SetUndeliveryValuesEmpty_Action } from "./../../../../salesManagement/orderManagement/salesOrder/_redux/Actions";
import { useLocation } from "react-router";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "./../../../../_helper/_loading";
import moment from "moment";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { GetDeliveryApprroximateDateTimeApi } from "../utils";

const initData = {
  id: undefined,
  shipPoint: "",
  warehouse: "",
  soldToParty: "",
  shipToParty: "",
  salesOrder: "",
  deliveryType: { value: 3, label: "Sales Delivery" },
  deliveryQty: "",
  location: "",
  mode: "",
  carType: "",
  bagType: "",
  deliveryMode: "",
  category: "",
  deliveryDate: _todayDate(),
  itemLists: [],
  shipmentType: "",
  requestTime: `${moment().format("YYYY-MM-DD HH:mm:ss")}`,
};

export default function DeliveryForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [responseData, setresponseData] = useState("");

  const { state: headerData } = useLocation();
  const pendingDeliveryReportitemList = headerData?.itemLists;
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const {
    partnerBalance,
    availableBalance,
    undeliveryValues,
    isBalanceCheck,
  } = useSelector((state) => {
    return state.salesOrder;
  }, shallowEqual);

  const is_BalanceCheck =
    isBalanceCheck?.balanceCheckOnDelivery &&
    !isBalanceCheck?.balanceCheckOnOrder;

  // get shipPointDDL ddl from store
  const {
    shipPointDDL,
    warehouseDDL,
    shipToPartner,
    soldToPartyDDL,
    salesOrderDDL,
    salesOrderList,
    soldToPartnerDDL,
    deliveryTypeDDL,
    plantLocationDDL,
    singleData,
    categoryDDL,
  } = useSelector((state) => {
    return state?.delivery;
  }, shallowEqual);

  const dispatch = useDispatch();
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getDeliveryById(id));
    } else {
      dispatch(setDeliverySingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //initial Load ShipPointDDL & DeliveryType dispatch
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        GetSoldToPartyDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        GetCategoryDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      if (!id) {
        dispatch(
          GetShipPointDDLAction(
            profileData.accountId,
            selectedBusinessUnit.value
          )
        );
        dispatch(GetDeliveryTypeAction());
      }
      dispatch(
        GetSalesConfigurationBalanceCheck_acion(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const responseDataCB = (deliveryCode) => {
    setresponseData(deliveryCode);
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      let requestDeliveryDate = "";
      //curent date compare with request date
      if (moment(values?.requestTime).isBefore(moment())) {
        requestDeliveryDate = moment().format("YYYY-MM-DDTHH:mm:ss");
      } else {
        requestDeliveryDate = moment(values?.requestTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        );
      }
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
          shipmentExtraAmount:
            (+itm?.extraRate || 0) * (+itm?.deliveryQty || 0),
          shipmentExtraRate: +itm?.extraRate || 0,
        };
      });

      if (rowData?.length === 0) {
        return toast.warning("You must have to add at least one item");
      }

      if (id) {
        const payload = {
          headerData: {
            deliveryId: singleData?.objDeliveryHeaderLandingDTO?.deliveryId,
            shipToPartyId:
              singleData?.objDeliveryHeaderLandingDTO?.shipToPartnerId,
            shipToPartyName:
              singleData?.objDeliveryHeaderLandingDTO?.shipToPartnerName,
            shipPointId: singleData?.objDeliveryHeaderLandingDTO?.shipPointId,
            actionBy: profileData.userId,
            lastActionDateTime: _todayDate(),
            territoryId: values?.soldToParty?.terriToryId || 0,
          },
          rowData: rowData,
        };
        dispatch(saveEditedDelivery(payload, setDisabled, history));
      } else {
        const payload = {
          objHeader: {
            deliveryId: 0,
            deliveryTypeId: values.deliveryType.value,
            deliveryType: values.deliveryType.label,
            shipToPartyId: values.shipToParty.value,
            shipToPartyName: values.shipToParty.label,
            shipPointId: headerData?.shipPoint?.value,
            deliveryDate: values?.deliveryDate,
            actionBy: profileData.userId,
            warehouseId: values.warehouse.value,
            businessUnitId: selectedBusinessUnit?.value,
            shipmentTypeId: values?.shipmentType?.value || 0,
            shipmentType: values?.shipmentType?.label || "",
            requestDeliveryDate: requestDeliveryDate,
            territoryId: values?.soldToParty?.terriToryId || 0,
            plantId: headerData?.plant?.value,
            plantName: headerData?.plant?.label,
          },
          objRow: rowData,
          objShipRequest: {
            deliveryDate: values?.deliveryDate,
            mode: values?.mode?.label,
            carType: values?.carType?.label,
            bagType: values?.bagType?.label || "",
            category: values?.category?.label,
            deliveryMode: values?.deliveryMode?.label,
            strRequestNo: rowData?.[rowData?.length - 1]?.salesOrder,
            vehicleNo: "",
          },
        };

        if ([4].includes(selectedBusinessUnit?.value)) {
          const totalQty = rowData?.reduce(
            (acc, cur) => (acc += +cur?.quantity || 0),
            0
          );
          GetDeliveryApprroximateDateTimeApi(
            selectedBusinessUnit?.value,
            headerData?.shipPoint?.value,
            requestDeliveryDate,
            totalQty,
            values?.soldToParty?.terriToryId,
            values?.shipmentType?.value,
            setDisabled,
            (apprroximateDate) => {
              let confirmObject = {
                title: "Notice",
                message: `Your Approximate Delivery Will be \n
                From ${moment().format("DD-MM-YYYY hh:mm A")} \n
                To ResponseTime ${moment(apprroximateDate).format(
                  "DD-MM-YYYY hh:mm A"
                )}`,
                yesAlertFunc: async () => {
                  dispatch(
                    saveCreateDelivery({
                      data: payload,
                      cb,
                      responseDataCB,
                      setDisabled,
                    })
                  );
                },
                noAlertFunc: () => {
                  "";
                },
              };
              IConfirmModal(confirmObject);
            }
          );
        } else {
          dispatch(
            saveCreateDelivery({
              data: payload,
              cb,
              responseDataCB,
              setDisabled,
            })
          );
        }
      }
    } else {
      setDisabled(false);
    }
  };

  //dispatch shipToPartyDispatcher
  const shipToPartyDispatcher = (payload) => {
    if (payload) {
      dispatch(getPartnerBalance_action(payload));
      dispatch(getUndeliveryValues_action(payload));
      dispatch(
        GetSalesOrderListDDLAction(selectedBusinessUnit.value, payload, 0)
      );
    }
  };

  useEffect(() => {
    if (id && singleData?.objDeliveryHeaderLandingDTO?.soldToPartnerId) {
      const {
        soldToPartnerId,
        shipToPartnerId,
      } = singleData?.objDeliveryHeaderLandingDTO;
      dispatch(getPartnerBalance_action(soldToPartnerId));
      dispatch(getUndeliveryValues_action(soldToPartnerId));
      dispatch(GetDeliveryTypeAction());
      dispatch(
        GetSalesOrderListDDLAction(
          selectedBusinessUnit.value,
          soldToPartnerId,
          shipToPartnerId
        )
      );

      // Available Balance api call
      const orderIdList = singleData?.objListDeliveryRowDetailsDTO?.map(
        (itm) => itm?.salesOrderId
      );
      dispatch(getAvailableBalance_Action(soldToPartnerId, orderIdList, 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, singleData]);

  //Add rowdto handler with oder no
  const addBtnHandler = (values, setValues) => {
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
            extraRate: +values?.shipmentType?.extraRate || 0,
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
            selectedBusinessUnit.value,
            values?.soldToParty?.value,
            values?.shipToParty?.value
          )
        );
      }
    } else {
      toast.warning("Data not found");
    }
  };
  // row remove
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
  useEffect(() => {
    return () => {
      dispatch(SetPartnerBalanceEmpty_Action());
      dispatch(SetAvailableBalanceEmpty_Action());
      dispatch(SetUndeliveryValuesEmpty_Action());
      dispatch(setDeliverySingleEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      headerData?.sbu?.value &&
      headerData?.shipPoint?.value &&
      headerData?.distributionChannel?.value
    ) {
      dispatch(
        getSoldToPartner_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          headerData?.sbu?.value,
          headerData?.shipPoint?.value,
          headerData?.distributionChannel?.value
        )
      );
      dispatch(
        GetWarehouseDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          headerData?.shipPoint?.value
        )
      );
      // if user Pending "Order menu" crate btn click
      if (headerData?.soldToParty?.value) {
        shipToPartyDispatcher(headerData?.soldToParty?.value);
      }
    } else {
      if (!id) {
        history.push("/inventory-management/warehouse-management/delivery");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);

  return (
    <IForm
      title={id ? "Edit Delivery" : "Create Delivery"}
      getProps={setObjprops}
      isDisabled={isDisabled || btnDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          singleData || {
            ...initData,
            warehouse: headerData?.warehouse?.value
              ? headerData?.warehouse
              : "",
            soldToParty: headerData?.soldToParty?.value
              ? headerData?.soldToParty
              : "",
            itemLists: pendingDeliveryReportitemList || [],
            businessUnitId: selectedBusinessUnit?.value,
          }
        }
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        shipPointDDL={shipPointDDL}
        warehouseDDL={warehouseDDL}
        soldToPartyDDL={soldToPartyDDL}
        salesOrderDDL={salesOrderDDL}
        deliveryTypeDDL={deliveryTypeDDL}
        plantLocationDDL={plantLocationDDL}
        isEdit={id || false}
        shipToPartyDispatcher={shipToPartyDispatcher}
        remover={remover}
        addBtnHandler={addBtnHandler}
        partnerBalance={partnerBalance}
        availableBalance={availableBalance}
        undeliveryValues={undeliveryValues}
        responseData={responseData}
        profileData={profileData}
        soldToPartnerDDL={soldToPartnerDDL}
        shipToPartner={shipToPartner}
        headerData={headerData}
        setBtnDisabled={setBtnDisabled}
        setDisabled={setDisabled}
        is_BalanceCheck={is_BalanceCheck}
        categoryDDL={categoryDDL}
      />
    </IForm>
  );
}
