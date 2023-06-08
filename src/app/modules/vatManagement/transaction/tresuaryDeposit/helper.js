import Axios from 'axios';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../_helper/_dateFormate';

export const getBranchDDL = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getDepositTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetDepositTypeDDL`)
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getBankNameDDL = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/BankAccount/GETBankDDl`)
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getBankBranchDDLAction = async (bId, cId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GETBankBranchDDl?BankId=${bId}&CountryId=${cId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getDivisionNameDDL = async (cId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetDivisionDDL?countryId=${cId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getDistrictNameDDLAction = async (cId, dId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetDistrictDDL?countryId=${cId}&divisionId=${dId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getDepositorNameDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const saveTresuaryDeposit = async (data, cb, setDisabled) => {
  setDisabled(true)
  try {
    const res = await Axios.post(
      `/vat/TresuaryDeposit/CreateTresuaryDeposit`,
      data
    )
      toast.success(res?.message || "Submitted successfully");
      cb()
      setDisabled(false)
    
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}

export const GetTresuaryDepositPagination = async (
  accId,
  buId,
  taxBId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  try {
    setLoading(true)
    const searchPath = search ? `searchTerm=${search}&` : ''

  

    const res = await Axios.get(
      `/vat/TresuaryDeposit/TresuaryDepositLandingSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&TaxBranchId=${taxBId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
      setLoading(false)
    }
  } catch (error) {
    
    //setLoading(false);
  }
}

export const singleDataById = async (tresuaryId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TresuaryDeposit/TresuaryDepositGetById?TresuaryId=${tresuaryId}`
    )
    if (res.status === 200 && res?.data) {
      const data = res?.data[0]

      const newData = {
        ...data,
        branchName: data.taxBranchId ? {
          value: data.taxBranchId,
          label: data.taxBranchName,
        }: '',
        branchAddress: data.taxBranchAddress,
        depositeType:data.treasuryDepositTypeId ?  {
          value: data.treasuryDepositTypeId,
          label: data.treasuryDepositTypeName,
        }: '',
        depositAmount: data.depositAmount,
        depositDate: _dateFormatter(data.depositDate),
        challanNo: data.trChallanNo,
        challanDate: _dateFormatter(data.trChallanDate),
        instrumentNo: data.instumentNo,
        instrumentDate: _dateFormatter(data.instrumentDate),
        bankName: data.bankId ? {
          value: data.bankId,
          label: data.bankName,
        }: '',
        bankBranch: data.bankBranchId ?  {
          value: data.bankBranchId,
          label: data.bankBranchName,
        }: '',
        divisionName: data.divisionId ? {
          value: data.divisionId,
          label: data.divisionName,
        }: '',
        districtName: data.districtId ? {
          value: data.districtId,
          label: data.district,
        }: '',
        depositorName: data.depositorId?  {
          value: data.depositorId,
          label: data.depositorName,
        }: '',
        description: data?.naraation
      }
      setter(newData)
    }
  } catch (error) {
    
  }
}

export const saveEditedTresuaryDeposit = async (data, setDisabled) => {
  try {
    setDisabled(true)
    const res = await Axios.put(
      `/vat/TresuaryDeposit/EditTresuaryDeposit`,
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
