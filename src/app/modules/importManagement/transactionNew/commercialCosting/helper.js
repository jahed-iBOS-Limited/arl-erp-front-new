import axios from "axios";
import Axios from "axios";
import { toast } from "react-toastify";

export const getCostTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/imp/AllCharge/GetCostTypeDDL`);
    res.data.unshift({ value: 0, label: "All" });
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getCommercialCostingLanding = async ({
  accId,
  buId,
  fromDate,
  toDate,
  isCompleted,
  setLoading,
  setter,
  bank,
  pageNo,
  pageSize,
  getExcelData
}) => {
  setLoading(true);
  try {
    // const url = costTypeId
    //   ? `/imp/AllCharge/GetCommercialCosting?accountId=${accId}&businessUnitId=${buId}&costTypeId=${costTypeId}&fromDate=${fromDate}&toDate=${toDate}`
    //   : `/imp/AllCharge/GetCommercialCosting?accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}`;
    // let res = await Axios.get(url);
    let dteFromDate = isCompleted ? `&fromDate=${fromDate}` : "";
    let dteToDate = isCompleted ? `&toDate=${toDate}` : "";
    const res = await axios.get(
      `/imp/AllCharge/GetCommercialCosting?accountId=${accId}&businessUnitId=${buId}${dteFromDate}${dteToDate}&isCompleted=${isCompleted}&bankId=${bank?.value ||
        0}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setLoading(false);
    setter(res?.data);
    getExcelData(`/imp/AllCharge/GetCommercialCosting?accountId=${accId}&businessUnitId=${buId}${dteFromDate}${dteToDate}&isCompleted=${isCompleted}&bankId=${bank?.value ||
      0}&PageNo=${pageNo}&PageSize=${res?.data?.totalCount}`)
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const updateCommercialCost = async (data, setDisabled) => {
  let newData = {
    costId: +data?.costId,
    standardAmount: +data?.standardAmount,
    dueDate: data?.dueDate,
  };
  setDisabled(true);
  try {
    let res = await Axios.post(`/imp/AllCharge/UpdateCommercialCost`, newData);
    setDisabled(false);
    toast.success(res?.data?.message || "Updated successfully");
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};
