import Axios from "axios";
import { toast } from "react-toastify";

// Get GetBOMPllaningYearly
export const GetBOMPllaningYearly = async (
  fromDate,
  toDate,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/mes/MSIL/GetBOMPllaningYearly?FromDate=${fromDate}&ToDate=${toDate}&BuId=${buId}&Partid=1`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.log(error.message);
  }
};
export const getBillOfMaterialPlan = async (
  itemId,
  yearId,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/mes/BOM/GetBillOfMaterialPlan?businessUnitId=${buId}&itemId=${itemId}&yearId=${yearId}`
    );
    if (res?.data?.length > 0) {
      setter(res?.data);
    } else {
      setter(
        monthDDL?.map((item) => ({
          quantity: 0,
          rate: 0,
          monthName: item?.label,
          monthId: item?.value,
        }))
      );
    }

    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.log(error.message);
    setter(
      monthDDL?.map((item) => ({
        quantity: 0,
        rate: 0,
        monthName: item?.label,
        monthId: item?.value,
      }))
    );
  }
};
const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
export const saveBillOfMaterialPlanning = async (data, setLoading, CB) => {
  try {
    setLoading(true);
    const res = await Axios.post(
      `/mes/BOM/SaveBillOfMaterialPlanning`,
      data
    );
    toast.success(res?.data?.message);
    CB();
    setLoading(false);
  } catch (error) {
    setLoading(false);
    //add response message
    toast.warning(error?.response?.data?.message || error?.message);
  }
};
