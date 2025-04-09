import axios from 'axios';
export const getHeaderData = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetTaxPayerInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter({});
  }
};
