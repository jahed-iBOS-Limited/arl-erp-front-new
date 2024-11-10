import Axios from 'axios'
import { toast } from 'react-toastify'
export const businessPartnerLocation_api = async (
  accId,
  buId,
  partnerId,
  setter,
  setLoading
) => {
  try {
    setLoading(true)
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerLocationRegisterById?PartnerId=${partnerId}&accountId=${accId}&businessUnitId=${buId}`
    )
    if (res.status === 200 && res?.data) {
      console.log(res?.data?.data?.length)
      if (res?.data?.data?.length === 0) {
        toast.warning('Data not found')
        setter(res?.data?.data)
        setLoading(false)
      } else {
        setter(res?.data?.data)
        setLoading(false)
      }
    }
  } catch (error) {
    
    setLoading(false)
  }
}

export const creatPartnerLocationRegister_api = async (data) => {
  try {
    const res = await Axios.post(
      `/partner/PartnerLocationRegister/CreatPartnerLocationRegister`,
      data
    )
    if (res.status === 200) {
      toast.success(res?.message || 'Submitted successfully')
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
  }
}
export const businessPartner_api = async (userId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerListSalesForceDDL?EmployeeId=${userId}`
    )
    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}
