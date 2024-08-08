import Axios from "axios";
import { toast } from "react-toastify";
import { getMonth } from "./utils";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getBusinessUnitDDL = async (setter, accId, buId) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBusinessUPartnerDDL = async (
  setter,
  accId,
  buId,
  Sbuid,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/GetBusinessPartnerSalesDDL?accountId=${accId}&businessUnitId=${buId}&SbuId=${Sbuid}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getSalesTargetPagination = async (
  setter,
  accId,
  buId,
  userId,
  buPartnerId,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/CustomerSalesTargetLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${buPartnerId ||
        31}&userId=${userId}&vieworder=desc&PageNo=1&PageSize=1000000`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.objdata);
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const createCustomerSalesTarget = async (data, setDisabled, cb) => {
  setDisabled && setDisabled(true);
  try {
    const res = await Axios.post(
      `/oms/CustomerSalesTarget/CreateCustomerSalestarget`,
      data
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      toast.success("created successfully");
      cb && cb();
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.warn(error?.response?.data?.message);
  }
};

export const getSalesTargetById = async (
  setter1,
  setter2,
  targetId,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/GetCustomerSalesTargetById?TargetId=${targetId}`
    );

    if (res.status === 200 && res?.data) {
      const { objheader, objrow } = res?.data;

      let newData = {
        targetId: objheader.targetId,
        sbuid: objheader.sbuid,
        sbu: objheader.sbuname,
        businessPartnerId: objheader.businessPartnerId,
        businessPartner: objheader.businessPartnerName,
        targetAmount: objheader.targetAmount,
        targetMonth: {
          value: objheader.targetMonth,
          label: getMonth(objheader.targetMonth),
        },
        targetYear: {
          value: objheader.targetYear,
          label: objheader.targetYear,
        },
        targetStartDate: _dateFormatter(objheader.targetStartDate),
        targetEndDate: _dateFormatter(objheader.targetEndDate),
        approval: false,
        distributionChannel: objheader.distributionChannelId
          ? {
              value: objheader.distributionChannelId,
              label: objheader.distributionChannelName,
            }
          : "",
      };

      let newRowData = [];
      objrow.forEach((item) => {
        newRowData.push({
          ...item,
          targetRowId: item?.intTargetRowId,
          itemCode: item?.itemCode,
          itemName: item?.strItemName,
          uomname: item?.strUomname,
          targetQuantity: +item?.targetQuantity,
          itemSalesRate: item?.itemSalesRate,
          amount: item?.targetAmount,
          uom: item?.intUomid,
          itemId: item?.intItemId,
          targetQty: +item?.targetQuantity || 0,
          isSelected: true,
        });
      });

      setter1(newData);
      setter2(newRowData);
    }
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
  }
};

export const getItemNameDDL = async (setter, accId, buId, itemTypeId) => {
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/GetitemDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemTypeId}`
    );
    if (res.status === 200 && res?.data) {
      let newData = res?.data.map((item) => ({
        value: item?.itemId,
        label: item?.itemName,
        itemName: item?.itemName,
        uomId: item?.uomId,
        uomName: item?.uomName,
        code: item?.itemCode,
        uomCode: item?.uomCode,
      }));
      setter(newData);
    }
  } catch (error) {}
};

export const getItemRate = async (accId, buId, partnerId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/GetItemRateByPartnerId?AccountId=${accId}&BusinessUnitId=${buId}&PartnerId=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const editCustomerSalesTarget = async (data, setDisabled) => {
  setDisabled && setDisabled(true);
  try {
    const res = await Axios.put(
      `/oms/CustomerSalesTarget/EditCustomerSalestarget`,
      data
    );
    if (res.status === 200 && data?.isApproved) {
      toast.success("Approved successfully");
      setDisabled && setDisabled(false);
      // cb();
    }
    if (res.status === 200 && !data?.isApproved) {
      toast.success("Edited successfully");
      setDisabled && setDisabled(false);
      // cb();
    }
  } catch (error) {
    setDisabled(false);
    toast.warn(error?.response?.data?.message);
  }
};

export const approveCustomerSalesTarget = async (data) => {
  try {
    const res = await Axios.put(
      `/oms/CustomerSalesTarget/CreateCustomerSalestargetApprove`,
      data
    );
    if (res.status === 200) {
      toast.success("Approved  successfully");

      // cb();
    }
  } catch (error) {}
};

export const getGeneralLedgerDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/BusinessUnitGeneralLedger/GetBUGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data?.map((itm) => {
        return {
          ...itm,
          value: itm?.generalLedgerId,
          label: itm?.generalLedgerName,
        };
      });
      setter(data);
    }
  } catch (error) {}
};
export const getBusinessUnitSalesOrgApi = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/BusinessUnitSalesOrganization/GetPartnerGroupFromSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}`
    );

    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const getItemSalesByChannelDDL = async (
  accId,
  buId,
  disChaId,
  salesOrgId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${disChaId}&SalesOrgId=${salesOrgId}
      `
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getFinancialStatementCopyFromLanding = async (
  comId,
  busId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/FinancialStatement/GetFinancialStatementLandingByCopyFromId?componentId=${comId}&BusinessUnitId=${busId}&viewOrder=desc&PageNo=1&PageSize=1000`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.data);
    }
  } catch (error) {}
};

