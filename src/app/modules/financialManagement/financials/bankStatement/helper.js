import axios from "axios";
// import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import { toast } from "react-toastify";

export const savebankStatement = async (
  accId,
  insertby,
  cb,
  setDisabled,
  setIsUpload
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/fino/BusinessTransaction/CreateBankAccountStatementSubmit?intAccountID=${accId}&intInsertBy=${insertby}`
    );
    if (res.status === 200) {
      cb();
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
      setIsUpload(false);
    }
  } catch (error) {
    setDisabled(false);
    setIsUpload(false);
  }
};

export const uploadBankStatement = async (
  profileData,
  values,
  filteredFileData,
  setDisabled,
  setFileObject
) => {
  const payload = filteredFileData?.filter((data)=> _dateFormatter(data?.trDate) !== "NaN-NaN-NaN").map((item) => ({
    bankAccountId: values?.bankAccountNo?.value,
    date: `${_dateFormatter(item?.trDate)}` || "",
    particulars: `${item?.particulars}` || "",
    instrumentNo: `${item?.instrumentNo}` || "",
    debit: item?.debit || 0,
    credit: item?.credit || 0,
    balance: item?.balance || 0,
    insertBy: profileData?.userId,
  }));
  setDisabled(true);
  try {
    await axios.put(
      "/fino/BusinessTransaction/UploadTempBankStatement",
      payload
    );
    setDisabled(false);
    setFileObject("")
    //no msg will be shown as far requirement of Said vai
    // toast.success(res?.data?.message || "Submitted successfully");
  } catch (error) {
    console.log(error.message);
    setDisabled(false);
    setFileObject("")
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const getBankAccountNoDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/fino/FinanceCommonDDL/BankAccountNumberDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};

export const getBankAccountOtherInfoDDL = async (
  accId,
  buId,
  bankAccId,
  setter,
  setFieldValue
) => {
  try {
    const res = await axios.get(
      `/fino/FinancialStatement/GetFinancialStatementRunningBalance?AccountId=${accId}&BusinessUnitId=${buId}&BankAccountId=${bankAccId}`
    );
    setter(res?.data);
    setFieldValue("lastCollected",_dateFormatter(res?.data[0]?.lastCollectedDateTime))
    setFieldValue("runningBalance",res?.data[0]?.runningBalance)

    //empty check
    setFieldValue("openingDate",_dateFormatter(res?.data[0]?.lastCollectedDateTime))
    setFieldValue("openingBalance",res?.data[0]?.runningBalance)

  } catch (err) {
    console.log(err);
  }
};

export const getBankAccount = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/fino/Advice/GetBankAccount?businessUnitId=${buId}&isActive=true`
    );
    const newData = res?.data?.map((itm) => {
      return {
        ...itm,
        value: itm?.bankAccountId,
        label: itm?.bankAccountNo,
      };
    });
    setter(newData);
  } catch (err) {
    console.log(err);
  }
};

export const getAdviceReport = async (
  accId,
  buId,
  adviceType,
  isAdviceComplete,
  date,
  advice,
  voucherPosting,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/Advice/GetAdvice?accountId=${accId}&businessUnitId=${buId}&getDate=${date}&adviceType=${adviceType}&isAccountNoMandatory=${isAdviceComplete}&advice=${advice}&voucherPosting=${voucherPosting}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

// accId=1,busId=152,isAdviceComplete=false,getDate=04-28-2021 advice=ibbl voucherPosting=all adviceType=Salary Advice
