import * as Yup from "yup";

export const initData = {
  refType: {value: 11, label: "NA (Without Reference)"},
  refNo:"",
  transType: {value: 19, label: "Transfer Out"},
  transplant:"",
  transWare:"",
  remarks:"",
  costCenter:"",
  projName:"",
  personnel:"",
  busiPartner:"",
  item:"",
  isAllItem:false,
  location:""
};

// // Validation schema
export const validationSchema = Yup.object().shape({
  transType: Yup.object().shape({
    label: Yup.string().required("Transaction Type is required"),
    value: Yup.string().required("Transaction Type is required")
  }),
  refType: Yup.object().shape({
    label: Yup.string().required("Refference Type is required"),
    value: Yup.string().required("Refference Type is required")
  }),
  transplant: Yup.object().shape({
    label: Yup.string().required("Trans Plant is required"),
    value: Yup.string().required("Trans Plant is required")
  })
  ,
  transWare: Yup.object().shape({
    label: Yup.string().required("Trans  Warehouse is required"),
    value: Yup.string().required("Trans Warehouse is required")
  })
  ,
  // refNo: Yup.object().shape({
  //   label: Yup.string().required("Refference no is required"),
  //   value: Yup.string().required("Refference no  is required")
  // }),
  // location: Yup.object().shape({
  //   label: Yup.string().required("Refference no is required"),
  //   value: Yup.string().required("Refference no  is required")
  // })

});
