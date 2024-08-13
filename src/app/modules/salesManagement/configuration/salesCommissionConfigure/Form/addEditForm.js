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
  fromAchievement: "",
  toAchievement: "",
  fromQuantity: "",
  toQuantity: "",
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
    profileData: { userId, userName },
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

  const getAreas = (values, cb) => {
    const commissionTypeId = values?.commissionType?.value;
    const channelId = values?.channel?.value;
    const regionId = values?.region?.value;
    // const areaId = values?.area?.value;
    // const territoryId = values?.territory?.value;

    const region = regionId ? `&regionId=${regionId}` : "";
    // const area = areaId ? `&areaId=${areaId}` : "";
    // const territory = territoryId ? `&TerritoryId=${territoryId}` : "";

    const commonRate = values?.commonRate || "";

    if ([14, 16, 20, 23].includes(commissionTypeId)) {
      const newArray = [];
      let currentDate = new Date(values?.fromDate);
      let endDate = new Date(values?.toDate);

      while (currentDate <= endDate) {
        const commissionDate = _dateFormatter(currentDate);
        const newRow = {
          value: values?.area?.value,
          label: values?.area?.label,
          areaId: values?.area?.value,
          areaName: values?.area?.label,
          commissionDate: commissionDate,
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
    } else if ([17, 18, 25, 27].includes(commissionTypeId)) {
      const newRow = {
        value: values?.area?.value,
        label: values?.area?.label,
        areaId: values?.area?.value,
        areaName: values?.area?.label,
        commissionDate: "",
        commissionRate: "",
        salesQty: "",
        ratePerBag: "",
        bpcommissionRate: commonRate,
        bacommissionRate: commonRate,
        cpcommissionRate: commonRate,
        firstSlabCommissionRate: "",
        secondSlabCommissionRate: "",
        thirdSlabCommissionRate: "",

        offerQntFrom: +values?.fromQuantity,
        offerQntTo: +values?.toQuantity,
        achievementFrom: +values?.fromAchievement,
        achievementTo: +values?.toAchievement,
      };
      setRowData([...rowData, newRow]);
      cb && cb();
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
    const commissionTypeId = values?.commissionType?.value;
    const selectedItems = rowData?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }

    const payload = selectedItems?.map((item) => {
      const date = new Date(item?.commissionDate);
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
        actionBy: userId,

        sl: 0,

        areaName: item?.areaName,

        actionName: userName,
        commissionDayId: date?.getDate(),
        commissionMonthId: date?.getMonth() + 1,
        commissionYearId: date?.getFullYear(),
      };
    });

    const commonURL = `/oms/CustomerSalesTarget/SavePartySalesCommissionConfiguration`;

    const additionalLiftingURL = `/oms/CustomerSalesTarget/CreatePartySalesCommissionDaybyDayBase`;

    const URL = commissionTypeId === 16 ? additionalLiftingURL : commonURL;

    postData(
      URL,
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
