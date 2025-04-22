import { default as axios } from 'axios';
import { toast } from 'react-toastify';
import { imarineBaseUrl } from '../../../App';
import { _dateFormatter } from './_dateFormate';
import { _todayDate } from './_todayDate';

export const getImageuploadStatus = (accountId) => {
  return axios.get(`/fino/Image/getImageuploadStatus?accountId=${accountId}`);
};

export const getSBU = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${BuId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBankAc = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const changeChequeBookSave = async (id, chequeNo, cb) => {
  try {
    const res = await axios.put(
      `/fino/BankJournal/UpdateChekNoById?Id=${id}&CheckNo=${chequeNo}`
    );
    if (res.status === 200 && res?.data) {
      cb();
      toast.success(res?.data?.message, { toastId: 'sfasfsf' });
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: 'sfasfsfErr' });
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
    const res = await axios.get(
      `/fino/BankJournal/ChequeGeneretor?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccId}&BankAccountNo=${bankAccNo}&instrumentId=${instrumentId}`
    );
    if (res.status === 200 && res?.data) {
      return res?.data;
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: 'asfasfasErr' });
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
    const res = await axios.get(
      `/fino/BankJournal/ChequeGeneretor?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccId}&BankAccountNo=${bankAccNo}&instrumentId=${instrumentId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.currentChequeNo);
      res?.data?.currentChequeNo ? setChequeModal(true) : setChequeModal(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: 'asfasfasErr' });
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
    const res = await axios.get(
      `fino/BankJournal/ChequeGeneretor?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccountId}&BankAccountNo=${bankAccountNo}&instrumentId=${instrumentId}&BankJournalId=${bankJournalId}`
    );
    if (res.status === 200 && res?.data) {
      cb(res?.data);
      // res?.data?.currentChequeNo ? setChequeModal(true) : setChequeModal(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: 'asfasfasErr' });
    // setter([]);
  }
};

export const getPartner = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDDL?accountId=${accId}&businessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export function getPartnerDDL(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

export const getPartnerDetailsDDL = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDetailsDDL?accountId=${accId}&businessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBusinessTransactionDDL = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBusTransDDLForExpense = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDLForExpense?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getInstrumentType = async (setter) => {
  try {
    const res = await axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSendToGLBank = async (accId, BuId, journalType, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GetBusinessUnitGeneralLedgerDDLTypeById?AccountId=${accId}&BusinssUnitId=${BuId}&AccountingGroupId=${journalType}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const approvalApi = async (
  parameter,
  poayload,
  activityName,
  onChangeForActivity,
  setBillSubmitBtn
) => {
  try {
    await axios.put(
      `/procurement/Approval/CommonApproved?AcountId=${parameter?.accid}&BusinessUnitId=${parameter?.buId}&UserId=${parameter?.userId}&ActivityId=${parameter?.activityId}`,
      poayload
    );
    toast.success('Approved successfully');
    setBillSubmitBtn(true);
    onChangeForActivity();
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Approval Failed');
  }
};

export const getItemGridData = async (
  activityId,
  accId,
  buId,
  userId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search,
  plantId
) => {
  const Search = search ? `&Search=${search}` : '';
  try {
    setLoading(true);
    const res = await axios.get(
      `/procurement/Approval/CoomonApprovalList?AcountId=${accId}&BusinessUnitId=${buId}&UserId=${userId}&ActivityId=${activityId}&viewOrder=desc&PageNo=${
        pageNo || 1
      }&PageSize=${pageSize}${Search}&plantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter({
        data: res?.data?.map((itm) => ({
          ...itm,
          isSelect: false,
        })),
        totalCount: res?.data[0]?.totalRows,
        currentPage: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
      });
      // console.log(res.data)
      // setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
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
    const res = await axios.post(
      `/fino/BankJournal/CreateBankJournalNew`,
      data
    );

    if (res?.data?.statuscode === 200) {
      toast.success(res?.data?.message || 'Submitted successfully');
      cb && cb(res?.data?.code);
      setRowDto([]);
      setDisabled(false);
      const obj = {
        title: 'Bank Journal Code',
        message: res?.data?.code,
        noAlertFunc: () => {},
      };
      IConfirmModal(obj);
    }
    if (res?.data?.statuscode === 400) {
      toast.warning(res?.data?.message || 'Something went wrong');
      cb && cb(res?.data?.code);
      setRowDto([]);
      setDisabled(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const generateAdviceNo = async (UnitId, setFieldValue) => {
  try {
    const res = await axios.post(
      `/fino/BankBranch/GenerateAdviceNo?UnitId=${UnitId}`
    );
    setFieldValue('instrumentNo', res?.data?.code);
  } catch (error) {
    // toast.warn(error?.response?.data?.message);
    // setDisabled(false);
  }
};

export const singleDataById = async (id, type, setter) => {
  try {
    const res = await axios.get(
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
            : '',
          revenueCenter:
            itm?.controlType === 'Revenue' && itm?.costRevenueId
              ? { value: itm?.costRevenueId, label: itm?.costRevenueName }
              : '',
          revenueElement:
            itm?.controlType === 'Revenue' && itm?.elementId
              ? { value: itm?.elementId, label: itm?.elementName }
              : '',
          costCenter:
            itm?.controlType === 'Cost' && itm?.costRevenueId
              ? { value: itm?.costRevenueId, label: itm?.costRevenueName }
              : '',
          costElement:
            itm?.controlType === 'Cost' && itm?.elementId
              ? { value: itm?.elementId, label: itm?.elementName }
              : '',
        }));

        const data = {
          objHeader: {
            partnerBankAccount: '',
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
                  label: item?.objHeader?.businessPartnerName || '',
                  businessPartnerCode:
                    item?.objHeader?.businessPartnerCode || '',
                }
              : '',
            isCheck: item?.objHeader?.businessPartnerId ? false : true,
            // partnerType: item?.objHeader?.businessPartnerTypeId
            //   ? {
            //       value: item?.objHeader?.businessPartnerTypeId,
            //       label: item?.objHeader?.businessPartnerTypeName,
            //     }
            //   : "",
            receiveFrom: item?.objHeader?.receiveFrom || '',
            instrumentType: {
              value: item?.objHeader?.instrumentId || 0,
              label: item?.objHeader?.instrumentName || '',
            },
            instrumentNo: item?.objHeader?.instrumentNo || '',
            instrumentDate:
              _dateFormatter(item?.objHeader?.instrumentDate) || '',
            headerNarration: item?.objHeader?.narration || '',
            placedInBank: item?.objHeader?.placedInBank,
            placingDate: _dateFormatter(item?.objHeader?.placingDate) || '',
            paidTo: item?.objHeader?.paidTo || '',
            transferTo: '',
            sendToGLBank: '',
            // transaction: {value : item?.objHeader?.businessPartnerId, label : item?.objHeader?.businessPartnerName, code : item?.objHeader?.businessPartnerCode},
            // amount is for bank receive and bank payment row
            amount: '',
            // transferAmount is for bank transfer header
            transferAmount: '',
            narration: '',
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
          partnerBankAccount: {
            bankId: itm?.partnerBankId,
            bankBranchId: itm?.partnerBankBranchId,
            bankAccountNo: itm?.partnerBankAccountNo,
            bankName: itm?.partnerBankAccountName,
            routingNo: itm?.partnerBankRoutingNumber,
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
            itm?.controlType === 'Cost' && itm?.elementId
              ? { value: itm?.elementId, label: itm?.elementName }
              : '',
          profitCenter: itm?.profitCenterId
            ? { value: itm?.profitCenterId, label: itm?.profitCenterName }
            : '',
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
                  label: item?.objHeader?.businessPartnerName || '',
                  businessPartnerCode:
                    item?.objHeader?.businessPartnerCode || '',
                }
              : '',
            isCheck: item?.objHeader?.businessPartnerId ? false : true,
            // partnerType: item?.objHeader?.businessPartnerTypeId
            //   ? {
            //       value: item?.objHeader?.businessPartnerTypeId,
            //       label: item?.objHeader?.businessPartnerTypeName,
            //     }
            //   : "",
            receiveFrom: item?.objHeader?.receiveFrom || '',
            instrumentType: {
              value: item?.objHeader?.instrumentId || 0,
              label: item?.objHeader?.instrumentName || '',
            },
            instrumentNo: item?.objHeader?.instrumentNo || '',
            instrumentDate:
              _dateFormatter(item?.objHeader?.instrumentDate) || '',
            headerNarration: item?.objHeader?.narration || '',
            placedInBank: item?.objHeader?.placedInBank,
            placingDate: _dateFormatter(item?.objHeader?.placingDate) || '',
            paidTo: item?.objHeader?.paidTo || '',
            transferTo: item?.objHeader?.transferTo || '',
            sendToGLBank: '',
            transaction: '',
            // amount is for bank receive and bank payment row
            amount: '',
            // transferAmount is for bank transfer header
            transferAmount: '',
            narration: '',
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
              label: item?.objHeader?.businessPartnerName || '',
              businessPartnerCode: item?.objHeader?.businessPartnerCode || '',
            },
            partnerType: {
              value: item?.objHeader?.businessPartnerTypeId,
              label: item?.objHeader?.businessPartnerTypeName,
            },
            receiveFrom: item?.objHeader?.receiveFrom || '',
            instrumentType: {
              value: item?.objHeader?.instrumentId || 0,
              label: item?.objHeader?.instrumentName || '',
            },
            instrumentNo: item?.objHeader?.instrumentNo || '',
            instrumentDate:
              _dateFormatter(item?.objHeader?.instrumentDate) || '',
            headerNarration: item?.objHeader?.narration || '',
            placedInBank: item?.objHeader?.placedInBank,
            placingDate: _dateFormatter(item?.objHeader?.placingDate) || '',
            paidTo: item?.objHeader?.paidTo || '',
            transferTo:
              item?.objHeader?.transferTo === 'Bank'
                ? { value: 2, label: 'Bank' }
                : { value: 1, label: 'Cash' },
            sendToGLBank:
              item?.objHeader?.transferTo === 'Cash'
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
            transaction: '',
            // amount is for bank receive and bank payment row
            amount: '',
            // transferAmount is for bank transfer header
            transferAmount: item?.objRow?.[0]?.amount,
            narration: '',
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
export const getBusinessPartnerSalesDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerSales/GetBusinessPartnerSales?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBusinessPartnerPurchaseDDLAction = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerPurchaseDDL?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getOthersPartner = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerOthersDdl?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getPartnerTypeDDL = async (setter) => {
  try {
    const res = await axios.get(
      '/fino/AccountingConfig/GetAccTransectionTypeDDL'
    );
    setter(res?.data);
  } catch (error) {}
};
export const getProfitCenterDDL = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${buId}`
    );
    const modifiedData = res?.data?.map((item) => ({
      ...item,
      value: item?.profitCenterId,
      label: item?.profitCenterName,
    }));
    setter(modifiedData);
  } catch (error) {}
};
export const getCostElementDDL = async (UnitId, AccountId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/CostElement?AccountId=${AccountId}&UnitId=${UnitId}`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getCostCenterDDL = async (UnitId, AccountId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/CostCenter?AccountId=${AccountId}&UnitId=${UnitId}`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getRevenueElementListDDL = async (businessUnitId, setter) => {
  try {
    const res = await axios.get(
      `/fino/AccountingConfig/GetRevenueElementList?businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getRevenueCenterListDDL = async (businessUnitId, setter) => {
  try {
    const res = await axios.get(
      `/fino/AccountingConfig/GetRevenueCenterList?businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) {}
};
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
    const res = await axios.get(
      `/fino/BankJournal/GetNextBankCheque?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccountId}`
    );
    if (res.status === 200 && res?.data) {
      setter(key, res?.data?.currentChequeNo);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message);
  }
};
export const cancelJournal = async (
  journalCode,
  journalTypeId,
  unitId,
  actionById,
  typeId,
  cb
) => {
  try {
    await axios.post(
      `/fino/JournalPosting/CancelJournal?JournalCode=${journalCode}&JournalTypeId=${journalTypeId}&UnitId=${unitId}&ActionById=${actionById}&TypeId=${typeId}`
    );
    // setFieldValue("instrumentNo",res?.data?.code)
    cb();
    toast.success('Submitted successfully');
  } catch (error) {
    // toast.warn(error?.response?.data?.message);
    // setDisabled(false);
  }
};

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
    const res = await axios.get(
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
    toast.warn(error?.response?.data?.message || 'Please try again');
    // setDisabled(false);
  }
};
export const getCostElementByCostCenterDDL = async (
  unitId,
  accountId,
  costCenterId,
  setter
) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accountId}&UnitId=${unitId}&CostCenterId=${costCenterId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getBankAccountDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getShipByDDL = async (setter) => {
  try {
    const res = await axios.get('/imp/ImportCommonDDL/GetShipmentTypeDDL');
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const GetLighterCNFDDL = async (setter) => {
  try {
    const res = await axios.get(`/wms/FertilizerOperation/GetLighterCNFDDL`);
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getMotherVesselInfo = async (vesselId, portId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/wms/FertilizerOperation/GetMVesselProgramDet?PortId=${portId}&MotherVesselId=${vesselId}`
    );
    cb && cb(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getMotherVesselDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getPartnerTypeDDLAction = async (setPartnerTypeDDL) => {
  try {
    const res = await axios.get(
      '/fino/AccountingConfig/GetAccTransectionTypeDDL'
    );
    setPartnerTypeDDL(res?.data);
  } catch (error) {
    setPartnerTypeDDL([]);
  }
};

export const getPortDDL = async (voyageId, chartererId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LayTime/GetPortDDL?VoyageId=${voyageId}&PartnerId=${chartererId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getCargoDDL = async (voyageId, type, chartererId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LayTime/GetCargoDDL?VoyageId=${voyageId}&PartnerType=${type}&PartnerId=${chartererId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getTimeCharterLandingData = async (
  accId,
  buId,
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  searchValue,
  setter,
  setLoading
) => {
  setLoading(true);
  const search = searchValue ? `&search=${searchValue}` : '';
  const voyageNoStr = voyageId ? `&VoyageId=${voyageId}` : '';
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/GetTimeCharterLanding?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${
        vesselId || 0
      }${voyageNoStr}${search}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const GetBranchDDL = async (accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getDeliveryChallanInfoById = async ({
  id,
  profileData,
  selectedBusinessUnit,
  setLoading,
  setDeliveryOrderReporData,
}) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/ShopBySales/GetDeliveryChallanByDeliveryId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&DeliveryId=${id}`
    );
    setLoading(false);
    const modified = res?.data?.[0]?.rows?.map((itm) => ({
      ...itm,
      weight: +itm?.weight?.toFixed(3),
    }));
    setDeliveryOrderReporData({ ...res?.data?.[0], rows: modified });
  } catch (error) {
    setLoading(false);
  }
};

export const GetShipmentTypeApi = async (
  accId,
  buId,
  territoryId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/DeliveryRequisition/GetShipmentType?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`
    );

    const dataModify = res?.data?.map((item) => ({
      value: item?.shipmentTypeId,
      label: item?.shipmentType,
      extraRate: item?.extraRate || 0,
    }));
    setter([{ value: 0, label: 'All' }, ...dataModify] || []);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getCommercialCostingServiceBreakdown = async (
  referenceId,
  setter
) => {
  try {
    const res = await axios.get(
      `/imp/AllCharge/GetCommercialCostingServiceBreakdown?referenceId=${referenceId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.error(err?.response?.data?.message);
  }
};

export const getPurchaseOrganizationDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getOrderCompleteInfo = async (accId, buId, orderId, setter) => {
  try {
    let res = await axios.get(
      `/oms/SalesOrder/GetOrderCompleteInfo?AccountId=${accId}&BusinessUnitId=${buId}&OrderId=${orderId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getVoyageDDLNew = async ({
  accId,
  buId,
  id,
  setLoading,
  setter,
  voyageTypeId, // 0: All, 1: Time Charter, 2: Voyage Charter,
  isComplete, // 0: All, 1: true, 2: false,
  hireType, // 0: All, 1: Owner, 2: Charterer,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/PortPDA/GetVoyageDDLNew?AccountId=${accId}&BusinessUnitId=${buId}&vesselId=${id}&VoyageTypeId=${
        voyageTypeId || 0
      }&ReturnType=${isComplete || 0}&HireTypeId=${hireType || 0}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getVesselDDL = async (accId, buId, setter, vesselId) => {
  const vesselIdStr = vesselId ? `&IsVessel=${vesselId}` : ''; // first perameter so not (?)
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}${vesselIdStr}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getBeatDDL = async (RoId, setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${RoId}`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};

export const getMonthDDL = async (setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/GetMonthDDl`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};

export const getCategoryDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=10`
    );
    if (res?.status === 200) {
      let dataMapping = res?.data?.map((data) => {
        return {
          value: data?.itemCategoryId,
          label: data?.itemCategoryName,
        };
      });
      setter(dataMapping);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getSubCategoryDDL = async (accId, buId, cat, setter) => {
  try {
    let res = await axios.get(
      `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${accId}&businessUnitId=${buId}&itemCategoryId=${cat}&typeId=10`
    );
    if (res?.status === 200) {
      let dataMapping = res?.data?.map((item) => {
        return {
          code: item?.code,
          value: item?.id,
          label: item?.itemSubCategoryName,
        };
      });
      setter(dataMapping);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getItemDDL = async (catId, subId, accId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetFinishedItemByCatagoryDDL?CatagoryId=${catId}&SubCatagoryId=${subId}&AccountId=${accId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const GetOutletProfileTypeAttributes = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/OutletProfileType/GetOutletProfileTypeInfo?AccountId=${accId}&BusinsessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const attributes = res?.data.map((item) => {
        if (item.objAttribute.uicontrolType === 'DDL') {
          const attributeValue = item.objAttributeValue.map((attr) => ({
            ...attr,
            value: attr.attributeValueId,
            label: attr.outletAttributeValueName,
            type: item.objAttribute.uicontrolType,
          }));

          return {
            ...item,
            objAttributeValue: attributeValue,
          };
        } else {
          return item;
        }
      });
      setter(attributes);
    }
  } catch (error) {}
};

export const operation = async ({
  profileData,
  selectedBusinessUnit,
  setAttributes,
  params,
  getOutletProfileById,
  setSingleData,
  setOutlet,
  cb,
}) => {
  if (profileData.accountId && selectedBusinessUnit.value) {
    await GetOutletProfileTypeAttributes(
      profileData.accountId,
      selectedBusinessUnit.value,
      setAttributes
    );
  }

  if (params?.id) {
    await getOutletProfileById(params?.id, setSingleData, setOutlet);
    cb && cb();
  }
};
export const businessUnitPlant_api = async (
  accId,
  buId,
  userId,
  plantId,
  setter
) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const wearhouse_api = async (accId, buId, userId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getWhList = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    setter(res?.data);
  } catch (error) {}
};
export const ItemSubCategory_api = async (accId, buId, caId, setter) => {
  try {
    const res = await axios.get(
      `/wms/WmsReport/GetItemSubCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemCategoryId=${caId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getItemTypeListDDL_api = async (setter) => {
  try {
    const res = await axios.get(`/wms/WmsReport/GetItemTypeListDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getItemCategoryDDLByTypeId_api = async (
  accId,
  buId,
  itemTypeId,
  setter
) => {
  try {
    const res = await axios.get(
      `/wms/WmsReport/GetItemCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemTypeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getPlantList = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPlantDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getLogVersionDDL = async (accId, buId, salesPlanId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetSalesPlanHeaderLogDDL?AccountId=${accId}&BusinessunitId=${buId}&SalesPlanId=${salesPlanId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getLandingPlantDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error.message);
  }
};

export const getYearDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getHorizonDDL = async (accId, buId, plantId, yearId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetPlanningHorizonDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}`
    );
    let newData = res?.data;
    setter(
      newData.sort(function (a, b) {
        return new Date(a.startdatetime) - new Date(b.enddatetime);
      })
    );
  } catch (error) {}
};

export const getVersionGridData = async (planId, logId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/mes/SalesPlanning/GetSalesPlanLogById?SalesPlanId=${planId}&Logid=${logId}`
    );
    setLoading(false);
    setter(res?.data?.objRow);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getPlantNameDDL_api = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getWorkplaceDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    const modfid = res?.data?.map((item) => ({
      value: item?.workplaceId,
      label: item?.workplaceName,
      code: item?.workplaceCode,
      workplaceGroupId: item?.workplaceGroupId,
    }));
    const newModfData = [{ value: 0, label: 'All' }, ...modfid];
    setter(newModfData);
  } catch (error) {
    setter([]);
  }
};

export const getConsumption = async (
  vesselId,
  voyageId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/BunkerInformation/GetItemInfoByBunker?VesselId=${vesselId}&VoyageId=${voyageId}`
    );
    setter(res?.data[0]);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getBunkerPurchaseList = async (
  buId,
  vesselId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/PurchaseBunker/GetRemainingItemInfo?BusinessUnitId=${buId}&VesselId=${vesselId}`
    );

    setter(
      res?.data?.map((item) => ({
        ...item,
        itemCost: 0,
        consumption: 0,
        remainingQty: item?.remaining,
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const saveBunkerCost = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/BunkerCost/CreateBunkerCost`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export function fetchInventoryData(obj) {
  // destructure
  const { getInventoryData, values, updatedData, setTableData } = obj;

  getInventoryData(
    `/mes/SalesPlanning/GetGlWiseMaterialBalance?unitId=${
      values?.businessUnit?.value
    }&dteFromDate=${_todayDate()}`,
    (invData) => {
      const updatedDataWithInventory = updatedData?.map((item) => {
        const invDataItem = invData?.find(
          (invItem) => invItem?.intGeneralLedgerId === item?.glId
        );
        if (invDataItem) {
          return {
            ...item,
            initialAmount: invDataItem?.opnAmount?.toFixed(2),
            julAmount: invDataItem?.julAmount.toFixed(2),
            augAmount: invDataItem?.augAmount.toFixed(2),
            sepAmount: invDataItem?.sepAmount.toFixed(2),
            octAmount: invDataItem?.octAmount.toFixed(2),
            novAmount: invDataItem?.novAmount.toFixed(2),
            decAmount: invDataItem?.decAmount.toFixed(2),
            janAmount: invDataItem?.janAmount.toFixed(2),
            febAmount: invDataItem?.febAmount.toFixed(2),
            marAmount: invDataItem?.marAmount.toFixed(2),
            aprAmount: invDataItem?.aprAmount.toFixed(2),
            mayAmount: invDataItem?.mayAmount.toFixed(2),
            junAmount: invDataItem?.junAmount.toFixed(2),
          };
        } else {
          return item;
        }
      });
      setTableData(updatedDataWithInventory);
    }
  );
}

export const GetBillofMaterialPagination = async (
  accId,
  buId,
  plantId,
  shopFloorId,
  setLoading,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      search
        ? `/mes/BOM/GetBOMPasignation?SearchTerm=${search}&AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${shopFloorId}&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
        : `/mes/BOM/GetBOMPasignation?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${shopFloorId}&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getShopFloorDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId} `
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    toast.warn(error.message);
  }
};

export const saveBillofMaterial = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(`/mes/BOM/CreateBillOfMaterial`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || 'Submitted successfully');
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getBusinessUnitDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getGridData = async (
  accountId,
  businessUnitId,
  warehouseId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  fromDate,
  toDate,
  plantId,
  searchValue = false
) => {
  try {
    setLoading(true);
    // console.log("plantId", plantId);
    const res = await axios.get(
      searchValue
        ? `/wms/GatePass/GetGatePassLandingPasignation?accountId=${accountId}&businessUnitId=${businessUnitId}&plantId=${plantId}&warehouseId=${warehouseId}&search=${searchValue}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
        : `/wms/GatePass/GetGatePassLandingPasignation?accountId=${accountId}&businessUnitId=${businessUnitId}&plantId=${plantId}&warehouseId=${warehouseId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
    );
    // console.log(res);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getAssetReceiveReportData = async (
  accId,
  buId,
  userId,
  value,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  const searchPath = search ? `searchTearm=${search}&` : '';
  setLoading(true);
  try {
    const res = await axios.get(
      `/asset/Asset/GetAssetReportForEmployee?AccountId=${accId}&UnitId=${buId}&ActionBy=${userId}&Type=${value}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
export const getLandingData = async (
  accountId,
  businessUnitId,
  searchTerm,
  bankId,
  fromDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    let query = `/imp/LetterOfCredit/LetterOfCreditLandingPasignation?accountId=${accountId}&businessUnitId=${businessUnitId}`;
    if (searchTerm) {
      query += `&searchTerm=${searchTerm}`;
    }
    if (bankId) {
      query += `&bankId=${bankId}`;
    }
    if (fromDate) {
      query += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      query += `&toDate=${toDate}`;
    }
    query += `&PageSize=${pageSize}&PageNo=${pageNo}&viewOrder=desc`;
    setLoading(true);
    const res = await axios.get(query);

    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

const createPayloadChange = (
  values,
  profileData,
  selectedBusinessUnit,
  uploadImage
) => {
  const payload = {
    lcTypeName: values?.lcType?.label,
    countryOriginName: values?.origin?.label,
    currencyName: values?.currency?.label,
    description: values?.description,
    lcafNo: '',
    applicationDate: _dateFormatter(new Date()),
    poId: values?.poId,
    numExchangeRate: values?.exchangeRate,
    numTotalPiamountFC: +values?.PIAmountFC,
    numTotalPiamountBDT: +values?.PIAmountBDT,
    accountId: profileData?.accountId,
    businessUnitId: selectedBusinessUnit?.value,
    sbuId: values?.sbuId,
    plantId: values?.plantId,
    ponumber: values?.poNo,
    lcnumber: values?.lcNo,
    subPonumber: '',
    incoTerms: values?.encoTerms?.value,
    materialTypeId: values?.materialType?.value,
    bankName: values?.bankName?.label,
    bankId: values?.bankName?.value,
    lctypeId: values?.lcType?.value,
    dteLcdate: values?.lcDate,
    dteLastShipmentDate: _dateFormatter(values?.lastShipmentDate),
    dteLcexpireDate: _dateFormatter(values?.lcExpiredDate),
    originId: values?.origin?.value,
    loadingPortName: values?.loadingPort,
    numTolarance: +values?.tolarance,
    currencyId: values?.currency?.value,
    totalBankCharge: values?.totalBankCharge,
    vatOnBankCharge: values?.vatOnCharge,
    lcTenor: values?.lcTenor,
    numPgamount: +values?.pgAmount,
    dtePgdueDate: values?.pgDueDate,
    // indemnityBond: values?.indemnityBond || false,
    indemnityBond: false,
    // bondLicense: values?.bondLicense || false,
    bondLicense: false,
    // duration: values?.duration,
    duration: null,
    openingLcdocumentId: uploadImage[0]?.id || '',
    lastActionBy: profileData?.userId,
    finalDestinationId: values?.finalDestination?.value,
    dueDate: values?.dueDate,
    bankAccountId: values?.bankAccount?.value || 0,
    bankAccountNo: values?.bankAccount?.label || '',
    lcMarginPercentage: +values?.lcMarginPercent || 0,
    lcMarginValue: +values?.lcMarginValue || 0,
    lcMarginDueDate: values?.lcMarginDueDate || null,
    marginType: values?.marginType?.value,
    numInterestRate: values?.numInterestRate || 0,
  };
  return payload;
};
export const createLCOpen = async (
  setDisabled,
  values,
  profileData,
  selectedBusinessUnit,
  uploadImage,
  cb
) => {
  const obj = createPayloadChange(
    values,
    profileData,
    selectedBusinessUnit,
    uploadImage
  );
  try {
    setDisabled(true);
    const res = await axios.post(
      `/imp/LetterOfCredit/CreateLetterOfCredit`,
      obj
    );
    setDisabled(false);
    // console.log(res,"res");
    toast.success(res?.message || 'Create successfully');
    cb();
  } catch (error) {
    setDisabled(false);
    // console.log(error);
    toast.error(error?.response?.data?.message);
  }
};

const updatePayloadChange = (
  values,
  profileData,
  selectedBusinessUnit,
  uploadImage
) => {
  const payload = {
    description: values?.description,
    numPIAmountBDT: values?.PIAmountBDT,
    numPIAmountFC: values?.PIAmountFC,
    numExchangeRate: values?.exchangeRate,
    lcId: values?.lcid,
    accountId: profileData?.accountId,
    businessUnitId: selectedBusinessUnit?.value,
    ponumber: values?.poNo,
    lcnumber: values?.lcNo,
    subPonumber: '',
    incoTerms: values?.encoTerms?.value,
    materialTypeId: values?.materialType?.value,
    bankId: values?.bankName?.value,
    lctypeId: values?.lcType?.value,
    dteLcdate: values?.lcDate,
    dteLastShipmentDate: _dateFormatter(values?.lastShipmentDate),
    dteLcexpireDate: _dateFormatter(values?.lcExpiredDate),
    originId: values?.origin?.value,
    loadingPortName: values?.loadingPort,
    numTolarance: +values?.tolarance,
    currencyId: values?.currency?.value,
    totalBankCharge: values?.totalBankCharge,
    vatOnBankCharge: values?.vatOnCharge,
    lcTenor: values?.lcTenor,
    numPgamount: +values?.pgAmount,
    dtePgdueDate: values?.pgDueDate,
    // indemnityBond: values?.indemnityBond || false,
    indemnityBond: false,
    // bondLicense: values?.bondLicense || false,
    bondLicense: false,
    // duration: values?.duration,
    duration: null,
    openingLcdocumentId: uploadImage[0]?.id || values?.attachment || '',
    finalDestinationId: values?.finalDestination?.value,
    dueDate: values?.dueDate,
    bankAccountId: values?.bankAccount?.value || 0,
    bankAccountNo: values?.bankAccount?.label || '',
    lcMarginPercentage: +values?.lcMarginPercent || 0,
    lcMarginValue: +values?.lcMarginValue || 0,
    lcMarginDueDate: values?.lcMarginDueDate || null,
  };
  return payload;
};
export const updateLCOpen = async (
  setDisabled,
  values,
  profileData,
  selectedBusinessUnit,
  uploadImage
  // cb
) => {
  const obj = updatePayloadChange(
    values,
    profileData,
    selectedBusinessUnit,
    uploadImage
  );
  try {
    setDisabled(true);
    let res = await axios.put(`/imp/LetterOfCredit/EditLetterOfCredit`, obj);
    setDisabled(false);
    toast.success(res?.message || 'Update successfully');
    // cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const LCTypeDDLAction = async (setDisabled, setter) => {
  try {
    setDisabled(true);
    const res = await axios.get(`/imp/ImportCommonDDL/GetLCTypeDDL`);
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

export const currencyTypeDDLAction = async (setter) => {
  try {
    const res = await axios.get(`/imp/ImportCommonDDL/GetCurrencyTypeDDL`);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

export const originTypeDDLAction = async (setDisabled, setter) => {
  try {
    setDisabled(true);
    const res = await axios.get(`/imp/ImportCommonDDL/GetCountryNameDDL`);
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

export const encoItemDDLAction = async (setDisabled, setter) => {
  try {
    setDisabled(true);
    const res = await axios.get(`/imp/ImportCommonDDL/GetIncoTermsDDL`);
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

export const materialTypeDDLAction = async (setDisabled, setter) => {
  try {
    setDisabled(true);
    const res = await axios.get(`/imp/ImportCommonDDL/GetMaterialTypeDDL`);
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

export const PortDDLAction = async (
  accId,
  businessUnitId,
  setDisabled,
  setter
) => {
  try {
    setDisabled(true);
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetPortName?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

export const GetBankDDL = async (setter, accId, businessUnitId) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetBankListDDL?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

export const getCalculationFormLandingForm = async (
  businessUnitId,
  values,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/imp/FormulaForCalculation/GetFormulaForLcBankCharge?businessUnitId=${businessUnitId}&poId=${
        values?.poId
      }&tenorDays=${
        values?.lcTenor
      }&poTotalFc=${+values?.PIAmountFC}&toleranceRate=${
        values?.tolarance
      }&excRate=${values?.exchangeRate}&bankId=${
        values?.bankName?.value
      }&type=${values?.lcType?.value}`
    );
    setLoading(false);

    let newObj = {};
    for (let index = 0; index < res?.data.length; index++) {
      const element = res?.data[index];
      newObj[element.strType] = element.monAmount;
    }
    setter(newObj && newObj);
    setter({
      swift: newObj['Swift Charge'],
      stamp: newObj['Stamp Charge'],
      stationary: newObj['Stationary Charge'],
      stampChargeforOther: newObj['Others Charge'],
      lcConfirm: 0,
      tenorQuarter: 0,
      vatRate: 0,
    });
  } catch (error) {
    setLoading(false);
    toast.error(error.response.data.message);
  }
};

export const getPoForLcOpen = (accountId, businessUnitId, poId, cb) => {
  try {
    let query = `/imp/LetterOfCredit/GetPOForLCOpen?accountId=${accountId}&businessUnitId=${businessUnitId}&POId=${poId}`;
    return axios.get(query);
  } catch (error) {}
};

export const currencyLoadByPoId = async (
  setter,
  accId,
  businessUnitId,
  poId
) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetCurrencyFromInsuranceDDL?accountId=${accId}&businessUnitId=${businessUnitId}&POId=${poId}`
    );
    setter({ currency: res?.data[0] });
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

export const getChargeLandingData = async (
  accId,
  setDisabled,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setDisabled(true);
  const searchPath = search ? `Search=${search}&` : '';
  try {
    let res = await axios.get(
      `/domain/CreateRoleManager/GetRoleManagerSearchLandingPasignation?${searchPath}AccountId=${accId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
export const getPaymentTermDDL = async (setter) => {
  try {
    let res = await axios.get(
      '/procurement/PurchaseOrder/GetPaymentTermsListDDL'
    );
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};
export const getHeaderData_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetTaxPayerInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter({});
  }
};
export const getTrailBalanceReport = async (
  accId,
  buId,
  startDate,
  endDate,
  balanceType,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/TrailBalanceReport/GetTrailBalanceByPamsReport?AccountId=${accId}&BusinessUnitId=${buId}&StartDate=${startDate}&EndDate=${endDate}&ViewType=${balanceType}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

export const getBusinessUnitYearConfigData = async (
  accountId,
  businessUnitId,
  initData,
  setter
) => {
  try {
    const res = await axios.get(
      `/fino/FinanceCommonDDL/GetBusinessUnitYearConfigData?accountId=${accountId}&businessUnitId=${businessUnitId}`
    );
    setter({
      balanceType: '3',
      toDate: _todayDate(),
      fromDate: res?.data?.[0]['startDate']
        ? _dateFormatter(res?.data?.[0]['startDate'])
        : _dateFormatter(new Date()),
    });
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};

export const PurchaseRegister_Report_api = async (
  accid,
  buid,
  fromDate,
  toDate,
  itemId,
  branch,
  setter,
  setLoading
) => {
  try {
    setLoading && setLoading(true);
    const res = await axios.get(
      `/vat/VATSP/PurchaseRegister?intAccountId=${accid}&intBusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}&ItemId=${itemId}&intBranch=${branch}`
    );
    if (res.status === 200 && res?.data) {
      setLoading && setLoading(false);
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning('Data Not Found');
        setter([]);
      }
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getRegisterDetailsByIdAction = async (
  buId,
  bankAccId,
  fromDate,
  toDate,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/Account/GetBankBook?BusinessUnitId=${buId}&BankAccountId=${bankAccId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getGeneralLedgerDDL = async (setLoading, setter) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/CommonFino/GetGeneralLedgerListScheduleView`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getPartnerBook = async (
  businessUnitId,
  partnerId,
  partnerType,
  fromDate,
  toDate,
  setLoading,
  setter,
  glId
) => {
  try {
    setLoading(true);
    let query = `/fino/Account/GetPartnerBook?BusinessUnitId=${businessUnitId}&PartnerId=${partnerId}&PartnerType=${partnerType}&FromDate=${fromDate}&ToDate=${toDate}`;
    if (glId) {
      query += `&GeneralId=${glId}`;
    }
    const res = await axios.get(query);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getPartnerBookBankBranch = async (
  businessUnitId,
  partnerId,
  partnerType,
  fromDate,
  toDate,
  setLoading,
  setter,
  glId,
  profitCenter
) => {
  try {
    setLoading(true);

    const profitCenterQuery = profitCenter
      ? `&ProfitCenterId=${profitCenter?.value}`
      : '';

    let query = `/fino/BankBranch/GetPartnerBook?BusinessUnitId=${businessUnitId}&PartnerId=${partnerId}&PartnerType=${partnerType}&FromDate=${fromDate}&ToDate=${toDate}${profitCenterQuery}`;
    if (glId) {
      query += `&GeneralId=${glId}`;
    }
    const res = await axios.get(query);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const partnerGeneralLedgerList = async (
  businessUnitId,
  partnerTypeId,
  setter
) => {
  try {
    const res = await axios.get(
      `/fino/FinanceCommonDDL/PartnerGeneralLedgerList?businessUnitId=${businessUnitId}&partnerTypeId=${partnerTypeId}`
    );
    setter(
      res?.data.map((item) => ({
        ...item,
        value: item?.glId,
        label: item?.glName,
      }))
    );
  } catch (error) {
    console.log(error);
  }
};
export const GetItemNameDDL_api = async (accId, buId, typeId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxItemListByItemTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&TaxItemTypeId=${typeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getDeliveryToDDL = async (soldToPrtnrId, setter) => {
  try {
    const res = await axios.get(
      `/partner/PManagementCommonDDL/GetDeliveredToDDL?SoldToPartnerId=${soldToPrtnrId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getTaxPortDDL = async (setter) => {
  try {
    const res = await axios.get(`/vat/TaxDDL/GetTaxPortDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetCustomHouseDDL_api = async (setter) => {
  try {
    const res = await axios.get(`/vat/TaxDDL/GetCustomHouseDDL`);
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((itm) => ({
          ...itm,
          label: `${itm?.code}: ${itm?.label}`,
          withOutCodeLabel: itm?.label,
        }))
      );
    }
  } catch (error) {}
};

export const saveDailyTargetRow = async (data, cb) => {
  const newData = data?.map((item) => ({ ...item, amount: +item?.amount }));

  try {
    const res = await axios.put(
      `/pms/KPI/UpdateEmployeeDailyAchivement`,
      newData
    );
    if (res?.status === 200) {
      // cb = when save daily target, dispatch header target Again,
      cb();
      toast.success(res.data?.message || 'Submitted successfully');
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message || 'Something went wrong');
  }
};
export const getDailyTargetData = async (kpiId, monthId, setter) => {
  // set empty initially
  setter([]);
  try {
    const res = await axios.get(
      `/pms/KPI/GetEmployeeDailyAchivemenById?kpiid=${kpiId}&monthid=${monthId}`
    );
    if (res?.status === 200) {
      const newData = res?.data?.map((item) => ({
        ...item,
        amount: item?.amount,
      }));

      setter(newData);
    }
  } catch (error) {
    setter([]);
  }
};

export const getEmployeeApproveAndActiveByKPIId = async (
  kpiId,
  setDisabled
) => {
  try {
    const res = await axios.get(
      `/pms/KPI/GetEmployeeApproveAndActiveByKPIId?KpiId=${kpiId}`
    );
    if (res.status === 200 && res?.data) {
      // setDisabled(res?.data?.approved ==="false");
      setDisabled(res?.data?.approved);
    }
  } catch (error) {}
};

export const getSingleData = async (id, setter) => {
  try {
    const res = await axios.get(
      `/wms/ItemRequest/GetItemRequestDatabyId?requestid=${id}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const sendEmailPostApi = async (dataObj) => {
  let formData = new FormData();
  formData.append('to', dataObj?.toMail);
  formData.append('cc', dataObj?.toCC);
  formData.append('bcc', dataObj?.toBCC);
  formData.append('subject', dataObj?.subject);
  formData.append('body', dataObj?.message);
  formData.append('file', dataObj?.attachment);
  try {
    let { data } = await axios.post('/domain/MailSender/SendMail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success('Mail Send Successfully');
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || 'Mail cant not send successfully'
    );
  }
};
export const postItemReqCancelAction = async (iId) => {
  try {
    const res = await axios.put(
      `/wms/ItemRequest/CancelItemRequestDatabyId?ItemRequest=${iId}`
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || 'Cancel Successfully');
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Cancel Failed');
  }
};
export const getReportItemReq = async (prId, setter) => {
  try {
    const res = await axios.get(
      `/wms/InventoryView/GetItemRequestViewById?requestid=${prId}`
    );
    setter(res?.data[0]);
  } catch (error) {}
};
export const getUOMList = async (
  itemId,
  buId,
  accId,
  setter,
  setFieldValue
) => {
  try {
    const res = await axios.get(
      `/wms/ItemPlantWarehouse/GetItemUomconversionData?ItemId=${itemId}&BusinessUnitId=${buId}&AccountId=${accId}`
    );
    const data = res?.data?.convertedList;
    const newData = data?.map((item) => {
      return {
        value: item?.value,
        label: item?.label,
      };
    });
    setFieldValue('itemUom', {
      value: res?.data?.value,
      label: res?.data?.label,
    });
    setter(newData);
  } catch (error) {}
};
export const getItemForOthersDDL = async (accId, buId, plnId, whId, setter) => {
  try {
    const res = await axios.get(
      `/wms/ItemRequestDDL/GetItemForOthersTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plnId}&WarehouseId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      let itemData = res?.data?.map((data) => {
        return {
          ...data,
          label: `${data?.label} [${data?.value}]`,
        };
      });
      setter(itemData);
      // setter(res?.data)
    }
  } catch (error) {}
};

export const getItemforServiceItemDDL = async (
  accId,
  buId,
  plnId,
  whId,
  setter
) => {
  try {
    const res = await axios.get(
      `/wms/ItemRequestDDL/GetItemForServiceTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plnId}&WarehouseId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      let itemData = res?.data?.map((data) => {
        return {
          ...data,
          label: `${data?.label} [${data?.value}]`,
        };
      });
      setter(itemData);
    }
  } catch (error) {}
};

export const getItemAssetDDL = async (accId, buId, plnId, whId, setter) => {
  try {
    const res = await axios.get(
      `/wms/ItemRequestDDL/GetItemForAssetTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plnId}&WarehouseId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      let itemData = res?.data?.map((data) => {
        return {
          ...data,
          label: `${data.label} [${data.code}]`,
        };
      });
      setter(itemData);
    }
  } catch (error) {}
};

export const saveItemReqEdit = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(`/wms/ItemRequest/EditItemRequest`, data);
    if (res.status === 200) {
      toast.success(res?.message || 'Submitted successfully');
      //cb()
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getSingleDataForEdit = async (id, setter) => {
  try {
    const res = await axios.get(
      `/wms/ItemRequest/GetItemRequestDatabyId?requestid=${id}`
    );
    if (res.status === 200 && res?.data) {
      let setDtoValue = res?.data[0];
      let newData = {
        objHeader: {
          ...setDtoValue.objHeader,
          requestDate: _dateFormatter(setDtoValue.objHeader.dteRequestDate),
          validTill: _dateFormatter(setDtoValue.objHeader.validTill),
          dueDate: _dateFormatter(setDtoValue.objHeader.dteDueDate),
          actionType:
            setDtoValue?.objHeader?.intProjectId > 0
              ? { label: 'Project', value: 1 }
              : { label: 'Operation', value: 2 },
          project:
            setDtoValue?.objHeader?.intProjectId > 0
              ? {
                  value: setDtoValue?.objHeader?.intProjectId,
                  label: setDtoValue?.objHeader?.strProject,
                }
              : null,
          referenceId: '',
          quantity: '',
          remarks: '',
          item: '',
        },
        objRow: [...setDtoValue?.objRow],
      };
      setter(newData);
    }
  } catch (error) {}
};

export const getWarehouseDDL = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveItemRequest = async (data, cb, setGridData, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(`/wms/ItemRequest/CreateItemRequest`, data);
    if (res.status === 200) {
      setGridData([]);
      toast.success(res?.message || 'Submitted successfully');
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const changeReqSaveAction = async (
  payload,
  setLoader,
  changeReqDateCb,
  PrevValues,
  setIsShowModal
) => {
  setLoader(true);
  try {
    const res = await axios.post(
      `/hcm/HCMLeaveApplication/PLChangeRequest`,
      payload
    );
    // callback for leave application, it will be called from modal, when user save req date
    changeReqDateCb(PrevValues);
    setIsShowModal(false);
    toast.success(res.data?.message || 'Updated successfully');
    setLoader(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || 'Please try again');
    setLoader(false);
  }
};
//aa
export const getEmpInfoById = async (valueOption, setFieldValue, fieldName) => {
  try {
    let res = await axios.get(
      `/hcm/HCMDDL/GetEmployeeDetailsByEmpId?EmpId=${valueOption?.value}`
    );
    let {
      employeeInfoDesignation,
      employeeBusinessUnit,
      employeeInfoDepartment,
    } = res?.data;
    setFieldValue(
      'employeeInfo',
      `${employeeInfoDesignation},${employeeInfoDepartment},${employeeBusinessUnit}`
    );
    setFieldValue(fieldName, { ...valueOption, ...res?.data });
  } catch (error) {
    return null;
  }
};

export const getCountryDDL = async (setter) => {
  try {
    const res = await axios.get(`/hcm/HCMDDL/GetCountryDDL`);
    const data = res?.data;
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getDistrictDDLAction = async (countryId, divisionId, setter) => {
  try {
    const res = await axios.get(`/hcm/HCMDDL/GetBDAllDistrictDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const leaveAppLandingPagintaion_api = async (
  empId,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await axios.get(
      `/hcm/LeaveApplication/LeaveApplicationLandingPagintaion?EmployeeId=${empId}&PageNo=1&PageSize=1000&viewOrder=desc`
    );
    const data = res?.data;
    console.log(res?.data, 'res?.data');
    setter(data?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
    setLoader(false);
  }
};

export const OfficialMoveLandingPagination_api = async (
  empId,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await axios.get(
      `/hcm/OfficialMovement/OfficialMovementLandingPagination?EmployeeId=${empId}&PageNo=1&PageSize=100&viewOrder=desc`
    );
    const data = res?.data;
    setter(data?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
    setLoader(false);
  }
};

export const getLeaveTypeDDL = async (checkId, empId, setter) => {
  try {
    // const res = await axios.get(
    //   `/hcm/HCMDDL/GetLeaveTypeDDL?check=${checkId}&accountId=${accId}`
    // );
    const res = await axios.get(
      `/hcm/HCMDDL/GetEmpWiseLeaveTypeDDL?check=${checkId}&employeeId=${empId}`
    );
    const data = res?.data;
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const saveLeaveMovementAction = async (data, cb, setDisabled) => {
  let {
    typeId,
    employeeId,
    accountId,
    businessUnitId,
    applicationDate,
    appliedFromDate,
    appliedToDate,
    documentFile,
    reason,
    addressDueToLeaveMove,
    actionBy,
    tmStart,
    tmEnd,
  } = data;
  try {
    if ((typeId === 10 || typeId === 8) && (!tmStart || !tmEnd))
      return toast.warn('Time is required');
    setDisabled(true);

    let fromModifiedTime = tmStart || null;
    let toModifiedTime = tmEnd || null;

    let url = `/hcm/HCMLeaveApplication/LeaveApplication?leaveTypeId=${typeId}&employeeId=${employeeId}&accountId=${accountId}&businessUnitId=${businessUnitId}&applicationDate=${applicationDate}&appliedFromDate=${appliedFromDate}&appliedToDate=${appliedToDate}&leaveReason=${reason}&addressDuetoLeave=${addressDueToLeaveMove}&ActionBy=${actionBy}&documentFile=${
      documentFile ? documentFile : ''
    }`;

    if (fromModifiedTime && toModifiedTime) {
      url = `/hcm/HCMLeaveApplication/LeaveApplication?leaveTypeId=${typeId}&employeeId=${employeeId}&accountId=${accountId}&businessUnitId=${businessUnitId}&applicationDate=${applicationDate}&appliedFromDate=${appliedFromDate}&appliedToDate=${appliedToDate}&leaveReason=${reason}&addressDuetoLeave=${addressDueToLeaveMove}&ActionBy=${actionBy}&documentFile=${
        documentFile ? documentFile : ''
      }&startTime=${fromModifiedTime}&endTime=${toModifiedTime}`;
    }
    let res = await axios.post(url);
    // do not remove this status code check, this is mendatory
    if (res?.data?.statuscode === 500) {
      setDisabled(false);
      return toast.warn(res?.data?.message);
    }

    toast.success(res?.data?.message);
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveMovementAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    await axios.post(
      `/hcm/HCMMovementApplication/CreateMovementApplication`,
      data
    );
    toast.success('Submitted successfully');
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const getLeaveSummarySelfData = (employeeId, setter, setLoader) => {
  setLoader(true);
  axios
    .get(
      `/hcm/LeaveAndMovement/GetEmployeeWiseLeaveBalance?EmployeeId=${employeeId}`
    )
    .then((res) => {
      setter(res?.data);
      setLoader(false);
    })
    .catch((err) => {
      setter([]);
      setLoader(false);
    });
};
export const getChalanInfo = async (shipmentId, setter) => {
  try {
    const res = await axios.get(
      `/tms/Shipment/GetChallanInfoByShipmentId?shipmentId=${shipmentId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
