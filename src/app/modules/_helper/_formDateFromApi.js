const axios = require("axios");

export async function fromDateFromApi(businessUnitId, setter) {
  try {
    const res = await axios.get(
      `/fino/Account/GetYearStartDateByUnitId?businessUnitId=${businessUnitId}`
    );
    setter && setter(res?.data?.split("T")?.[0] || "");
  } catch (error) {
    setter && setter("");
  }
}
