/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  programType: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  itemCategory: "",
  item: "",
  uom: "",
  requiredDate: "",
  quantity: "",
  description: "",
  purpose: "",
};

export default function BrandItemRequisitionForm() {
  const {
    profileData: { accountId: accId, accountName: accName, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [rowData, setRowData] = useState([]);
  const [itemCategoryDDL, getItemCategoryDDL] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [UOMDDL, getUOMDDL] = useAxiosGet();
  const [, postData, loader] = useAxiosPost();

  useEffect(() => {
    getItemCategoryDDL(
      `/wms/ItemPlantWarehouse/GetItemCategoryDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    getUOMDDL(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
  }, [accId, buId]);

  const getItemsByCategory = (values) => {
    const categoryId = values?.itemCategory?.value;
    getItemDDL(
      `/wms/ItemPlantWarehouse/ItemByCategoryDDL?CategoryId=${categoryId}`
    );
  };

  const saveHandler = async (values, cb) => {
    const payload = {
      brandRequestId: 0,
      brandRequestCode: "",
      reffNo: "",
      brandRequestTypeId: values?.programType?.value,
      brandRequestTypeName: values?.programType?.label,
      accountId: accId,
      accountName: accName,
      businessUnitId: buId,
      businessUnitName: buName,
      sbuid: 0,
      sbuname: "",
      areaId: values?.area?.value,
      areaName: values?.area?.label,
      brandWarehouseId: 0,
      brandWarehouseName: "",
      deliveryAddress: "",
      supplyingWarehouseName: "",
      supplyingWarehouseId: 0,
      requestDate: _todayDate(),
      actionBy: userId,
      costControlingUnitId: 0,
      costControlingUnit: "",
      costCenterId: 0,
      costCenter: "",
      costElementId: 0,
      costElement: "",
      purpose: values?.purpose,
      requiredDate: values?.requiredDate,
      itemCategoryId: values?.itemCategory?.value,
      brandItemRows: rowData,
    };
    postData(
      `/wms/ItemRequest/CreateBrandItemRequest`,
      payload,
      () => {
        setRowData([]);
        cb();
      },
      true
    );
  };

  const addRow = (values) => {
    const exist = rowData?.find((item) => item?.itemId === values?.item?.value);
    if (exist) {
      return toast.warn("Duplicate item not allowed!");
    }
    const newRow = {
      // rowId: 0,
      // brandRequestId: 0,
      itemId: values?.item?.value,
      itemName: values?.item?.label,
      itemCode: values?.item?.code,
      uoMid: values?.uom?.value,
      uoMname: values?.uom?.label,
      requestQuantity: values?.quantity,
      remarks: values?.description,
      // restQuantity: 0,
      channelId: values?.channel?.value,
      channelName: values?.channel?.label,
      territoryId: values?.territory?.value,
      territoryName: values?.territory?.label,
    };
    setRowData([...rowData, newRow]);
  };

  const removeRow = (index) => {
    setRowData(rowData?.filter((_, i) => i !== index));
  };

  return (
    <>
      {loader && <Loading />}
      <Form
        initData={initData}
        saveHandler={saveHandler}
        rowData={rowData}
        itemCategoryDDL={itemCategoryDDL}
        getItemsByCategory={getItemsByCategory}
        itemDDL={itemDDL}
        UOMDDL={UOMDDL}
        addRow={addRow}
        removeRow={removeRow}
      />
    </>
  );
}
