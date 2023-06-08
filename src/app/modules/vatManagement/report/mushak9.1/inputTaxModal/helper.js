import axios from "axios";
import { toast } from 'react-toastify';
export const getHeaderData = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetTaxPayerInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter({});
  }
};


export const PurchaseRegister_Report_api = async (
    accid,
    buid,
    fromDate,
    toDate,
    itemId,
    branch,
    setter,
    setLoading
  ) => {
    try {
      setLoading && setLoading(true);
      const res = await axios.get(
        `/vat/VATSP/PurchaseRegister?intAccountId=${accid}&intBusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}&ItemId=${itemId}&intBranch=${branch}`
      );
      if (res.status === 200 && res?.data) {
        setLoading && setLoading(false);
        if (res?.data?.length > 0) {
          setter(res?.data);
        } else {
          toast.warning("Data Not Found");
          setter([]);
        }
      }
    } catch (error) {
      setLoading && setLoading(false);
    }
  };