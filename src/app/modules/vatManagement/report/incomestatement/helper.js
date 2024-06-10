import Axios from "axios";

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// export const getIncomeStatement_api = async (
//   fromDate,
//   toDate,
//   fromDateL,
//   toDateL,
//   buId,
//   sbuId,
//   setter
// ) => {
//   try {
//     const res = await Axios.get(
//       `/fino/Accounting/GetIncomeStatement?dteFromDate=${fromDate}&dteToDate=${toDate}&dteFromDateL=${fromDateL}&dteToDateL=${toDateL}&BusinessUnitId=${buId}&SBUID=${sbuId}`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(res?.data);
//     }
//   } catch (error) {

//   }
// };

export const getIncomeStatement_api = async (
  fromDate,
  toDate,
  buId,
  sbuId,
  setter,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await Axios.get(
      `/fino/Accounting/GetIncomeStatement?dteFromDate=${fromDate}&dteToDate=${toDate}&BusinessUnitId=${buId}&SBUID=${sbuId}`
    );
    setter(res?.data);
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
  }
};
