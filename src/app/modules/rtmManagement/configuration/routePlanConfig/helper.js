import Axios from 'axios'
import { toast } from 'react-toastify'

// Real

export const createRouteSetupConfig = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true)

    const res = await Axios.post(
      `/rtm/RoutePlanConfiguration/CreateRoutePlanConfiguration`,
      payload
    )
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || 'Created successfully')
      cb()
      setDisabled(false)
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}

export const editRoutePlanConfig = async (payload, setDisabled) => {
  try {
    setDisabled(true)
    const res = await Axios.put(
      `/rtm/RoutePlanConfiguration/EditRoutePlanConfiguration`,
      payload
    )
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || 'Edited successfully')
      // cb();
      setDisabled(false)
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}

export const getVatBranches = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accid}&BusinessUnitId=${buid}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getRouteConfigById = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RoutePlanConfiguration/GetRoutePlanConfigurationById?autoId=${id}`
    )
    if (res.status === 200 && res?.data) {
      const values = res?.data[0]
      const data = {
        entryDay: values.lastRoutePlanEntryDay,
        editedDay: values.lastRoutePlanEditDay,
        approvalStatus: values.isApproveRequired,
      }
      setter(data)
    }
  } catch (error) {
    
  }
}

export const getGridData = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading(true)
  try {
    const res = await Axios.get(
      `/rtm/RoutePlanConfiguration/GetRoutePlanConfigurationLandingPasignation?accountId=${accId}&businessUnitid=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
      setLoading(false)
    }
  } catch (error) {
    
    setLoading(false)
  }
}
