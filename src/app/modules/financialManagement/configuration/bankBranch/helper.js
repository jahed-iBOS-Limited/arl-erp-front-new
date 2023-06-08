import axios from 'axios'
import { toast } from 'react-toastify'
export const GetBankDDL_api = async (setter) => {
  try {
    const res = await axios.get(`/hcm/HCMDDL/GetBankDDL`)

    if (res.status === 200 && res.data) {
      const data = res?.data.map((itm) => ({
        value: itm?.value,
        label: `${itm?.label} (${itm?.bankShortName}, ${itm?.code})`,
        code: itm?.code,
        name: itm?.label,
        bankShortName: itm?.bankShortName,
      }))
      setter(data)
    }
  } catch (error) {
    
  }
}
export const GetBankBranchAdd_Api = async (setter) => {
  try {
    const res = await axios.get(`/fino/BankBranch/GetBankBranchAdd`)

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}
export const CreateBankBranch_api = async (payload) => {
  payload.setDisabled(true)
  try {
    const res = await axios.post(
      `/fino/BankBranch/CreateBankBranch`,
      payload?.data
    )

    if (res.status === 200 && res.data) {
      toast.success(res.data?.message || 'Submitted successfully', {
        toastId: 'CreateBankBranch',
      })
      payload.cb()
      payload.setDisabled(false)
    }
  } catch (error) {
    payload.setDisabled(false)
    
  }
}
