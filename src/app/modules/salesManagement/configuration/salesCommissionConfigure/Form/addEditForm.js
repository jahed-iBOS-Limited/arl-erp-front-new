/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading.js";
import { _todayDate } from "../../../../_helper/_todayDate.js";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet.js";
import Form from "./form.js";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost.js";
import { _dateFormatter } from "../../../../_helper/_dateFormate.js";

const initData = {
  commissionType: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  channel: "",
  region: "",
  commonRate: "",
};

export default function SalesCommissionConfigureEntryForm() {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [rowData, getAreaList, loader, setRowData] = useAxiosGet();
  const [, postData, saveLoader] = useAxiosPost();
  const [
    commissionTypes,
    getCommissionTypes,
    ,
    setCommissionTypes,
  ] = useAxiosGet();

  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getCommissionTypes(
      `/wms/WmsReport/GetCommissionTypeDDL?businessUnitId=${buId}`,
      (resData) => {
        setCommissionTypes(resData?.data);
      }
    );
  }, [buId]);

  const getAreas = (values) => {
    const commissionTypeId = values?.commissionType?.value;
    const channelId = values?.channel?.value;
    const regionId = values?.region?.value;
    // const areaId = values?.area?.value;
    // const territoryId = values?.territory?.value;

    const region = regionId ? `&regionId=${regionId}` : "";
    // const area = areaId ? `&areaId=${areaId}` : "";
    // const territory = territoryId ? `&TerritoryId=${territoryId}` : "";

    const commonRate = values?.commonRate || "";

    if (commissionTypeId === 16) {
      const newArray = [];
      let currentDate = new Date(values?.fromDate);
      let endDate = new Date(values?.toDate);

      while (currentDate <= endDate) {
        const newRow = {
          value: values?.area?.value,
          label: values?.area?.label,
          areaId: values?.area?.value,
          areaName: values?.area?.label,
          commissionDate: _dateFormatter(currentDate),
          commissionRate: "",
          salesQty: "",
          ratePerBag: "",
          bpcommissionRate: commonRate,
          bacommissionRate: commonRate,
          cpcommissionRate: commonRate,
          firstSlabCommissionRate: commonRate,
          secondSlabCommissionRate: commonRate,
          thirdSlabCommissionRate: commonRate,
        };

        newArray.push(newRow);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setRowData(newArray);
    } else {
      getAreaList(
        `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}${region}`,
        (resData) => {
          const modifyData = resData?.map((item) => ({
            ...item,
            value: item["areaId"],
            label: item["areaName"],

            commissionRate: "",
            salesQty: "",
            ratePerBag: "",
            bpcommissionRate: commonRate,
            bacommissionRate: commonRate,
            cpcommissionRate: commonRate,
            firstSlabCommissionRate: commonRate,
            secondSlabCommissionRate: commonRate,
            thirdSlabCommissionRate: commonRate,
          }));

          setRowData(modifyData);
        }
      );
    }
  };

  const saveData = async (values, cb) => {
    const selectedItems = rowData?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }

    const payload = selectedItems?.map((item) => {
      return {
        ...item,
        autoId: 0,
        businessUnitId: buId,
        fromDateTime: values?.fromDate,
        toDateTime: values?.toDate,
        commissionDate: item?.commissionDate || _todayDate(),
        levelId: 0,
        channelId: values?.channel?.value,
        regionId: values?.region?.value,
        areaId: item?.areaId,
        territoryId: 0,
        commissionTypeId: values?.commissionType?.value,
        commissiontTypeName: values?.commissionType?.label,
        commissionRate: 0,
        bpcommissionRate: +item?.bpcommissionRate || 0,
        bacommissionRate: +item?.bacommissionRate || 0,
        cpcommissionRate: +item?.cpcommissionRate || 0,
        firstSlabCommissionRate: +item?.firstSlabCommissionRate || 0,
        secondSlabCommissionRate: +item?.secondSlabCommissionRate || 0,
        thirdSlabCommissionRate: +item?.thirdSlabCommissionRate || 0,
      };
    });

    postData(
      `/oms/CustomerSalesTarget/SavePartySalesCommissionConfiguration`,
      payload,
      () => {
        cb();
      },
      true
    );
  };

  const isLoading = loading || loader || saveLoader;

  return (
    <>
      {isLoading && <Loading />}
      <Form
        initData={initData}
        saveData={saveData}
        isEdit={params?.id || false}
        id={params?.id}
        getAreas={getAreas}
        setLoading={setLoading}
        rowData={rowData}
        setRowData={setRowData}
        commissionTypes={commissionTypes}
      />
    </>
  );
}
