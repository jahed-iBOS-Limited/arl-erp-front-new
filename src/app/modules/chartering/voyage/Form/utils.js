import { toast } from "react-toastify";
import { _todayDate } from "../../_chartinghelper/_todayDate";

export const addCargo = (values, setFieldValue, cargoList, setCargoList) => {
  if (!values?.cargoName?.value) {
    toast.warn("Please select a cargo");
    return;
  }

  // if (cargoList?.find((item) => item?.cargoId === values?.cargoName?.value)) {
  //   toast.warn("Item already added");
  //   return;
  // } else
  // {
  const newItem = {
    chartererId: values?.charterName?.value,
    cargoId: values?.cargoName?.value,
    cargoName: values?.cargoName?.label,
    cargoQty: "",
    freightRate: "",
    totalFreight: "",
    cargoLoadPortId: values?.startPort?.value,
    cargoLoadPortName: values?.startPort?.label,
    cargoDischargePortId: values?.endPort?.value,
    cargoDischargePortName: values?.endPort?.label,
  };
  setCargoList([...cargoList, newItem]);
  // setFieldValue("cargoName", "");
  // }
};

export const cargoRowDataHandler = (
  key,
  value,
  index,
  cargoList,
  setCargoList
) => {
  let newItemList = [...cargoList];
  newItemList[index][key] = +value;
  const freightValue =
    key === "freightRate"
      ? value * (+newItemList[index]["cargoQty"] || 0)
      : value * (+newItemList[index]["freightRate"] || 0);
  newItemList[index]["totalFreight"] = +freightValue;

  setCargoList(newItemList);
};

export const removeCargo = (
  index,
  values,
  setFieldValue,
  cargoList,
  setCargoList
) => {
  setCargoList(cargoList.filter((_, i) => i !== index));
};

export const removeCharterer = (
  index,
  chartererRowData,
  setChartererRowData
) => {
  setChartererRowData(chartererRowData.filter((_, i) => i !== index));
};

export const addCharterer = (
  values,
  cargoList,
  chartererRowData,
  setChartererRowData,
  setCargoList,
  uploadedFile,
  setCPList,
  cpList
) => {
  if (cargoList?.length === 0) {
    toast.warning("Please Add at least one cargo", { toastId: 1245 });
    return;
  }

  if (cargoList?.filter((e) => e?.cargoQty < 1 || e?.freightRate < 1)?.length) {
    toast.warn("Please fill up all cargo info");
    return;
  }

  let duplicateCheck = chartererRowData.some(
    (obj) => obj?.charterId === values.charterName?.value
  );

  if (duplicateCheck) {
    toast.warning("Charterer Already exists", { toastId: 124 });
    return;
  }

  if (!values?.demurrageRate) {
    toast.warning("Demurrage/Detention Rate is required", { toastId: 2124 });
    return;
  }

  /* Total Cargo Qty */
  let totalvalue = cargoList
    ? cargoList?.reduce((acc, obj) => acc + +obj?.totalFreight, 0)
    : 0;

  const payload = {
    charterId: values?.charterName?.value,
    charterName: values?.charterName?.label,
    cpDate: values?.cpDate,
    loadPortId: values?.startPort?.value,
    layCanFrom: values?.layCanFrom,
    layCanTo: values?.layCanTo,
    loadPortName: values?.startPort?.label,
    dischargePortId: values?.endPort?.value,
    dischargePortName: values?.endPort?.label,
    brokerId: values?.brokerName?.value,
    brokerName: values?.brokerName?.label,
    brokerCommission: parseFloat(values?.brokerCommission) || 0,
    addressCommission: parseFloat(values?.addressCommission) || 0,
    totalCargoAmount: totalvalue || 0,
    demurrageRate: +values?.demurrageRate || 0,
    dispatchRate: +values?.despatchRate || 0,
    deadFreight: +values?.deadFreightDetention || 0,
    lsmgoPrice: +values?.lsmgoPrice || 0,
    lsifoPrice: +values?.lsifoPrice || 0,
    iloch: +values?.iloch || 0,
    cveday: +values?.cve30Days || 0,
    dailyHire: +values?.dailyHire || 0,
    apamount: +values?.ap || 0,
    totalHireAmount: +values?.totalAmount || 0,
    othersAmount: +values?.others || 0,
    // new two fields
    freightPercentage: parseFloat(values?.freightPercentage) || 0,
    detention: +values?.detention || 0,
    objCargoList: cargoList || [],
    // attachment: uploadedFile[0]?.id || "",
  };

  const newCP = {
    cpClauseId: 0,
    voyageId: 0,
    chartererId: values?.charterName?.value,
    attachment: uploadedFile[0]?.id || "",
    isActive: true,
  };

  setCPList([...cpList, newCP]);

  setChartererRowData([...chartererRowData, payload]);
  setCargoList([]);
};

