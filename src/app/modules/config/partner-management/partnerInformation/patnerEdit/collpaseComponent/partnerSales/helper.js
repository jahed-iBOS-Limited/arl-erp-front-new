import Axios from "axios";

// getBusinessPartnerBasicinfoAction
export const getBusinessPartnerBasicinfoAction = async (
  accId,
  buId,
  partnerId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerByID?accountId=${accId}&businessUnitId=${buId}&partnerID=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
