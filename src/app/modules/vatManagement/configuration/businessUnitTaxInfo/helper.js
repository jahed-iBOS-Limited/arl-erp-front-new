import Axios from 'axios'
import { toast } from 'react-toastify'
import { _todayDate } from '../../../_helper/_todayDate'

export const getTaxCircle_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxCircleDDL`)
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getTaxZone_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxZoneDDL`)
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getBusinessUnit_api = async (accountId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetBusinessUnitByAccIdDDL?AccountId=${accountId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getRepresentative_api = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getRepresentativeRank_api = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDesignationDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const GetBusinessUnitTaxInfoPagination = async (
  accountId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/vat/BusinessUnitTaxInfo/GetBusinessUnitTaxInfoPagination?accountId=${accountId}&businessUnitId=${buId}&status=true&PageNo=1&PageSize=100&viewOrder=desc`
    )
    if (res.status === 200 && res?.data?.data) {
      setter(res?.data?.data)
    }
  } catch (error) {
    
  }
}

export const GetBusinessUnitTaxView = async (Id, setter) => {
  try {
    const res = await Axios.get(
      `/vat/BusinessUnitTaxInfo/GetBusinessUnitTaxInfoById?taxInfoId=${Id}`
    )
    if (res.status === 200 && res?.data) {
      const data = res?.data[0]
      const newData = {
        ...data,
        businessUnitDDL: {
          value: data.businessUnitId,
          label: data.businessUnitName,
        },
        taxZoneDDL: {
          value: data.taxZoneId,
          label: data.taxZoneName,
        },
        taxCircleDDL: {
          value: data.taxCircleId,
          label: data.taxCircleName,
        },
        representativeDDL: {
          value: data.representativeId,
          label: data.representativeName,
        },
        representativeRankDDL: {
          value: data.representativeRank,
          label: data.representativeRank,
        },
        representativeAddress: data.representativeAddress,
        returnSubmissionDate: _todayDate(),
      }
      setter(newData)
    }
  } catch (error) {
    
  }
}

export const saveBusinessUnitTaxInfo = async (data, cb) => {
  try {
    const res = await Axios.post(
      `/vat/BusinessUnitTaxInfo/CreateBusinessUnitTaxInfo`,
      data
    )
    if (res.status === 200) {
      toast.success(res.data?.message || 'Submitted successfully', {
        toastId: "saveBusinessUnitTaxInfo",
      })
      cb()
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
  }
}

export const saveEditedBusinessUnitTaxInfo = async (data, cb) => {
  try {
    const res = await Axios.put(
      `/vat/BusinessUnitTaxInfo/EditBusinessUnitTaxInfo`,
      data
    )
    if (res.status === 200) {
      toast.success(res.data?.message || 'Edited successfully')
      cb()
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
  }
}
