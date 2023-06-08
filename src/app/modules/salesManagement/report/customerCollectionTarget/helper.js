import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { getMonth } from "./utils";

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
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/GetSalesTargetEntryForACCL?accId=${accId}&buId=${buId}&channelId=${channelId}&areaId=${areaId}&itemId=0&sbuid=${sbuid}&targetMonth=${targetMonth}&targetYear=${targetYear}`
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
          targetAmount: 0,
        }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const deleteCollectionTarget = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.put(
      `/oms/CustomerSalesTarget/DeleteCollectionTarget?CollectionTargetId=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
