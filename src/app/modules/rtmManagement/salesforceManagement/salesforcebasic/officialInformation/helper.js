import axios from 'axios'
import { toast } from 'react-toastify'
import { APIUrl } from '../../../../../App'

export const getCostCenterDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    )

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

export const getBusinessUnitDDL = async (setter) => {
  try {
    const res = await axios.get('/hcm/HCMDDL/GetBusinessunitDDL')

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

export const getSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetSBUDDL?AccountId=${accId}&BusineessUnitId=${buId}`
    )

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

export const getWorkplaceGroupDDL = async (setter) => {
  try {
    const res = await axios.get('/hcm/HCMDDL/GetWorkplaceGroupDDL')

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

export const getDepartmentDDL = async (setter) => {
  try {
    const res = await axios.get('/hcm/HCMDDL/GetDepartmentDDL')

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

export const getHRPositionDDL = async (setter) => {
  try {
    const res = await axios.get('/hcm/HCMDDL/GetPositionDDL')

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

export const getDesignationDDL = async (setter) => {
  try {
    const res = await axios.get('/hcm/HCMDDL/GetDesignationDDL')

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

export const getEmployeeGradeDDL = async (setter) => {
  try {
    const res = await axios.get('/hcm/HCMDDL/GetEmployeeGradeDDL')

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

export const getEmpTypeDDL = async (setter) => {
  try {
    const res = await axios.get('/hcm/HCMDDL/GetEmploymentTypeDDL')

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

export const getEmpStatusDDL = async (setter) => {
  try {
    const res = await axios.get('/hcm/HCMDDL/GetEmployeeStatusDDL')

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {}
}
export const getLineManagerDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetLineManagerDDL?AccountId=${accId}`
    )

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {}
}

//create EmployeeBasicInformation
export const createEmpBasicInformation_api = async (data, cb) => {
  try {
    const res = await axios.post(
      `/hcm/EmployeeBasicInformation/CreateEmployeeBasicInformation`,
      data
    )
    if (res.status === 200) {
      toast.success(res?.message || 'Submitted successfully')

      cb()
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
  }
}

export const employeeBasicInformation_landing_api = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  setLoading(true)
  const searchPath = search ? `name=${search}&` : ''

  try {
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/EmployeeBasicInfoLandingPasignation?${searchPath}Accountid=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    )

    if (res.status === 200 && res.data) {
      setter(res?.data)
      setLoading(false)
    }
  } catch (error) {
    setLoading(false)
  }
}

export const empAttachment_action = async (attachment, cb) => {
  let formData = new FormData()
  attachment.forEach((file) => {
    formData.append('files', file?.file)
  })
  try {
    let { data } = await axios.post('/domain/Document/UploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success('Upload  successfully')
    return data
  } catch (error) {
    toast.error('Document not upload')
    
    return []
  }
}

export const getImageFile_api = async (id) => {
  try {
    const res = await axios.get(
      `${APIUrl}/domain/Document/DownlloadFile?id=${id}`
    )

    if (res.status === 200 && res.data) {
      console.log(res)
      return res?.config?.url
    }
  } catch (error) {}
}
