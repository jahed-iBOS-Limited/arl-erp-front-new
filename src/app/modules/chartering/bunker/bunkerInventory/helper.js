import axios from "axios";
import { imarineBaseUrl } from '../../../../App';

export const getLandingData = async (accId, buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/BunkerCost/GetVesselBunkerItemInfo?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};
