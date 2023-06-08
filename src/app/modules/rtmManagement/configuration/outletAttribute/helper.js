import Axios from "axios";
import { toast } from "react-toastify";

export const getOutletAttributeLanding = async (
  accountId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/OutletProfileType/OutletProfileTypeLandingPagination?accountId=${accountId}&businessUnitid=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
    
  }
};

export const saveOutletAttribute = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/rtm/OutletProfileType/CreateOutletProfileType`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editOutletAttribute = async (data, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      `/rtm/OutletProfileType/EditOutletProfileType`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getOutletAttributeSigleData = async (ProfileId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/OutletProfileType/GetOutletProfileTypeById?ProfileId=${ProfileId}`
    );

    let {
      // eslint-disable-next-line no-unused-vars
      outletAttributeId,
      outletAttributeName,
      // eslint-disable-next-line no-unused-vars
      accountId,
      // eslint-disable-next-line no-unused-vars
      businessUnitId,
      // eslint-disable-next-line no-unused-vars
      uicontrolType,
      // eslint-disable-next-line no-unused-vars
      isMandatory,
      // eslint-disable-next-line no-unused-vars
      actionBy,
    } = res?.data?.objAttribute;
    let row = res?.data?.objAttributeValue;

    let obj = {
      profileTypeName: outletAttributeName,
      controlName: {label:uicontrolType ,value:uicontrolType} || "" ,
      isMandatory:isMandatory,
      row,
    };
    setter(obj);
    console.log(obj);
  } catch (error) {
    
  }
};
