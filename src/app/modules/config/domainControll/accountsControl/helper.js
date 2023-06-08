/* eslint-disable no-unused-vars */
import axios from "axios";
import { toast } from "react-toastify";

export const getAccountsControl = async (setControlData) => {
  try {
    const res = await axios.get(`/fino/Accounting/AccountsControlStatus`);
    setControlData(res?.data?.isControl);
  } catch (error) {}
};

export const setAccountsControl = async (userId, isActive, cb) => {
  try {
    const res = await axios.get(
      `/fino/Accounting/AccountsControl?ActionById=${userId}&isActive=${isActive}`
    );
    cb && cb();
    toast.success("Updated successfully");
  } catch (error) {
    toast.warn("Something went wrong");
  }
};
