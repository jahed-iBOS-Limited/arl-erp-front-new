import Axios from "axios";

export const getCostElementDDL = async (unitId, accountId, costCenterId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accountId}&UnitId=${unitId}&CostCenterId=${costCenterId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};