// For Communication with external API's , for example ... get data, post data etc
import axios from 'axios'
import { toast } from 'react-toastify'

export const getModuleNameDDL = async (accId, buId, setter, setDisabled) => {
  setDisabled(true)
  try {
    let res = await axios.get(`/domain/FeatureGroup/GetModuleList`)
    if (res?.status === 200) {
      let paylaod = res?.data?.map((item) => {
        return {
          ...item,
          label: item?.moduleName,
          value: item?.moduleId,
        }
      })
      setter(paylaod)
      setDisabled(false)
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message)
    setDisabled(false)
  }
}

// This is Work for ddl and grid data also
export const getModuleFeature = async (moduleId, setter, type, setDisabled) => {
  setDisabled(true)
  try {
    let res = await axios.get(
      `/domain/FeatureGroup/GetModuleFeature?ModuleId=${moduleId}`
    )
    if (res?.status === 200) {
      let payload = res?.data?.map((item) => {
        return {
          // value and label for DDL
          value: item?.featureId,
          label: item?.featureName,
          moduleId: item?.moduleId,
          moduleCode: item?.moduleCode,
          moduleName: item?.moduleName,
          featureId: item?.featureId,
          featureCode: item?.featureCode,
          featureName: item?.featureName,
          isActive: item?.isActive,
          isCreate: type ? item?.isCreate : false,
          isEdit: type ? item?.isEdit : false,
          isView: type ? item?.isView : false,
          isClose: type ? item?.isClose : false,
        }
      })
      setter(payload)
      setDisabled(false)
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message)
    setDisabled(false)
  }
}

export const getLandingData = async (
  accId,
  setDisabled,
  setter,
  pageNo,
  pageSize
) => {
  setDisabled(true)
  try {
    let res = await axios.get(
      `/domain/FeatureGroup/GetFeatureGroupLandingPasignation?AccountId=${accId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    )
    if (res?.status === 200) {
      setter(res?.data)
      setDisabled(false)
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message)
    setDisabled(false)
  }
}

export const createFeatureGroup = async (payload, setDisabled, cb) => {
  setDisabled(true)
  try {
    let res = await axios.post(
      `/domain/FeatureGroup/CreateFeatureGroup`,
      payload
    )
    if (res?.status === 200) {
      cb()
      toast.success(res?.data?.message, { toastId: 'createFeatureGroup' })
      setDisabled(false)
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: 'createFeatureGroupErr',
    })
    setDisabled(false)
  }
}

export const editFeatureGroup = async (payload, setDisabled) => {
  setDisabled(true)
  try {
    let res = await axios.post(`/domain/FeatureGroup/EditFeatureGroup`, payload)
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: 'editFeatureGroup' })
      setDisabled(false)
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: 'editFeatureGroup',
    })
    setDisabled(false)
  }
}

export const getSingleData = async (
  id,
  mId,
  setDisabled,
  setSingleData,
  setRowData
) => {
  setDisabled(true)
  try {
    let res = await axios.get(
      `/domain/FeatureGroup/GetFeatureGroupById?FeatureGroupId=${id}&ModuleId=${mId}`
    )
    if (res?.status === 200) {
      const objheader = res?.data?.objheader
      const objRow = res?.data?.objRow

      const payload = {
        featureGroupName: objheader?.featureGroupName,
        module: {
          value: objheader?.moduleId,
          label: objheader?.moduleName,
        },
      }
      setSingleData(payload)
      setRowData(
        objRow?.map((item) => {
          return {
            ...item,
            isSelect: true,
          }
        })
      )
      setDisabled(false)
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message)
    setDisabled(false)
  }
}
