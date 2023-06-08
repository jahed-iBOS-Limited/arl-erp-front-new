import Axios from "axios";
import * as Yup from "yup";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../../_helper/_todayDate";

export const initData = {
  //header
  supplyingWh: "",
  deliveryAddress: "",
  orderDate: _todayDate(),
  // last shipment date will after 15 days of current
  lastShipmentDate: _dateFormatter(
    new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000)
  ),  validity: _todayDate(),
  otherTerms: "",

  // row
  referenceNo: "",
  item: "",
  deliveryDate: "",
  isAllItem: false,
};

// Validation schema
export const validationSchema = Yup.object().shape({
  deliveryAddress: Yup.string().required("Delivery address is required"),
  orderDate: Yup.date().required("Order date is required"),
  lastShipmentDate: Yup.date().required("Last shipment date is required"),
  validity: Yup.date().required("Validity date is required"),
});

export const getSupplyingWhDDL = async (accId,userId,whId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/PlantWarehouse/GetWarehouseListBasedonUserPermissionDDL?AccountId=${accId}&UserId=${userId}`
    );
    if (res.status === 200 && res?.data) {
      let newData =  res.data.filter(data=> data?.value !== whId)
      setter(newData);
    }
  } catch (error) {
    
  }
};
