import axios from "axios";
import { toast } from "react-toastify";

export const fetchMenuListData = async (accId, setter) => {
  try {
    let res = await axios.get(
      `/hcm/HCMMenuList/GetCafeteriaMenuListReport?LoginBy=${accId}`
    );
    setter(res.data);
  } catch (error) {}
};

export const fetchEmpDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {}
};

export const fetchEmpBasicInfo = async (empId, setter) => {
  try {
    let res = await axios.get(
      `/hcm/EmployeeBasicInformation/GetEmployeeBasicInfoById?EmployeeId=${empId}`
    );
    setter(res?.data?.[0]);
  } catch (error) {}
};

// Meal Details Part one
export const fetchPartOneMealDetails = async (enrollId, setter) => {
  try {
    let res = await axios.get(
      `/hcm/HCMCafeteriaReport/GetPendingAndConsumeMealReport?Partid=1&EnrollId=${enrollId}`
    );
    setter(res?.data);
  } catch (error) {}
};

// Meal Details Part Two
export const fetchPartTwoMealDetails = async (enrollId, setter) => {
  try {
    let res = await axios.get(
      `/hcm/HCMCafeteriaReport/GetPendingAndConsumeMealReport?Partid=2&EnrollId=${enrollId}`
    );
    setter(res.data);
  } catch (error) {}
};

export const postCafeteriaEntry = async (
  partId,
  toDate,
  enrollId,
  typeId,
  mealOption,
  mealFor,
  countMeal,
  isOwnGuest,
  isPayable,
  narration,
  actionBy,
  placeId,
  setRowData,
  setDisabled,
  cb
) => {
  setDisabled(true);
  try {
    const narrationText = narration ? narration : null;
    let data = await axios.post(
      `/hcm/HCMCafeteriaReport/CafeteriaEntry?PartId=${partId}&ToDate=${toDate}&EnrollId=${enrollId}&TypeId=${typeId}&MealOption=${mealOption}&MealFor=${mealFor}&CountMeal=${countMeal}&isOwnGuest=${isOwnGuest}&isPayable=${isPayable}&Narration=${narrationText}&ActionBy=${actionBy}&PlaceId=${placeId}`
    );
    fetchPartOneMealDetails(enrollId, setRowData, setDisabled);
    toast.success(data.data);
    cb();
    setDisabled(false);
  } catch (err) {
    toast.warning(err.response.data.message);
    setDisabled(false);
  }
};

export const cancelMealPost = async (toDate, enrollId, setRowData, userId) => {
  try {
    let data = await axios.post(
      `/hcm/HCMCafeteriaReport/CafeteriaEntry?PartId=2&ToDate=${toDate}&EnrollId=${enrollId}&TypeId=1&MealOption=1&MealFor=1&CountMeal=1&isOwnGuest=0&isPayable=1&Narration=blank&ActionBy=${userId}&PlaceId=0`
    );
    fetchPartOneMealDetails(enrollId, setRowData);
    toast.success(data.data);
  } catch (err) {
    toast.warning(err.response.data.message);
  }
};

export const menuUpdatePost = async (enrollId, list, setEditMode, setter) => {
  try {
    let data = await axios.put(
      `/hcm/MenuListOfFoodCorner/EditMenuListOfFoodCorner`,
      list
    );
    fetchMenuListData(enrollId, setter);
    toast.success(data.data);
    setEditMode(false);
  } catch (err) {
    toast.warning(err.response.data.message);
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
