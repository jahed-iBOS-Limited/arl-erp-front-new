import Axios from "axios";

// getItemBasicinfoAction
export const getItemBasicinfoAction = async (
  itmId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/item/ItemBasic/GetItemBasicByItemId?Itemid=${itmId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
