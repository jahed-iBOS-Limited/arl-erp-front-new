import Axios from "axios";
// eslint-disable-next-line no-unused-vars
import { toast } from "react-toastify";

export const getPurchaseClearPagination_api = async (
  buId,
  PlantId,
  accountId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  try {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    const res = await Axios.get(
      `/procurement/PaymentRequest/PaymentRequestSearchLanding?${searchPath}BusinessUnitId=${buId}&PlantId=${PlantId}&AccountId=${accountId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const plantDDL_api = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetPurchaseInvoiceDetails = async (
  InvoiceId,
  supplierId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PaymentRequest/PurchaseInvoiceDetails?InvoiceId=${InvoiceId}&SupplierInvoiceId=${supplierId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newData = {
        ...data,
        invoiceCode: data?.invoiceCode,
        invoiceDate: data?.invoiceDate,
        poAmount: data?.poAmount,
        grnAmount: data?.grnAmount,
        invoiceAmount: data?.invoiceAmount,
        wareHouseName: data?.wareHouseName,
      };
      setter(newData);
    }
  } catch (error) {}
};

export const getBankAcDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getInstrumentTypeDDL = async (setter) => {
  try {
    const res = await Axios.get("/costmgmt/Instrument/GetInstrumentTypeDDL");
    if (res.status === 200 && res?.data) {
      const newData = res?.data?.filter((itm) => itm?.label !== "Cash");
      setter(newData);
    }
  } catch (error) {}
};

export const getCashGlDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBusinessUnitGeneralLedgerDDLTypeById?AccountId=${accId}&BusinssUnitId=${buId}&AccountingGroupId=2`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTransactionDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      // `/tms/RouteStandardCost/GetBusinessTransactionDDL?BusinessUnitId=${buId}`
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const createBankCashPayment = async (payload, cb, setRowDto) => {
  try {
    const res = await Axios.post(
      `/procurement/PaymentRequest/CreateCashBankPayment`,
      payload
    );
    if (res.status === 200 && res?.data) {
      cb();
      setRowDto([]);
      toast.success(res.data.message || "create successfully");
      // setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "error occured");
  }
};

export const getGridData = async (
  accId,
  buId,
  sbuId,
  partnerId,
  cashGlId,
  cashAmount,
  bcId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PaymentRequest/GetCPurchaseGridData?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}&PartnerId=${partnerId}&CashGLId=${cashGlId}&CashAmount=${cashAmount}&BankAccId=${bcId || 0}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
