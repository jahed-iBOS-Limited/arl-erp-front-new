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

      sbuDDL: {
        label: objHeader?.sbuName,
        value: objHeader?.sbuId,
      },
      plantDDL: {
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
      purchaseRequestNo: {
        value: objHeader?.purchaseRequestNo,
        label: objHeader?.purchaseRequestNo,
      },
      referenceType: {
        label: objHeader?.purchaseContractId
          ? "Purchase Contract"
          : "Purchase Request",
        value: objHeader?.purchaseContractId ? 1 : 2,
      },
      purchaseContractNo:{
        label:objHeader?.purchaseContractNo,
        value:objHeader?.purchaseContractId
      },
      etaDate : _dateFormatter(objHeader?.dteEta)
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
      plantName: values?.plantDDL?.label,
      plantId: values?.plantDDL?.value,
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
      sbuId: values?.sbuDDL?.value,
      purchaseRequestNo: values?.purchaseRequestNo?.label || "",
      purchaseRequestId: values?.purchaseRequestNo?.value || 0,
      purchaseContractId: values?.purchaseContractNo?.value || 0,
      purchaseContractNo: values?.purchaseContractNo?.label || "",
      dteEta: values?.etaDate,
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

// export function addDaysToDate(){
//     const today = new Date();
//     var res = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 180);
//     return res.;
// }
// const purchaseRequestNoSchema = Yup.object().shape({
//   value: Yup.number().required('Purchase Request Number is required'),
//   label: Yup.string().required('Purchase Request Number is required'),
// });

// const purchaseContractNoSchema = Yup.object().shape({
//   value: Yup.number().required('Purchase Contract Number is required'),
//   label: Yup.string().required('Purchase Contract Number is required'),
// });

export const validationSchema = Yup.object().shape({
  sbuDDL: Yup.object().shape({
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
  // bankNameDDL: Yup.object().shape({
  //   value: Yup.string().required("Bank is required"),
  // }),
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
  // tolerance: Yup.number()
  //   .positive("Tolerance must be positive")
  //   .required("Tolarance is required"),
  // usance: Yup.string().required("Usance is required"),
  // presentation: Yup.string().required("Presentation  is required"),
  // purchaseRequestNo: Yup.object().when(['purchaseContractNo.value'], {
  //   is: (purchaseContractNoValue) => !purchaseContractNoValue,
  //   then: purchaseRequestNoSchema,
  // }),
  // purchaseContractNo: Yup.object().when(['purchaseRequestNo.value'], {
  //   is: (purchaseRequestNoValue) => !purchaseRequestNoValue,
  //   then:purchaseContractNoSchema,
  // }),
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
export const getItemDDL = async (purchaseRequestOrContractId, refType, setter) => {
  try {
    const res = await Axios.get(
      // `/imp/ImportCommonDDL/GetItemListForPI?accountId=${accId}&businessUnitId=${buId}`
      `/imp/ImportCommonDDL/GetItemListForPI?code=${purchaseRequestOrContractId ||
        null}&referenceType=${
        refType === 1 ? "PurchaseContract" : "PurchaseRequest"
      }`
    );
    const modifyData = res?.data?.map((data) => ({
      ...data,
      uom: { value: data?.uomId, label: data?.uomName },
      itemId: data.value,
      label: data.label,
      itemName: data.label,
      refQty : data?.quantity,
      quantity:""
    }));
    console.log("modified Data",modifyData);
    setter(modifyData);
    // setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
