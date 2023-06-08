import axios from "axios";

export const getBusinessUnitDDL = async (accId, setter) => {
    try {
      const res = await axios.get(
        `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accId}`
      );
      if (res.status === 200 && res?.data) {
        const DDLData = [{ value: 0, label: "All" }, ...res?.data];
        setter(DDLData);
      }
    } catch (error) {}
  };

  export const getCashRegisterReport = async ({
    fromDate,
    toDate,
    buId,
    setter
  }) => {
    try {
      const res = await axios.get(
        `/fino/Account/GetCashRegisterGroupLevel?fromDate=${fromDate}&toDate=${toDate}&businessUnitId=${buId}`
      );
      if (res.status === 200 && res?.data) {
        setter(res?.data);
      }
    } catch (error) {}
  };