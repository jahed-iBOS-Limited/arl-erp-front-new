import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

// export const GetLighterStevedoreDDL = async (setter) => {
//   try {
//     const res = await Axios.get(
//       `/wms/FertilizerOperation/GetLighterStevedoreDDL`
//     );
//     if (res.status === 200) {
//       setter(res?.data);
//     }
//   } catch (error) {
//     setter([]);
//   }
// };

// export const getMotherVesselDDL = async (accId, buId, setter, portId) => {
//   try {
//     const res = await Axios.get(
//       `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${portId ||
//         0}`
//     );
//     setter(res.data);
//   } catch (error) {
//     setter([]);
//   }
// };

// export const getMotherVesselInfo = async (vesselId, portId, setLoading, cb) => {
//   setLoading && setLoading(true);
//   try {
//     const res = await Axios.get(
//       `/wms/FertilizerOperation/GetMVesselProgramDet?PortId=${portId}&MotherVesselId=${vesselId}`
//     );
//     cb && cb(res?.data);
//     setLoading && setLoading(false);
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//     setLoading && setLoading(false);
//   }
// };

export const setShipPointData = async (url, setter) => {
  try {
    const res = await Axios.get(url);
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const deleteG2GInfo = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/LigterLoadUnload/DeleteG2GItemInfo?IntId=${id}`
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getG2GData = async (url, setRowDto) => {
  try {
    const res = await Axios.get(url);
    setRowDto(res?.data);
  } catch (error) {
    setRowDto([]);
  }
};

export const getItemTypeData = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(`/wms/WmsReport/GetItemTypeListDDL`);
    setter(res?.data.filter((itm) => itm?.label !== "ALL"));
  } catch (error) {
    setter([]);
  }
};
export const getItemData = async (accId, buId, itemTypeId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/GetitemDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemTypeId}`
    );
    const data = res?.data.map((itm) => ({
      value: itm.itemId,
      label: itm.itemName,
      data: itm,
    }));
    setter(data);
  } catch (error) {
    setter([]);
  }
};
export const getSingleDataEdit = async (url, setter) => {
  try {
    const res = await Axios.get(url);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const postDataEdit = async (url, payload, cb) => {
  try {
    const res = await Axios?.put(url, payload);
    if (res?.status === 200) {
      toast.success("Edit success");
      cb && cb();
    }
  } catch (error) {
    toast.error(error?.message);
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
