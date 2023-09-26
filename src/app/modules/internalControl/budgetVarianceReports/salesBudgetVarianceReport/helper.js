import axios from "axios";

export const getProfitCenterDDL = async (buId, setter) => {
    try {
      const res = await axios.get(
        `/fino/CostSheet/ProfitCenterDDL?BUId=${buId}`
      );
      if (res.status === 200 && res?.data) {
        const DDLData = [{ value: 0, label: "All" }, ...res?.data];
        setter(DDLData);
      }
    } catch (error) {}
  };