import axios from "axios";
import { toast } from "react-toastify";

export const getShipPointDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const partnerCommissionReportUpdate = async (
  payload,
  userId,
  setIsLoading,
  cb
) => {
  setIsLoading(true);
  try {
    const res = await axios.put(
      `/wms/SecondaryDelivery/EditPaymentStatus?actionBy=${userId}`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message);
      cb();
      setIsLoading(false);
    }
  } catch (error) {
    toast.success(error?.response?.data?.message);
    setIsLoading(false);
  }
};

export const getPartnerCommissionReportData = async (
  accId,
  buId,
  shId,
  type,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/WmsReport/GetSecondaryDeliveryCommission?AccountId=${accId}&BusinessUnitId=${buId}&ShippointId=${shId}&ReportType=${type}`
    );
    if (res?.status === 200) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            isSelect: false,
          };
        })
      );
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getSalesOrderDDL = async (
  accId,
  buId,
  customerId,
  date,
  setter
) => {
  try {
    let res = await axios.get(
      `/oms/SalesOrder/GetPartnerandDateWiseOrderDDL?AccountId=${accId}&BusinessUnitId=${buId}&CustomerId=${customerId}&ReportDate=${date}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};
