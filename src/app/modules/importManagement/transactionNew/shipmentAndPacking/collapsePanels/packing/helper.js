import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const getPackingListByShipmentId = async (
  accId,
  buId,
  shipmentId,
  setter
) => {
  try {
    let res = await axios.get(
      `/imp/Packing/GetPackingListByShipmentId?accountId=${accId}&businessUnitId=${buId}&shipmentId=${shipmentId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const createPacking = async (payload, cb) => {
  try {
    const res = await axios.post(`/imp/Packing/CreatePacking`, payload);
    if (res.status === 200) {
      cb();
      toast.success(res.data.message);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getPackingTypeDDL = async (setter) => {
  try {
    const res = await axios.get("/imp/ImportCommonDDL/PackingTypeDDL");
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message);
  }
};

export const deletePackingById = async (packingId) => {
  try {
    const res = await axios.put(
      `/imp/Packing/DeletePacking?packingId=${packingId}`
    );
    if (res.status === 200) {
      toast.success(res?.data?.message);
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message);
  }
};

export const packingValidationSchema = Yup.object().shape({
  quantity: Yup.number()
    .positive("Quantity Must be positive")
    .integer("Must be Integer"),

  packingType: Yup.object().shape({
    value: Yup.string().required("Packing Type is required"),
  }),
});
