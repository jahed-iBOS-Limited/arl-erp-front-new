import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";

export const createPurchase = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(`/vat/TaxPurchase/CreateTaxPurchase`, payload);
    if (res.status === 200 && res?.data) {
      toast.success("Submitted Successfully", {
        toastId: shortid(),
      });
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const SetIsGenerated_api = async (payload) => {
  try {
    const res = await Axios.put(`/vat/TaxPurchase/SetIsGenerated`, payload);
    if (res.status === 200 && res?.data) {
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const editPurchase = async (payload, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.put(`/vat/TaxPurchase/EditTaxPurchase`, payload);
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Edited successfully");
      // cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getVatBranches = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPartnerDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=1`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTaxConfig = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/BusinessUnitTaxConfig/GetPurchaseTaxConfig?AccountId=${accId}&BusinessUnitId=${buId}&TradeTypeId=1`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {}
};

export const getTradeTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTradeTypeDDL?TradeGroup=purchase`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTreasuryChallanNoDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTreasuaryChallanNoDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const generate66 = async (
  payload,
  setCertificateNo,
  setDateIssue,
  SetIsGeneratedFunc,
  setIsLoading,
) => {
  setIsLoading &&setIsLoading(true);
  try {
    const res = await Axios.post(
      `/vat/GenrateMushak66/CreateGenerateMushak66`,
      payload
    );

    SetIsGeneratedFunc && SetIsGeneratedFunc();
    setCertificateNo(res?.data?.mushak66HeaderDTO?.certificateNo);
    setDateIssue && setDateIssue(res?.data?.mushak66HeaderDTO?.dateofIssue);
    toast.success("Generate successfully");
    setIsLoading &&setIsLoading(false);
  } catch (error) {
    setIsLoading &&setIsLoading(false);
    console.log(error);
    toast.warning(error?.response?.message);
  }
};

export const getPaymentTermDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/fino/BusinessTransaction/GetPaymentTermsFinoDDL`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxItemListDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.map((itm) => ({
        ...itm,
        label: `${itm.label} (${itm.uomName})`,
        withoutlabel: itm.label,
      }));
      setter(modifiedData);
    }
  } catch (error) {}
};

export const getItemTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getUomDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSingleGenerateData = async (gId, setSingleData, setRowDto) => {
  try {
    const res = await Axios.get(
      `/vat/GenrateMushak66/GetGenerateMushak66ById?Mushak66GenerateId=${gId}`
    );
    if (res.status === 200 && res?.data) {
      const header = res?.data?.mushak66HeaderDTO;
      const row = res?.data?.mushak66HeaderRowDTO;
      setSingleData(header);
      setRowDto(row);
    }
  } catch (error) {}
};

export const getSinglePurchase = async (puId, setSingleData, setRowDto) => {
  try {
    const res = await Axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseById?TaxPurchaseId=${puId}`
    );
    if (res.status === 200 && res?.data) {
      const header = res?.data?.objHeaderDTO;
      const row = res?.data?.objListRowDTO;
      if (!res?.data?.objHeaderDTO) {
        toast.warning("Data Not Found");
      }
      setSingleData(header);
      setRowDto(row);
    }
  } catch (error) {}
};

export const getGridDataSingleInvoice = async (
  accId,
  buId,
  tbId,
  fromDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/vat/TaxPurchase/GetTaxPurchasePaginationVDS?accountId=${accId}&businessUnitId=${buId}&TaxBranchId=${tbId}&TaxTransactionTypeId=1&FromDate=${fromDate}&ToDate=${toDate}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      if (res?.data?.length === 0) {
        toast.warning("Data Not Found");
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getGridDataOthers = async (
  accId,
  buId,
  partnerId,
  viewTypeId,
  tbId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  const partnerPath = partnerId ? `PartnerId=${partnerId}&` : "";
  try {
    setLoading(true);
    const res = await Axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseByDetails?${partnerPath}&TypeId=${viewTypeId}&TaxBranchId=${tbId}&FromDate=${fromDate}&ToDate=${toDate}&accountId=${accId}&buisinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data || []);
      setLoading(false);
      if (res?.data?.length === 0) {
        toast.warning("Data Not Found");
      }
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getGenaratedGridData = async (
  accId,
  buId,
  tbId,
  fromDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/vat/GenrateMushak66/GetGenerateMushak66Pagination?accountId=${accId}&businessUnitId=${buId}&TaxBranchId=${tbId}&FromDate=${fromDate}&ToDate=${toDate}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data || []);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
