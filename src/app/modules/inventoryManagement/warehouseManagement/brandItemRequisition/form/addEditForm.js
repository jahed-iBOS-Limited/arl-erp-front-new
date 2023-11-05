/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { useParams } from "react-router-dom";

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
  const { id, type } = useParams();
  const [singleData, getSingleData, loading, setSingleData] = useAxiosGet();

  useEffect(() => {
    getItemCategoryDDL(
      `/wms/ItemPlantWarehouse/GetItemCategoryDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    getUOMDDL(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (type === "edit") {
      getSingleData(
        `/wms/ItemRequest/GetBrandItemRequestById?id=${id}`,
        (resData) => {
          setRowData(resData?.brandItemRows);

          const modifyData = {
            ...resData,
            programType: {
              value: resData?.brandRequestTypeId,
              label: resData?.brandRequestTypeName,
            },
            requiredDate: resData?.requiredDate,
            purpose: resData?.purpose,
          };
          setSingleData(modifyData);
        }
      );
    }
  }, [accId, buId]);

  const getItemsByCategory = (values) => {
    const categoryId = values?.itemCategory?.value;
    getItemDDL(
      `/wms/ItemPlantWarehouse/ItemByCategoryDDL?CategoryId=${categoryId}`
    );
  };

  const saveHandler = async (values, cb) => {
    if (rowData?.length < 1) {
      return toast.warn("Pleas add least one row!");
    }
    const payload = {
      brandRequestId: type === "edit" ? id : 0,
      brandRequestCode: singleData?.brandRequestCode || "",
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

  const isLoading = loader || loading;

  const title =
    type === "edit"
      ? "Edit Brand Item Requisition"
      : type === "view"
      ? "View Brand Item Requisition"
      : "Brand Item Requisition Entry";

  return (
    <>
      {isLoading && <Loading />}
      <Form
        type={type}
        title={title}
        UOMDDL={UOMDDL}
        addRow={addRow}
        rowData={rowData}
        itemDDL={itemDDL}
        removeRow={removeRow}
        saveHandler={saveHandler}
        itemCategoryDDL={itemCategoryDDL}
        initData={id ? singleData : initData}
        getItemsByCategory={getItemsByCategory}
      />
    </>
  );
}
