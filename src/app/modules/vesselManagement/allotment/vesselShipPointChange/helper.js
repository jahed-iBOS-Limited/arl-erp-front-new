import Axios from "axios";
import * as Yup from "yup";

export const GetDomesticPortDDL = async (setter) => {
  try {
    const res = await Axios.get(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getMotherVesselDDL = async (accId, buId, portId, setter) => {
  try {
    const res = await Axios.get(
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
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetLighterVesselDDL?MotherVesselId=${motherVesselId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetShipPointDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const GetLandingData = async (values, setter) => {
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GTOGLighterVesselShipPointChange?intLighterVesselId=${values
        ?.lighterVessel?.value || 0}&intShipPointid=${values?.shipPoint
        ?.value || 0}&intBusinessUnitId=94&intPortId=${values?.domesticPort
        .value || 0}&intMotherVesselId=${values?.motherVessel?.value ||
        0}&intPartid=${values?.type?.value || 0}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const GetBillingData = async (values, setter) => {
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GetG2GChallanSupportInformation?accountId=1&businessUnitId=${values?.buId}&supplierId=0&challanNumber=${values?.challanNumber}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const validationSchema = Yup.object().shape({
  item: Yup.object().shape({
    label: Yup.string().required("Item is required"),
    value: Yup.string().required("Item is required"),
  }),
  shipPoint: Yup.object().shape({
    label: Yup.string().required("Shipping Point is required"),
    value: Yup.string().required("Shipping Point is required"),
  }),
  date: Yup.string().required("Date is required"),
  bustingBagQnt: Yup.number().required("Quantity is required"),
  othersBagQnt: Yup.number().required("Quantity is required"),
  cnfbagQnt: Yup.number().required("Quantity is required"),
});
