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
  isAllItem:false
};

// // Validation schema
export const validationSchema = Yup.object().shape({
  refType: Yup.object().shape({
    label: Yup.string().required("Refference Type is required"),
    value: Yup.string().required("Refference Type is required")
  }),
  transType: Yup.object().shape({
    label: Yup.string().required("Transaction Type is required"),
    value: Yup.string().required("Transaction Type is required")
  }),
  // item: Yup.object().shape({
  //   label: Yup.string().required("Item is required"),
  //   value: Yup.string().required("Item is required")
  // })
});



