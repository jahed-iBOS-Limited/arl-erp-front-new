import Axios from "axios";
import * as Yup from "yup";

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

export const GetCarrierDDL = async (accId, buId, port, setter) => {
  try {
    const res = await Axios.get(
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
export const GetLandingData = async (pageNo, pageSize, values, setter) => {
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GTOGLighterVesselShipPointChange?intLighterVesselId=${values?.lighterVessel?.value}&intShipPointid=${values?.shipPoint?.value}&intBusinessUnitId=94&intPortId=${values.domesticPort.value}&intMotherVesselId=${values.motherVessel.value}&intPartid=${values?.type?.value}`
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
