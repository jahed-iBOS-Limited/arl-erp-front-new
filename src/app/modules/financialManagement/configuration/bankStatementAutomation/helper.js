import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getBankStatmentAttachmentLanding = async (
  accId,
  buId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/BankStatment/GetBankStatmentAttachmentLanding?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&ViewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};

//Bank Account ddl
export const bankAccountDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/fino/FinanceCommonDDL/GetBankNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
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
    const res = await axios.get(
      `/fino/FinanceCommonDDL/BankAccountNumberByBankIdDDL?AccountId=${accId}&BusinessUnitId=${unitId}&BankId=${bankId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getBankStatmentAttachmentById = async (
  attachmenId,
  setter,
  setLoading,
  cb
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/BankStatment/GetBankStatmentAttachmentById?BankStatmentAttachmenId=${attachmenId}`
    );
    setLoading(false);
    setter(res?.data);
    cb(res?.data);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const dataModify = ({ formikRef, setRowDto, resData }) => {
  if (formikRef.current) {
    formikRef.current.setValues({
      ...formikRef.current.values,
      bankAccount: resData?.headerDTO?.bankId
        ? {
            value: resData?.headerDTO?.bankId,
            label: resData?.headerDTO?.bankName,
          }
        : "",
      acDDL: resData?.headerDTO?.bankAccountId
        ? {
            value: resData?.headerDTO?.bankAccountId,
            label: resData?.headerDTO?.bankAccountNo,
          }
        : "",
      fileName: resData?.headerDTO?.fileName || "",
      fileUID: resData?.headerDTO?.fileUid || "",
      emailUId: resData?.headerDTO?.emailUid || "",
      senderAddress: resData?.headerDTO?.senderAddress || "",
      emailHeader: resData?.headerDTO?.emailHeader || "",
      emailDate: resData?.headerDTO?.emailDateTime
        ? _dateFormatter(resData?.headerDTO?.emailDateTime)
        : "",
      statusMessage: resData?.headerDTO?.statusMessage || "",
    });
  }

  setRowDto(
    resData?.rowDTO?.map((itm) => ({
      ...itm,
      transactionDate: itm?.transactionDate
        ? _dateFormatter(itm?.transactionDate)
        : "",
      isEdit: false,
    })) || []
  );
};

export const editBankStatmentAttachment = async (payload, setDisabled, cb) => {
  try {
    setDisabled(true);
    const res = await axios.post(
      `/fino/BankStatment/EditBankStatmentAttachment`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
