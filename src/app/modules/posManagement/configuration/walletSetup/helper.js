import Axios from "axios";
import { toast } from "react-toastify";

export const CreateWalletSetup = async (payload) => {
  try {
    const res = await Axios.post(`/oms/POSDelivery/PostWalletInfo`, payload);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Save Successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "error happened");
  }
};

export const getWalletSetupLanding = async (
  accId,
  buId,
  walletType,
  searchTerm,
  setter
) => {
  try {
    let search=searchTerm?searchTerm:""
    const res = await Axios.get(
      `/oms/POSDelivery/GetWalletInfoDetails?accountId=${accId}&UnitId=${buId}&type=${walletType}&pageNo=${1}&pageSize=${100}&search=${search}`
    );
    if (res.status === 200) {
      setter(res?.data?.data);
    }
  } catch (error) {}
};

export const getWalletSetupById = async (id, setter) => {
  try {
    const res = await Axios.get(`/oms/POSDelivery/GetWalletInfo?Id=${id}`);
    if (res.status === 200) {
      if(res?.data?.strWalletType==="Bank"){
        res.data.strWalletType={label: res?.data?.strWalletType, value: 1}
      }else{
        res.data.strWalletType={label: res?.data?.strWalletType, value: 2}
      }
      setter(res?.data);
    }
  } catch (error) {}
};
