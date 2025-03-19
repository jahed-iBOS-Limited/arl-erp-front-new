/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import Form from "./form";
import { getTargetEntryData } from "../helper";
import { monthDDL } from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import { toast } from "react-toastify";

const initData = {
  type: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  zone: "",
  month: "",
  year: "",
  item: "",
};

export default function ManpowerSalesTargetForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const { id, type } = useParams();
  const [objProps] = useState({});
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, postData, isLoading] = useAxiosPost();
  const [itemList, getItemList] = useAxiosGet();
  const [salesOrgs, getSalesOrgs] = useAxiosGet();
  const [TSOList, getTSOList] = useAxiosGet();

  useEffect(() => {
    getSalesOrgs(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
  }, [accId, buId]);

  const getItems = (values) => {
    getItemList(
      `/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${values?.channel?.value}&SalesOrgId=${values?.salesOrg?.value}
    `
    );
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return { ...item, isSelected: value };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.filter((item) => item?.isSelected)?.length ===
      rowData?.length && rowData?.length > 0
      ? true
      : false;
  };

  const rowDataChange = (index, key, value) => {
    const newRow = [...rowData];
    newRow[index][key] = value;
    setRowData(newRow);
  };

  const rowDataSet = (values) => {
    if (buId === 144 && [1].includes(values?.type?.value)) {
      setRowData(
        TSOList?.map((item) => ({
          ...item,
          isSelected: false,
          chiniguraQty: "",
          nonChiniguraQty: "",
        }))
      );
    } else if ([1, 2, 3].includes(values?.type?.value)) {
      getTargetEntryData(
        buId,
        [1, 3]?.includes(values?.type?.value) ? 8 : 6,
        values?.channel?.value,
        setRowData,
        setLoading,
        values?.area?.value
      );
    } else if ([4].includes(values?.type?.value)) {
      setRowData(
        shipPointDDL?.map((item) => ({
          ...item,
          isSelected: false,
          targetQty: "",
        }))
      );
    } else if ([5].includes(values?.type?.value)) {
      setRowData(
        monthDDL?.map((item) => ({
          ...item,
          isSelected: false,
          rate: "",
        }))
      );
    }
  };

  const saveHandler = (values, cb) => {
    if (!id) {
      const selectedItems = rowData?.filter((e) => e?.isSelected);
      if (selectedItems?.length < 1) {
        return toast.warn("Please select at least one row!");
      }
      const payloadForAEL = [];

      if (buId === 144 && [1].includes(values?.type?.value)) {
        for (let i = 0; i < selectedItems.length; i++) {
          const item = selectedItems[i];
          for (let index = 1; index < 3; index++) {
            const newRow = {
              intId: 0,
              accountId: accId,
              businessUnitId: buId,
              targetMonthId: values?.month?.value,
              targetYearId: values?.year?.value,
              channelId: values?.channel?.value,
              channelName: values?.channel?.label,
              setupPKId: item?.zoneId,
              setupPkName: item?.zoneName,
              // setupPKId: values?.zone?.value,
              // setupPkName: values?.zone?.label,
              territoryTypeId: item?.territoryTypeId,
              territoryTypeName: item?.territoryTypeName,
              employeeEnroll: item?.employeeId,
              targeQnt:
                index === 1
                  ? +item?.chiniguraQty
                  : index === 2
                  ? +item?.nonChiniguraQty
                  : 0,
              targeAmount: 0,
              actionBy: userId,
              typeId: values?.type?.value,
              entryTypeName: values?.type?.label,
              targetItemGroupId: index,
              areaId: item?.areaId,
              territoryId: item?.territoryId,
            };

            payloadForAEL.push(newRow);
          }
        }
      }

      const payloadOne =
        buId === 144
          ? payloadForAEL
          : selectedItems.map((item) => {
              return {
                intId: 0,
                accountId: accId,
                businessUnitId: buId,
                targetMonthId: values?.month?.value,
                targetYearId: values?.year?.value,
                channelId: values?.channel?.value,
                channelName: values?.channel?.label,
                setupPKId: item?.zoneId,
                setupPkName: item?.zoneName,
                // setupPKId: values?.zone?.value,
                // setupPkName: values?.zone?.label,
                territoryTypeId: 74,
                territoryTypeName: "Point",
                employeeEnroll: item?.employeeId,
                targeQnt: +item?.targetQty,
                targeAmount: 0,
                actionBy: userId,
                typeId: values?.type?.value,
                entryTypeName: values?.type?.label,
              };
            });

      const payloadTwo = selectedItems.map((item) => {
        return {
          intId: 0,
          accountId: accId,
          businessUnitId: buId,
          targetMonthId: [4].includes(values?.type?.value)
            ? values?.month?.value
            : item?.value,
          targetYearId: values?.year?.value,
          channelId: 0,
          setupPKId: 0,
          setupPkName: "",
          channelName: "",
          territoryTypeId: 0,
          territoryTypeName: "",
          employeeEnroll: 0,
          targeQnt: [4].includes(values?.type?.value)
            ? +item?.targetQty
            : +item?.rate,
          targeAmount: 0,
          actionBy: userId,
          typeId: values?.type?.value || 0,
          entryTypeName: values?.type?.label || "",
          shippingPointId: item?.value || 0,
        };
      });

      const payload = [1, 2, 3].includes(values?.type?.value)
        ? payloadOne
        : payloadTwo;

      const URL = [1, 2, 3].includes(values?.type?.value)
        ? `/oms/Complains/CreateManPowerSalesTarget`
        : `/oms/Complains/CreateGhatTargetEntry`;

      postData(
        URL,
        payload,
        () => {
          cb();
        },
        true
      );
    }
  };

  return (
    <>
      {(loading || isLoading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          buId={buId}
          accId={accId}
          viewType={type}
          TSOList={TSOList}
          rowData={rowData}
          getItems={getItems}
          itemList={itemList}
          initData={initData}
          salesOrgs={salesOrgs}
          allSelect={allSelect}
          rowDataSet={rowDataSet}
          setRowData={setRowData}
          getTSOList={getTSOList}
          selectedAll={selectedAll}
          saveHandler={saveHandler}
          rowDataChange={rowDataChange}
        />
      </div>
    </>
  );
}
