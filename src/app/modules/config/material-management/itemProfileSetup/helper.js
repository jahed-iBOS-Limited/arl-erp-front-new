import axios from "axios";
import { toast } from "react-toastify";
export const GetProfileControlerTypeDDL_api = async (setter) => {
  try {
    const res = await axios.get(
      `/item/ItemProfileSetup/GetProfileControlerTypeDDL`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const CreateItemProfileConfig_api = async (payload,cb, setDisabled) => {
  setDisabled(true)
  try {
    const res = await axios.post(
      `/item/ItemProfileSetup/CreateItemProfileConfig`,
      payload
    );
    if (res.status === 200) {
      cb()
      toast.success(" Create Submitted successfully");
      setDisabled(false)
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false)
  }
};
export const EditItemProfileConfig_api = async (payload, setDisabled) => {
  setDisabled(true)
  try {
    const res = await axios.put(
      `/item/ItemProfileSetup/EditItemProfileConfig`,
      payload
    );
    if (res.status === 200) {
      toast.success("Edit Submitted successfully");
      setDisabled(false)
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false)
  }
};

export const GetItemProfileConfigPagination_api = async (
  accId,
  buId,
  pageNo,
  pageSize,
  search,
  setter,
  setLoading
) => {
  setLoading(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  try {
    const res = await axios.get(
      `/item/ItemProfileSetup/GetItemProfileConfigPagination?${searchPath}&AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
export const GetItemProfileConfigById_api = async (
  accId,
  buId,
  itemProfileId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/item/ItemProfileSetup/GetItemProfileConfigById?AccountId=${accId}&BusinessUnitId=${buId}&ItemProfileId=${itemProfileId}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = {
        rowDto: res?.data?.objAttrbt,
        header: {
          sectionName: res?.data?.objConfig?.itemProfileName,
        },
      };
      setter(modifiedData);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