export const timeChartererSavePayloadMaker = (
  values,
  chartererRowData,
  businessPartnerGrid,
  profileData,
  selectedBusinessUnit,
  uploadedFile
) => {
  const payload = {
    objHeader: {
      vesselId: values?.vesselName?.value,
      vesselName: values?.vesselName?.label,
      voyageTypeId: values?.voyageType?.value,
      fromCharterer: false, // Unknown
      chartererVoyageId: 0, // Unknown
      chartererVoyageCode: "", // Unknown
      voyageTypeName: values?.voyageType?.label,
      voyageNo: +values?.currentVoyageNo || 0,
      voyageStartDate: values?.startDate,
      voyageEndDate: values?.completionDate,
      voyageDurrition: values?.voyageDuration,
      hireTypeId: values?.hireType?.value,
      cpDate: values?.cpDate,
      hireTypeName: values?.hireType?.label,
      chaterId: values?.charterName?.value,
      chaterName: values?.charterName?.label,
      startPortId: values?.startPort?.value,
      startPortName: values?.startPort?.label,
      endPortId: values?.endPort?.value,
      endPortName: values?.endPort?.label,
      layCanFrom: values?.layCanFrom || "",
      layCanTo: values?.layCanTo || "",
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      insertby: profileData?.userId,
    },
    objRow: [
      {
        charterId: values?.charterName?.value,
        charterName: values?.charterName?.label,
        cpDate: values?.cpDate,
        layCanFrom: values?.layCanFrom || "",
        layCanTo: values?.layCanTo || "",
        loadPortId: values?.startPort?.value,
        loadPortName: values?.startPort?.label,
        dischargePortId: values?.endPort?.value,
        dischargePortName: values?.endPort?.label,
        brokerId: values?.brokerName?.value,
        brokerName: values?.brokerName?.label,
        brokerCommission: parseFloat(values?.brokerCommission) || 0,
        addressCommission: parseFloat(values?.addressCommission) || 0,
        totalCargoAmount: 0, // There are no cargo list in voyage charterer
        demurrageRate: +values?.demurrageRate || 0,
        dispatchRate: +values?.despatchRate || 0,
        deadFreight: +values?.deadFreightDetention || 0,
        lsmgoPrice: +values?.lsmgoPrice || 0,
        lsifoPrice: +values?.lsifoPrice || 0,
        iloch: +values?.iloch || 0,
        cveday: +values?.cve30Days || 0,
        dailyHire: +values?.dailyHire || 0,
        apamount: +values?.ap || 0,
        totalHireAmount: +values?.totalAmount || 0,
        othersAmount: +values?.others || 0,
        // new two fields
        freightPercentage: parseFloat(values?.freightPercentage) || 0,
        detention: +values?.detention || 0,
        // objCargoList: cargoList || [],
        deliveryDateTime: values?.deliveryDate,
        reDeliveryDateTime: values?.reDeliveryDate,
        attachment: uploadedFile[0]?.id,
      },
    ],
    objStakeHolder: businessPartnerGrid || [],
    objCharterCp: [
      {
        cpClauseId: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        voyageId: 0,
        chartererId: values?.charterName?.value,
        attachment: uploadedFile[0]?.id || "",
        isActive: true,
        // "actionBy": 0,
        // "dteLastActionDateTime": "2022-04-03T05:09:36.404Z",
        // "dteServerDatetime": "2022-04-03T05:09:36.404Z"
      },
    ],
  };

  return payload;
};

export const voyageChartererSavePayloadMaker = (
  values,
  chartererRowData,
  businessPartnerGrid,
  profileData,
  selectedBusinessUnit,
  cpList
) => {
  const payload = {
    objHeader: {
      vesselId: values?.vesselName?.value,
      vesselName: values?.vesselName?.label,
      voyageTypeId: values?.voyageType?.value,
      fromCharterer: false, // Unknown
      chartererVoyageId: 0, // Unknown
      chartererVoyageCode: "", // Unknown
      voyageTypeName: values?.voyageType?.label,
      voyageNo: +values?.currentVoyageNo || 0,
      voyageStartDate: values?.startDate,
      voyageEndDate: values?.completionDate,
      voyageDurrition: values?.voyageDuration,
      hireTypeId: values?.hireType?.value,
      cpDate: values?.cpDate,
      hireTypeName: values?.hireType?.label,
      chaterId: values?.charterName?.value,
      chaterName: values?.charterName?.label,
      startPortId: values?.startPort?.value,
      startPortName: values?.startPort?.label,
      endPortId: values?.endPort?.value,
      endPortName: values?.endPort?.label,
      layCanFrom: values?.layCanFrom,
      layCanTo: values?.layCanTo,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      insertby: profileData?.userId,
    },
    objRow: chartererRowData || [],
    objStakeHolder: businessPartnerGrid || [],
    objCharterCp:
      cpList?.map((item) => ({
        ...item,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
      })) || [],
  };

  return payload;
};

