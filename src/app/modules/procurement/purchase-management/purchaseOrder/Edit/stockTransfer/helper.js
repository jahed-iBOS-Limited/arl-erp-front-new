import Axios from "axios";
import * as Yup from "yup";
import { _todayDate } from "../../../../../_helper/_todayDate";

export const initData = {
  //header
  supplyingWh: "",
  deliveryAddress: "",
  orderDate: _todayDate(),
  lastShipmentDate: _todayDate(),
  validity: _todayDate(),
  otherTerms: "",

  // row
  referenceNo: "",
  item: "",
  deliveryDate: "",
  isAllItem: false,
};

//  Validation schema
export const validationSchema = Yup.object().shape({
  deliveryAddress: Yup.string().required("Delivery address is required"),
  orderDate: Yup.date().required("Order date is required"),
  lastShipmentDate: Yup.date().required("Last shipment date is required"),
  validity: Yup.date().required("Validity date is required"),
  
});

export const getSupplyingWhDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/PlantWarehouse/GetPlantWarehouseSupplierDDL?AccountId=${accId}&BusinessUnit=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
