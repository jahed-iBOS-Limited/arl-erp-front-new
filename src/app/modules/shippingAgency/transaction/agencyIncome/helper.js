import axios from "axios";
import { imarineBaseUrl } from "../../../../App";

export const getExpensePDALandingApi = async (
  sbu,
  vesselid,
  voyageNo,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  setter([]);
  try {
    const _VoyageNo = voyageNo ? `&VoyageNo=${voyageNo}` : "";
    const _sbuID = sbu ? `&sbuID=${sbu}` : "";
    const _Vesselid = vesselid ? `&Vesselid=${vesselid}` : "";

    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetExpensePDALanding?FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${_VoyageNo}&accountId=${accId}&businessUnitId=${buId}${_sbuID}${_Vesselid}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
