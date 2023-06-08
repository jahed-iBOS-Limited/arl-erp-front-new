import * as Yup from "yup";

export const initData = {
  refType:"",
  refNo:"",
  transType:"",
  remarks:"",
  item:"",
  quantity:"",
  locaStockType:"",
  locaStock:"",
  personnel:"",
  costCenter:"",
  projName:"",
  busiPartner:"",
  presentLocation:""
};

// // Validation schema
export const validationSchema = Yup.object().shape({
  refType: Yup.object().shape({
    label: Yup.string().required("Reference Type is required"),
    value: Yup.string().required("Reference Type is required"),
  }),
  // transType: Yup.object().shape({
  //   label: Yup.string().required("Transaction Type is required"),
  //   value: Yup.string().required("Transaction Type is required"),
  // }),
  // item: Yup.object().shape({
  //   label: Yup.string().required("Item is required"),
  //   value: Yup.string().required("Item is required"),
  // }),
  // locaStockType: Yup.object().shape({
  //   label: Yup.string().required("Stock/Location is required"),
  //   value: Yup.string().required("Stock/Location is required"),
  // }),
  // locaStock: Yup.object().shape({
  //   label: Yup.string().required(" is required"),
  //   value: Yup.string().required(" is required"),
  // }),
});

