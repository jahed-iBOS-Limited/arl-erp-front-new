import axios from "axios";

// get selected business unit from store

export const getDetailsReportData = async (
  userId,
  fromDate,
  toDate,
  setter,
  setLoader,
  buId
) => {
  setLoader(true);
  try {
    const res = await axios.get(
      `/hcm/HCMCafeteriaReport/GetCafeteriaReportALL?PartId=1&FromDate= ${fromDate}&ToDate= ${toDate}&ReportType=1&LoginBy= ${userId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoader(false);
  } catch (error) {
    setLoader(false);
    setter([]);
  }
};

export const getDailyDetailsReportData = async (
  buId,
  date,
  placeId,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await axios.get(
      `/hcm/HCMCafeteriaReport/GetDailyCafeteriaReport?businessUnitId=${buId}&mealDate=${date}&PlaceId=${placeId}`
    );
    setter(res?.data);
    setLoader(false);
  } catch (error) {
    setLoader(false);
    setter([]);
  }
};

export const getBuDDLForEmpDirectoryAndSalaryDetails = async (
  accId,
  setter
) => {
  try {
    const res = await axios.get(
      `/hcm/HCMReport/GetOnboardedBusinessUnitList?accountId=${accId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getMealConsumePlaceDDL = async (setter) => {
  try {
    let res = await axios.get(
      `/hcm/HCMCafeteriaReport/GetPendingAndConsumeMealReport?Partid=3&EnrollId=0`
    );
    setter(res.data);
  } catch (error) {}
};