export const voyageChartererEditPayloadMaker = (
  id,
  values,
  chartererRowData,
  businessPartnerGrid,
  profileData,
  selectedBusinessUnit
) => {
  const payload = {
    objHeader: {
      voyageId: id,
      vesselId: values?.vesselName?.value,
      vesselName: values?.vesselName?.label,
      voyageTypeId: values?.voyageType?.value,
      fromCharterer: false, // Unknown
      chartererVoyageId: 0, // Unknown
      chartererVoyageCode: "", // Unknown
      voyageTypeName: values?.voyageType?.label,
      voyageNo: +values?.currentVoyageNo || 0,
      voyageStartDate: values?.startDate,
      voyageEndDate: values?.completionDate,
      voyageDurrition: values?.voyageDuration,
      hireTypeId: values?.hireType?.value,
      cpDate: values?.cpDate,
      hireTypeName: values?.hireType?.label,
      chaterId: values?.charterName?.value,
      chaterName: values?.charterName?.label,
      startPortId: values?.startPort?.value,
      startPortName: values?.startPort?.label,
      endPortId: values?.endPort?.value,
      endPortName: values?.endPort?.label,
      layCanFrom: values?.layCanFrom,
      layCanTo: values?.layCanTo,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      insertby: profileData?.userId,
    },
    objRow: chartererRowData || [],
    objStakeHolder: businessPartnerGrid || [],
  };

  return payload;
};

export const timeChartererEditPayloadMaker = (
  id,
  values,
  chartererRowData,
  businessPartnerGrid,
  profileData,
  selectedBusinessUnit,
  uploadedFile
) => {
  const payload = {
    objHeader: {
      voyageId: id,
      voyageTypeId: values?.voyageType?.value,
      voyageTypeName: values?.voyageType?.label,
      voyageNo: +values?.currentVoyageNo || 0,
      voyageStartDate: values?.startDate,
      voyageEndDate: values?.completionDate,
      voyageDurrition: values?.voyageDuration,
      hireTypeId: values?.hireType?.value,
      cpDate: values?.cpDate,
      hireTypeName: values?.hireType?.label,
      chaterId: values?.charterName?.value,
      chaterName: values?.charterName?.label,
      startPortId: values?.startPort?.value,
      startPortName: values?.startPort?.label,
      endPortId: values?.endPort?.value,
      endPortName: values?.endPort?.label,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      layCan: "",
      insertby: profileData?.userId,
      layCanFrom: values?.layCanFrom || "",
      layCanTo: values?.layCanTo || "",
    },
    objRow: {
      voyageRowId: chartererRowData[0]?.voyageRowId,
      voyageId: chartererRowData[0]?.voyageId,
      charterId: values?.charterName?.value,
      charterName: values?.charterName?.label,
      cpDate: values?.cpDate,
      loadPortId: values?.startPort?.value,
      loadPortName: values?.startPort?.label,
      dischargePortId: values?.endPort?.value,
      dischargePortName: values?.endPort?.label,
      layCan: "",
      othersAmount: +values?.others,
      brokerId: values?.brokerName?.value,
      brokerName: values?.brokerName?.label,
      brokerCommission: +values?.brokerCommission || 0,
      addressCommission: +values?.addressCommission || 0,
      totalCargoAmount: 0,
      demurrageRate: +values?.demurrageRate || 0,
      dispatchRate: +values?.despatchRate || 0,
      deadFreight: +values?.deadFreightDetention || 0,
      lsmgoPrice: +values?.lsmgoPrice || 0,
      lsifoPrice: +values?.lsifoPrice || 0,
      iloch: +values?.iloch || 0,
      cveday: +values?.cve30Days || 0,
      dailyHire: +values?.dailyHire || 0,
      apamount: +values?.ap || 0,
      totalHireAmount: +values?.totalAmount || 0,
      layCanFrom: _todayDate(),
      layCanTo: _todayDate(),
      // layCanFrom: values?.layCanFrom || "",
      // layCanTo: values?.layCanTo || "",
      // new two fields
      freightPercentage: parseFloat(values?.freightPercentage) || 0,
      detention: +values?.detention || 0,

      deliveryDateTime: values?.deliveryDate,
      reDeliveryDateTime: values?.reDeliveryDate,
      attachment: uploadedFile[0]?.id,
    },
    objStack: businessPartnerGrid || [],
  };

  return payload;
};

// Previous Data maker
export const previousDataMaker = (values, resData) => {
  const preData = {
    vesselName: {
      value: values?.vesselName?.value,
      label: values?.vesselName?.label,
      ownerName: values?.vesselName?.ownerName,
      ownerId: values?.vesselName?.ownerId,
    },
    voyageNo: { value: resData?.voyageId, label: resData?.voyageNo },
    voyageType: {
      value: values?.voyageType?.value,
      label: values?.voyageType?.label,
    },
    shipType: {
      value: values?.hireType?.value,
      label: values?.hireType?.label,
    },
    lsmgoRate: +values?.lsmgoPrice || 0,
    lsfo1Rate: +values?.lsifoPrice || 0,
    lsfo2Rate: +values?.lsifoPrice || 0,
    voyageDuration: values?.voyageDuration,
    cve30Days: +values?.cve30Days || 0,
    dailyHire: +values?.dailyHire || 0,
    addressCommission: +values?.addressCommission || 0,
    brokerCommission: +values?.brokerCommission || 0,
  };
  return preData;
};
