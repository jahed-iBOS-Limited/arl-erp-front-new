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
    const checkDuplicate = rowData?.find(item=>item?.customerName === values?.customer?.label && item?.bankID === values?.bankName?.value && item?.bankAccountNumber === values?.bankAccountingNo && item?.branchID === values?.branchName?.value && item?.routingNumber === values?.branchName?.strRoutingNo && item?.glId === +values?.businessTransaction?.generalLedgerId)

    if(checkDuplicate){
      return toast.warn("Duplicate Data Not Allowed")
    }
    
    const newRow = {
      accountID: accId,
      businessUnitID: buId,
      plantID: location?.state?.plant?.value,
      sbuid: location?.state?.sbu?.value,
      billName: "",
      customerName:values?.customer?.label,
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
      glId: +values?.businessTransaction?.generalLedgerId,
      glName: values?.businessTransaction?.generalLedgerName,
      glCode: values?.businessTransaction?.generalLedgerCode,
      subGlId: values?.businessTransaction?.businessTransactionId,
      subGlName: values?.businessTransaction?.businessTransactionName,
      subGlCode: values?.businessTransaction?.businessTransactionCode,
      profitCenterId: values?.profitCenter?.value,
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