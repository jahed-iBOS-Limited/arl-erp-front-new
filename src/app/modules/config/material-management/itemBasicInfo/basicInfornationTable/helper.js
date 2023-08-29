import { toast } from 'react-toastify';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';

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
    console.log(itemList);
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};
