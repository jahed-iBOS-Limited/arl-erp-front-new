import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const GetBusinessPartnerProfilePagination = async (
  accountId,
  buId,
  channelId,
  regionId,
  areaId,
  territoryId,
  typeId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      // `/oms/CustomerProfile/CustomerVisitPagination?accountId=${accountId}&businessid=${buId}&vieworder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      `/oms/CustomerProfile/CustomerVisitPagination?accountId=${accountId}&businessid=${buId}&channel=${channelId}&region=${regionId}&area=${areaId}&territory=${territoryId}&customerType=${typeId ||
        0}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getCustomerVisitById = async (id, setter, setDisabled) => {
  setDisabled && setDisabled(true);
  try {
    const res = await Axios.get(
      `/oms/CustomerProfile/GetCustomerVisitById?CustomerVisitId=${id}`
    );

    let {
      territoryId,
      territoryName,
      customerPotentialCategoryId,
      customerPotentialCategoryTypeName,
      customerPotentialCategoryName,
      customerName,
      customerPhone,
      customerAddress,
      contractPersonName,
      contractPersonPhone,
      contractPersonDesignation,
      conversionDate,
      conversionDeadline,
      remarks,
    } = res?.data[0];

    setDisabled && setDisabled(false);

    let obj = {
      territory: {
        value: territoryId,
        label: territoryName,
      },
      category: {
        value: customerPotentialCategoryId,
        label: customerPotentialCategoryName,
        type: customerPotentialCategoryTypeName,
      },

      customerName: customerName || "",
      customerPhone: customerPhone || "",
      customerAddress: customerAddress || "",
      contractPersonName: contractPersonName || "",
      contractPersonPhone: contractPersonPhone || "",
      contractPersonDesignation: contractPersonDesignation || "",
      conversionDate: _dateFormatter(conversionDate) || "",
      conversionDeadline: _dateFormatter(conversionDeadline) || "",
      remarks: remarks || "",
    };

    setter(obj);
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const saveCustomerVisit = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/oms/CustomerProfile/CreateCustomerVisit`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editCustomerVisit = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/oms/CustomerProfile/EditCustomerVisit`,
      data
    );

    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getTerritoryDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getCategoryDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/CustomerProfile/GetCustomerPotentialCategoryDDL`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            value: item?.potentialCategoryId,
            label: item?.potentialCategoryCategoryName,
            type: item?.potentialCategoryTypeName,
          };
        }) || []
      );
    }
  } catch (error) {
    setter([]);
  }
};
