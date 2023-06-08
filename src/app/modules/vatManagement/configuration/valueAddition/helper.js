import Axios from 'axios'
import { toast } from 'react-toastify'

export const GetValueAdditionPagination = async (
  accountId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true)
    const res = await Axios.get(
      `/vat/ValueAddition/GetValueAdditionLandingPasignation?accountId=${accountId}&businessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc
      `
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
      setLoading(false)
    }
  } catch (error) {
    
    setLoading(false)
  }
}

export const GetValueAdditionView = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/vat/ValueAddition/GetValueAdditionById?ValueAdditionId=${id}
      `
    )
    if (res?.status === 200 && res?.data[0]) {
      const data = res?.data[0]
      const newData = {
        ...data,
        valueAdditionName: data?.valueAdditionName,
      }

      setter(newData)
    }
  } catch (error) {
    
  }
}

export const saveValueAddition = async (data, cb, setDisabled) => {
  setDisabled(true)
  try {
    const res = await Axios.post(`/vat/ValueAddition/CreateValueAddition`, data)
    if (res.status === 200) {
      toast.success(res.data?.message || 'Submitted successfully')
      cb()
      setDisabled(false)
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}

export const saveEditedValueAddition = async (data, setDisabled) => {
  setDisabled(true)
  try {
    const res = await Axios.put(`/vat/ValueAddition/EditValueAddition`, data)
    if (res.status === 200) {
      toast.success(res.data?.message || 'Edited successfully')
      setDisabled(false)
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}
