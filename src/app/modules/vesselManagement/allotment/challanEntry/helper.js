import axios from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

export const getShipToPartyDDL = async (
  accId,
  buId,
  soldToPartnerId,
  shipPointId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetShipToParty?AccountId=${accId}&BusinessUnitId=${buId}&SoldToPartnerId=${soldToPartnerId}&shippointid=${shipPointId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getVehicleDDL = async (
  accId,
  buId,
  ownerId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetVehicleInfoByOwnerTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&OwnerType=${ownerId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getChallanById = async (deliveryId, setter, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetLighterChallanInfoByChallanNo?DeliveryId=${deliveryId}`
    );
    setter(res?.data);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getLightersForChallan = async (
  shipPointId,
  vesselId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetLighterVesselNItemDDL?ShipPointId=${shipPointId}&MotherVesselId=${vesselId}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        value: item?.lighterVessel,
        label: item?.lighterVesselName,
      }))
    );
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
export const StockOutFromInventoryApproval = async (payload, cb) => {
  try {
    await axios.put(
      `/tms/LigterLoadUnload/StockOutFromInventoryApproval`,
      payload
    );
    toast.success('Approved');
    cb();
  } catch (error) {
    // toast.error(error?.response?.data?.message);
  }
};
export const StockInToInventoryApproval = async (payload, cb) => {
  try {
    await axios.put(`tms/LigterLoadUnload/StockInToInventoryApproval`, payload);
    toast.success('Approved');
    cb();
  } catch (error) {
    // toast.error(error?.response?.data?.message);
  }
};
export const GetLighterChallanInfoById = async (deliveryId, setter, cb) => {
  try {
    const res = await axios?.get(
      `/tms/LigterLoadUnload/GetLighterChallanInfoById?DeliveryId=${deliveryId}`
    );
    if (res?.status === 200) {
      setter && setter(res?.data);
      cb && cb(res?.data);
    }
  } catch (error) {}
};
export const EditLighterChallanInfo = async (payload, cb) => {
  try {
    const res = await axios?.put(
      `/tms/LigterLoadUnload/EditLighterChallanInfo`,
      payload
    );
    if (res?.status === 200) {
      toast.success('Edit success');
      cb && cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
// Validation schema
export const validationSchema = Yup.object().shape({
  shipPoint: Yup.object().shape({
    label: Yup.string().required('Mother Vessel is required'),
    value: Yup.string().required('Mother Vessel is required'),
  }),
  motherVessel: Yup.object().shape({
    label: Yup.string().required('Mother Vessel is required'),
    value: Yup.string().required('Mother Vessel is required'),
  }),
  // program: Yup.object().shape({
  //   label: Yup.string().required("Program is required"),
  //   value: Yup.string().required("Program is required"),
  // }),
  lighterVessel: Yup.object().shape({
    label: Yup.string().required('Lighter Vessel is required'),
    value: Yup.string().required('Lighter Vessel is required'),
  }),
  logisticBy: Yup.object().shape({
    label: Yup.string().required('Logistic by is required'),
    value: Yup.string().required('Logistic by is required'),
  }),
  supplier: Yup.object().shape({
    label: Yup.string().required('Supplier is required'),
    value: Yup.string().required('Supplier is required'),
  }),
  vehicle: Yup.object().shape({
    label: Yup.string().required('Vehicle is required'),
    value: Yup.string().required('Vehicle is required'),
  }),
  driver: Yup.string().required('Driver Name is required'),
  mobileNo: Yup.string().required('Mobile No is required'),
  godown: Yup.object().shape({
    label: Yup.string().required('Destination/Godown Name is required'),
    value: Yup.string().required('Destination/Godown Name is required'),
  }),
  address: Yup.string().required('Delivery address is required'),
  deliveryDate: Yup.string().required('Delivery date is required'),
  shippingChallanNo: Yup.string().required('Shipping challan no is required'),
});
