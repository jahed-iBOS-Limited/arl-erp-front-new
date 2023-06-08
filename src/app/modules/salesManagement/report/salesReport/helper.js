import Axios from "axios";

export const GetCustomerNameDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data.map((itm) => {
        return {
          value: itm?.organizationUnitReffId,
          label: itm?.organizationUnitReffName,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};

export const getCustomerNameDDL = async (accId, buId, orgId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameBySalesOrgDDL?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrganization=${orgId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
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
export const GetSalesReportDateRangeByItem = async (
  obj,
  setter,
  setLoading
) => {
  setLoading(true);
  const {
    accountId,
    businessunitId,
    salesOrganizationId,
    fromDate,
    toDate,
    shippointId,
    customerId,
    productId,
  } = obj;
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetSalesReportDateRangeByItem?AccountId=${accountId}&BusinessUnitId=${businessunitId}&SalesOrganizationId=${salesOrganizationId}&FromDate=${fromDate}&ToDate=${toDate}&ShippointId=${shippointId}&CustomerId=${customerId}&ItemId=${productId}`
    );

    setter(res?.data);

    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
export const GetSalesOrderReportByItem = async (obj, setter, setLoading) => {
  setLoading(true);
  const { itemId, deliveryId } = obj;
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetSalesOrderReportByItem?ItemId=${itemId}&DeliveryId=${deliveryId}`
    );

    setter(res?.data);

    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
export const GetSalesOrderReportInfoByItemWise_api = async (
  obj,
  setter,
  setLoading
) => {
  setLoading(true);
  const { accountId, businessunitId, fromDate, toDate, productId } = obj;
  try {
    const res = await Axios.get(
      `/oms/SalesOrder/GetSalesOrderReportInfoByItemWise?AccountId=${accountId}&BusinessUnitId=${businessunitId}&ItemId=${productId}&FromDate=${fromDate}&Todate=${toDate}`
    );

    setter(res?.data);

    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
