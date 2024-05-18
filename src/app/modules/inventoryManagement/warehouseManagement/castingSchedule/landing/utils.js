import { toast } from "react-toastify";

export const rowDataAddHandler = (rowData, setRowData, values) => {
  const filterDuplicate = rowData?.some(
    (item) => item?.intItemId === values?.item?.value
  );

  if (filterDuplicate) return toast.warn("Duplicate data not allowed");

  const payload = {
    intRowId: 0, // RowId
    intCastingId: 0, // HeaderId
    intItemId: values?.item?.value,
    strItemName: values?.item?.label,
    numQuantity: values?.numQuantity,
    strShift: values?.strShift?.label,
    intNumberOfPump: values?.intNumberOfPump,
    intPipeFeet: values?.intPipeFeet,
    intLargeTyre: values?.intLargeTyre,
    intSmallTyre: values?.intSmallTyre,
    intBagCementUse: values?.intBagCementUse,
    isWaterProof: values?.waterproof?.value === 1,
    intNumberOfNonePump:values?.nonPump || 0,
  };

  const copy = [...rowData];
  setRowData([...copy, payload]);
};

export const removeRowData = (index, rowData, setRowData) => {
  const filterData = rowData?.filter((_, i) => index !== i);
  setRowData(filterData);
};
