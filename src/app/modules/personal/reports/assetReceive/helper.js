import Axios from "axios";
export const getAssetReceiveReportData = async (
  accId,
  buId,
  userId,
  value,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  const searchPath = search ? `searchTearm=${search}&` : "";
  setLoading(true);
  try {
    const res = await Axios.get(`/asset/Asset/GetAssetReportForEmployee?AccountId=${accId}&UnitId=${buId}&ActionBy=${userId}&Type=${value}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`)
    if (res.status === 200 && res?.data) {     
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

