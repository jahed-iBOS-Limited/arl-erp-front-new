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

  export const getPlantDDL = async (accId, buId, setter) => {
    try {
      const res = await axios.get(
        `/mes/MesDDL/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
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