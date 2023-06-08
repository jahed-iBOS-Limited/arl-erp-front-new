import axios from "axios";
import { toast } from "react-toastify";




export const getShippingBillRegisterPagination_api = async (
   accId,
   buId,
   plantId,
   sbu,
   costCenterId,
   typeId,
   pageNo,
   pageSize,
   setter,
   setDisabled,
   values
 ) => {
   try {
     setDisabled(true);
 
     const res = await axios.get(
       `/fino/BillRegister/BillRegisterPagination?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ViewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&SBUId=${sbu}&TypeId=${typeId}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&CostCenterId=${costCenterId || 0}`
     );
     setDisabled(false);
     if (res.status === 200 && res?.data) {
       setter(res?.data);
     }
   } catch (error) {
     setDisabled(false);
   }
 };

 export const getShippingGRNDDL = async (
   accId,
   buId,
   SBUId,
   plantId,
   wareId,
   refId,
   refCode,
   setter
 ) => {
   try {
     const res = await axios.get(
       `/wms/InventoryTransaction/GetGrnDDLShipping?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${SBUId}&PlantId=${plantId}&WarehouseId=${wareId}&ReferenceId=${refId}&ReferenceCode=${refCode}`
     );
     const newData = res?.data?.map((item) => ({
       ...item,
       label: `${item?.label}(${item?.challanNo})`,
     }));
     setter(newData);
   } catch (error) {
     setter([]);
   }
 };

 export const GetShippingSupplierAmountInfo = async (poId, setter, setFieldValue) => {
   try {
     const res = await axios.get(
       `/fino/SupplierInvoiceInfo/GetSupplierAmountInfo?PoId=${poId}`
     );
     if (res.status === 200 && res?.data) {
       setter(res?.data);
       setFieldValue &&
         setFieldValue("totalAdjustedBalance", res?.data?.totalAdjustedBalance);
       setFieldValue("poAdvanceAmount", res?.data?.poAdvanceAmount);
       setFieldValue(
         "curentAdjustmentBalance",
         res?.data?.poAdvanceAmount // - res?.data?.totalAdjustedBalance
       );
     }
   } catch (error) {}
 };

 export const saveShippingPurchaseInvoice = async (
   data,
   cb,
   setgrnGridData,
   setDisabled,
   setFileObjects,
   modalView
 ) => {
   setDisabled(true);
   try {
     const res = await axios.post(
       `/procurement/SupplierInvoice/CreateSupplierInvoiceShipping`,
       data
     );
     // if (res.status === 200) {
     if (res?.data?.statuscode === 200) {
       setFileObjects([]);
       setgrnGridData([]);
       modalView(res?.data?.code);
       toast.success(res.data?.message || "Submitted successfully");
       cb();
       setDisabled(false);
     } else {
       toast.error(res.data?.message || "Invoice Already Exists");
       setDisabled(false);
     }
     // }
   } catch (error) {
     toast.error(error?.res?.data?.message);
     setDisabled(false);
   }
 };

 export const GetShippingInvoiceById_api = async (id, buId, setter, setDisabled) => {
  try {
    setDisabled(true);
    const res = await axios.get(
      `/procurement/SupplierInvoice/GetSupplierInvoiceById?BillId=${id}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled(false);
      setter(res?.data);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const ShippingBillApproved_api = async (
  actionById,
  data,
  setDisabled,
  girdDataFunc,
  values,
  setModalShow
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/fino/BillRegister/BillApproved?ActionById=${actionById}`,
      data
    );
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "BillApproved",
      });
      girdDataFunc(values);
      setModalShow && setModalShow(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message, {
      toastId: "BillApproved",
    });
  }
};