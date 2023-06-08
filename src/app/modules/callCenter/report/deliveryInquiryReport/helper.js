import Axios from "axios";
//CustomerDeliveryInquery_api
export const CustomerDeliveryInquery_api = async (
  fromDate,
  toDate,
  searchValue,
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  const search = searchValue ? `&searchTerm=${searchValue}` : "";
  try {
    const res = await Axios.get(
      `/wms/CustomerDeliveryInquery/GetCustomerDeliveryInqueryReport?AccountId=${accId}&BusinessUnitid=${buId}&fromDate=${fromDate}&toDate=${toDate}${search}`
    );
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (error) {}
  setLoading && setLoading(false);
};
