import Axios from 'axios'
import { toast } from 'react-toastify'

export const getOutletAttributeLanding = async (
  accountId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  setter
) => {
  setLoading(true)
  try {
    const res = await Axios.get(
      `/hcm/EmployeeProfileSection/GetEmployeeProfileSection?accountId=${accountId}&businessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc  `
    )
    if (res.status === 200 && res?.data) {
      setLoading(false)
      setter(res?.data)
    }
  } catch (error) {
    setLoading(false)
    
  }
}

// create
export const saveProfileSetup = async (data, cb, setDisabled, setRowDto) => {
  setDisabled(true)
  try {
    const res = await Axios.post(
      `/hcm/EmployeeProfileSection/CreateEmployeeProfileSection`,
      data
    )
    setDisabled(false)
    if (res.status === 200) {
      toast.success(res.data?.message || 'Submitted successfully')
      // setRowDto([])
      cb()
      
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}

// edit
export const EditEmployeeProfileSection_api = async (data, setDisabled) => {
  try {
    setDisabled(true)
    const res = await Axios.put(
      `/hcm/EmployeeProfileSection/EditEmployeeProfileSection`,
      data
    )
    setDisabled(false)
    if (res.status === 200) {
      toast.success(res.data?.message || 'Edited successfully')
      
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}

export const EmployeeProfileSection_api = async (attributeId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmployeeProfileSection/GetById?attributeId=${attributeId}`
    )

    const header = res?.data;
    //controlName condition
    const controlName =
      header?.strControlType === 'DDL'
        ? 1
        : header?.strControlType === 'Date'
        ? 2
        : header?.strControlType === 'Number'
        ? 4
        : 3

    const rowObj = header?.profileSectionAttributeList?.map((item) => ({
      ...item,
      valueName: item?.strSectionAttributeName,
    }))
    // obj modify
    const payload = {
      headerData: {
        sectionName: {
          value: header?.intProfileSectionId,
          label: header?.strProfileSection,
        },
        attributeName: header?.strSectionAttributeName,
        controlName: {
          value: controlName,
          label: header?.strControlType,
        },
        isMandatory: header?.isMandatory,
        datePickerField:
          header?.strControlType === 'Date'
            ? header?.profileSectionAttributeList[0]?.strSectionAttributeName
            : '',
        textType:
          header?.strControlType === 'TextBox'
            ? header?.profileSectionAttributeList[0]?.strSectionAttributeName
            : '',
        intEmpProfileSectionId:
          header?.profileSectionAttributeList[0]?.intEmployeeProfileSectionId ||
          0,
        intSectionAttributeId:
          header?.profileSectionAttributeList[0]?.intSectionAttributeId || 0,
      },
      rowData: header?.strControlType === 'DDL' ? rowObj : [],
    }
    setter(payload)
  } catch (error) {
    
  }
}

export const getSectionNameDDL_api = async (accId,setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmployeeProfileSection/GetSectionName?AccountId=${accId}`
      // `/hcm/EmployeeProfileSection/GetSectionName 
      // `
    )
    if (res.status === 200 && res?.data) {
      const data = res?.data
      const newData = data?.map((item) => {
        return {
          value: item?.intProfileSectionId,
          label: item?.strProfileSection,
        }
      })
      setter(newData)
    }
  } catch (error) {
    
  }
}
