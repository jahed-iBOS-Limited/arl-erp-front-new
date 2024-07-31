import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

export const getSBU = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${BuId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBankAc = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const changeChequeBookSave = async (id, chequeNo, cb) => {
  try {
    const res = await Axios.put(
      `/fino/BankJournal/UpdateChekNoById?Id=${id}&CheckNo=${chequeNo}`
    );
    if (res.status === 200 && res?.data) {
      cb();
      toast.success(res?.data?.message, { toastId: "sfasfsf" });
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: "sfasfsfErr" });
  }
};

export const genarateChequeNo = async (
  accId,
  buId,
  bankId,
  branchId,
  bankAccId,
  bankAccNo,
  instrumentId
) => {
  try {
    const res = await Axios.get(
      `/fino/BankJournal/ChequeGeneretor?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccId}&BankAccountNo=${bankAccNo}&instrumentId=${instrumentId}`
    );
    if (res.status === 200 && res?.data) {
      return res?.data;
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: "asfasfasErr" });
    return [];
  }
};

export const setGenarateChequeNo = async (
  accId,
  buId,
  bankId,
  branchId,
  bankAccId,
  bankAccNo,
  instrumentId,
  setter,
  setChequeModal
) => {
  try {
    const res = await Axios.get(
      `/fino/BankJournal/ChequeGeneretor?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccId}&BankAccountNo=${bankAccNo}&instrumentId=${instrumentId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.currentChequeNo);
      res?.data?.currentChequeNo ? setChequeModal(true) : setChequeModal(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: "asfasfasErr" });
    setter([]);
  }
};
export const chequeGeneretor = async (
  accountId,
  businessUnitId,
  bankId,
  branchId,
  bankAccountId,
  bankAccountNo,
  instrumentId,
  bankJournalId,
  cb
) => {
  try {
    const res = await Axios.get(
      `fino/BankJournal/ChequeGeneretor?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccountId}&BankAccountNo=${bankAccountNo}&instrumentId=${instrumentId}&BankJournalId=${bankJournalId}`
    );
    if (res.status === 200 && res?.data) {
      cb(res?.data);
      // res?.data?.currentChequeNo ? setChequeModal(true) : setChequeModal(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: "asfasfasErr" });
    // setter([]);
  }
};

export const getPartner = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDDL?accountId=${accId}&businessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPartnerDetailsDDL = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDetailsDDL?accountId=${accId}&businessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
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
export const getInstrumentType = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSendToGLBank = async (accId, BuId, journalType, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBusinessUnitGeneralLedgerDDLTypeById?AccountId=${accId}&BusinssUnitId=${BuId}&AccountingGroupId=${journalType}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// Get landing
export const getBankJournalGrid = async (
  accId,
  BuId,
  sbuId,
  journalType,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/BankJournal/GetBankJournalLandingPasignation?AccountId=${accId}&BusinessUnitId=${BuId}&SbuId=${sbuId}&AccountingJournalTypeId=${journalType}&IsPosted=false&IsActive=true&viewOrder=desc&PageNo=1&PageSize=100`
    );
    if (res.status === 200 && res?.data?.data) {
      const data = res?.data?.data;
      const newData = data.map((itm) => ({
        ...itm,
        itemCheck: false,
      }));
      setter(newData);
    }
  } catch (error) {}
};

