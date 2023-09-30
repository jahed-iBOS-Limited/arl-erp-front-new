import axios from "axios";
export const getShippointDDL = async (accId, buId, setter) => {
    try {
        const res = await axios.get(
            `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
        );
        setter(res?.data);
    } catch (error) {
        setter([]);
    }
};

export const getMotherVesselDDL = async (accId, buId, portId, setter) => {
    try {
        const res = await axios.get(
            `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${portId ||
            0}`
        );
        setter(res.data);
    } catch (error) {
        setter([]);
    }
};

export const GetLighterVesselDDL = async (motherVesselId, setter) => {
    try {
        const res = await axios.get(
            `/wms/FertilizerOperation/GetLighterVesselDDL?MotherVesselId=${motherVesselId}`
        );
        setter(res?.data);
    } catch (error) {
        setter([]);
    }
};

export const GetDomesticPortDDL = async (setter) => {
    try {
      const res = await axios.get(
        `https://imarine.ibos.io/domain/LighterVessel/GetDomesticPortDDL`
      );
      setter(res?.data);
    } catch (error) {
      setter([]);
    }
  };

  export const getSupplierDDL = async (accId, buId, setter) => {
    try {
      const res = await axios.get(
        `/partner/PManagementCommonDDL/GetCustomerNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      if (res.status === 200 && res?.data) {
        setter(res?.data);
      }
    } catch (error) {}
  };

  export const GetCarrierDDL = async (accId, buId, port, setter) => {
    try {
      const res = await axios.get(
        `/wms/FertilizerOperation/GetLighterCarrierDDL?BusinessUnitId=${buId}&PortId=${port}`
      );
      const data = res?.data?.map((itm) => ({
        value: itm?.carrierId,
        label: itm?.carrierName,
      }));
      setter(data);
    } catch (error) {
      setter([]);
    }
  };

export const GetDomesticPortDDLWMS = async (setter) => {
  try {
    const res = await axios.get(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};