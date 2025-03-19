import Axios from "axios";

// https://localhost:44339/costmgmt/BusinessTransaction/GetBusinessTransactionByPartnerDDL?AccountId=1&BusinessUnitId=8&partnerTypeId=3&partnerId=0
export const getBusinessTransactionByPartnerDDL = async (accountId, businessUnitId,partnerTypeId,partnerId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionByPartnerDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&partnerTypeId=${partnerTypeId}&partnerId=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
  }
};

export const getCostElementDDL = async (unitId, accountId, costCenterId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accountId}&UnitId=${unitId}&CostCenterId=${costCenterId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};