import Axios from "axios";

// getBusinessPartnerSalesDDL
export const getBusinessPartnerSalesDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerSales/GetBusinessPartnerSales?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

// getBusinessPartnerSalesDDL
export const getBusinessPartnerPurchaseDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerPurchaseDDL?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};


export const getOthersPartner = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerOthersDdl?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};


export const getPartnerTypeDDLAction = async (setPartnerTypeDDL) => {
  try {
    const res = await Axios.get(
      "/fino/AccountingConfig/GetAccTransectionTypeDDL"
    );
    setPartnerTypeDDL(res?.data);
  } catch (error) {
    setPartnerTypeDDL([])
  }
};

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
    console.log(error.message);
  }
};