export const saveBankJournal = async (
  data,
  cb,
  setRowDto,
  setDisabled,
  IConfirmModal
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/BankJournal/CreateBankJournalNew`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb && cb(res?.data?.code);
      setRowDto([]);
      setDisabled(false);
      // const obj = {
      //   title: "Bank Journal Code",
      //   message: res?.data?.code,
      //   noAlertFunc: () => {},
      // };
      // IConfirmModal(obj);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message);
    setDisabled(false);
  }
};
// https://localhost:44346/fino/BankBranch/GenerateAdviceNo?UnitId=2
export const generateAdviceNo = async (UnitId, setFieldValue) => {
  try {
    const res = await Axios.post(
      `/fino/BankBranch/GenerateAdviceNo?UnitId=${UnitId}`
    );
    setFieldValue("instrumentNo", res?.data?.code);
  } catch (error) {
    // toast.warn(error?.response?.data?.message);
    // setDisabled(false);
  }
};

export const singleDataById = async (id, type, setter) => {
  try {
    const res = await Axios.get(
      `/fino/BankJournal/GetBankJournalById?BankJournalId=${id}&AccountingJournalTypeId=${type}`
    );
    if (res.status === 200 && res?.data) {
      if (type === 4) {
        const item = res?.data?.[0];
        // const objRow = item.objRow.filter((itm) => itm.amount < 0);
        const ObjMap = item?.objRow?.map((itm) => ({
          ...itm,
          rowId: itm?.rowId,
          transaction: {
            value: itm?.subGLId,
            label: itm?.subGLName,
            code: itm?.subGlCode,
          },
          gl: {
            value: itm?.generalLedgerId,
            label: itm?.generalLedgerName,
            code: itm?.generalLedgerCode,
          },
          amount: Math.abs(itm?.amount),
          narration: itm?.narration,
          bankAccountId: itm?.bankAccountId,
          bankAccNo: itm?.bankAccNo,
          partner: {
            value: itm?.businessPartnerId,
            label: itm?.businessPartnerName,
            code: itm?.businessPartnerCode,
          },
          partnerType: {
            value: itm?.subGLTypeId,
            label: itm?.subGLTypeName,
            reffPrtTypeId: itm?.subGLTypeId,
          },
          profitCenter: itm?.profitCenterId
            ? { value: itm?.profitCenterId, label: itm?.profitCenterName }
            : "",
          revenueCenter:
            itm?.controlType === "Revenue" && itm?.costRevenueId
              ? { value: itm?.costRevenueId, label: itm?.costRevenueName }
              : "",
          revenueElement:
            itm?.controlType === "Revenue" && itm?.elementId
              ? { value: itm?.elementId, label: itm?.elementName }
              : "",
          costCenter:
            itm?.controlType === "Cost" && itm?.costRevenueId
              ? { value: itm?.costRevenueId, label: itm?.costRevenueName }
              : "",
          costElement:
            itm?.controlType === "Cost" && itm?.elementId
              ? { value: itm?.elementId, label: itm?.elementName }
              : "",
        }));

        const data = {
          objHeader: {
            partnerBankAccount: "",
            transactionDate: _dateFormatter(item?.objHeader?.voucherDate),
            bankJournalCode: item?.objHeader?.bankJournalCode,
            bankAcc: {
              value: item?.objHeader?.bankAccountId,
              label: `${item?.objHeader?.bankShortName}: ${item?.objHeader?.bankAccountNumber}`,
              bankAccNo: item?.objHeader?.bankAccountNumber,
              bankId: item?.objHeader?.bankId,
              bankName: item?.objHeader?.bankName,
              generalLedgerId: item?.objHeader?.generalLedgerId,
              generalLedgerName: item?.objHeader?.generalLedgerName,
              generalLedgerCode: item?.objHeader?.generalLedgerCode,
              bankBranch_Id: item?.objHeader?.bankBranchId,
              bankBranchName: item?.objHeader?.bankBranchName,
            },
            partner: item?.objHeader?.businessPartnerId
              ? {
                  value: item?.objHeader?.businessPartnerId || 0,
                  label: item?.objHeader?.businessPartnerName || "",
                  businessPartnerCode:
                    item?.objHeader?.businessPartnerCode || "",
                }
              : "",
            isCheck: item?.objHeader?.businessPartnerId ? false : true,
            // partnerType: item?.objHeader?.businessPartnerTypeId
            //   ? {
            //       value: item?.objHeader?.businessPartnerTypeId,
            //       label: item?.objHeader?.businessPartnerTypeName,
            //     }
            //   : "",
            receiveFrom: item?.objHeader?.receiveFrom || "",
            instrumentType: {
              value: item?.objHeader?.instrumentId || 0,
              label: item?.objHeader?.instrumentName || "",
            },
            instrumentNo: item?.objHeader?.instrumentNo || "",
            instrumentDate:
              _dateFormatter(item?.objHeader?.instrumentDate) || "",
            headerNarration: item?.objHeader?.narration || "",
            placedInBank: item?.objHeader?.placedInBank,
            placingDate: _dateFormatter(item?.objHeader?.placingDate) || "",
            paidTo: item?.objHeader?.paidTo || "",
            transferTo: "",
            sendToGLBank: "",
            // transaction: {value : item?.objHeader?.businessPartnerId, label : item?.objHeader?.businessPartnerName, code : item?.objHeader?.businessPartnerCode},
            // amount is for bank receive and bank payment row
            amount: "",
            // transferAmount is for bank transfer header
            transferAmount: "",
            narration: "",
            bankJournalId: item?.objHeader?.bankJournalId,
            customerSupplierStatus: item?.objHeader?.businessPartnerTypeName,
            revenueCenter: {
              label: item?.objHeader?.costRevenueName,
              value: item?.objHeader?.costRevenueId,
            },
            revenueElement: {
              label: item?.objHeader?.elementName,
              value: item?.objHeader?.elementId,
            },
          },
          objRow: ObjMap,
          headerRowId: item?.objRow?.[0]?.rowId,
        };
        setter(data);
      }
      if (type === 5) {
        const item = res?.data?.[0];
        // const objRow = item.objRow.filter((itm) => itm.amount > 0);
        const ObjMap = item?.objRow?.map((itm) => ({
          partnerBankAccount : {
            bankId : itm?.partnerBankId,
            bankBranchId : itm?.partnerBankBranchId,
            bankAccountNo : itm?.partnerBankAccountNo,
            bankName : itm?.partnerBankAccountName,
            routingNo : itm?.partnerBankRoutingNumber,
          },
          ...itm,
          rowId: itm?.rowId,
          transaction: {
            value: itm?.subGLId,
            label: itm?.subGLName,
            code: itm?.subGlCode,
          },
          gl: {
            value: itm?.generalLedgerId,
            label: itm?.generalLedgerName,
            code: itm?.generalLedgerCode,
          },
          amount: itm?.amount,
          narration: itm?.narration,
          bankAccountId: itm?.bankAccountId,
          bankAccNo: itm?.bankAccNo,
          partner: {
            value: itm?.businessPartnerId,
            label: itm?.businessPartnerName,
            code: itm?.businessPartnerCode,
          },
          partnerType: {
            value: itm?.subGLTypeId,
            label: itm?.subGLTypeName,
            reffPrtTypeId: itm?.subGLTypeId,
          },
          costElement:
          itm?.controlType === "Cost" && itm?.elementId
            ? { value: itm?.elementId, label: itm?.elementName }
            : "",
            profitCenter: itm?.profitCenterId
            ? { value: itm?.profitCenterId, label: itm?.profitCenterName }
            : "",
          
        }));

        const data = {
          objHeader: {
            transactionDate: _dateFormatter(item?.objHeader?.voucherDate),
            bankJournalCode: item?.objHeader?.bankJournalCode,
            bankAcc: {
              value: item?.objHeader?.bankAccountId,
              label: `${item?.objHeader?.bankShortName}: ${item?.objHeader?.bankAccountNumber}`,
              bankAccNo: item?.objHeader?.bankAccountNumber,
              bankId: item?.objHeader?.bankId,
              bankName: item?.objHeader?.bankName,
              generalLedgerId: item?.objHeader?.generalLedgerId,
              generalLedgerName: item?.objHeader?.generalLedgerName,
              generalLedgerCode: item?.objHeader?.generalLedgerCode,
              bankBranch_Id: item?.objHeader?.bankBranchId,
              bankBranchName: item?.objHeader?.bankBranchName,
            },
            partner: item?.objHeader?.businessPartnerId
              ? {
                  value: item?.objHeader?.businessPartnerId || 0,
                  label: item?.objHeader?.businessPartnerName || "",
                  businessPartnerCode:
                    item?.objHeader?.businessPartnerCode || "",
                }
              : "",
            isCheck: item?.objHeader?.businessPartnerId ? false : true,
            // partnerType: item?.objHeader?.businessPartnerTypeId
            //   ? {
            //       value: item?.objHeader?.businessPartnerTypeId,
            //       label: item?.objHeader?.businessPartnerTypeName,
            //     }
            //   : "",
            receiveFrom: item?.objHeader?.receiveFrom || "",
            instrumentType: {
              value: item?.objHeader?.instrumentId || 0,
              label: item?.objHeader?.instrumentName || "",
            },
            instrumentNo: item?.objHeader?.instrumentNo || "",
            instrumentDate:
              _dateFormatter(item?.objHeader?.instrumentDate) || "",
            headerNarration: item?.objHeader?.narration || "",
            placedInBank: item?.objHeader?.placedInBank,
            placingDate: _dateFormatter(item?.objHeader?.placingDate) || "",
            paidTo: item?.objHeader?.paidTo || "",
            transferTo: item?.objHeader?.transferTo || "",
            sendToGLBank: "",
            transaction: "",
            // amount is for bank receive and bank payment row
            amount: "",
            // transferAmount is for bank transfer header
            transferAmount: "",
            narration: "",
            bankJournalId: item?.objHeader?.bankJournalId,
            customerSupplierStatus: item?.objHeader?.businessPartnerTypeName,
            costCenter: {
              label: item?.objHeader?.costRevenueName,
              value: item?.objHeader?.costRevenueId,
            },
            costElement: {
              label: item?.objHeader?.elementName,
              value: item?.objHeader?.elementId,
            },
          },
          objRow: ObjMap,
          headerRowId: item?.objRow?.[0]?.rowId,
        };
        setter(data);
      }
      if (type === 6) {
        const item = res?.data?.[0];
        // const objRow = item.objRow.filter((itm) => itm.amount > 0);
        const ObjMap = item?.objRow?.map((itm) => ({
          rowId: itm?.rowId,
          businessTransactionId: itm?.subGLId,
          businessTransactionCode: itm?.subGlCode,
          businessTransactionName: itm?.subGLName,
          generalLedgerId: itm?.generalLedgerId,
          generalLedgerCode: itm?.generalLedgerCode,
          generalLedgerName: itm?.generalLedgerName,
          amount: itm?.amount,
          narration: itm?.narration,
          bankAccountId: itm?.bankAccountId,
          bankAccNo: itm?.bankAccNo,
          bankAcc: {
            value: itm?.bankAccountId,
            bankAccNo: itm?.bankAccNo,
            bankName: itm?.bankShortName,
          },
        }));

        const data = {
          objHeader: {
            transactionDate: _dateFormatter(item?.objHeader?.voucherDate),
            bankJournalCode: item?.objHeader?.bankJournalCode,
            bankAcc: {
              value: item?.objHeader?.bankAccountId,
              label: `${item?.objHeader?.bankShortName}: ${item?.objHeader?.bankAccountNumber}`,
              bankAccNo: item?.objHeader?.bankAccountNumber,
              bankId: item?.objHeader?.bankId,
              bankName: item?.objHeader?.bankName,
              generalLedgerId: item?.objHeader?.generalLedgerId,
              generalLedgerName: item?.objHeader?.generalLedgerName,
              generalLedgerCode: item?.objHeader?.generalLedgerCode,
              bankBranch_Id: item?.objHeader?.bankBranchId,
              bankBranchName: item?.objHeader?.bankBranchName,
            },
            partner: {
              value: item?.objHeader?.businessPartnerId || 0,
              label: item?.objHeader?.businessPartnerName || "",
              businessPartnerCode: item?.objHeader?.businessPartnerCode || "",
            },
            partnerType: {
              value: item?.objHeader?.businessPartnerTypeId,
              label: item?.objHeader?.businessPartnerTypeName,
            },
            receiveFrom: item?.objHeader?.receiveFrom || "",
            instrumentType: {
              value: item?.objHeader?.instrumentId || 0,
              label: item?.objHeader?.instrumentName || "",
            },
            instrumentNo: item?.objHeader?.instrumentNo || "",
            instrumentDate:
              _dateFormatter(item?.objHeader?.instrumentDate) || "",
            headerNarration: item?.objHeader?.narration || "",
            placedInBank: item?.objHeader?.placedInBank,
            placingDate: _dateFormatter(item?.objHeader?.placingDate) || "",
            paidTo: item?.objHeader?.paidTo || "",
            transferTo:
              item?.objHeader?.transferTo === "Bank"
                ? { value: 2, label: "Bank" }
                : { value: 1, label: "Cash" },
            sendToGLBank:
              item?.objHeader?.transferTo === "Cash"
                ? {
                    value: item?.objRow?.[0]?.generalLedgerId,
                    label: item?.objRow?.[0]?.generalLedgerName,
                    generalLedgerCode: item?.objRow?.[0]?.generalLedgerCode,
                  }
                : {
                    value: item?.objRow?.[0]?.bankAccountId,
                    // label: item?.objRow?.[0]?.bankAccNo,
                    label: `${item?.objRow?.[0]?.bankShortName}: ${item?.objRow?.[0]?.bankAccNo}`,
                    bankAccNo: item?.objRow?.[0]?.bankAccNo,
                    generalLedgerId: item?.objRow?.[0]?.generalLedgerId,
                    generalLedgerCode: item?.objRow?.[0]?.generalLedgerCode,
                    generalLedgerName: item?.objRow?.[0]?.generalLedgerName,
                  },
            transaction: "",
            // amount is for bank receive and bank payment row
            amount: "",
            // transferAmount is for bank transfer header
            transferAmount: item?.objRow?.[0]?.amount,
            narration: "",
            bankJournalId: item?.objHeader?.bankJournalId,
            costCenter: {
              label: item?.objHeader?.costRevenueName,
              value: item?.objHeader?.costRevenueId,
            },
            costElement: {
              label: item?.objHeader?.elementName,
              value: item?.objHeader?.elementId,
            },
          },
          objRow: ObjMap,
          headerRowId: item?.objRow?.[0]?.rowId,
        };

        setter(data);
      }
    }
  } catch (error) {}
};

// getBusinessPartnerSalesDDL
export const getBusinessPartnerSalesDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerSales/GetBusinessPartnerSales?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// getBusinessPartnerSalesDDL
export const getBusinessPartnerPurchaseDDLAction = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerPurchaseDDL?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getOthersPartner = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerOthersDdl?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
  }
};

export const getPartnerTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(
      "/fino/AccountingConfig/GetAccTransectionTypeDDL"
    );
    setter(res?.data);
  } catch (error) {
  }
};
// getProfitCenter List
export const getProfitCenterDDL = async (buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${buId}`
    );
    const modifiedData = res?.data?.map((item) => ({
      ...item,
      value: item?.profitCenterId,
      label: item?.profitCenterName,
    }));
    setter(modifiedData);
  } catch (error) {
  }
};
// getCostElementDDL
export const getCostElementDDL = async (UnitId, AccountId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/CostElement?AccountId=${AccountId}&UnitId=${UnitId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};
// getCostCenterDDL
export const getCostCenterDDL = async (UnitId, AccountId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/CostCenter?AccountId=${AccountId}&UnitId=${UnitId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};
// getRevenueElementListDDL
export const getRevenueElementListDDL = async (businessUnitId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/AccountingConfig/GetRevenueElementList?businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};
// getRevenueCenterListDDL
export const getRevenueCenterListDDL = async (businessUnitId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/AccountingConfig/GetRevenueCenterList?businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};

// getNextBankCheque
export const getNextBankCheque = async (
  accId,
  buId,
  bankId,
  branchId,
  bankAccountId,
  setter,
  key
) => {
  try {
    const res = await Axios.get(
      `/fino/BankJournal/GetNextBankCheque?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccountId}`
    );
    if (res.status === 200 && res?.data) {
      setter(key, res?.data?.currentChequeNo);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message);
  }
};

// /fino/JournalPosting/CancelJournal?JournalCode=CN-APFIL-JUL21-2&JournalTypeId=6&UnitId=8&ActionById=32897&TypeId=2
export const cancelJournal = async (
  journalCode,
  journalTypeId,
  unitId,
  actionById,
  typeId,
  cb
) => {
  try {
    await Axios.post(
      `/fino/JournalPosting/CancelJournal?JournalCode=${journalCode}&JournalTypeId=${journalTypeId}&UnitId=${unitId}&ActionById=${actionById}&TypeId=${typeId}`
    );
    // setFieldValue("instrumentNo",res?.data?.code)
    cb();
    toast.success("Submitted successfully");
  } catch (error) {
    // toast.warn(error?.response?.data?.message);
    // setDisabled(false);
  }
};

export const getBusinessTransactionByPartnerDDL = async (
  accountId,
  businessUnitId,
  partnerTypeId,
  partnerId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionByPartnerDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&partnerTypeId=${partnerTypeId}&partnerId=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
  }
};

// https://localhost:5001/fino/CommonFino/CheckTwoFactorApproval?OtpType=1&intUnitId=164&strTransectionType=kfjdskfj&intTransectionId=2&strCode=djfksjk&intActionById=11621&strOTP=kfjsklfjsd&CancelType=1
export const checkTwoFactorApproval = async (
  otpType,
  unitId,
  transectionType,
  transectionId,
  journalCode,
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
      `/fino/CommonFino/CheckTwoFactorApproval?OtpType=${otpType}&intUnitId=${unitId}&strTransectionType=${transectionType}&intTransectionId=${transectionId}&strCode=${journalCode}&journalTypeId=${journalTypeId}&intActionById=${actionById}&strOTP=${strOTP}&CancelType=${cancelType}`
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
    toast.warn(error?.response?.data?.message || "Please try again");
    // setDisabled(false);
  }
};

export const getCostElementByCostCenterDDL = async (unitId, accountId, costCenterId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accountId}&UnitId=${unitId}&CostCenterId=${costCenterId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};
