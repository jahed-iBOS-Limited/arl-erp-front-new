import axios from "axios";

export const getLandingData = async (accId, buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/BunkerCost/GetVesselBunkerItemInfo?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};
