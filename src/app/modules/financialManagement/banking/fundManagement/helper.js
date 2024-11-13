import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

//bank ddl
export const getBankDDL = async (setter, setLoading) => {
  try {
    setLoading(true);
    const res = await Axios.get(`/hcm/HCMDDL/GetBankDDL`);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

//bank ddl
export const getBankBranchDDL = async (bankId, setter, setLoading) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/costmgmt/BankAccount/GETBankBranchDDl?BankId=${bankId}&CountryId=18`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
//bank ddl all
export const getBankDDLAll = async (setter, setLoading) => {
  try {
    setLoading(true);
    const res = await Axios.get(`/hcm/HCMDDL/GetBankDDL`);
    setter([{ label: "ALL", value: 0 }, ...res?.data]);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

//facility ddl
export const getFacilityDLL = async (buiId, bankId, setter, setLoading) => {
  try {
    setLoading(true);
    const res = await Axios.get(`/fino/FundManagement/GetFacilityDDL?BusinessUnitId=${buiId}&BankId=${bankId ||
      0}
    `);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

//create fund limit
export const createFundLimit = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/FundManagement/CreateAndUpdateFundLimit`,
      payload
    );
    setDisabled(false);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//get fund limit landing
export const getFundLimitLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/FundManagement/GetFundManagementLandingPasignation?accountId=${accId}&businessUnitId=${buId}&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

//get fund details by id

export const getFundLimitById = async (id, setter, setLoading) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/FundManagement/GetFundLimitById?id=${id}`
    );
    const modifyData = {
      ...res?.data,
      bank: { label: res?.data?.bankName, value: res?.data?.bankId },
      facility: {
        label: res?.data?.facilityName,
        value: res?.data?.facilityId,
      },
      limit: +res?.data?.numLimit,
      updatedDate: _dateFormatter(res?.data?.loanUpdateDate),
    };
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

//get fdr register landing data
export const getFDRLandingData = async (
  buId,
  bankId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  status = "Active"
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/FundManagement/GetFDRLandingPasignation?businessUnitId=${buId}&bankId=${bankId}&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}&status=${status}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

//create fdr register
export const createAndUpdateFDR = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/FundManagement/CreateAndUpdateFDR`,
      payload
    );
    console.log("res=>", res);
    setDisabled(false);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//create fdr register
