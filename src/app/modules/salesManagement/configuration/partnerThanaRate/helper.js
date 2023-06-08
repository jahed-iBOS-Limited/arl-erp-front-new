import axios from "axios";
import { toast } from "react-toastify";

export const getShippointDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getSoldToPartnerDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getShipToPartnerDDL = async (accId, buId, partnerId, setter) => {
  try {
    let res = await axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerSalesShippingAddress?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${partnerId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getransportZoneDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getVehicleCapacityDDL = async (setter) => {
  try {
    let res = await axios.get(`/tms/TransportMgtDDL/GetVehicleCapacityDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const savePartnerTransportZoneAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/partner/PartnerThanaRate/CreatePartnerThanaRate`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveEditedPartnerTransportZoneAction = async (
  data,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      `/partner/PartnerThanaRate/EditPartnerThanaRate`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getPartnerTransportZoneLanding = async (
  accountId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/partner/PartnerThanaRate/GetPartnerThanaRateLandingPagination?AccountId=${accountId}&BusniessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetPartnerTransportZoneById = async (partnerId, setter) => {
  try {
    const res = await axios.get(
      `/partner/PartnerThanaRate/GetPartnerThanaRateById?PartnerThanaRateId=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newData = {
        ...data,
        shippoint: {
          value: data?.shippointId,
          label: data?.shippointName,
        },
        // soldToPartner: {
        //   value: data?.partnerId,
        //   label: data?.partnerName,
        // },
        // shipToPartner: {
        //   value: data?.shiptoPartnerId,
        //   label: data?.shiptoPartnerName,
        // },
        transportZone: {
          value: data?.transportZoneId,
          label: data?.transportZoneName,
        },
        rate: data?.perBagPrice,
        vehicleCapacity: {
          value: data?.vehicleCapacityId || 0,
          label: data?.vehicleCapacityName || "",
        },
      };
      setter(newData);
    }
  } catch (error) {}
};
