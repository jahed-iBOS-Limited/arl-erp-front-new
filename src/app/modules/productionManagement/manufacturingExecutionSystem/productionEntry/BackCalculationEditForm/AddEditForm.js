/* eslint-disable react-hooks/exhaustive-deps */

/* 

Dont Touch Any Code without permission by Mamun Ahmed (Backend)

*/

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import {
  getPlantNameDDL,
  getShiftDDL,
  editProductionEntry,
  getOrderQuantityDDL,
  getOtherOutputItemDDL,
  getProductionItemQuantity,
  createProductionEntryForBackCalculation,
  getSingleDataByForBackCalculation,
} from "../helper";
import Form from "./BackCalculationEditForm";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

let initData = {
  id: undefined,
  plantName: "",
  shopFloor: "",
  workcenterName: "",
  itemName: "",
  bomName: "",
  orderQty: "",
  dteProductionDate: _todayDate(),
  shift: "",
  goodQty: "",
  goodReceivedQty: "",
  othersOutputItem: "",
  othersOutputQty: "",
  checkOutputItem: false,
};

export default function BackCalculationEditForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [plantNameDDL, setPlantNameDDL] = useState([]);
  const [shiftDDL, setShiftDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const params = useParams();

  const [ setOthersOutputItemDDL] = useState([]);
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [workCenterDDL, setWorkCenterDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [bomDDL, setBomDDL] = useState([]);
  const [setGetOrderQuantity] = useState("");
  const [setProductionQuantity] = useState("");

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {}, []);

  const saveHandler = (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit) {
      if (params?.id) {
        const objRowData = rowData?.map((item, index) => {
          if (item?.uomId) {
            return {
              productionRowId: item?.productionRowId,
              outputItemName: item?.itemName,
              outputItemQty: +item?.numQuantity,
              uomId: +item?.uomId,
              itemId: +item?.itemId,
            };
          } else {
            return {
              productionRowId: item?.productionRowId,
              outputItemName: item?.itemName,
              outputItemQty: +item?.numQuantity,
            };
          }
        });
        // console.log("objRowData: ",objRowData);
        const payload = {
          editHeader: {
            productionId: +params.id,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            plantId: values?.plantName?.value,
            actionBy: profileData?.userId,
            shiftId: values?.shift?.value,
            productionDate: values?.dteProductionDate,
          },
          editRow:
            values?.checkOutputItem === true
              ? [
                  {
                    productionRowId: values?.productionRowId,
                    outputItemName: values?.outputItemName,
                    outputItemQty: +values?.goodQty,
                  },
                  ...objRowData,
                ]
              : [
                  {
                    productionRowId: values?.productionRowId,
                    outputItemName: values?.outputItemName,
                    outputItemQty: +values?.goodQty,
                  },
                ],
        };
        // console.log("Payload =>", payload);
        editProductionEntry(payload, setDisabled);
      } else {
        const objRowData = rowData?.map((item) => {
          return {
            productionOrderId: 0,
            productionOrderCode: item.productionOrderCode,
            itemId: item.itemId,
            itemName: item.itemName,
            uomid: item?.uomid,
            uomname: item?.uomName,
            numQuantity: item?.numQuantity,
            approvedintItemId: item?.approvedItemId,
            numApprovedQuantity: item?.numApprovedQuantity,
            productionDate: _dateFormatter(values?.dteProductionDate),
          };
        });

        const payload = {
          header: {
            // dteProductionDate: values?.dteProductionDate,
            // intShiftId: values?.shift?.value,
            // productionCode: "string",
            // intAccountId: profileData?.accountId,
            // intBusinessUnitId: selectedBusinessUnit?.value,
            // intPlantId: values?.plantName?.value,
            // intItemId: values?.productionOrder?.itemId,
            // strItemName: values?.productionOrder?.itemName,
            // intShopFloorId: values?.productionOrder?.shopFloorId,
            // strShopFloorName: values?.productionOrder?.shopFloorName,
            // intWorkCenterId: values?.productionOrder?.workCenterId,
            // bomId: values?.productionOrder?.bomId,
            // strWorkCenterName: values?.productionOrder?.workCenterName,
            // intApproveBy: 0,
            // intActionBy: profileData?.userId,

            productionCode: "",
            productionDate: _dateFormatter(values?.dteProductionDate),
            shiftId: values?.shift?.value,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            billOfMaterialId: values?.bomName?.value,
            itemId: values?.itemName?.value,
            itemName: values?.itemName?.label,
            plantId: values?.plantName?.value,
            shopFloorId: values?.shopFloor?.value,
            shopFloorName: values?.shopFloor?.label,
            workCenterId: values?.workcenterName?.value,
            workCenterName: values?.workcenterName?.label,
            actionBy: profileData?.userId,
          },
          row:
            values?.checkOutputItem === true
              ? [
                  {
                    // productionOrderId: 0,
                    // productionOrderCode: "",
                    // itemId: values?.productionOrder?.itemId,
                    // approvedItemId: values?.productionOrder?.itemId,
                    // itemName: values?.productionOrder?.itemName,
                    // uomid: values?.productionOrder?.uomId,
                    // uomname: values?.productionOrder?.uomName,
                    // numQuantity: +values?.goodQty,
                    // numApprovedQuantity: 0,

                    productionOrderId: 0,
                    productionOrderCode: "string",
                    productionDate: _dateFormatter(values?.dteProductionDate),
                    itemId: values?.itemName?.value,
                    itemName: values?.itemName?.label,
                    uomid: values?.itemName?.uoMId,
                    uomname: values?.itemName?.uoMName,
                    numQuantity: +values?.goodQty,
                  },
                  ...objRowData,
                ]
              : [
                  {
                    productionOrderId: 0,
                    productionOrderCode: "string",
                    productionDate: _dateFormatter(values?.dteProductionDate),
                    itemId: values?.itemName?.value,
                    itemName: values?.itemName?.label,
                    uomid: values?.itemName?.uoMId,
                    uomname: values?.itemName?.uoMName,
                    numQuantity: +values?.goodQty,

                    // productionOrderId: values?.productionOrder?.value,
                    // productionOrderCode: values?.productionOrder?.label,
                    // itemId: values?.productionOrder?.itemId,
                    // itemName: values?.productionOrder?.itemName,
                    // uomid: values?.productionOrder?.uomId,
                    // uomname: values?.productionOrder?.uomName,
                    // numQuantity: +values?.goodQty,
                    // approvedintItemId: values?.productionOrder?.itemId,
                    // numApprovedQuantity: 0,
                  },
                ],
        };

        const isOutputZero = objRowData.every((itm) => itm?.numQuantity > 0);
        if (isOutputZero && payload?.row?.length > 0) {
          if (!values?.plantName || !values?.shift || !values?.goodQty) {
            toast.warn("All Field Required");
          } else {
            createProductionEntryForBackCalculation(
              payload,
              cb,
              setDisabled
            );
          }
        } else {
          toast.warn("Output Quantity For 'Item Name' Must Be Greater Than 0");
        }
      }
    }
  };

  const modifySingleData = {
    ...singleData,
    shopFloorDDL: {value: singleData?.header?.shopFloorId, label: singleData?.header?.shopFloorName},
    workCenterDDL: {value: singleData?.header?.workCenterId, label: singleData?.header?.workCenterName},
    itemDDL: {value: singleData?.header?.itemId, label: singleData?.header?.itemName},
    // uomDDL: {value: singleData?.header?.}
    productionDate: _dateFormatter(singleData?.dteProductionDate)
  }

  console.log('modifySingleData: ', modifySingleData)

  // useEffect(() => {
  //   console.log("Change Row Data => ", rowData);
  // }, [rowData]);

  useEffect(() => {
    getPlantNameDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlantNameDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    getShiftDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShiftDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    getSingleDataByForBackCalculation(
      params?.id,
      setSingleData,
      setRowData
    );
  }, [params?.id, profileData?.accountId, selectedBusinessUnit?.value]);

  const dataHandler = (name, value, sl) => {
    const xData = [...rowData];
    xData[sl][name] = value;
    setRowData([...xData]);
  };

  useEffect(() => {
    // console.log("Init Data => ", initData);
    if (initData?.plantId) {
      getOtherOutputItemDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        initData.plantId,
        setOthersOutputItemDDL
      );
      getOrderQuantityDDL(
        profileData?.accountId,
        selectedBusinessUnit.value,
        initData?.plantName?.value,
        initData?.productionOrder?.value,
        setGetOrderQuantity
      );
      getProductionItemQuantity(
        initData?.productionOrder?.value,
        initData?.objHeader?.itemId,
        setProductionQuantity
      );
    }
  }, [initData, profileData.accountId, selectedBusinessUnit.value]);

  return (
    <IForm
      title="Create Production Entry"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={modifySingleData}
        saveHandler={saveHandler}
        plantNameDDL={plantNameDDL}
        shiftDDL={shiftDDL}
        rowData={rowData}
        setRowData={setRowData}
        isEdit={params?.id ? true : false}
        dataHandler={dataHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        workCenterDDL={workCenterDDL}
        shopFloorDDL={shopFloorDDL}
        setShopFloorDDL={setShopFloorDDL}
        setWorkCenterDDL={setWorkCenterDDL}
        itemDDL={itemDDL}
        setItemDDL={setItemDDL}
        bomDDL={bomDDL}
        setBomDDL={setBomDDL}
        singleData={singleData}
      />
    </IForm>
  );
}
