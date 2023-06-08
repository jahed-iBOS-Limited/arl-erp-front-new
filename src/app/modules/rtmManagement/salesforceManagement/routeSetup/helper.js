import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getEmployeeDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetSalesForceEmployeeDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getTerritoryDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/TerritoryDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getRoutePlanLanding = async (
  accountId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  tourPlanDate,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/RoutePlan/RoutePlanLandingPagination?accountId=${accountId}&businessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&tourPlanDate=${tourPlanDate}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
    
  }
};

export const saveRoutePlanWeekWiseAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/rtm/RoutePlan/CreateRoutePlanWeekWise`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveRoutePlanMonthlyWiseAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/rtm/RoutePlan/CreateRoutePlanMonthWise`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveEditedRoutePlanMonthlyAction = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/rtm/RoutePlan/EditRoutePlanMonthWiseRow`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveEditedRoutePlanMonthlyApproveAction = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/rtm/RoutePlan/ApproveRoutePlanMonthWise`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Approve Successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetRoutePlanById = async (
  accId,
  buId,
  employeeId,
  tourId,
  singleMonthSetter,
  rowMonthSetter,
  rowWeekSetter
) => {
  try {
    const res = await Axios.get(
      `/rtm/RoutePlan/GetRoutePlanMonthWise?accountId=${accId}&businessUnitId=${buId}&employeeId=${employeeId}&tourId=${tourId}`
    );
    if (res?.status === 200 && res?.data) {
      const data = res?.data;

      rowWeekSetter(data?.objRow);

      const singleMonthRowDto = data?.objRow?.map((itm, idx) => {
        return {
          ...itm,
          routeCategory: {
            // value: itm?.strCategory
            label: itm?.strCategory,
          },
          routeLocation: {
            value: itm?.intTerritoryId,
            label: itm?.territoryName,
          },
        };
      });
      const singleObjHeader = {
        ...data?.objHeader,
        routeDate: _dateFormatter(data?.objHeader?.dteTourMonth),
        employeeName: {
          value: data?.objHeader?.intEmployeeId,
          label: data?.objHeader?.employeeName,
          level: data?.objHeader?.level || 1,
        },
      };
      singleMonthSetter(singleObjHeader);
      rowMonthSetter(singleMonthRowDto);
      rowWeekSetter(singleMonthRowDto)
    }
  } catch (error) {
    
  }
};
