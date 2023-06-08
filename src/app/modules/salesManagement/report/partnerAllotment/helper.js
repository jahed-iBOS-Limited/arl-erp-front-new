import Axios from "axios";
import { toast } from "react-toastify";

export const GetPartnerAllotmentLanding = async (
  accId,
  buId,
  date,
  type,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/wms/PartnerAllotmentReport/GetPartnerAllotmentReport?reportType=${type}&date=${date}&businessunitId=${buId}&accountId=${accId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warning(error.message);
    setLoading(false);
  }
};


export const GetSecondaryDeliveryLanding_api = async (
  accId,
  buId,
  date,
  pageNo,
  pageSize,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/wms/SecondaryDelivery/GetSecondaryDeliveryLanding?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${date}&ToDate=${date}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warning(error.message);
    setLoading(false);
  }
};