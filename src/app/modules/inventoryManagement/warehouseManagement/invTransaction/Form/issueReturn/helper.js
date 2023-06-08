import * as Yup from 'yup'
import axios from 'axios'

export const initData = {
  refType: {value: 7, label: "Inventory Request"},
  refNo: '',
  transType: {value: 7, label: "Receive For Issue Return"},
  busiPartner: '',
  personnel: '',
  remarks: '',
  item: '',
  costCenter: '',
  projName: '',
  isAllItem: false,
  getEntry: '',
  file: '',
  challanNO:"",
  challanDate:"",
  vatChallan:"",
  vatAmmount:"",
  freight:"",
  grossDiscount:"",
  commission:"",
  foreignPurchase:"",
  othersCharge: ""
}

// // Validation schema
export const validationSchema = Yup.object().shape({
  refType: Yup.object().shape({
    label: Yup.string().required('Refference Type is required'),
    value: Yup.string().required('Refference Type is required'),
  }),
  transType: Yup.object().shape({
    label: Yup.string().required('Transaction Type is required'),
    value: Yup.string().required('Transaction Type is required'),
  }),
  // item: Yup.object().shape({
  //   label: Yup.string().required("Item is required"),
  //   value: Yup.string().required("Item is required")
  // })
})

export const getSupplierDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=${sbuId}`
    )
    if (res.status === 200 && res?.data) {
      let newData = res?.data?.map(data =>{
        return {
          ...data,
          label:data?.labelValue
        }
      })
      setter(newData)
    }
  } catch (error) {
    
  }
}




