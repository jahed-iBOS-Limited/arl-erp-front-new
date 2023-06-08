import Axios from "axios";
import { toast } from "react-toastify";

export const getGridData = async (setter, setLoader, pageNo, pageSize) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/JobRequisition/JobRequisitionLandingPagination?viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};

export const approveCircular = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/hcm/JobRequisition/JobRequisitionApprove`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      setLoading(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
