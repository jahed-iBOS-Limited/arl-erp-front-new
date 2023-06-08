import axios from "axios";
import Axios from "axios";
import { toast } from "react-toastify";

export const getDDL = async (api, setter) => {
  let data = await axios.get(`${api}`);
  if (data) {
    setter(data.data);
  }
};

export const fetchLandingData = async (
  accId,
  buId,
  setter,
  setLoader,
  pageNo,
  pageSize,
  search
) => {
  setLoader(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  let res = await axios.get(
    `/hcm/EmpFunctionalDesignation/GetFunctionalDesignationLandingSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
  if (res) {
    setter(res?.data);
    setLoader(false);
  }
};

// export const fetchSingleData = async (id, setter) => {
//   let data = await axios.get(
//     `/hcm/EmpFunctionalDesignation/GetFunctionalDesignationById?DesignationId=${id}`
//   );
//   if (data) {
//     setter(data.data[0]);
//   }
// };

export const singleDataById = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmpFunctionalDesignation/GetFunctionalDesignationById?DesignationId=${id}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data[0];

      console.log(data, "data");

      const newData = {
        ...data,
        id: data?.designationId,
        designationName: data?.designationName,
        designationCode: data?.designationCode,
        businessUnit: {
          value: data?.businessUnitId,
          label: data?.businessUnitName,
        },
        position: {
          value: data?.positionId,
          label: data?.positionName,
        },
      };
      setter(newData);
    }
  } catch (error) {
    
  }
};

export const editSingleData = async (editData, setDisabled) => {
  setDisabled(true);
  try {
    let data = await axios.put(
      `/hcm/EmpFunctionalDesignation/EditEmpFunctionalDesignation
        `,
      editData
    );
    if (data.status === 200) {
      toast.success("Edit Successfully");
      setDisabled(false);
    }
  } catch (err) {
    if (err) {
      toast.warning("Some thing wrong, Please try again");
      setDisabled(false);
    }
  }
};

export const createData = async (saveData, cb, setDisabled) => {
  setDisabled(true);
  await axios
    .post(
      `/hcm/EmpFunctionalDesignation/CreateEmpFunctionalDesignation`,
      saveData
    )
    .then((data) => {
      if (data.status === 200) {
        toast.success(data.data.message);
        cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.warning(err.response.data.message);
      setDisabled(false);
    });
};
