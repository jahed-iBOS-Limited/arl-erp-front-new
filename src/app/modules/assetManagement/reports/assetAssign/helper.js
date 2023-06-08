import Axios from "axios";

export const getAssetAssignReportData = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  const searchPath = search ? `searchTearm=${search}&` : "";
  setLoading(true);
  try {
    const res = await Axios.get(`/asset/Asset/GetAssetReportForAsset?AccountId=${accId}&UnitId=${buId}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`)
    if (res.status === 200 && res?.data) {     
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

