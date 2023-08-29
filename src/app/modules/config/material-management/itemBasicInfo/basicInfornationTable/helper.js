import { toast } from 'react-toastify';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { generateJsonToExcel } from '../../../../_helper/excel/jsonToExcel';

export const itemSchema = Yup.object().shape({
  itemName: Yup.string().required(),
  itemTypeId: Yup.number().required(),
  itemCategoryId: Yup.number().required(),
  itemSubCategoryId: Yup.number().required(),
  plantId: Yup.number().required(),
  warehouseId: Yup.number().required(),
  inventoryLocationId: Yup.number().required(),
  binNumber: Yup.string().required(),
  uomName: Yup.string().required(),
  hscode: Yup.string().optional(),
  maxLeadDays: Yup.number().optional(),
});

export const getValidationError = (itemList) => {
  const isNotValid = itemList?.some((item) => !itemSchema?.isValidSync(item));
  if (isNotValid) {
    toast.warn('Invalid data set! please update and try again');
  }
  return isNotValid;
};

export const readAndPrintExcelData = async ({
  file,
  setLoading,
  setIsValidationError,
  setRowData,
  cb
}) => {
  setLoading(true);
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb = XLSX.read(bufferArray, { type: 'buffer' });
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
      return toast?.warning('No item found!');
    }
    setIsValidationError(getValidationError(itemList));
    setRowData(itemList || []);
    setLoading(false);
    cb && cb();
  } catch (err) {
    setLoading(false);
  }
};

export const itemListExcelGenerator = (itemList) => {
  const header = [
    {
      text: "Item Code",
      textFormat: "number",
      alignment: "center:middle",
      key: "itemCode",
    },
    {
      text: "Item Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "itemName",
    },
    {
      text: "Item Type Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "itemTypeId",
    },
    {
      text: "Item Category Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "itemCategoryId",
    },
    {
      text: "Item Sub Category Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "itemSubCategoryId",
    },
    {
      text: "Plant Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "plantId",
    },
    {
      text: "Warehouse Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "warehouseId",
    },
    {
      text: "Inventory Location Id",
      textFormat: "number",
      alignment: "center:middle",
      key: "inventoryLocationId",
    },
    {
      text: "Bin Number",
      textFormat: "number",
      alignment: "center:middle",
      key: "binNumber",
    },
    {
      text: "UoM Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "uomName",
    },
    {
      text: "HS Code",
      textFormat: "text",
      alignment: "center:middle",
      key: "hscode",
    },
    {
      text: "Lead Days",
      textFormat: "number",
      alignment: "center:middle",
      key: "maxLeadDays",
    },
    {
      text: "Status",
      textFormat: "text",
      alignment: "center:middle",
      key: "status",
    },
  ];

  generateJsonToExcel(header, itemList, 'Item_list')
}
