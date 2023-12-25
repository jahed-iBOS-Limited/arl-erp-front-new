import axios from "axios";
import { toast } from "react-toastify";

export const getDDL = async (api, setter) => {
  try {
    const res = await axios.get(api);
    if (res.status === 200 && res?.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getRouteStandardCostLanding = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/tms/RouteStandardCost/GetRouteStandardCostLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetRouteStandardCostById = async (id, setter) => {
  try {
    const res = await axios.get(
      `/tms/RouteStandardCost/GetRouteStandardCostById?StandardCostId=${id}`
    );
    if (res.status === 200 && res?.data) {
      let newData = {
        id: +id,
        transportOrganizationName: {
          value: res.data[0]?.transportOrganizationId,
          label: res.data[0]?.transportOrganizationName,
        },
        routeName: {
          value: res.data[0]?.routeId,
          label: res.data[0]?.routeName,
        },
        componentName: {
          value: res.data[0]?.transportRouteCostComponentId,
          label: res.data[0]?.transportRouteCostComponentName,
        },
        businessTransaction: {
          value: res.data[0]?.businessTransactionId,
          label: res.data[0]?.businessTransactionName,
        },
        amount: res.data[0]?.amount,
      };
      setter(newData);
    }
  } catch (error) {}
};

export const createRouteStandardCost = async (data, cb, setDisabled, id) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/tms/RouteStandardCost/CreateRouteStandardCostInfo`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      console.log(id);
      !id && cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editRouteStandardCost = async (data, setDisabled) => {
  try {
    setDisabled(true);
    const res = await axios.put(
      `/tms/RouteStandardCost/EditRouteStandardCost`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getBusinessTransactionDDL = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/tms/RouteStandardCost/GetBusinessTransactionDDL?BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getGetComponentDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/tms/TransportMgtDDL/GetComponentDDL?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetRouteStandardCostDetails_api = async (
  accId,
  buId,
  OrgId,
  routeId,
  setFieldValue,
  id,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await axios.get(
      `/tms/RouteStandardCost/GetRouteStandardCostDetails?AccountId=${accId}&BusinessUnitId=${buId}&TransportOrganizationId=${OrgId}&RouteId=${routeId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      if (id === 0 || id) {
        // if edit
        const obj = {
          transportOrganizationName: {
            value: res?.data?.[0]?.transportOrganizationId,
            label: res?.data?.[0]?.transportOrganizationName,
          },
          routeName: {
            value: res?.data?.[0]?.routeId,
            label: res?.data?.[0]?.routeName,
          },
          itemLists: res?.data?.length > 0 ? res?.data : [],
        };
        setFieldValue(obj);
      } else {
        setFieldValue("itemLists", res?.data?.length > 0 ? res?.data : []);
      }
    }
  } catch (error) {
    if (id === 0 || id) {
      setFieldValue([]);
    } else {
      setFieldValue("itemLists", []);
    }

    setDisabled && setDisabled(false);
  }
};

export const GetRouteStandardCostDetailsApi = async (
  accId,
  buId,
  OrgId,
  routeId,
  setter,
  setDisabled
) => {
  setter([])
  try {
    setDisabled && setDisabled(true);
    const res = await axios.get(
      `/tms/RouteStandardCost/GetRouteStandardCostDetails?AccountId=${accId}&BusinessUnitId=${buId}&TransportOrganizationId=${OrgId}&RouteId=${routeId}`
    );

    setDisabled && setDisabled(false);
    setter(res?.data?.map(itm => ({
      ...itm,
      value: itm?.transportRouteCostComponentId,
      label: itm?.transportRouteCostComponentName
    })) || []);
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const GetRouteStandardCostByRouteId = async (
  accId,
  buId,
  routeId,
  transportORGId,
  shipPointId,
  setter,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await axios.get(
      `/tms/RouteStandardCost/GetRouteStandardCostByRouteId?accountId=${accId}&businessUnitId=${buId}&routeId=${routeId}&transportOrganizationId=${transportORGId}&shipPointId=${shipPointId}`
    );
    setDisabled && setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};
