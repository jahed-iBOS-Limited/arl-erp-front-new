import Axios from "axios";
// import { toast } from "react-toastify";

export const getDepartmentDDL = async (accId, buId,userId, setter) => {
  try {
    const res = await Axios.get(
      `/pms/CommonDDL/DepartmentNameBySupervisorNameWiseDDL?AccountId=${accId}&BusinessUnitId=${buId}&UserId=${userId}`
    );
    setter(res?.data);
  } catch (error) {
    
  }
};
