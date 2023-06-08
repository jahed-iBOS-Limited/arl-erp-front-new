import axios from 'axios'
import { toast } from 'react-toastify'

// get selected business unit from store

export const getLandingPageData = (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoader,
  search
) => {
  setLoader(true)
  const searchPath = search ? `searchTerm=${search}&` : ''
  axios
    .get(
      `/hcm/EmpFunctionalDepartment/GetFunctionalDepartmentLandingSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    )
    .then((res) => {
      console.log(res)
      console.log(accId, buId)
      const { data, status } = res

      if (status === 200 && data) {
        setter(data)
        setLoader(false)
      }
    })
}

export const getSinglePageData = (id, setter) => {
  axios
    .get(
      `/hcm/EmpFunctionalDepartment/GetFunctionalDepartmentById?FunctionalDepartmentId=${id}`
    )
    .then((res) => {
      const { data, status } = res
      if (status === 200 && data) {
        const data = res?.data[0] 
        
        const payload = {
          functionalDepartmentName: data?.departmentName,
          functionalDepartmentCode: data?.departmentCode,
          businessUnit: "",
          isCorporate: data?.isCorporate
        }
        setter(payload)
      }
    })
}

export const getBusinessUnitDdl = (accId,setter) => {
  axios.get(`/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accId}`).then((res) => {
    setter(res.data)
  })
}

export function saveCreateData(check, data, cb, setDisabled) {
  setDisabled(true)
  axios
    .post(
      `/hcm/EmpFunctionalDepartment/CreateEmpFunctionalDepartment?Check= ${check}`,
      data
    )
    .then((res) => {
      const { data, status } = res
      if (status === 200 && data) {
        toast.success(data.message)

        cb()
        setDisabled(false)
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message)
      setDisabled(false)
    })
}

export function saveEditData(data, setDisabled) {
  setDisabled(true)
  axios
    .put('/hcm/EmpFunctionalDepartment/EditEmpFunctionalDepartment', data)
    .then((res) => {
      const { data, status } = res
      if (status === 200 && data) {
        toast.success(data.message)
        setDisabled(false)
      }
    })
}
