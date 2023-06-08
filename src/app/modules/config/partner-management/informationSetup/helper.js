import Axios from 'axios'
import { toast } from 'react-toastify'

export const getInformationSetupLanding = async (
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
      `/partner/PartnerInformation/GetPartnerInfoSetupLandingandSearch?accountId=${accountId}&businessUnitId=${buId}&pageSize=${pageSize}&pageNo=${pageNo}`
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
export const saveInformationSetup = async (data, cb, setDisabled, setRowDto) => {
  setDisabled(true)
  try {
    const res = await Axios.post(
      `/partner/PartnerInformation/CreatePartnerInfoSetup`,
      data
    )
    if (res.status === 200) {
      toast.success(res.data?.message || 'Submitted successfully')
      // setRowDto([])
      cb()
      setDisabled(false)
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}

// edit
export const EditPartnerInformationSetup = async (data, setDisabled) => {
  try {
    setDisabled(true)
    const res = await Axios.put(
      `/partner/PartnerInformation/EditPartnerInfoSetup`,
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

export const getPartneInformationSetupById = async (accId, buId, attributeId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PartnerInformation/GetPartnerInfoSetupByID?accountId=${accId}&businessUnitId=${buId}&attributeid=${attributeId}`
    )
    const header = res?.data;
    console.log(header)
    //controlName condition
    const controlValue =
      header?.controlName === 'DDL'
        ? 1
        : header?.controlName === 'Date'
        ? 2
        : header?.controlName === 'Number'
        ? 4
        : 3

    // const rowObj = header?.controlValues?.map((item) => ({
    //   ...item,
    //   valueName: item?.strSectionAttributeName,
    // }))

    // obj modify
    const payload = {
      headerData: {
        sectionName:
        {
          value: header.sectionId,
          label: header?.sectionName,
        },
        attributeId: header.attributeId,
        attributeName: header?.attributeName,
        isMandatory: header?.isMandatory,
        controlName: {
          value: controlValue,
          label: header?.controlName,
        },
        // isMandatory: header?.isMandatory,
        // datePickerField:
        //   header?.strControlType === 'Date'
        //     ? header?.profileSectionAttributeList[0]?.strSectionAttributeName
        //     : '',
        // textType:
        //   header?.strControlType === 'TextBox'
        //     ? header?.profileSectionAttributeList[0]?.strSectionAttributeName
        //     : '',
        // intEmpProfileSectionId:
        //   header?.profileSectionAttributeList[0]?.intEmployeeProfileSectionId ||
        //   0,
        // intSectionAttributeId:
        //   header?.profileSectionAttributeList[0]?.intSectionAttributeId || 0,
      },
      rowData: header?.controlName === 'DDL' ? header?.controlValues : [],
    }
    setter(payload)
  } catch (error) {
    
  }
}

export const getPartnerSectionNameDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PartnerInformation/PartnerInfoSectionNameDDL?accountId=${accId}&businessUnitId=${buId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}
