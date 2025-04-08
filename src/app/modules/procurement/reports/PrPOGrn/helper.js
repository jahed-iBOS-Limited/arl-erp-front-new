import Axios from 'axios';

export const getPOPrGRNLanding = async (
  accId,
  buId,
  setLoading,
  setter,
  sbu,
  plantId,
  whId,
  fromDate,
  toDate,
  typeId,
  typeCode,
  pageNo,
  pageSize,
  search
) => {
  setLoading(true);
  const SearchCode = typeCode ? `SearchCode=${typeCode}&` : '';
  try {
    const res = await Axios.get(
      `/procurement/PurchaseRequest/GetIndentPoMRR?UnitId=${buId}&SbuId=${sbu}&WHId=${whId}&PlantId=${plantId}&FromDate=${fromDate}&ToDate=${toDate}&SearchType=${typeId}&${SearchCode}PageNo=${pageNo || 1}&PageSize=${pageSize}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};
