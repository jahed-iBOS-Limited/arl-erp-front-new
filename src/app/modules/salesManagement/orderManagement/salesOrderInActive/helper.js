import Axios from "axios";
import { toast } from "react-toastify";

export const salesOrderInActiveMenuPermissionAPI = async (
  userId,
  buId,
  setter
) => {
  try {
    let res = await Axios.get(
      `/wms/Delivery/GetUserPermissionForProcess?UserId=${userId}&BusinessUnitId=${buId}&CheckType=1`
    );
    setter(res?.data);
  } catch (err) {
    setter(false);
  }
};

export const getDistributionChannelDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getCustomerDDL = async (accId, buId, chId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionByChanneIdlDDL?accountId=${accId}&businessUnitId=${buId}&distributionChannelId=${chId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getSalesOrderInActiveLandingData = async (
  accId,
  buId,
  customerId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/wms/Delivery/GetPendingCustomerSalesOrder?AccountId=${accId}&BusinessUnitId=${buId}&SoldToPartnerId=${customerId}&fromdate=${fromDate}&todate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getSalesOrderInactiveViewData = async (
  accId,
  buId,
  partnerId,
  salesOrderId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/wms/Delivery/GetCustomerSalesOrderPending?AccountId=${accId}&BusinessUnitId=${buId}&SoldToPartnerId=${partnerId}&SalesOrderId=${salesOrderId}`
    );

    setLoading(false);
    setter(
      res?.data?.map((item) => ({
        ...item,
        pendingQty: item?.undeliveryQuantity,
      }))
    );
  } catch (err) {
    setLoading(false);
    setter([]);
  }
};

/* Commented | Assing by Iftakhar Bhai (Backend) */
// export const getCustomerDDL = async (accId, buId, employeeId, setter) => {
//   try {
//     const res = await Axios.get(
//       `/partner/BusinessPartnerSales/GetBusinessPartnerByEmployeeId?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${employeeId}`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(
//         res?.data?.map((item) => {
//           return {
//             ...item,
//             value: item?.businessPartnerId,
//             label: item?.businessPartnerName,
//           };
//         })
//       );
//     }
//   } catch (error) {
//     setter([]);
//   }
// };

export const saveSalesOrderInactiveView = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/wms/Delivery/EditSalesOrderPendingDeliveryQty`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message);
      setLoading(false);
      cb();
    }
  } catch (err) {
    setLoading(false);
  }
};

// export const getSBUDDL_api = async (accId, buId, setter) => {
//   try {
//     const res = await Axios.get(
//       `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(res?.data);
//     }
//   } catch (error) {
//     setter([]);
//   }
// };

// export const getSalesOrgDDL_api = async (accId, buId, sbuId, setter) => {
//   try {
//     const res = await Axios.get(
//       `/oms/SalesOrder/GetSODDLbySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(res?.data);
//     }
//   } catch (error) {
//     setter([]);
//   }
// };

// export const getDistChnDDL_api = async (accId, buId, sbuId, setter) => {
//   try {
//     const res = await Axios.get(
//       `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(res?.data);
//     }
//   } catch (error) {
//     setter([]);
//   }
// };

// export const getShippointByUserIdDDL_api = async (
//   accId,
//   buId,
//   userId,
//   setter
// ) => {
//   try {
//     const res = await Axios.get(
//       `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${accId}&BusinessUnitId=${buId}`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(
//         res?.data?.map((item) => {
//           return {
//             ...item,
//             value: item?.organizationUnitReffId,
//             label: item?.organizationUnitReffName,
//           };
//         })
//       );
//     }
//   } catch (error) {
//     setter([]);
//   }
// };
