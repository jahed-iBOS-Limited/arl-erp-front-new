import axios from "axios";
import { toast } from "react-toastify";

export const getWorkplaceDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    const modfid = res?.data?.map((item) => ({
      value: item?.workplaceId,
      label: item?.workplaceName,
      code: item?.workplaceCode,
      workplaceGroupId: item?.workplaceGroupId,
    }));
    setter(modfid);
  } catch (error) {
    setter([]);
  }
};
export const getYearDDLForProcessReport = async (setter) => {
  try {
    const res = await axios.get(`/hcm/HCMOvertimeRequisition/GetRequisitionYearDDLForProcess`);
    let data = [...res?.data]
    data.unshift({ value : 0, label: "All"})
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getGridData = async (
  buId,
  workplaceId,
  monthId,
  yearId,
  status,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    let payload = {
      intBusinessUnitId: buId,
      intWorkplaceId: workplaceId,
      intMonthId: monthId,
      intYearId: yearId,
      intStatus: status,
    };
    const res = await axios.post(
      `/hcm/HCMOvertimeRequisition/GetAllRequisitionListForProcess`,
      payload
    );
    setLoading(false);

    // setter(res?.data);
    const newData = res?.data?.map((item) => ({
      ...item,
      isSelect: item?.payableStatusId === 1 ? true : false,
    }));
    setter(newData);
  } catch (error) {
    setLoading(false);
    setter([]);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const processHandler = async (gridData, setLoading, userId) => {
  try {
    let reqList = [];
    let statusList = [];

    for (let i = 0; i < gridData.length; i++) {
      if (gridData[i].isSelect) {
        let item = gridData[i];
        // let obj = {
        //   overtimeRequisitionId: ,
        //   payableStatusId: 1,
        //   insertBy: userId,
        // };
        reqList.push(item?.intId);
        statusList.push(1);
      }
    }
    if (reqList.length < 1) return toast.warn("Please select atleast one data");
    setLoading(true);
    let res = await axios.post(
      "/hcm/HCMOvertimeRequisition/ProcessOvertimeRequisition",
      { requisitionIdList: reqList, statusId: statusList, insertBy: userId }
    );
    toast.success(res?.data?.message || "Successfully Processed");
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Failed, Please try again");
  }
};
