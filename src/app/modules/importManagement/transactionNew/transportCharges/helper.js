import axios from "axios";
import { toast } from "react-toastify";
export const getLandingData = async (
  accId,
  setDisabled,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setDisabled(true);
  const searchPath = search ? `Search=${search}&` : "";
  try {
    let res = await axios.get(
      `/domain/CreateRoleManager/GetRoleManagerSearchLandingPasignation?${searchPath}AccountId=${accId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const createTransportCharge = async (payload) => {
  try {
    const res = await axios.post(
      `/imp/TransportPayment/CreateTransportPayment`, payload);
    if (res.status === 200) {
      toast.success(res.data.message);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
}

export const getShipmentDDL= async (accId, buId, setter)=> {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetShipmentDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
      toast.error(error?.response?.data?.message);
  }
}

export const getTransportTypeDDL= async (setter)=> {
  try {
    const res = await axios.get("/imp/ImportCommonDDL/TransportTypeDDL");
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
      toast.error(error?.response?.data?.message);
  }
}

export const getTransportProviderDDL= async (accId, buId, setter)=> {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/TransportProviderNameDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
      toast.error(error?.response?.data?.message);
  }
}

export const getTransportChargeByProvider= async (
  providerId, 
  accId, 
  buId, 
  fromDate, 
  toDate, 
  rowSetter, 
  qtySetter,
  amountSetter,
)=> {
  try {
    var totalQty=0;
    var totalTransportAmount=0;
    var totalVatAmount=0;
    const res = await axios.get(
      `/imp/TransportPayment/GetTransportPaymentList?providerId=${providerId}&accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    console.log(res?.data)
    if (res.status === 200 && res.data) {
      const response = res.data.map(item=>{
        totalQty=totalQty+parseInt(item?.qty)
        totalTransportAmount=totalTransportAmount+parseInt(item?.transportAmount)
        totalVatAmount=totalVatAmount+parseInt(item?.vatamount)

        return{
          transportProviderName: item?.transportProviderName,
          ponumber: item?.ponumber,
          billNumber: item?.billNumber,
          qty: item?.qty,
          paymentDate: item?.paymentDate,
          amountBDT: parseInt(item?.transportAmount)+ parseInt(item?.vatamount)
        }
      })
      rowSetter(response);
      qtySetter(totalQty);
      amountSetter(totalTransportAmount+totalVatAmount)
    }
  } catch (error) {
      toast.error(error?.response?.data?.message);
  }
}

