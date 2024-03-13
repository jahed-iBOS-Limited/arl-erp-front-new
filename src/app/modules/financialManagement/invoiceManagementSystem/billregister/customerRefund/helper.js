import axios from "axios";
import { toast } from "react-toastify";

export const tableHeader = [
    "SL",
    "Customer Name",
    "Bank Name",
    "Branch Name",
    "Account No",
    "Routing No",
    "Amount",
    "Remarks",
    "Action",
  ]

  export const removeDataFromRow = (index,rowData,setRowData) => {
    const rows = [...rowData];
    rows.splice(index, 1);
    setRowData(rows);
  };

  export const rowDataHandler = (values,rowData,setRowData,accId,buId,location,userId, cb) => {
    const checkDuplicate = rowData?.find(item=>item?.customerName === values?.customer?.label && item?.customerId === values?.customer?.value)
    if(checkDuplicate){
      return toast.warn("Duplicate Customer Not Allowed")
    }
    
    const newRow = {
      accountID: accId,
      businessUnitID: buId,
      plantID: location?.state?.plant?.value,
      sbuid: location?.state?.sbu?.value,
      billName: "",
      partnerName:values?.customer?.label,
      partnerId:values?.customer?.value,
      bankID: values?.bankName?.value,
      bankName: values?.bankName?.label,
      bankAccountNumber: values?.bankAccountingNo,
      branchID: values?.branchName?.value,
      branchName: values?.branchName?.label,
      routingNumber: values?.branchName?.strRoutingNo,
      remarks: values?.remarks,
      insertBy:userId,
      billID: 0,
      amount: values?.amount,
      billRegisterDate: values?.billRegisterDate,
    };
    setRowData([...rowData,{...newRow}]);
    cb();
  };

  export const convertBalance = (number)=>{
   if(number<0){
    return Math.abs(number);
   }else{
    return -number
   }
  }

  export const debounce=(func, delay)=> {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export const uploadAtt = async (attachment)=>{
  const formData = new FormData()
  attachment.forEach(file=>{
    formData.append("files",file)
  })
  return axios.post("/domain/Document/UploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
