import Axios from "axios";
import { toast } from "react-toastify";
export const getItemTypeListDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/item/ItemCategory/GetItemTypeListDDL`);
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.map((item) => ({
        value: item.itemTypeId,
        label: item.itemTypeName,
      }));
      const DDLData = [{ value: 0, label: "All" }, ...modifiedData];

      setter(DDLData);
    }
  } catch (error) {}
};
export const GetItemProfileInfoByItemID_api = async (
  accId,
  buId,
  itemId,
  profileId,
  setter,
  setLoading
) => {
  try {
    setLoading && setLoading(true);
    const res = await Axios.get(
      `/item/ItemProfile/GetItemProfileInfoByItemID?AccountId=${accId}&BusinessUnitId=${buId}&ItemId=${itemId}&ItemProfileId=${profileId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.objRowList.length > 0) {
        setter(res?.data);
        setLoading && setLoading(false);
      } else {
        setter({});
        setLoading && setLoading(false);
      }
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter({});
  }
};
export const getItemCategoryDDLByTypeId_api = async (
  accId,
  buId,
  itemTypeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemTypeId}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.map((item) => ({
        value: item.itemCategoryId,
        label: item.itemCategoryName,
      }));
      const DDLData = [{ value: 0, label: "All" }, ...modifiedData];

      setter(DDLData);
    }
  } catch (error) {}
};
export const getItemSubCategoryDDLByCategoryId_api = async (
  accId,
  buId,
  itemCategory,
  itemTypeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${accId}&businessUnitId=${buId}&itemCategoryId=${itemCategory}&typeId=${itemTypeId}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.map((item) => ({
        value: item.id,
        label: item.itemSubCategoryName,
      }));
      const DDLData = [{ value: 0, label: "All" }, ...modifiedData];

      setter(DDLData);
    }
  } catch (error) {}
};

export const GetItemProfileConfigList_api = async (
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/item/ItemProfileSetup/GetItemProfileConfigList?AccountId=${accId}&BusinessUnitId=${buId}`
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
export const CreateItemProfile_api = async (
  payload,
  cb,
  setDisabled,
  ItemProfileInfoByItemIDFunc,
  itemProfileId
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/item/ItemProfile/CreateItemProfile`,
      payload
    );
    if (res.status === 200) {
      toast.success("Submitted successfully");
      cb();
      setDisabled(false);
      ItemProfileInfoByItemIDFunc(itemProfileId);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const DeleteTradeOfferConfigurationApi = async (
  payload,
  setDisabled,
  cb
) => {
  try {
    setDisabled(true);
    await Axios.post(`/oms/TradeOffer/DeleteTradeOfferConfiguration`, payload);
    toast.success("Submitted successfully");
    cb();
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
};
export const CreateTradeOfferConfiguration = async (
  payload,
  setDisabled,
  cb
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/oms/TradeOffer/CreateTradeOfferConfiguration`,
      payload
    );
    if (res.status === 200) {
      toast.success("Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getDistributionChannelIdApi = async (
  channelId,
  ItemId,
  setDisabled,
  cb
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/oms/TradeOffer/GetTradeOfferConfiguration?DistributionChannelId=${channelId}&ItemId=${ItemId}`
    );
    cb(res?.data);
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    cb([]);
  }
};

export const getItemDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxItemForSalesDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
export const getItemSalesOfferDDLApi = async (accId, buId, chanalId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemBasic/ItemSalesOfferDDL?AccountId=${accId}&BusinessunitId=${buId}&DistributionchannelId=${chanalId}`
    );

      setter(res?.data);
    
  } catch (error) {
    setter([]);
  }
};
export const GetDistributionChannelDDL = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accid}&BUnitId=${buid}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
