import { toast } from "react-toastify";
import { createShipmentCharge, getPortCharge, getPortChargeLanding } from "./helper";

export const setDataToGridData = (key, index, value, grid, setter, label) => {
  let data = [...grid];
  data[index][key] = value;
  setter([...data]);
};

export const initData = {
  poLcDDL: "",
  shipmentDDL: "",
  vendor: "",
  totalAmount: "",
  vatAmount: "",
  dueDate: "",
  serviceReceiveDate: "",
  shipmentExchangeRate: "",
};

export const clickSaveBtn = (
  item,
  values,
  setDisabled,
  profileData,
  selectedBusinessUnit,
  setGridData,
  setLoading,
  setData,
  setReferenceId
) => {
  if(item?.value===3||item?.value===4 || item?.value===9 || item?.value===10){
    if (
      !item?.dueDate ||
      !item?.serviceReceiveDate ||
      !item?.totalAmount ||
      !values?.shipmentDDL ||
      !values?.poLcDDL
    ) {
      return toast.warn("Please fill all field");
    } else {
      if (item?.totalAmount > 0 ) {
        if (item?.label === "CnF Payment" && !values?.shipmentExchangeRate) {
          return toast.warn("Please give exchange rate");
        }
        if(+item?.totalAmount < +item?.vatAmount) return toast.warn("Total Amount Must Be Greater Than Vat Amount", { toastId: "Compare Vat and Total Amount" })
        return createShipmentCharge(
          setDisabled,
          values,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          item,
          () => {
            getPortChargeLanding(
              profileData?.accountId,
              selectedBusinessUnit.value,
              values?.poLcDDL?.label,
              values?.shipmentDDL?.label,
              setGridData,
              setLoading
            );
            getPortCharge(
              profileData?.accountId,
              selectedBusinessUnit.value,
              values?.poLcDDL?.poId,
              values?.shipmentDDL?.value,
              setData,
              setReferenceId
            )
          }
        );
      } 
      else {
        toast.warn("Total amount must be positive", {
          // and vat amount
          toastId: "TotalAmountPositive",
        });
      }
    }
  }else{
    if (
      !item?.dueDate ||
      !item?.serviceReceiveDate ||
      !item?.totalAmount ||
      (item.isMultipleSupplier ? false : !item?.vendor) ||
      !values?.shipmentDDL ||
      !values?.poLcDDL
    ) {
      return toast.warn("Please fill all field");
    } else {
      if (item?.totalAmount > 0 ) {
        if (item?.label === "CnF Payment" && !values?.shipmentExchangeRate) {
          return toast.warn("Please give exchange rate");
        }
        if(+item?.totalAmount < +item?.vatAmount) return toast.warn("Total Amount Must Be Greater Than Vat Amount", { toastId: "Compare Vat and Total Amount" })
        return createShipmentCharge(
          setDisabled,
          values,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          item,
          () => {
            getPortChargeLanding(
              profileData?.accountId,
              selectedBusinessUnit.value,
              values?.poLcDDL?.label,
              values?.shipmentDDL?.label,
              setGridData,
              setLoading
            );
            getPortCharge(
              profileData?.accountId,
              selectedBusinessUnit.value,
              values?.poLcDDL?.poId,
              values?.shipmentDDL?.value,
              setData,
              setReferenceId
            )
          }
        );
      } 
      else {
        toast.warn("Total amount must be positive", {
          // and vat amount
          toastId: "TotalAmountPositive",
        });
      }
    }
  }
};

export const disabledFunction = (
  shipmentExchangeRate,
  cnfAgent,
  key,
  gridData,
  index
) => {
  if (
    (!shipmentExchangeRate || shipmentExchangeRate) &&
    cnfAgent === "CnF Payment"
  ) {
    return (gridData[index]["CnF Payment"] = "disabled");
  }
  return "";
};
