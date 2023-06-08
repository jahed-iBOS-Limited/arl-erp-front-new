import Axios from "axios";
// import moment from "moment";
import { toast } from "react-toastify";

export const getCustomerDeliveryStatementForShiptoPartner = async (
  accountId,
  businessUnitId,
  fromDate,
  toDate,
  customerId,
  shipPartnerId,
  shipPointId,
  salesOrgId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/OManagementReport/GetCustomerDeliveryStatementForShiptoPartner?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&FromDate=${fromDate}&ToDate=${toDate}&CustomerId=${customerId}&ShipToPartnerId=${shipPartnerId}&ShipPointId=${shipPointId}&salesOrgId=${salesOrgId}`
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
export const getBusinessPartnerByEmployeeId = async (
  accId,
  buId,
  empId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerSales/GetBusinessPartnerByEmployeeId?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    setter(
      res?.data?.map((itm) => ({
        ...itm,
        value: itm?.businessPartnerId,
        label: `${itm?.businessPartnerName}(${itm?.businessPartnerCode})`,
      }))
    );
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

export const getShipToParty = async (
  accountId,
  businessUnitId,
  partnerId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetShipToParty?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&SoldToPartnerId=${partnerId}`
    );
    setter([{ value: 0, label: "All" }, ...res?.data]);
  } catch (error) {
    setter([]);
  }
};

export const GetDistributorCoverage_api = async (
  type,
  buid,
  fromDate,
  toDate,
  channelId,
  soldToPartyId,
  shiptopartner,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/SalesInformation/GetDistributorCoverage?Partid=${type}&FromDate=${fromDate}&ToDate=${toDate}&UnitID=${buid}&ChannelID=${channelId}&Soldtopartnerid=${soldToPartyId}&Shiptopartnerid=${shiptopartner}`
    );

    if (res?.data?.length > 0) {
      setter(res?.data);
    } else {
      toast.warning("Data not found");
      setter([]);
    }

    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getDistributionChannelDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetLabourBill_api = async (
  type,
  buid,
  fromDate,
  toDate,
  shipPointId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/SalesInformation/GetLabourBill?Partid=${type}&FromDate=${fromDate}&ToDate=${toDate}&UnitID=${buid}&ShippingPointid=${shipPointId}`
    );

    if (res?.data?.length > 0) {
      setter(res?.data);
    } else {
      toast.warning("Data not found");
      setter([]);
    }

    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getSupplierBaseDeliveryCustomerChallan = async (
  accId,
  buId,
  fromDate,
  toDate,
  supplierId,
  shipPointId,
  salesOrgId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetSupplierStatementForChallan?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&SupplierID=${supplierId}&ShipPointId=${shipPointId}&salesOrgId=${salesOrgId}`
    );
    if (res?.data?.length) {
      setter(res?.data);
    } else {
      toast.warn("Oops... No Data Found!");
    }

    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getSupplierBaseDeliveryTransferChallan = async (
  accId,
  buId,
  fromDate,
  toDate,
  supplierId,
  shipPointId,
  salesOrgId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetSupplierStatementForTransferChallan?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&SupplierID=${supplierId}&ShipPointId=${shipPointId}&salesOrgId=${salesOrgId}`
    );
    if (res?.data?.length) {
      setter(res?.data);
    } else {
      toast.warn("Oops... No Data Found!");
    }

    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getCustomerTopSheet = async (
  accId,
  buId,
  fromDate,
  toDate,
  supplierId,
  shipPointId,
  saleOrgId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetSupplierStatementTopsheet?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&SupplierID=${supplierId}&ShipPointId=${shipPointId}&salesOrgId=${saleOrgId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
