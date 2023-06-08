import Axios from 'axios'
import { toast } from 'react-toastify'

export const remoteAttendance_api = async (data) => {
  try {
    const res = await Axios.post(
      `/hcm/EmployeeRemoteAttendance/CreateEmployeeRemoteAttendance`,
      data
    )
    if (res.status === 200) {
      toast.success(res?.message || 'Submitted successfully')
    }
  } catch (error) {
    
    toast.error(error?.response?.message || 'Submitted unuccessfully')
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
