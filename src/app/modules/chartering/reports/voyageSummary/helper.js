import axios from "axios";

export const getVoyageSummary = async (
  accId,
  buId,
  vesselId,
  pageNo,
  pageSize,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/Report/GetVoyageReportLanding?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getVoyageDetails = async (voyageId, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/Report/GetVoyageInfoReport?VoyageId=${voyageId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
