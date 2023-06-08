import axios from "axios";
import * as Yup from "yup";

export const initData = {
  refType:"",
  refNo:"",
  transType:"",
  costCenter:"",
  projName:"",
  busiPartner:"",
  personnel:"",
  remarks:"",
  costElement:"",
  item:"",
  isAllItem:false,
  file: "",
  profitcenter:"",
};

// // Validation schema
export const validationSchema = Yup.object().shape({
  refType: Yup.object().shape({
    label: Yup.string().required("RefType is required"),
    value: Yup.string().required("RefType is required"),
  }),
  transType: Yup.object().shape({
    label: Yup.string().required("TransType is required"),
    value: Yup.string().required("TransType is required"),
  }),
  // costElement: Yup.object().shape({
  //   label: Yup.string().required("Cost Element is required"),
  //   value: Yup.string().required("Cost Element is required"),
  // }),
  // costCenter: Yup.object().shape({
  //  label: Yup.string().required("Cost Center is required"),
  //  value: Yup.string().required("Cost Center is required"),
  // })
});



export const CostElementDDLApi = async (accId,buId,costCenterId,setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accId}&UnitId=${buId}&CostCenterId=${costCenterId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}


