import Axios from "axios";


export const getAssetCategoryDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/Asset/GetAssetCategoryDDL?accountId=${accId}&businessUnitId=${buId}
      `
    );
    setter(res?.data);
  } catch (error) {}
};

export const getAssetList = async (
  accountId,
  businessUnitId,
  itemCategoryId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    let api = `/asset/Asset/GetAssetList?accountId=${accountId}&businessUnitId=${businessUnitId}&itemCategoryId=${itemCategoryId}`;
    const res = await Axios.get(api);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};
