import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";
//landing api;

export const getLandingData = async (
  accountId,
  businessUnitId,
  searchTerm,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    let query = `/imp/ProformaInvoice/ProformaInvoiceLandingPasignation?accId=${accountId}&buId=${businessUnitId}`;
    if (searchTerm) {
      query += `&piNumber=${searchTerm}`;
    }
    query += `&pageSize=${pageSize}&pageNo=${pageNo}&viewOrder=desc`;
    setLoading(true);
    const res = await Axios.get(query);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

// https://localhost:44396/imp/ProformaInvoice/GetProformaInvoiceById?proformaInvoiceId=3
// //get single data;
export const getSingleData = async (id, setter, setRowDto, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/imp/ProformaInvoice/GetProformaInvoiceById?proformaInvoiceId=${id}`
    );
    setDisabled(false);
    const { objHeader, objRow } = res?.data;
    const payload = {
      ...objHeader,
      // referenceType
      sbu: {
        label: objHeader?.sbuName,
        value: objHeader?.sbuId,
      },
      plant: {
        label: objHeader?.plantName,
        value: objHeader?.plantId,
      },
      beneficiaryNameDDL: {
        label: objHeader?.supplierName,
        value: objHeader?.supplierId,
      },
      expireDate: _dateFormatter(objHeader?.expireDate),
      lastShipDate: _dateFormatter(objHeader?.lastShipDate),
      lcTypeDDL: {
        label: objHeader?.lctypeName,
        value: objHeader?.lctypeId,
      },
      incoTermsDDL: {
        label: objHeader?.incotermName,
        value: objHeader?.incotermId,
      },
      materialTypeDDL: {
        label: objHeader?.metarialTypeName,
        value: objHeader?.metarialTypeId,
      },
      bankNameDDL: {
        label: objHeader?.bankName,
        value: objHeader?.bankId,
      },
      countryOriginDDL: {
        label: objHeader?.countryOfOriginName,
        value: objHeader?.countryOfOriginId,
      },
      finalDestinationDDL: {
        label: objHeader?.destinationPortName,
        value: objHeader?.destinationPortId,
      },
      currencyDDL: {
        label: objHeader?.currencyName,
        value: objHeader?.currencyId,
      },
      tolarance: objHeader?.tolarance || 0,
      // purchaseRequestNo: {
      //   value: objHeader?.purchaseRequestNo,
      //   label: objHeader?.purchaseRequestNo,
      // },
      purchaseRequestNo: "",
      // referenceType: {
      //   label: objHeader?.purchaseContractId
      //     ? "Purchase Contract"
      //     : "Purchase Request",
      //   value: objHeader?.purchaseContractId ? 1 : 2,
      // },
      referenceType: {
        label:
          objHeader?.referenceTypeId === 1
            ? "Purchase Contract"
            : objHeader?.purchaseRequestId === 2
            ? "Purchase Request"
            : "",
        value:
          objHeader?.referenceTypeId === 1
            ? 1
            : objHeader?.referenceTypeId === 2
            ? 2
            : null,
      },
      purchaseContractNo: {
        label: objHeader?.purchaseContractNo,
        value: objHeader?.purchaseContractId,
      },
      etaDate: _dateFormatter(objHeader?.dteEta),
      dteEstimatedLaycanDate: _dateFormatter(objHeader?.dteEstimatedLaycanDate),
      //  objHeader?.purchaseRequestNo || 0,
    };

    setter(payload);
    if (objRow) {
      let modifyData = objRow?.map((item) => ({
        ...item,
        label: item?.itemName,
        uom: { value: item?.uomId, label: item?.uomName },
      }));
      setRowDto(modifyData);
    }
    // setRowDto()
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//create data;
export const createPI = async (
  setDisabled,
  profileData,
  selectedBusinessUnit,
  values,
  rowDto,
  cb
) => {
  const obj = createPayloadChange(
    profileData,
    selectedBusinessUnit,
    values,
    rowDto
  );

  try {
    setDisabled(true);
    const res = await Axios.post(
      `/imp/ProformaInvoice/CreateProformaInvoice`,
      obj
    );
    setDisabled(false);
    toast.success(res?.message || "Create successfully");
    cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

const createPayloadChange = (
  profileData,
  selectedBusinessUnit,
  values,
  rowDto
) => {
  let modifyArray = rowDto?.map((item) => ({
    referenceType: item?.referenceType,
    referenceId: item?.referenceId,
    referenceCode: item?.referenceCode,
    hscode: item?.hscode,
    uomId: item?.uomId,
    uomName: item?.uomName,
    rate: item?.rate,
    quantity: +item?.quantity,
    totalAmount: item?.totalAmount,
    itemId: item?.itemId,
    itemName: item?.itemName,
    currency: "string",
  }));
  const payload = {
    objHeader: {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      plantName: values?.plant?.label,
      plantId: values?.plant?.value,
      supplierId: values?.beneficiaryNameDDL?.value,
      supplierName: values?.beneficiaryNameDDL?.label,
      piAmount: rowDto?.reduce((acc, item) => acc + item?.totalAmount, 0),
      currencyId: values?.currencyDDL?.value,
      currencyName: values?.currencyDDL?.label,
      pinumber: values?.pinumber,
      pidate: _dateFormatter(new Date()),
      bankId: values?.bankNameDDL?.value || 0,
      lastShipDate: _dateFormatter(values?.lastShipDate),
      expireDate: _dateFormatter(values?.expireDate),
      countryOfOriginId: values?.countryOriginDDL?.value,
      loadingPort: values?.loadingPort,
      destinationPortId: values?.finalDestinationDDL?.value,
      destinationPortName: values?.finalDestinationDDL?.label,
      lctypeId: values?.lcTypeDDL?.value,
      lctypeName: values?.lcTypeDDL?.label,
      incotermId: values?.incoTermsDDL?.value,
      incotermName: values?.incoTermsDDL?.label,
      usance: values?.usance ? values?.usance : 0,
      presentation: values?.presentation ? values?.presentation : 0,
      tolerance: values?.tolerance || 0,
      otherTerms: values?.otherTerms ? values?.otherTerms : "",
      metarialTypeId: values?.materialTypeDDL?.value,
      metarialTypeName: values?.materialTypeDDL?.label,
      sbuId: values?.sbu?.value,
      warehouseId: values?.warehouse?.value,
      warehouseName: values?.warehouse?.label,
      // purchaseRequestNo: values?.purchaseRequestNo?.label || "",
      // purchaseRequestId: values?.purchaseRequestNo?.value || 0,
      // purchaseContractId: values?.purchaseContractNo?.value || 0,
      // purchaseContractNo: values?.purchaseContractNo?.label || "",
      purchaseRequestNo: "",
      purchaseRequestId: 0,
      purchaseContractId: 0,
      purchaseContractNo: "",
      dteEta: values?.etaDate,
      dteEstimatedLaycanDate: values?.dteEstimatedLaycanDate,
    },
    objRow: modifyArray,
  };
  return payload;
};

//update data;
export const updatePi = async (
  setDisabled,
  values,
  rowDto
  // cb
) => {
  const obj = updatePayloadChange(values, rowDto);
  try {
    setDisabled(true);
    let res = await Axios.put(`/imp/ProformaInvoice/EditProformaInvoice`, obj);
    setDisabled(false);
    toast.success(res?.message || "Update successfully");
    // cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

const updatePayloadChange = (values, rowDto) => {
  let modifyArray = rowDto?.map((item) => ({
    referenceType: item?.referenceType,
    referenceId: item?.referenceId,
    referenceCode: item?.referenceCode,
    hscode: item?.hscode,
    uomId: item?.uomId,
    uomName: item?.uomName,
    rate: item?.rate,
    quantity: item?.quantity,
    totalAmount: item?.totalAmount,
    itemId: item?.itemId,
    itemName: item?.itemName,
  }));
  const payload = {
    objHeader: {
      plantName: values?.plantDDL?.label,
      plantId: values?.plantDDL?.value,
      proformaInvoiceId: values?.proformaInvoiceId,
      supplierId: values?.beneficiaryNameDDL?.value,
      piAmount: rowDto?.reduce((acc, item) => acc + item?.totalAmount, 0),
      currencyId: values?.currencyDDL?.value,
      currencyName: values?.currencyDDL?.label,
      pinumber: values?.pinumber,
      pidate: _dateFormatter(new Date()),
      bankId: values?.bankNameDDL?.value || 0,
      lastShipDate: _dateFormatter(values?.lastShipDate),
      expireDate: _dateFormatter(values?.expireDate),
      countryOfOriginId: values?.countryOriginDDL?.value,
      loadingPort: values?.loadingPort,
      destinationPortId: values?.finalDestinationDDL?.value,
      destinationPortName: values?.finalDestinationDDL?.label,
      lctypeId: values?.lcTypeDDL?.value,
      lctypeName: values?.lcTypeDDL?.label,
      incotermId: values?.incoTermsDDL?.value,
      incotermName: values?.incoTermsDDL?.label,
      usance: values?.usance,
      presentation: values?.presentation,
      tolerance: values?.tolerance,
      otherTerms: values?.otherTerms,
      metarialTypeId: values?.materialTypeDDL?.value,
      metarialTypeName: values?.materialTypeDDL?.label,
      sbuId: values?.sbuDDL?.value,
      dteEta: values?.etaDate,
      dteEstimatedLaycanDate: values?.dteEstimatedLaycanDate,
    },
    objRow: modifyArray,
  };
  return payload;
};

//Dropdown loading start

export const getPurchaseOrganizationDDL = async (
  accountId,
  businessUnitId,
  setter
) => {
  try {
    let query = `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getPlantDDL = async (
  accountId,
  businessUnitId,
  userId,
  OrgUnitTypeId,
  setter
) => {
  try {
    let query = `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accountId}&BusinessUnitId=${businessUnitId}&OrgUnitTypeId=${OrgUnitTypeId}`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getPiTypeDDL = async (setter) => {
  try {
    let query = `/imp/ImportCommonDDL/GetPITypeDDL`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getLCTypeDDL = async (setter) => {
  try {
    let query = `/imp/ImportCommonDDL/GetLCTypeDDL`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getIncoTermsDDL = async (setter) => {
  try {
    let query = `/imp/ImportCommonDDL/GetIncoTermsDDL`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getMaterialTypeDDL = async (setter) => {
  try {
    let query = `/imp/ImportCommonDDL/GetMaterialTypeDDL`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getBankNameDDL = async (setter, accId, businessUnitId) => {
  try {
    // let query = `/imp/ImportCommonDDL/GetBankListDDL`;
    let query = `/imp/ImportCommonDDL/GetBankListDDL?accountId=${accId}&businessUnitId=${businessUnitId}`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getCountryNameDDL = async (setter) => {
  try {
    let query = `/imp/ImportCommonDDL/GetCountryNameDDL`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getFinalDestinationDDL = async (accId, businessUnitId, setter) => {
  try {
    let query = `/imp/ImportCommonDDL/GetPortName?accountId=${accId}&businessUnitId=${businessUnitId}`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getCurrencyDDL = async (setter) => {
  try {
    let query = `/imp/ImportCommonDDL/GetCurrencyDDL`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getInsuranceDDL = async (accountId, businessUnitId, setter) => {
  try {
    let query = `/imp/ImportCommonDDL/GetProviderDDL?accountId=${accountId}&businessUnitId=${businessUnitId}`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getBeneficaryDDL = async (accountId, businessUnitId, setter) => {
  try {
    let query = `/imp/LCBusinessPartner/GetSupplierListDDL?accountId=${accountId}&businessUnitId=${businessUnitId}`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getUoMDDL = async (accountId, businessUnitId, setter) => {
  try {
    let query = `/item/ItemUOM/GetItemUOMByAccountIdBusinessUnitId?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`;
    const res = await Axios.get(query);
    setter(
      res?.data.map((item) => {
        return {
          ...item,
          label: item?.uomName,
          value: item?.uomid,
        };
      })
    );
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getSBUDDL = async (accountId, businessUnitId, setter) => {
  try {
    let query = `/costmgmt/SBU/GetSBUListDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&Status=true`;
    const res = await Axios.get(query);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export function addDaysToDate(date, days) {
  let res = new Date(date);
  res.setDate(res.getDate() + days);
  return _dateFormatter(new Date(res));
}

export const validationSchema = Yup.object().shape({
  sbu: Yup.object().shape({
    value: Yup.string().required("SBU is required"),
  }),
  plantDDL: Yup.object().shape({
    value: Yup.string().required("Plant is required"),
  }),
  beneficiaryNameDDL: Yup.object().shape({
    value: Yup.string().required("Beneficiary is required"),
  }),
  lcTypeDDL: Yup.object().shape({
    value: Yup.string().required("LC Type is required"),
  }),
  incoTermsDDL: Yup.object().shape({
    value: Yup.string().required("Inco terms is required"),
  }),
  materialTypeDDL: Yup.object().shape({
    value: Yup.string().required("Material Type is required"),
  }),
  countryOriginDDL: Yup.object().shape({
    value: Yup.string().required("Country Origin is required"),
  }),
  finalDestinationDDL: Yup.object().shape({
    value: Yup.string().required("Final Destination is required"),
  }),
  currencyDDL: Yup.object().shape({
    value: Yup.string().required("Currency is required"),
  }),
  pinumber: Yup.string().required("PI No is required"),
  loadingPort: Yup.string().required("Loading Port is required"),
});

export const checkPurchaseRequestNo = (
  poNumber,
  setPurchaseRequestValidity,
  accountId,
  businessUnitId,
  setFieldValue
) => {
  if (poNumber) {
    ValidatePoNo(
      accountId,
      businessUnitId,
      poNumber,
      setPurchaseRequestValidity,
      setFieldValue
    );
  }
};

export const ValidatePoNo = async (
  accId,
  buId,
  purchaseOrderNo,
  setter,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `/imp/PurchaseOrder/GetCheckPurchaseRequestNo?accountId=${accId}&businessUnitId=${buId}&purchaseRequestNo=${purchaseOrderNo}`
    );

    setFieldValue("sbuDDL", {
      value: res?.data?.sbuId,
      label: res?.data?.sbuName,
    });
    setFieldValue("plantDDL", {
      value: res?.data?.plantId,
      label: res?.data?.plantName,
    });
    setter(res?.data);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// https://localhost:44396/imp/ImportCommonDDL/GetItemInPIRespectToPRDDL?accountId=2&businessUnitId=164&purchaseRequstCode=PR-0420210056&itemId=6965
export const checkItemFromPurchaseRequest = async (
  accId,
  buId,
  purchaseOrderNo,
  itemId,
  cb
) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetItemInPIRespectToPRDDL?accountId=${accId}&businessUnitId=${buId}&purchaseRequstCode=${purchaseOrderNo}&itemId=${itemId}`
    );
    if (res?.data) {
      cb();
    } else {
      toast.error(
        `This item is not included in this purchase request : ${purchaseOrderNo}`
      );
    }
  } catch (error) {
    toast.error(
      `This item is not included in this purchase request : ${purchaseOrderNo}`
    );
  }
};

//item ddl;
// /imp/ImportCommonDDL/GetItemListForPI?accountId=2&businessUnitId=164
export const getItemDDL = async (
  purchaseRequestOrContractId,
  refType,
  setter,
  values,
  rowDto
) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetItemListForPI?code=${purchaseRequestOrContractId}&referenceType=${
        refType === 1 ? "PurchaseContract" : "PurchaseRequest"
      }`
    );
    // const newData = [...rowDto, ...res?.data];
    const newData = [...res?.data];

    const modifyData = newData?.map((data) => {
      //Doing this just because there is a weired condition based on rowId and the problem is urgent to be fixed
      const { rowId, ...restData } = data || {};
      return {
        ...restData,
        uom: { value: data?.uomId, label: data?.uomName },
        itemId: data.value,
        label: data.label,
        itemName: data.label,
        refQty: data?.quantity,
        quantity: "",
        referenceId:
          values?.referenceType?.value === 1
            ? values?.purchaseContractNo?.value
            : values?.purchaseRequestNo?.value,
        referenceCode:
          values?.referenceType?.value === 1
            ? values?.purchaseContractNo?.label
            : values?.purchaseRequestNo?.label,
        referenceType: values?.referenceType?.label,
      };
    });
    setter(modifyData);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const downloadDocumentaryCredit = async (
  bankId,
  pdfText,
  setLoading
) => {
  const url = `https://devautomation.ibos.io/bank_lc/create`;

  const payload = {
    bank: bankId.toString(),
    text: pdfText,
  };

  fetch(url, {
    method: "POST",
    body: JSON.stringify(payload), // Convert payload to JSON string
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      // Check if the request was successful (status code 200)
      if (response.ok) {
        // If the response contains a PDF file
        if (response.headers.get("content-type") === "application/pdf") {
          // Extract the filename from the response headers
          const filename = "LC Application Form";
          // Return a promise with the response blob
          return response.blob().then((blob) => {
            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);
            // Create a link element to trigger the download
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            // Append the link to the body and trigger the download
            document.body.appendChild(link);
            link.click();
            // Clean up by revoking the object URL
            window.URL.revokeObjectURL(url);
            toast.success("File downloaded successfully as:", filename);

            setLoading(false);
          });
        } else {
          toast.warn("Request Failed");
          setLoading(false);
        }
      } else {
        toast.error("Request failed");

        setLoading(false);
      }
    })
    .catch((error) => {
      toast.error("Something went wrong");
      setLoading(false);
    });
};
