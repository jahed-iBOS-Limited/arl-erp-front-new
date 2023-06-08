import Axios from "axios";
import { toast } from "react-toastify";

export const GetProfitCenterPagination = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/ProfitCenter/GetProfitCenterInformationPasignation?AccountId=${accountId}&BusinessUnitId=${buId}&Status=true&PageNo=1&PageSize=10&viewOrder=desc
      `
    );
    if (res.status === 200 && res?.data?.data) {
      setter(res?.data?.data);
    }
  } catch (error) {
    
  }
};

export const GetProfitCenterView = async (profitCenterId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/ProfitCenter/GetProfitCenterInformationByProfitCenterId?ProfitcenterId=${profitCenterId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data[0];
      const newData = {
        ...data,
        controllingUnitName: {
          value: data.controllingUnitId,
          label: data.controllingUnitName,
        },
        profitCenterGroupName: {
          value: data.profitCenterGroupId,
          label: data.profitCenterGroupName,
        },
        responsiblePersonName: {
          value: data.responsiblePersonId,
          label: data.responsiblePersonName,
        },
        profitCenterName: data?.profitCenterName,
        profitCenterCode: data?.profitCenterCode,
      };
      setter(newData);
    }
  } catch (error) {
    
  }
};

export const saveProfitCenter = async (data, cb) => {
  try {
    const res = await Axios.post(
      `/costmgmt/ProfitCenter/CreateProfitCenter`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
  }
};

export const saveEditedProfitCenter = async (data, cb) => {
  try {
    const res = await Axios.put(
      `/costmgmt/ProfitCenter/EditProfitCenter`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      cb();
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
  }
};

export const getControllingUnitDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/ControllingUnit/GetControllingUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getGetProfitCenterGroupNameDDL_api = async (
  accId,
  buId,
  cuId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/costmgmt/ProfitCenterGorup/GetProfitCenterGroupDDL?AccountId=${accId}&BusinessUnitId=${buId}&ControllunitId=${cuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getResponsiblePersonDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
