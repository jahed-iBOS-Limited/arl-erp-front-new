import axios from "axios";
import { toast } from "react-toastify";
export const getLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  searchValue,
  setLoading,
  provider,
  fromDate,
  toDate,
  setter
) => {
  const search = searchValue ?? "";
  const providerID = provider ?? "";
  const FromDate = fromDate ?? "";
  const ToDate = toDate ?? "";

  setLoading(true);
  try {
    let res = await axios.get(
      `/imp/InsurancePolicy/GetInsuranceCoverNoteLanding?accountId=${accId}&businessUnitId=${buId}&search=${search}&fromDate=${FromDate}&toDate=${ToDate}&providerId=${providerID}&PageNo=${pageNo}&PageSize=${pageSize}&ViewOrder=desc`
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};
