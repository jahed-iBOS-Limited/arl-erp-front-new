import axios from "axios";

// year ddl for create page
export const getYearDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getPlantDDL = async (accId,userId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getHorizonDDL = async (accId, buId, plantId, yearId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetPlanningHorizonDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}`
    );
    let newData = res?.data;
    setter(
      newData.sort(function(a, b) {
        return new Date(a.startdatetime) - new Date(b.enddatetime);
      })
    );
  } catch (error) {}
};

export const monthData = [
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 7,
    strMonthName: "July",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 8,
    strMonthName: "August",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 9,
    strMonthName: "September",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 10,
    strMonthName: "October",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 11,
    strMonthName: "November",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 12,
    strMonthName: "December",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 1,
    strMonthName: "January",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 2,
    strMonthName: "February",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 3,
    strMonthName: "March",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 4,
    strMonthName: "April",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 5,
    strMonthName: "May",
    intMonthLyValue: 0,
    isActive: true,
  },
  {
    intMopplanRowId: 0,
    intMopplanId: 0,
    intMonthId: 6,
    strMonthName: "June",
    intMonthLyValue: 0,
    isActive: true,
  },
];
