/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  distributionChannel: "",
  area: "",
  region: "",
  reportType: { value: 1, label: "Details" },
};

export default function BrandItemRequisitionForm() {
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [isDisabled, setIsDisabled] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, setRowData] = useState([]);
  const [itemCategoryDDL, getItemCategoryDDL] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [UOMDDL, getUOMDDL] = useAxiosGet();

  const commonGridFunc = (values, _pageNo = pageNo, _pageSize = pageSize) => {};

  useEffect(() => {
    getItemCategoryDDL(
      `/item/ItemCategoryGL/GetItemCategoryDDLForConfig?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    getUOMDDL(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
  }, [accId, buId]);

  const getItemsByCategory = (values) => {
    const categoryId = values?.itemCategory?.value;
    getItemDDL(
      `wms/ItemPlantWarehouse/ItemByCategoryDDL?CategoryId=${categoryId}`
    );
  };

  const saveHandler = async (values) => {
    const payload = {
      brandRequestId: 0,
      brandRequestCode: "string",
      reffNo: "string",
      brandRequestTypeId: 0,
      brandRequestTypeName: "string",
      accountId: 0,
      accountName: "string",
      businessUnitId: 0,
      businessUnitName: "string",
      sbuid: 0,
      sbuname: "string",
      areaId: 0,
      areaName: "string",
      brandWarehouseId: 0,
      brandWarehouseName: "string",
      deliveryAddress: "string",
      supplyingWarehouseName: "string",
      supplyingWarehouseId: 0,
      requestDate: "2023-10-23T11:10:20.273Z",
      actionBy: 0,
      costControlingUnitId: 0,
      costControlingUnit: "string",
      costCenterId: 0,
      costCenter: "string",
      costElementId: 0,
      costElement: "string",
      purpose: "string",
      requiredDate: "2023-10-23T11:10:20.273Z",
      itemCategoryId: 0,
      brandItemRows: [{}],
    };
  };

  const addRow = (values) => {
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
      territoryId: values?.territory?.value,
    };
    setRowData([...rowData, newRow]);
  };

  const removeRow = (index) => {
    setRowData(rowData?.filter((_, i) => i !== index));
  };

  return (
    <>
      {isDisabled && <Loading />}
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
