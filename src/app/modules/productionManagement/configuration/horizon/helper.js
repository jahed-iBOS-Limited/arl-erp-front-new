/* eslint-disable no-useless-concat */
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

export const createHorizon = async (postData) => {
  try {
    const res = await axios.post(`/mes/Horizon/CreateHorizon`, postData);
    if (res.status === 200) {
      if (res?.data?.statuscode === 401) {
        toast.warn(res?.data?.message, { toastId: "rsf" });
      } else {
        toast.success(res?.data?.message, { toastId: "rsft" });
      }
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message);
  }
};

export const getHorizonSearchData = async (
  accId,
  buId,
  plantId,
  year,
  pageNo,
  pageSize,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/Horizon/HorizonLandingPagination?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&year=${year}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
    toast.error("Data not found");
    //console.log(error.message);
  }
};

export const getPlantDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};

//Created Horizon Plant DDL
export const getHorizonPlantDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetHorizonPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error.message);
  }
};

export const getYearDDL = async (setter) => {
  try {
    const res = await axios.get(`/mes/Horizon/HorizonCreateYearDDL`);
    const newData = res?.data?.map((item) => {
      return {
        value: item.value,
        label: item.label,
      };
    });
    setter(newData);
  } catch (error) {}
};

export const getHorizonLandingYearDDL = async (
  accId,
  buId,
  plantId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/Horizon/HorizonLandingYearDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}`
    );
    const newData = res?.data.map((item) => {
      return {
        value: item.value,
        label: item.label,
      };
    });
    setter(newData);
  } catch (error) {}
};

export const getHorizonTypeDDL = async (setter) => {
  try {
    const res = await axios.get(`/mes/MesDDL/GetHorizonTypeDDL `);
    setter(res?.data);
  } catch (error) {}
};

export const getDaysInMonth = (months, year) => {
  var yearsData = [];
  // eslint-disable-next-line array-callback-return
  months.map((data) => {
    var dteStartDateTime = new Date(`${year}, ${data.intSubHorizonId}, 01`);
    var dteEndDateTime = new Date(year, data.intSubHorizonId, 0);

    yearsData.push({
      intSubHorizonId: data.intSubHorizonId,
      strPlanningHorizonName: data.strPlanningHorizonName,
      dteEndDateTime: moment(dteEndDateTime).format("YYYY-MM-DD"),
      dteStartDateTime: moment(dteStartDateTime).format("YYYY-MM-DD"),
    });
  });
  return yearsData;
};

export const getWeekInYear = (year) => {
  var start = new Date(year, 0, 1);
  var end = new Date(year, 11, 31);
  var count = 1;
  var sDate;
  var eDate;
  var dateArr = [];

  while (start <= end) {
    if (start.getDay() === 6 || (dateArr.length === 0 && !sDate)) {
      sDate = new Date(start.getTime());
    }

    if ((sDate && start.getDay() === 5) || start.getTime() === end.getTime()) {
      eDate = new Date(start.getTime());
    }

    if (sDate && eDate) {
      dateArr.push({
        dteStartDateTime: moment(sDate).format("YYYY-MM-DD"),
        dteEndDateTime: moment(eDate).format("YYYY-MM-DD"),
        strPlanningHorizonName: "Week" + " " + count,
        intSubHorizonId: count,
      });
      sDate = undefined;
      eDate = undefined;
      count++;
    }

    start.setDate(start.getDate() + 1);
  }
  return dateArr;
};
