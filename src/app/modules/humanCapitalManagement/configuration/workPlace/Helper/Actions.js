import { toast } from "react-toastify";
import * as requestFromServer from "./Api";

// workplaceGroupDDL
export const workplaceGroupDDL = (setter) => {
  requestFromServer.getWorkplaceGroupDDL().then((res) => {
    const { data, status } = res;
    if (status === 200 && data) {
      setter(data);
    }
  });
};

// GetBusinessunitDDL
export const businessunitDDL = (setter) => {
  requestFromServer.getbusinessunitDDL().then((res) => {
    const { data, status } = res;
    if (status === 200 && data) {
      setter(data);
    }
  });
};
//getWorkPlaceLandingData
export const workPlaceLandingData = (
  accId,
  setter,
  setLoader,
  pageNo,
  pageSize
) => {
  setLoader(true);
  requestFromServer
    .getWorkPlaceLandingData(accId, pageNo, pageSize)
    .then((res) => {
      const { data, status } = res;
      if (status === 200 && data) {
        setter(data);
        setLoader(false);
      }
    });
};
//get WorkPlaceGroupById
export const workPlaceGroupById = (wpGroupid, accId, setter) => {
  requestFromServer.getWorkPlaceGroupById(wpGroupid, accId).then((res) => {
    const { data, status } = res;
    if (status === 200 && data) {
      setter(data);
    }
  });
};
// get workplaceId
export const workPlaceById = (wpId, setter) => {
  requestFromServer.getWorkPlaceById(wpId).then((res) => {
    if (res?.status === 200 && res?.data) {
      let newData = res?.data.map((item) => {
        return {
          businessUnitName: {
            value: item?.businessUnitId,
            label: item?.businessUnitName,
          },
          workplaceGroupName: {
            value: item?.workplaceGroupId,
            label: item?.workplaceGroupName,
          },
          workplaceName: item?.workplaceName,
          workplaceCode: item?.workplaceCode,
        };
      });
      // setter(res?.data);
      setter(newData);
    }
  });
};
//Put saveEditWorkplace
export const saveEditWorkplace = (data, setDisabled) => {
  setDisabled(true);
  requestFromServer.putSaveEditWorkplace(data).then((res) => {
    const { data, status } = res;
    if (status === 200 && data) {
      toast.success(data.message || "Submitted successfully");
      setDisabled(false);
    }
  });
};

//Get CreateWorkplace
export const createWorkplace = (createData, setDisabled, cb) => {
  setDisabled(true);
  requestFromServer
    .getCreateWorkplace(createData)
    .then((res) => {
      if (res.status === 200 && res.data) {
        toast.success(res?.data?.message || "Submitted successfully");
        setDisabled(false);
        cb();
      }
    })
    .catch((err) => {
      toast.warning("Can not create this workplace." || err.message);
      setDisabled(false);
    });
};
