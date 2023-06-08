/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loading from "./../../../../_helper/_loading";
import { createReceiveFromShopFloor, getRefferenceCode_api } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import { isUniq } from "../../../../_helper/uniqChecker";

const initData = {
  transactionDate: _todayDate(""),
  referenceType: "",
  referenceCode: "",
  receiveFrom: "",
  transferTo: "",
  item: "",
  qty: "",
  checkbox: false,
};

export default function ReceiveFromShopFloorCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState("");
  const location = useLocation();
  const params = useParams();
  const [itemDDL, setItemDDL] = useState([]);
  const [referrenceCodeDDL, setRefferenceCodeDDL] = useState([]);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const receiveFromShopFloorInitData = useSelector(
    (state) => state.localStorage.receiveFromShopFloorInitData
  );

  useEffect(() => {
    getRefferenceCode_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      receiveFromShopFloorInitData?.warehouse?.value,
      setRefferenceCodeDDL
    );
  }, [location]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (params?.id) {
        // edit payload
      } else {
        if (rowDto?.length > 0) {
          // obj row for bank receipt and bank payment
          let objRow = rowDto?.map((item) => ({
            itemId: +item?.item?.value,
            itemName: item?.item?.label,
            itemCode: item?.item?.itemCode,
            uomId: +item?.item?.uomId,
            uomName: item?.item?.uom,
            transactionQuantity: +item?.item?.transferQty,
            transactionRate: +item?.item?.transactionRate,
            transactionValue: +item?.item?.transactionValue,
            inventoryLocationId: +item?.item?.locationId,
            inventoryLocationName: item?.item?.location,
            binNumber: item?.item?.binNumber || "",
          }));
          const payload = {
            accountId: +profileData?.accountId,
            accountName: profileData?.accountName,
            businessUnitId: +selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            warehouseId: +receiveFromShopFloorInitData?.warehouse?.value,
            warehouseName: receiveFromShopFloorInitData?.warehouse?.label,
            plantId: +receiveFromShopFloorInitData?.plant?.value,
            plantName: receiveFromShopFloorInitData?.plant?.label,
            transactionDate: values?.transactionDate,
            sbuId: +receiveFromShopFloorInitData?.sbu?.value,
            sbuName: receiveFromShopFloorInitData?.sbu?.label,
            actionBy: profileData?.userId,
            shopFloorInventoryTransactionId: +values?.referenceCode?.value,
            shopFloorInventoryTransactionCode: values?.referenceCode?.label,
            shopFloorRow: objRow,
          };

          createReceiveFromShopFloor(payload, cb, setDisabled);
        } else {
          toast.warn("Please select at least one item with quantity");
        }
      }
    }
  };

  const setter = (values) => {
    if (values?.checkbox) {
      const payload = itemDDL?.map((item) => {
        return {
          item: item,
        };
      });
      setRowDto(payload);
    } else {
      if (isUniq("item", values?.item, rowDto)) {
        setRowDto([...rowDto, values]);
      }
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});
  console.log(receiveFromShopFloorInitData, "receiveFromShopFloorInitData");
  return (
    <IForm
      title={
        params?.viewId
          ? "Edit Receive From Shop Floor"
          : "Receive From Shop Floor"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={params?.viewId}
      isHiddenSave={params?.viewId}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        location={location}
        referrenceCodeDDL={referrenceCodeDDL}
        itemDDL={itemDDL}
        setItemDDL={setItemDDL}
        setRowDto={setRowDto}
        receiveFromShopFloorInitData={receiveFromShopFloorInitData}
        setRefferenceCodeDDL={setRefferenceCodeDDL}
      />
    </IForm>
  );
}
