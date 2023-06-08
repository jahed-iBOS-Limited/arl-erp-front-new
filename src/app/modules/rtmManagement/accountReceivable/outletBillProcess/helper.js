// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";

export const getLandingData = async (
  accId,
  buId,
  itemId,
  monthId,
  pageNo,
  pageSize,
  setIsLoading,
  setter
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/OutletBillProcess/GetOutletBillProcessPagination?AccountId=${accId}&BusinessUnitId=${buId}&ItemId=${itemId}&MonthId=${monthId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res?.status === 200) {
      const payload = {
        currentPage: res?.data?.currentPage,
        data: res?.data?.data?.map((item) => {
          return {
            ...item,
            isSelect: false,
          };
        }),
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
      };
      setter(payload);
      setIsLoading(false);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
    setIsLoading(false);
  }
};

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getBeatDDL = async (RoId, setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${RoId}`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};

export const getCategoryDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=10`
    );
    if (res?.status === 200) {
      let dataMapping = res?.data?.map((data) => {
        return {
          value: data?.itemCategoryId,
          label: data?.itemCategoryName,
        };
      });
      setter(dataMapping);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getSubCategoryDDL = async (accId, buId, cat, setter) => {
  try {
    let res = await axios.get(
      `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${accId}&businessUnitId=${buId}&itemCategoryId=${cat}&typeId=10`
    );
    if (res?.status === 200) {
      let dataMapping = res?.data?.map((item) => {
        return {
          code: item?.code,
          value: item?.id,
          label: item?.itemSubCategoryName,
        };
      });
      setter(dataMapping);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getItemDDL = async (catId, subId, accId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetFinishedItemByCatagoryDDL?CatagoryId=${catId}&SubCatagoryId=${subId}&AccountId=${accId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getMonthDDL = async (setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/GetMonthDDl`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};

export const editBillProcess = async (payload) => {
  try {
    let res = await axios.put(
      `/rtm/OutletBillProcess/EditOutletBillProcess`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};
