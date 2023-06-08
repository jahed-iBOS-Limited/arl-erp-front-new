import axios from "axios";

export const getProfileOverviewDataById = async (
  typeId,
  buId,
  workPlaceId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/HCMReport/GetARLDashboardForCorrection?reportTypeId=${typeId}&intbusinessUnitId=${buId}&intworkplaceId=${workPlaceId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (err) {
    setter([]);
    setLoading && setLoading(false);
  }
};