export const renewFDR = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/fino/FundManagement/FDRRenew`, payload);
    setDisabled(false);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//get loan register landing

export const getLoanRegisterLanding = async (
  accId,
  buId,
  bankId,
  statusTypeId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  applicationType = 0,
  fromDate,
  toDate
) => {
  const IsApproved =
    applicationType === 1
      ? `&isLoanApproved=${false}`
      : applicationType === 2
      ? `&isLoanApproved=${true}`
      : "";
  const dateParam1 = fromDate ? `&fromDate=${fromDate}` : "";
  const dateParam2 = toDate ? `&toDate=${toDate}` : "";
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/FundManagement/GetLoanRegisterLanding?accountId=${accId}&businessUnitId=${buId}&bankId=${bankId}&statusTypeId=${statusTypeId}&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}${IsApproved}${dateParam1}${dateParam2}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

//create fund limit
export const createLoanRegister = async (
  accId,
  buId,
  loanAcc,
  bankId,
  bankAccId,
  facilityId,
  startDate,
  tenureDays,
  principle,
  interest,
  disbursementPurposeId,
  disbursementPurposeName,
  actionId,
  setDisabled,
  cb,
  isConfirm = false,
  loanAccountId = 0,
  facilityRemarks = "",
  remarks = ""
) => {
  setDisabled(true);
  try {
    // previous
    // const res = await Axios.post(
    //   `/fino/FundManagement/FundLoanAccountCreate?accountId=${accId}&businessUnitId=${buId}&loanAcc=${loanAcc}&bankId=${bankId}&bankAccId=${bankAccId}&facilityId=${facilityId}&startDate=${startDate}&tenureDays=${tenureDays}&numPrinciple=${principle}&numIntRate=${interest}&actionById=${actionId}&disbursementPurposeId=${disbursementPurposeId}&disbursementPurposeName=${disbursementPurposeName ||
    //     ""}&isConfirm=${isConfirm}&loanAccountId=${loanAccountId}`
    // );
    const requestBody = {
      accountId: accId,
      businessUnitId: buId,
      loanAcc: loanAcc,
      bankId: bankId,
      bankAccId: bankAccId,
      facilityId: facilityId,
      startDate: startDate,
      tenureDays: tenureDays,
      numPrinciple: principle,
      numIntRate: interest,
      actionById: actionId,
      disbursementPurposeId: disbursementPurposeId,
      disbursementPurposeName: disbursementPurposeName || "",
      isConfirm: isConfirm,
      loanAccountId: loanAccountId,
      facilityRemarks: facilityRemarks,
      remarks: remarks,
    };
    const res = await Axios.post(
      "/fino/FundManagement/FundLoanAccountCreate",
      requestBody
    );

    setDisabled(false);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//create loan register repay
export const createRepay = async (
  accId,
  buId,
  loanAcc,
  bankAccId,
  instrumentId,
  instrumentNo,
  instrumentDate,
  principalAmount,
  interestAmount,
  transDate,
  actionId,
  numExciseDuty,
  cb
) => {
  try {
    const res = await Axios.post(
      `/fino/FundManagement/FundLoanRepay?accountId=${accId}&businessUnitId=${buId}&loanAccId=${loanAcc}&bankAccId=${bankAccId}&instrumentId=${instrumentId}&instrumentNo=${instrumentNo}&instrumentDate=${instrumentDate}&numAmount=${principalAmount}&numInterestAmount=${interestAmount ||
        0}&transDate=${transDate}&actionById=${actionId}&numExciseDuty=${numExciseDuty}`
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const loadRegisterEdit = async ({ editPayload, setDisabled, cb }) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/fino/FundManagement/EditLoanRegister`,
      editPayload
    );
    toast.success(res?.message || "Submitted successfully");
    cb();
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};
//get bank account ddl

export const getBankAccountDDLByBankId = async (
  accId,
  buId,
  bankId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/BankAccountNumberByBankIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

const getInterest = (numPrinciple, numInterestRate, intTenureDays) => {
  const result = (numPrinciple * (numInterestRate / 100) * intTenureDays) / 365;
  return Math.round(result) || 0;
};

const getNewPrinciple = (numPrinciple, numInterestRate, intTenureDays) => {
  const result =
    (numPrinciple * (numInterestRate / 100) * intTenureDays) / 365 +
    numPrinciple;
  return Math.round(result) || 0;
};

//get fdr by id
export const getFdrById = async (id, setter, setLoading, setOldPrincipal) => {
  try {
    setLoading(true);
    const res = await Axios.get(`/fino/FundManagement/GetFDRById?id=${id}`);
    const newData = {
      bank: { label: res?.data?.strBankName, value: res?.data?.intBankId },
      fdrNo: res?.data?.strFdrAccountNo || "",
      leanTo: res?.data?.strLienTo || "",
      openingDate: "",
      termDays: "",
      principle: getNewPrinciple(
        res?.data?.numPrinciple,
        res?.data?.numInterestRate,
        res?.data?.intTenureDays
      ),
      interest: getInterest(
        res?.data?.numPrinciple,
        res?.data?.numInterestRate,
        res?.data?.intTenureDays
      ),
      interestRate: "",
      bankBranch: res?.data?.strBankBranchName
        ? {
            label: res?.data?.strBankBranchName,
            value: res?.data?.intBankBranchId,
          }
        : "",
      bankAccount: "",
    };
    setter(newData);
    setOldPrincipal(res?.data?.numPrinciple);

    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

//get loan register by id
export const getLoanRegisterById = async (id, setter, setLoading) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/FundManagement/GetLoanRegisterByid?id=${id}`
    );
    const newData = {
      bank: { label: res?.data?.strBankName, value: res?.data?.intBankId },
      facility: {
        label: res?.data?.facilityName,
        value: res?.data?.intLoanFacilityId,
      },
      account: {
        label: res?.data?.strLoanAccountName,
        value: res?.data?.intLoanAccountId,
      },
      openingDate: _dateFormatter(res?.data?.dteStartDate),
      loanAccNo: res?.data?.intLoanAccountId,
      termDays: res?.data?.intTenureDays,
      principle: res?.data?.numPrinciple,
      interestRate: res?.data?.numInterestRate,
    };
    setter(newData);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

//fund limit details

export const getFundLimitDetails = async (
  buId,
  bankId,
  facilityId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/FundManagement/FundLimitUtilizationDetail?businessUnitId=${buId}&bankId=${bankId}&FacilityId=${facilityId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const attachFilesForBanking = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.post(
      `/fino/FundManagement/CreateAttachmentForFDR`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const DeleteFundManagementApi = async (limitId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.post(
      `/fino/FundManagement/DeleteFundManagement?BankLoanLimitId=${limitId}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
export const getAttachments = async (
  buId,
  typeId,
  number,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/FundManagement/GetAttachmentForFDR?BusinessUnitId=${buId}&TypeId=${typeId}&Fdrnumber=${number}`
    );
    setter(res?.data);
    cb && cb();
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const fundManagementAttch = async (attachment, setUploadImage) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setUploadImage(data);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Document not upload");
  }
};

export const getBusinessUnitDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
