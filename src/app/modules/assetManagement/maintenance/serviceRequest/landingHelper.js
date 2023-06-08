import Axios from "axios";

export const getGridData = async (accId, buId, plId, setter, setLoading, pageNo, pageSize) => {
  try {
    setLoading(true);
    const res = await Axios.get(`/asset/LandingView/GetMntWorkOrderList?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
