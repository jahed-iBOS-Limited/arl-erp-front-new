import Axios from "axios";
import * as Yup from "yup";

export const initData = {
  refType:"",
  refNo:"",
  transType:"",
  busiPartner:"",
  personnel:"",
  remarks:"",
  item:"",
  costCenter:"",
  projName:"",
  isAllItem:false,
  file: ""
};

// // Validation schema
export const validationSchema = Yup.object().shape({
  refType: Yup.object().shape({
    label: Yup.string().required("Refference Type is required"),
    value: Yup.string().required("Refference Type is required"),
  }),
  transType: Yup.object().shape({
    label: Yup.string().required("Transaction Type is required"),
    value: Yup.string().required("Transaction Type is required"),
  }),
  // item: Yup.object().shape({
  //   label: Yup.string().required("Item is required"),
  //   value: Yup.string().required("Item is required"),
  // })
});

// Get purchase contract item
export const getPurchaseContractItem = async (refTypeId, refNoId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDL?RefTypeId=${refTypeId}&RefNoId=${refNoId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getBomList = async (accId, buId, plantId, itemId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/getBOM?AccountId=${accId}&UnitId=${buId}&PlantId=${plantId}&ItemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
