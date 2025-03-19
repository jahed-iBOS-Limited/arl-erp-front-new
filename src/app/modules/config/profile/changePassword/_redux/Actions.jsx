import * as requestFromServer from "./Api";
//import { costControllingUnitSlice } from "./Slice";
import { toast } from "react-toastify";
//const { actions: slice } = costControllingUnitSlice;

// action for savePasswordUpdate data
export const savePasswordUpdate_Action = (loginId,oldPassword, password, cb) => () => {
  return requestFromServer
    .savePasswordUpdate(loginId,oldPassword, password)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        cb();
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
    });
};
