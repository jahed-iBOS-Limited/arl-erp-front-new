import { toast } from "react-toastify";
import * as Yup from "yup";
import * as XLSX from "xlsx";
import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";

export const itemSchema = Yup.object().shape({
  itemMasterName: Yup.string().required(),
  itemMasterTypeId: Yup.number().required(),
  itemMasterCategoryId: Yup.number().required(),
  itemMasterSubCategoryId: Yup.number().required(),
  businessUnitId: Yup.number().required(),
  purchaseOrganizationId: Yup.number().required(),
  drawingCode: Yup.string().optional(),
  partNo: Yup.number().optional(),
  isSerialMaintain: Yup.number().optional(),
});

export const getValidationError = (itemList) => {
  const isNotValid = itemList?.some((item) => !itemSchema?.isValidSync(item));
  if (isNotValid) {
    toast.warn("Invalid data set! please update and try again");
  }
  return isNotValid;
};

export const readAndPrintExcelData = async ({
  file,
  setLoading,
  setIsValidationError,
  setRowData,
  cb,
}) => {
  setLoading(true);
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      resolve(data);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
  try {
    const itemList = await promise;
    if (!itemList?.length > 0) {
      setLoading(false);
      return toast?.warning("No item found!");
    }
    setIsValidationError(getValidationError(itemList));
    setRowData(itemList || []);
    setLoading(false);
    cb && cb();
  } catch (err) {
    setLoading(false);
  }
};
export const mapApiResponseToFrontend = (apiData) => {
  return apiData.map((item) => ({
    itemMasterCode: item.itemId || "",
    itemMasterName: item.itemName || "",
    itemMasterTypeId: item.itemTypeId || 0,
    itemMasterCategoryId: item.itemCategoryId || 0,
    itemMasterSubCategoryId: item.itemSubCategoryId || 0,
    purchaseOrganizationId: item.purchaseOrganizationId || 0,
    drawingCode: "",
    partNo: "",
    isSerialMaintain: "",
    maxLeadDays: item.maxLeadDays || 0,
    warehouseId: item.warehouseId || 0,
    plantId: item.plantId || 0,
    inventoryLocationId: item.inventoryLocationId || 0,
    binNumber: item.binNumber || "",
    uomName: item.uomName || "",
    status: item.status || "",
  }));
};

export const itemListExcelGenerator = (itemList) => {
  const header = [
    {
      text: "Item Code",
      textFormat: "number",
      alignment: "center:middle",
      key: "itemMasterCode",
    },
    {
      text: "Item Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "itemMasterName",
    },
    {
      text: "Item Type Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "itemMasterTypeId",
    },
    {
      text: "Item Category Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "itemMasterCategoryId",
    },
    {
      text: "Item Sub Category Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "itemMasterSubCategoryId",
    },
    {
      text: "Purchase Organization Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "purchaseOrganizationId",
    },
    {
      text: "Drawing Code",
      textFormat: "text",
      alignment: "center:middle",
      key: "drawingCode",
    },
    {
      text: "Part No",
      textFormat: "text",
      alignment: "center:middle",
      key: "partNo",
    },
    {
      text: "Serial Maintain",
      textFormat: "text",
      alignment: "center:middle",
      key: "isSerialMaintain",
      formatter: (item) => (item.isSerialMaintain ? "Yes" : "No"),
    },
    {
      text: "maxLeadDays",
      textFormat: "text",
      alignment: "center:middle",
      key: "maxLeadDays",
    },
    {
      text: "warehouseId",
      textFormat: "text",
      alignment: "center:middle",
      key: "warehouseId",
    },
    {
      text: "plantId",
      textFormat: "text",
      alignment: "center:middle",
      key: "plantId",
    },
    {
      text: "inventoryLocationId",
      textFormat: "text",
      alignment: "center:middle",
      key: "inventoryLocationId",
    },
    {
      text: "binNumber",
      textFormat: "text",
      alignment: "center:middle",
      key: "binNumber",
    },
    {
      text: "uomName",
      textFormat: "text",
      alignment: "center:middle",
      key: "uomName",
    },
    {
      text: "Status",
      textFormat: "text",
      alignment: "center:middle",
      key: "status",
      formatter: (item) => item.status,
    },
  ];

  generateJsonToExcel(header, itemList, "Item_list");
};
