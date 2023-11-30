import axios from "axios";
import { imarineBaseUrl } from "../../../../App";

export const getASLLAgencyBill = async (
  typeId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  setter([]);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetASLLAgencyBill?typeId=${typeId}&businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
