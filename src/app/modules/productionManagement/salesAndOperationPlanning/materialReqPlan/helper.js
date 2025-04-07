import Axios from 'axios';
import { toast } from 'react-toastify';
import { monthDDL } from '../../../_helper/commonInputFieldsGroups/yearMonthForm';

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

export const saveBillOfMaterialPlanning = async (data, setLoading, CB) => {
  try {
    setLoading(true);
    const res = await Axios.post(`/mes/BOM/SaveBillOfMaterialPlanning`, data);
    toast.success(res?.data?.message);
    CB();
    setLoading(false);
  } catch (error) {
    setLoading(false);
    //add response message
    toast.warning(error?.response?.data?.message || error?.message);
  }
};
