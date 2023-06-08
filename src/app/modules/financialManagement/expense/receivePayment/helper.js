import Axios from "axios";
import { toast } from "react-toastify";

//employeEnrollAction Api call
export const employeEnroll_Api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const modify = res?.data?.map((itm) => ({
        value: itm.value,
        label: `${itm.label} (${itm.value})`,
      }));
      setter(modify);
    }
  } catch (error) {
    
  }
};

export const recivePayment_SBU_Api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

//recivePayment_CashGL_Api
export const recivePayment_CashGL_Api = async (
  accId,
  buId,
  generalLedger,
  setter
) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBusinessUnitGeneralLedgerDDLTypeById?AccountId=${accId}&BusinssUnitId=${buId}&AccountingGroupId=${generalLedger}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

//getPartnerDDL_Api
export const profitCenterDDL_Api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/profitCenter/getProfitCenterDDLforExpence?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const newdata = res?.data?.map((itm) => ({
        value: itm.value,
        label: `${itm?.label}, ${itm?.controllingUnitName}`,
      }));
      setter(newdata);
    }
  } catch (error) {
    
  }
};

//getBusinessTransactionDDL_api
export const getBusinessTransactionDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

//getBankAccountDDL_api
export const getBankAccountDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
//getInstrumentType_Api
export const getInstrumentType_Api = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

//GetReferenceNoDDL_Api
export const getReferenceNoDDL_Api = async (
  transacctionType,
  accId,
  buId,
  userId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/GetReferenceNoDDL?TransacctionType=${transacctionType}&AccountId=${accId}&BusinessUnitId=${buId}&ExpenseForId=${userId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

//GetReferenceNoDDL_Api
export const getPaymentOrReceiveLandingPasignation_Api = async (
  transacctionType,
  referenceNo,
  accId,
  buId,
  employeeId,
  setter,
  values,
  setLoading
) => {
  const referenceNoN = referenceNo || 0;
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/GetPaymentOrReceiveLandingPasignation?TransacctionType=${transacctionType}&ReferenceNo=${referenceNoN}&AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${employeeId}&viewOrder=desc&PageNo=1&PageSize=100`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data?.data.map((itm) => ({
        ...itm,
        transactionType: values?.transactionType?.label,
        referanceNo: values?.referanceNo?.label,
      }));
      setter(newData);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    
  }
};

// Create Advance Pay (Cash)
export const createCashPayment_Api = async (
  data,
  cb,
  getPaymentOrReceiveByIdFunc,
  setDisabled
) => {
  try {
    const res = await Axios.post(
      `/fino/FinanceCommonDDL/CreateCashPayment`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      getPaymentOrReceiveByIdFunc();
      setDisabled(false);
    }
  } catch (error) {
    
    setDisabled(false);
  }
};
//Create Expense Pay (Cash)
export const createCashReceive_Api = async (
  data,
  cb,
  getPaymentOrReceiveByIdFunc,
  setDisabled
) => {
  try {
    const res = await Axios.post(
      `/fino/FinanceCommonDDL/CreateCashPayment`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      getPaymentOrReceiveByIdFunc();
      setDisabled(false);
    }
  } catch (error) {
    
    setDisabled(false);
  }
};

//Create Expense Pay (Cash)
export const createBankReceive_Api = async (
  data,
  cb,
  getPaymentOrReceiveByIdFunc,
  setDisabled
) => {
  try {
    const res = await Axios.post(
      `/fino/FinanceCommonDDL/CreateBankReceive`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      getPaymentOrReceiveByIdFunc();
      setDisabled(false);
    }
  } catch (error) {
    
    setDisabled(false);
  }
};

//Create Expense Pay (Bank)
export const createBankPayment_Api = async (
  data,
  cb,
  getPaymentOrReceiveByIdFunc,
  setDisabled
) => {
  try {
    const res = await Axios.post(
      `/fino/FinanceCommonDDL/CreateBankPayment`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      getPaymentOrReceiveByIdFunc();
      setDisabled(false);
    }
  } catch (error) {
    
    setDisabled(false);
  }
};
//Create Receive Without Reference (Cash)
export const CreateJournalWithoutReference_api = async (
  data,
  cb,
  setDisabled
) => {
  try {
    const res = await Axios.post(
      `/fino/PaymentOrReceive/CreateJournalWithoutReference`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    setDisabled(false);
  }
};

//getPaymentOrReceiveById_api
export const getPaymentOrReceiveById_api = async (
  referencTypeeId,
  referenceTypeName,
  accId,
  buId,
  userId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/PaymentOrReceive/GetPaymentOrReceiveById?ReferencTypeeId=${referencTypeeId}&ReferenceTypeName=${referenceTypeName}&Accountid=${accId}&Businessunitid=${buId}&EmployeeId=${userId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {
    
  }
};
