import { toast } from "react-toastify";
import Axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";

//Bank Account ddl
export const bankAccountDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/GetBankNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
//Branch Account ddl
export const bankBranchAccountDDL = async (setter, bankId) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GETBankBranchDDl?BankId=${bankId}&CountryId=18`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getBankAccountByBranchDDL = async (
  bankId,
  accId,
  unitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/BankAccountNumberByBankIdDDL?AccountId=${accId}&BusinessUnitId=${unitId}&BankId=${bankId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
// https://localhost:44346/fino/BusinessTransaction/GetBankAccountStatementByBankAccountReconsillate?BankAccountId=29&BusinessUnitId=8&TransactionDate=2021-06-06
export const getManualReconcileLanding = async (
  bankAccountId,
  businessUnitId,
  transactionDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/BusinessTransaction/GetBankAccountStatementByBankAccountReconsillate?BankAccountId=${bankAccountId}&BusinessUnitId=${businessUnitId}&TransactionDate=${_dateFormatter(
        transactionDate
      )}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data.map((item) => {
        return {
          ...item,
          drAmount: item.monAmount >= 0 ? item.monAmount : "",
          drAmountInit: item.monAmount >= 0 ? item.monAmount : "",
          crAmount: item.monAmount < 0 ? item.monAmount : "",
          crAmountInit: item.monAmount < 0 ? item.monAmount : "",
          editable: false,
          checked: false,
        };
      });
      setter(data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
export const getBankReconsileManualData = async (
  businessUnitId,
  bankAccountId,
  typeId,
  isManualReconsile,
  transactionDate,
  search,
  setter,
  setLoading,
  fromDate
) => {
  try {
    setLoading(true);
    let api = `/fino/BankBranch/GetBankReconsileManualData?intUnitId=${businessUnitId}&intBankAccId=${bankAccountId}&intType=${typeId}&isManualReconsile=${isManualReconsile}&dteDate=${_dateFormatter(
      transactionDate
    )}`;
    if (search) {
      api += `&search=${search}`;
    }
    if (fromDate) {
      api += `&dteFromDate=${fromDate}`;
    }
    const res = await Axios.get(api);
    const data = res?.data.map((item) => {
      return {
        ...item,
        checked: false,
      };
    });
    setter(data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
export const getBankStatementDataMatch = async (
  businessUnitId,
  bankAccountId,
  typeId,
  isManualReconsile,
  transactionDate,
  search,
  setter,
  setLoading,
  fromDate
) => {
  try {
    setLoading(true);
    let api = `/fino/BankBranch/GetBankStatementDataMatch?intUnitId=${businessUnitId}&intBankAccId=${bankAccountId}&intType=${typeId}&isManualReconsile=${isManualReconsile}&dteDate=${_dateFormatter(
      transactionDate
    )}`;
    if (search) {
      api += `&search=${search}`;
    }
    if (fromDate) {
      api += `&dteFromDate=${fromDate}`;
    }
    const res = await Axios.get(api);
    const data = res?.data.map((item) => {
      return {
        ...item,
        checked: false,
      };
    });
    setter(data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

// https://localhost:44346/fino/BusinessTransaction/UpdateBankAmountAndClosing
export const updateBankStatement = async (data, cf) => {
  try {
    const res = await Axios.put(
      `/fino/BusinessTransaction/UpdateBankAmountAndClosing`,
      [data]
    );
    if (res.status === 200 && res?.data) {
      cf();
      toast.success("Update successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getTransaction = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBankStatementLanding = async (
  bankAccountId,
  businessUnitId,
  transactionDate,
  setter,
  pageSize,
  pageNo,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/BusinessTransaction/GetBankStatementForManual?BankAccountId=${bankAccountId}&BusinessUnitId=${businessUnitId}&TransactionDate=${_dateFormatter(
        transactionDate
      )}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data?.data?.map((item) => {
        return {
          ...item,
          transction: "",
          remarks: "",
        };
      });
      setter({ ...res?.data, data });
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
export const getSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const postForceReconsile = async (obj, cb) => {
  // console.log(obj)
  // cb();
  try {
    const res = await Axios.post(
      `/fino/BankBranch/SelectedPostForceReconsile`,
      obj
    );
    toast.success(res?.data?.message || "Submitted successfully");
    cb();
  } catch (error) {}
};

export const getBankAccountNoDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/BankAccountNumberDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};

export const getManualReconcileMatching = async (
  businessUnitId,
  bankAccountId,
  typeId,
  isManualReconsile,
  transactionDate,
  reconsileManualDataSetter,
  statementDataMatchSetter,
  setLoading
) => {
  try {
    setLoading(true);
    let api = `/fino/BankBranch/GetManualReconcileMatching?businessUnitId=${businessUnitId}&bankAccId=${bankAccountId}&typeId=${typeId}&dteDate=${transactionDate}&isComplete=${isManualReconsile}`;
    const res = await Axios.get(api);
    const reconcileData = res?.data?.bankReconcileData?.map((item) => {
      return {
        ...item,
        checked: false,
      };
    });
    const statementData = res?.data?.bankStatementDataMatch?.map((item) => {
      return {
        ...item,
        checked: false,
      };
    });
    reconsileManualDataSetter(reconcileData);
    statementDataMatchSetter(statementData);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const checkTwoFactorApproval = async (
  otpType,
  unitId,
  transectionType,
  transectionId,
  transactionCode,
  journalTypeId,
  actionById,
  strOTP,
  cancelType,
  setDisabledModalButton,
  cb
) => {
  try {
    setDisabledModalButton(true);
    const res = await Axios.get(
      `/fino/CommonFino/CheckTwoFactorApproval?OtpType=${otpType}&intUnitId=${unitId}&strTransectionType=${transectionType}&intTransectionId=${transectionId}&strCode=${transactionCode}&journalTypeId=${journalTypeId}&intActionById=${actionById}&strOTP=${strOTP}&CancelType=${cancelType}`
    );
    // setFieldValue("instrumentNo",res?.data?.code)
    if (res?.data?.status === 1) {
      toast.success(res?.data?.message);
      cb(res?.data?.status);
    } else {
      toast.error(res?.data?.message);
      cb();
    }
    setDisabledModalButton(false);
    // toast.success("Submitted successfully");
  } catch (error) {
    setDisabledModalButton(false);
    cb(500);
    toast.warn(error?.response?.data?.message || "Please try again");
    // setDisabled(false);
  }
};

export const header = {
  display: "flex",
  padding: "2px 29px",
  alignItems: "center",
  justifyContent: "space-between",
  background: "transparent",
  margin: "0",
  flexWrap: "wrap",
};
