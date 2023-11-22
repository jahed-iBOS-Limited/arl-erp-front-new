import axios from "axios";
import { iMarineBaseURL } from "../../helper";

export const getLandingData = async (accId, buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/BunkerCost/GetVesselBunkerItemInfo?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};
