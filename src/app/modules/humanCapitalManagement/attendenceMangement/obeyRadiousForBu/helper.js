import Axios from 'axios'
import { toast } from 'react-toastify'

export const GetObeyRadiusLandingPagination = async (
  accountId,
  pageNo,
  pageSize,
  setLoading,
  setter
) => {
  try {
    setLoading(true)
    const res = await Axios.get(
      `/hcm/ObeyRadiusForBusinessUnit/GetObeyRadiusForBusinessUnitLandingPasignation?AccountId=${accountId}&PageSize=${pageSize}&PageNo=${pageNo}&viewOrder=desc`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
      setLoading(false)
    }
  } catch (error) {
    
    setLoading(false)
  }
}

export const saveObeyRadius = async (data, cb, setDisabled) => {
  setDisabled(true)
  try {
    const res = await Axios.post(
      `/hcm/ObeyRadiusForBusinessUnit/CreateObeyRadiusForBusinessUnit`,
      data
    )
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

export const getObeyRadiusById = async (Id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/ObeyRadiusForBusinessUnit/GetObeyRadiusForBusinessUnitById?ObeyRadiusForBusinessUnitId=${Id}`
    )
    if (res.status === 200 && res?.data) {
      console.log('payload', res?.data)
      const {
        businessUnitId,
        businessUnitName,
        numObeyRadius,
        obeyRadiusForBusinessUnitId,
      } = res?.data[0]
      let newData = {
        numObeyRadius,
        obeyRadiusForBusinessUnitId,
        businessUnit: { value: businessUnitId, label: businessUnitName },
      }
      setter(newData)
    }
  } catch (error) {
    
  }
}

export const editObeyRadius = async (data, setDisabled) => {
  setDisabled(true)
  try {
    const res = await Axios.put(
      `/hcm/ObeyRadiusForBusinessUnit/EditObeyRadiusForBusinessUnit`,
      data
    )
    if (res.status === 200) {
      toast.success(res.data?.message || 'Edited successfully')
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

export const getBusinessUnitPermissionbyUser = async (
  userId,
  accId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${userId}&ClientId=${accId}`
    )
    if (res.status === 200 && res?.data) {
      let newData = res?.data.map((item) => {
        return {
          value: item?.organizationUnitReffId,
          label: item?.organizationUnitReffName,
        }
      })
      setter(newData)
    }
  } catch (error) {
    
  }
}