export const getFinancialStatementMainLanding = async (busId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinancialStatement/FinancialStatementLandingPasignation?BusinessUnitId=${busId}&viewOrder=desc&PageNo=1&PageSize=1000`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.data);
    }
  } catch (error) {}
};

export const saveFinancialStatement = async (data, cb) => {
  try {
    const res = await Axios.post(
      `/fino/FinancialStatement/CreateFinancialStatement`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getFinancialStatementById = async (comId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinancialStatement/GetFinancialStatementById?ComponentId=${comId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getItemListByPartnerId_api = async (
  accId,
  buId,
  partnerId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/GetItemListByPartnerId?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getUoMitemPlantWarehouseDDL_api = async (
  accId,
  buId,
  plantId,
  itemId,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `/wms/ItemPlantWarehouse/GetUoMitemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&ItemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      setFieldValue("uom", res?.data?.[0] || "");
    }
  } catch (error) {
    setFieldValue("uom", "");
  }
};

export const getGenerateDataFormat_api = async (attachment, cb) => {
  let formData = new FormData();
  formData.append("uploadFile", attachment[0]);
  try {
    let { data } = await Axios.post(
      "/domain/GenerateDataFormat/GenerateDataFromExcel",
      formData,
      {
        headers: {
          "Content-Type": false,
        },
      }
    );
    toast.success("Upload  successfully");
    console.log(data);
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

export const getRegionAreaTerritory = async ({
  channelId,
  regionId,
  areaId,
  setter,
  setLoading,
  value,
  label,
}) => {
  setLoading(true);
  const region = regionId ? `&regionId=${regionId}` : "";
  const area = areaId ? `&areaId=${areaId}` : "";
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}${region}${area}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        value: item[value],
        label: item[label],
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetSalesTargetEntry = async (
  accId,
  buId,
  values,
  setter,
  setLoading
) => {
  const channelId = values?.distributionChannel?.value;
  const areaId = values?.area?.value;
  const sbuid = values?.sbu?.value;
  const targetMonth = values?.targetMonth?.value;
  const targetYear = values?.targetYear?.value;
  const itemId = values?.item?.value;
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/GetSalesTargetEntryForACCL?accId=${accId}&buId=${buId}&channelId=${channelId}&areaId=${areaId}&itemId=${itemId}&TerritoryId=${values
        ?.territory?.value ||
        0}&sbuid=${sbuid}&targetMonth=${targetMonth}&targetYear=${targetYear}`
    );
    setter(
      res?.data
        ?.filter((itm) => itm?.targetId?.length === 0)
        ?.map((item) => ({
          ...item,
          isSelected: false,
          itemCode: values?.item?.itemCode || values?.item?.code || "",
          itemName: values?.item?.label || "",
          itemId: values?.item?.value || 0,
          itemSalesRate: 0,
          uomid: values?.uom?.value || 0,
          uomcode: values?.uom?.uomcode || "",
          uomname: values?.uom?.label || "",
          itemTypeId: 0,
        }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const CreateCustomerSalesTarget = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/oms/CustomerSalesTarget/CreateCustomerSalesTargetACCLCommon`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
