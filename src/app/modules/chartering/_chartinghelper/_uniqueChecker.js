import { isArray } from "lodash";
import { toast } from "react-toastify";

export const isUniq = (key, param, arr, hideToast) => {
  if (isArray(arr)) {
    const isUnique = arr.filter((itm) => itm[key] === param).length < 1;
    if (isUnique) {
      return true;
    } else {
      !hideToast &&
        toast.warn("Not allowed to duplicate item!", { toastId: 456 });
      return false;
    }
  }
};



