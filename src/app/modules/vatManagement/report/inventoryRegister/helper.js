import axios from "axios";
// import { toast } from "react-toastify";

export const getTaxBranchDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getFGInventoryRegisterReport = async (
  accid,
  buid,
  branchId,
  date,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/FGInventoryRegister/GetFGInventoryRegister?AccountId=${accid}&BusinessUnitID=${buid}&taxBranchId=${branchId}&dateTime=${date}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  } catch (error) {}
};
