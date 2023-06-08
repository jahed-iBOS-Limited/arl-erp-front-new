import axios from "axios";
import { toast } from "react-toastify";

export const createVoucher = async (payload, setDisabled, cb) => {
  try {
    setDisabled(true)
    const res = await axios.post(`/partner/Pos/VoucherPost`, payload);
    if (res.status === 200 && res?.data) {
      toast.success(res?.data?.message);
      cb();
      setDisabled(false)
    }
  } catch (error) {
      toast.error(error.response.data.message);
      setDisabled(false)
  }
};

export const getVoucherLandingData = async (whId, accId, fromDate, toDate, pageNo, pageSize, setter, setLoading)=>{
  try{
    setLoading(true)
    const res= await axios.get(
      `/partner/Pos/VoucherLanding?WareHouseId=${whId}&AccountId=${accId}&FromDate=${fromDate}&ToDate=${toDate}&Status=true&pageNo=${pageNo}&pageSize=${pageSize}`
    )
    if(res?.status===200){
      setter(res?.data)
      setLoading(false)
    }
  }catch(err){
    toast.error(err?.response?.data?.message)
    setLoading(false)
  }
}

export const getVoucherById = async(voucherId, setter)=>{
  try{
    const res = await axios.get(`/partner/Pos/VoucherGetById?Id=${voucherId}`)
    if(res?.status===200){
      const response={
        warehouse:{
          value: res?.data?.intWhid,
          label: res?.data?.whName,
        },
        ...res?.data
      }
      setter(response)
    }
  }catch(err){
    toast.error(err.response.data.message)
  }
}


