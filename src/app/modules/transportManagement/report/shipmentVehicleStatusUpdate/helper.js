import Axios from "axios";
import { toast } from "react-toastify";

export const getDistributionChannelDDL_api = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const GetSupplierAndVehicleInfo_api = async (
  type,
  buId,
  code,
  shipmentId,
  customerId,
  userId,
  transportZoneId,
  remarks,
  setter,
  setLoading,
  isUpdateMassage
) => {
  setLoading(true);
  const isRemarks = remarks ? `&Reasons=${remarks}` : "";
  try {
    let res = await Axios.get(
      `/oms/SalesInformation/GetTransportzoneInformationforzonechange?PartID=${type}&UnitID=${buId}&Delivercode=${code}&ShippingPoint=${shipmentId}&Customerid=${customerId}&UpdateBy=${userId}&Transportzoneid=${transportZoneId}${isRemarks}`
    );
    if (isUpdateMassage) {
      toast.success("Submitted successfully");
      setter([]);
      setLoading(false);
      return false;
    }

    if (res?.data?.length === 0) toast.warning("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    setter([]);
  }
};

export const UpdateBalance = async (partnerId, partId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/SalesInformation/UpdateBalance?partnerId=${partnerId}&Partid=${partId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getSalesOrderDetailInfo = async (
  partId,
  buId,
  soCode,
  shipPointId,
  productType,
  updateBy,
  reason,
  customerId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/CodeGenerate/GetSalesOrderDetInfo?Partid=${partId}&BusinessUnitId=${buId}&SalesOrderCode=${soCode}&ShippointId=${shipPointId}&ProductType=${productType}&UpdateBy=${updateBy}&Resson=${reason}&Customerid=${customerId}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        isSelected: false,
        productType: {
          value: item?.strProductType,
          label: item?.strProductType,
        },
      }))
    );
    setLoading(false);
  } catch (error) {
    toast.error(error.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};

export const GetSupplierListDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${busId}&SBUId=0`
    );

    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const CreatePurchasePartner = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/partner/BusinessPurchasePartnerShippoint/CreatePurchasePartnerShippoint`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const productTypeUpdate = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.post(
      `/oms/SalesInformation/CreateSalesInfoUpdate`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
