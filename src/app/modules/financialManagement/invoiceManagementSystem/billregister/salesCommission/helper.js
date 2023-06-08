import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../_helper/_todayDate";

export const GetShipPointDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetSalesCommissionReport = async (
  accId,
  buId,
  shipPointId,
  partnerId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/WmsReport/GetPendingSecondaryDeliveryCommissionBill?AccountId=${accId}&BusinessUnitId=${buId}&ShippointId=${shipPointId}&PartnerId=${partnerId}`
    );
    const modifyData = res?.data?.map((item) => ({ ...item, isSelect: false }));
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    toast.error(error.message);
    setter([]);
    setLoading(false);
  }
};

export const billRegisterForSalesCommission = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/fino/BillRegister/CommissionBillRegister`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
  } catch (error) {
    toast.error(error.message);
  }
};

export const GetSalesCommissionById = async (deliveryId, setter) => {
  try {
    const res = await axios.get(
      `/wms/SecondaryDelivery/GetSecondaryDeliveryById?SecondaryDeliveryId=${deliveryId}`
    );
    if (res.status === 200 && res?.data) {
      const {
        shippointId,
        shippointName,
        numComission,
        soldToPartnerId,
        soldToPartnerName,
        supplierId,
        supplierName,
        supplierDate,
        itemId,
        itemName,
        itemRate,
        numQuantity,
        numTotalPrice,
        fromCountryName,
        deliveryAddress,
        lcnumber,
        dteLcdate,
        bankName,
        permissionNumber,
        govtRate,
        shipName,
        dtePermissionDate,
        deliveryDate,
        color,
        zilaName,
        upzilaName,
      } = res?.data;
      const modified = {
        ...res?.data,
        sbu: "",
        shippoint: shippointId
          ? { value: shippointId, label: shippointName }
          : "",
        commission: numComission || 0,
        soldToParty: soldToPartnerId
          ? { value: soldToPartnerId, label: soldToPartnerName }
          : "",
        supplierName: supplierId
          ? { value: supplierId, label: supplierName }
          : "",
        supplierDate: _dateFormatter(supplierDate) || _todayDate(),
        itemName: itemId ? { value: itemId, label: itemName } : "",
        itemPrice: itemRate || 0,
        quantity: numQuantity || 0,
        totalPrice: numTotalPrice || 0,
        supplierCountry: fromCountryName || "",
        deliveryAddress: deliveryAddress || "",
        lcNo: lcnumber || "",
        lcDate: _dateFormatter(dteLcdate) || _todayDate(),
        bankName: bankName || "",
        permissionNumber: permissionNumber || "",
        govtPrice: govtRate || 0,
        permissionDate: _dateFormatter(dtePermissionDate) || _todayDate(),
        challanDate: _dateFormatter(deliveryDate) || _todayDate(),
        shipName: shipName || "",
        maxQuantity: 100000000,
        color: color || "",
        district: zilaName || "",
        upazila: upzilaName || "",
      };
      setter(modified);
    }
  } catch (error) {}
};

export const GetCommissionByBillRegisterId = async (
  accId,
  buId,
  billRegisterId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/WmsReport/GetcommisionByBillRegisterId?AccountId=${accId}&BusinessUnitId=${buId}&BillRegsiterId=${billRegisterId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export async function getDistributionChannelDDL(accId, buId, setter) {
  try {
    const res = await axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
}

export async function getSoldToPartner(
  accId,
  buId,
  distributionChannel,
  setter
) {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetCustomerDDlByDistribution?AccountId=${accId}&BusienssUnitId=${buId}&DistributionId=${distributionChannel}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
}

export const GetAccOfPartnerDDl_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/SecondaryDelivery/GetAccOfPartnerDDl?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};