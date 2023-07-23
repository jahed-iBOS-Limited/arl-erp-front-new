import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

export const validationSchema = Yup.object().shape({
  shippingPoint: Yup.object().shape({
    value: Yup.string().required("Ship Point is required"),
    label: Yup.string().required("Ship Point is required"),
  }),
  route: Yup.object().shape({
    value: Yup.string().required("Route is required"),
    label: Yup.string().required("Route is required"),
  }),
  wareHouse: Yup.object().shape({
    value: Yup.string().required("Warehouse is required"),
    label: Yup.string().required("Warehouse is required"),
  }),
  transportZone: Yup.object().shape({
    value: Yup.string().required("Transport zone is required"),
    label: Yup.string().required("Transport zone is required"),
  }),
});

export const validationSchemaTwo = Yup.object().shape({
  employee: Yup.object().shape({
    value: Yup.string().required("Employee is required"),
    label: Yup.string().required("Employee is required"),
  }),
  shippingPoint: Yup.object().shape({
    value: Yup.string().required("Ship Point is required"),
    label: Yup.string().required("Ship Point is required"),
  }),
  // bank: Yup.object().shape({
  //   value: Yup.string().required("Bank is required"),
  //   label: Yup.string().required("Bank is required"),
  // }),
  // branch: Yup.object().shape({
  //   value: Yup.string().required("Branch is required"),
  //   label: Yup.string().required("Branch is required"),
  // }),
});
export const createAndUpdateSupplierByShippoint = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/wms/ShipPointWarehouse/CreateAndUpdateSupplierByShippoint`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
