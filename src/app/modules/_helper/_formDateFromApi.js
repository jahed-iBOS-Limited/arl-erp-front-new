const axios = require("axios");

export async function fromDateFromApi(businessUnitId, setter, cb) {
  try {
    const res = await axios.get(
      `/fino/Account/GetYearStartDateByUnitId?businessUnitId=${businessUnitId}`
    );
    setter && setter(res?.data?.split("T")?.[0] || "");
    cb && cb(res?.data?.split("T")?.[0] || "");
  } catch (error) {
    setter && setter("");
  }
}

export async function fromDateFromApiNew(businessUnitId, cb) {
  try {
    const res = await axios.get(
      `/fino/Account/GetYearStartDateByUnitId?businessUnitId=${businessUnitId}`
    );
    cb && cb(res?.data || "");
  } catch (error) {
    cb && cb("");
  }
}
