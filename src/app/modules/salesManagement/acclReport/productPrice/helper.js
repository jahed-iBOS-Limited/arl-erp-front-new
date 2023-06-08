import axios from "axios";

export const GetSbuDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetDistributionChannelDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getPartnerProductPrice = async (
  accId,
  buId,
  type,
  disId,
  customerId,
  setter,
  setLoading,
  setHeaders,
  setAllData
) => {
  setLoading(true);
  const param =
    type === 1
      ? `&disChannelId=${disId}`
      : type === 2
      ? `&businessPartnerId=${customerId}`
      : "";
  try {
    const res = await axios.get(
      `/oms/OManagementReport/GetBusinessPartnerProductPrice?accountId=${accId}&businessUnitId=${buId}${param}`
    );
    const apiData = res?.data;

    const partners = [];
    const items = [];

    for (let u = 0; u < apiData.length; u++) {
      if (items.length < 1) {
        items.push(apiData[u]);
      } else {
        let isAvailable = false;

        for (let y = 0; y < items.length; y++) {
          if (items[y].itemId === apiData[u].itemId) {
            isAvailable = true;
          }
        }
        if (!isAvailable) {
          items.push(apiData[u]);
        }
      }

      if (partners.length < 1) {
        partners.push(apiData[u]);
      } else {
        let isUnique = false;

        for (let n = 0; n < partners.length; n++) {
          if (
            partners[n]?.businessPartnerId === apiData[u]?.businessPartnerId
          ) {
            isUnique = true;
          }
        }
        if (!isUnique) {
          partners.push(apiData[u]);
        }
      }
    }

    setAllData(apiData);
    setter(partners);
    setHeaders(items);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
