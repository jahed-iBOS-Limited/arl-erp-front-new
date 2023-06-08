import Axios from "axios";
import { toast } from "react-toastify";


export const getSBUDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const shipmentTransferDetails_api = async (
  accId,
  buId,
  shipmentId,
  fromDate,
  toDate,
  reportType,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    let res = await Axios.get(
      `/wms/Delivery/GetItemWiseShipmentTransferDetails?AccountId=${accId}&BusinessUnitId=${buId}&Shippointid=${shipmentId}&FromDate=${fromDate}&Todate=${toDate}&ReportType=${reportType}`
    );
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const getDistributionChannelDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter([{ value: 0, label: "All" }, ...res?.data]);
  } catch (err) {
    setter([]);
  }
};

export const getSalesOrgDDL = async (accId, buId, sbuId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/SalesOrder/GetSODDLbySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const GetProductWiseShipmentReport = async (
  accId,
  buId,
  shipPintId,
  fromDate,
  toDate,
  DChannelId,
  SalesOrgId,
  type,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/wms/Delivery/GetItemWiseShipmentTransfer?AccountId=${accId}&BusinessUnitId=${buId}&Shippointid=${shipPintId}&FromDate=${fromDate}&Todate=${toDate}&DistributionChannelId=${DChannelId}&SalesOrgId=${SalesOrgId}&ReportType=${type}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warning(error.message);
    setLoading(false);
  }
};
