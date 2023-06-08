import Axios from "axios";
import { toast } from "react-toastify";

export const GetCustomerStatementLanding = async (
  accId,
  buId,
  values,
  setLoading,
  setter
) => {
  const { fromDate, toDate, customerNameDDL, shippointDDL, salesOrg } = values;
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/OManagementReport/GetCustomerDeliveryStatement?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&CustomerId=${customerNameDDL?.value}&ShipPointId=${shippointDDL?.value}&salesOrgId=${salesOrg?.value}`
    );
    const unique = [
      ...new Map(res?.data?.map((item) => [item["customerId"], item])).values(),
    ];

    if (res?.data?.[0]?.objList?.length > 0) {
      setter(unique);
    } else {
      toast.warning("Data not found");
      setter([]);
    }

    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getCustomerNameDDL = async (accId, buId, orgId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameBySalesOrgDDL?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrganization=${orgId}`
    );
    const modifiedData = [{ value: 0, label: "All" }, ...res?.data];
    setter(modifiedData);
  } catch (error) {
    setter([]);
  }
};

export const GetSalesOrganizationDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
