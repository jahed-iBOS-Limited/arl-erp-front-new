import { toast } from "react-toastify";
import * as Yup from "yup";
import * as XLSX from "xlsx";
import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";

export const partnerSchema = Yup.object().shape({
  businessPartnerName: Yup.string().required(),
  businessPartnerAddress: Yup.string().required(),
  propitor: Yup.string().required(),
  contactNumber: Yup.string().required(),
  contactPerson: Yup.string().required(),
  contactPersonNumber: Yup.string().required(),
  email: Yup.string().optional(),
  bin: Yup.string().optional(),
  licenseNo: Yup.string().required(),
  divisionName: Yup.string().optional(),
  districtName: Yup.string().optional(),
  upazilaName: Yup.string().optional(),
});

export const getValidationError = (partnerList) => {
  const isNotValid = partnerList?.some((item) => !partnerSchema?.isValidSync(item));
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
    const partnerList = await promise;
    if (!partnerList?.length > 0) {
      setLoading(false);
      return toast?.warning("No partner found!");
    }
    setIsValidationError(getValidationError(partnerList));
    setRowData(partnerList || []);
    setLoading(false);
    cb && cb();
  } catch (err) {
    setLoading(false);
  }
};

export const partnerListExcelGenerator = (partnerList) => {
  const header = [
    {
      text: "Partner Code",
      textFormat: "number",
      alignment: "center:middle",
      key: "businessPartnerCode",
    },
    {
      text: "Business Partner Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "businessPartnerName",
    },
    {
      text: "Business Partner Address",
      textFormat: "text",
      alignment: "center:middle",
      key: "businessPartnerAddress",
    },
    {
      text: "Propitor",
      textFormat: "text",
      alignment: "center:middle",
      key: "propitor",
    },
    {
      text: "Contact Number",
      textFormat: "text",
      alignment: "center:middle",
      key: "contactNumber",
    },
    {
      text: "Contact Person",
      textFormat: "text",
      alignment: "center:middle",
      key: "contactPerson",
    },
    {
      text: "Contact Person Number",
      textFormat: "text",
      alignment: "center:middle",
      key: "contactPersonNumber",
    },
    {
      text: "Email",
      textFormat: "email",
      alignment: "center:middle",
      key: "email",
    },
    {
      text: "Bin Number",
      textFormat: "text",
      alignment: "center:middle",
      key: "bin",
    },
    {
      text: "License No",
      textFormat: "text",
      alignment: "center:middle",
      key: "licenseNo",
    },
    {
      text: "Division Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "divisionName",
    },
    {
      text: "District Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "districtName",
    },
    {
      text: "Upazila Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "upazilaName",
    },
    {
      text: "Status",
      textFormat: "text",
      alignment: "center:middle",
      key: "status",
    },
  ];

  generateJsonToExcel(header, partnerList, "partner_list");
};
