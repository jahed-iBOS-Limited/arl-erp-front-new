import axios from 'axios'
import { toast } from 'react-toastify'

export const getDDL = async (api, setter) => {
  let res = await axios.get(`${api}`)
  if (res.status === 200) {
    setter(res?.data)
  }
}

export const fetchLandingData = async (
  accId,
  setter,
  loader,
  pageNo,
  pageSize
) => {
  loader(true)
  let res = await axios.get(
    `/hcm/EmployeeGrade/EmployeeGradeLandingPagination?AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  )
  if (res.status === 200) {
    setter(res?.data)
    loader(false)
  }
}

export const fetchSingleData = async (accId, posId, posGrpId, setter) => {
  let res = await axios.get(
    `/hcm/EmployeeGrade/GetEmployeeGradeByIdDTO?PositionId=${posId}&PositionGroupId=${posGrpId}&AccountId=${accId}
    `
  )
  if (res.status === 200) {
    setter(res?.data)
  }
}

export const createData = async (saveData, cb, setDisabled) => {
  setDisabled(true)
  await axios
    .post(`/hcm/EmployeeGrade/CreateEmployeeGrade`, saveData)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res?.data?.message)
        cb()
        setDisabled(false)
      }
    })
    .catch((err) => {
      toast.warning(err?.response?.data?.message)
      setDisabled(false)
    })
}

export const editSingleData = async (editData, setDisabled) => {
  setDisabled(true)
  console.log(editData)
  try {
    let res = await axios.put(`/hcm/EmployeeGrade/EditEmployeeGrade`, editData)
    if (res.status === 200) {
      toast.success(res?.data?.message)
      setDisabled(false)
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message)
    setDisabled(false)
  }
}
