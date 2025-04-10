import axios from 'axios';
export const GetItemTypeDDL_api = async (setter) => {
  try {
    const res = await axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      const filtering = res?.data?.filter((itm) => itm.value !== 3);
      setter(filtering);
    }
  } catch (error) {}
};

export const getVatBranches_api = async (userId, accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
