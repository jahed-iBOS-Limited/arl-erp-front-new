import axios from 'axios';

// getCostCenterDDL
export const getCostCenterDDL = async (UnitId, AccountId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/CostCenter?AccountId=${AccountId}&UnitId=${UnitId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

// getCostElementDDL
export const getCostElementDDL = async (UnitId, AccountId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/CostElement?AccountId=${AccountId}&UnitId=${UnitId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

// getRevenueCenterListDDL
export const getRevenueCenterListDDL = async (businessUnitId, setter) => {
  try {
    const res = await axios.get(
      `/fino/AccountingConfig/GetRevenueCenterList?businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

// getRevenueElementListDDL
export const getRevenueElementListDDL = async (businessUnitId, setter) => {
  try {
    const res = await axios.get(
      `/fino/AccountingConfig/GetRevenueElementList?businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};
