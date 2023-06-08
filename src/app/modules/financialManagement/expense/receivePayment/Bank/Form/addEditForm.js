/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useLocation } from "react-router-dom";
import IForm from "../../../../../_helper/_form";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Loading from "./../../../../../_helper/_loading";
import {
  getBusinessTransactionDDL_api,
  profitCenterDDL_Api,
  recivePayment_SBU_Api,
  getBankAccountDDL_api,
  getInstrumentType_Api,
  createBankReceive_Api,
  createBankPayment_Api,
  getPaymentOrReceiveById_api,
} from "../../helper";

const initData = {
  id: undefined,
  SBU: "",
  bankAc: "",
  placedInBank: false,
  placingDate: _todayDate(),
  profitCenter: "",
  transaction: "",
  sbu: "",
  amount: "",
  instrumentType: "",
  instrumentNo: "",
  instrumentDate: _todayDate(),
  narration: "",
  GLInfo: "",
};

export default function RecivePaymentBankForm({
  history,
  match: {
    params: { bank },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();
  const [SBUDDL, SetSBUDDL] = useState([]);
  const [profitCenterDDL, SetProfitCenterDDL] = useState([]);
  const [businessTransactionDDL, setBusinessTransactionDDL] = useState([]);
  const [bankAcDDL, setBankAcDDL] = useState([]);
  const [instrumentType, setInstrumentType] = useState([]);
  const [referenceTypeName, setReferenceTypeName] = useState("");
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    recivePayment_SBU_Api(
      profileData.accountId,
      selectedBusinessUnit.value,
      SetSBUDDL
    );
    profitCenterDDL_Api(
      profileData.accountId,
      selectedBusinessUnit.value,
      SetProfitCenterDDL
    );
    getBusinessTransactionDDL_api(
      profileData?.accountId,
      selectedBusinessUnit.value,
      setBusinessTransactionDDL
    );
    getBankAccountDDL_api(
      profileData.accountId,
      selectedBusinessUnit.value,
      setBankAcDDL
    );
    getInstrumentType_Api(setInstrumentType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(headerData?.values?.transactionType?.value);

  //getPaymentOrReceiveByIdFunc
  const getPaymentOrReceiveByIdFunc = () => {
    const referenceTypeName =
      headerData?.values?.transactionType?.value === 1 ||
      headerData?.values?.transactionType?.value === 3
        ? "Advance"
        : "Expense";
    getPaymentOrReceiveById_api(
      bank,
      referenceTypeName,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      headerData?.values?.employeeEnroll?.value,
      setReferenceTypeName
    );
  };

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (headerData?.values?.transactionType?.value === 3) {
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuid: values?.SBU?.value,
            generalLedgerId: +values?.bankAc?.generalLedgerId,
            generalLedgerCode: values?.bankAc?.generalLedgerCode,
            generalLedgerName: values?.bankAc?.generalLedgerName,
            amount: values?.amount,
            narration: values?.narration,
            posted: true,
            businessPartnerId: headerData?.values?.employeeEnroll?.value,
            businessPartnerCode: "",
            businessPartnerName: headerData?.values?.employeeEnroll?.label,
            accountingJournalTypeId: 2,
            directPosting: true,
            actionBy: profileData?.userId,
            employeeId: headerData?.values?.employeeEnroll?.value,
            advanceId: +bank,
            expenceId: 0,
            bankId: +values?.bankAc?.bankId,
            bankName: values?.bankAc?.bankName,
            bankBranchId: +values?.bankAc?.bankBranch_Id,
            bankBranchName: values?.bankAc?.bankBranchName,
            bankAccountId: +values?.bankAc?.value,
            bankAccountNumber: values?.bankAc?.label,
            placedInBank: values?.placedInBank,
            placingDate: _todayDate(),
            instrumentId: values?.instrumentType.value,
            instrumentName: values?.instrumentType.label,
            instrumentNo: values?.instrumentNo,
            instrumentDate: _todayDate(),
          },
          objRow: {
            bankAccountId: +values?.bankAc?.bankId,
            bankAccNo: values?.bankAc?.label,
            businessTransactionId: +values?.transaction?.value,
            businessTransactionCode:
              values?.transaction?.businessTransactionCode,
            businessTransactionName: values?.transaction?.label,
            generalLedgerId: +values?.transaction?.generalLedgerId,
            generalLedgerCode: values?.transaction?.generalLedgerCode,
            generalLedgerName: values?.transaction?.generalLedgerName,
            amount: values?.amount,
            narration: values?.narration,
            accountingJournalId: 0,
            accountingJournalCode: "",
          },
        };
        createBankPayment_Api(
          payload,
          cb,
          getPaymentOrReceiveByIdFunc,
          setDisabled
        );
      } else if (headerData?.values?.transactionType?.value === 4) {
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuid: values?.SBU?.value,
            generalLedgerId: +values?.bankAc?.generalLedgerId,
            generalLedgerCode: values?.bankAc?.generalLedgerCode,
            generalLedgerName: values?.bankAc?.generalLedgerName,
            amount: values?.amount,
            narration: values?.narration,
            posted: true,
            businessPartnerId: headerData?.values?.employeeEnroll?.value,
            businessPartnerCode: "",
            businessPartnerName: headerData?.values?.employeeEnroll?.label,
            accountingJournalTypeId: 2,
            directPosting: true,
            actionBy: profileData?.userId,
            employeeId: headerData?.values?.employeeEnroll?.value,
            advanceId: 0,
            expenceId: +bank,
            bankId: +values?.bankAc?.bankId,
            bankName: values?.bankAc?.bankName,
            bankBranchId: +values?.bankAc?.bankBranch_Id,
            bankBranchName: values?.bankAc?.bankBranchName,
            bankAccountId: +values?.bankAc?.value,
            bankAccountNumber: values?.bankAc?.label,
            placedInBank: values?.placedInBank,
            placingDate: _todayDate(),
            instrumentId: values?.instrumentType.value,
            instrumentName: values?.instrumentType.label,
            instrumentNo: values?.instrumentNo,
            instrumentDate: _todayDate(),
          },
          objRow: {
            bankAccountId: +values?.bankAc?.bankId,
            bankAccNo: values?.bankAc?.label,
            businessTransactionId: +values?.transaction?.value,
            businessTransactionCode:
              values?.transaction?.businessTransactionCode,
            businessTransactionName: values?.transaction?.label,
            generalLedgerId: +values?.transaction?.generalLedgerId,
            generalLedgerCode: values?.transaction?.generalLedgerCode,
            generalLedgerName: values?.transaction?.generalLedgerName,
            amount: values?.amount,
            narration: values?.narration,
            accountingJournalId: 0,
            accountingJournalCode: "",
          },
        };
        createBankPayment_Api(
          payload,
          cb,
          getPaymentOrReceiveByIdFunc,
          setDisabled
        );
      } else if (headerData?.values?.transactionType?.value === 1) {
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuid: values?.SBU?.value,
            generalLedgerId: +values?.bankAc?.generalLedgerId,
            generalLedgerCode: values?.bankAc?.generalLedgerCode,
            generalLedgerName: values?.bankAc?.generalLedgerName,
            amount: values?.amount,
            narration: values?.narration,
            posted: true,
            businessPartnerId: headerData?.values?.employeeEnroll?.value,
            businessPartnerCode: "",
            businessPartnerName: headerData?.values?.employeeEnroll?.label,
            accountingJournalTypeId: 2,
            directPosting: true,
            actionBy: profileData?.userId,
            employeeId: headerData?.values?.employeeEnroll?.value,
            advanceId: +bank,
            expenceId: 0,
            bankId: +values?.bankAc?.bankId,
            bankName: values?.bankAc?.bankName,
            bankBranchId: +values?.bankAc?.bankBranch_Id,
            bankBranchName: values?.bankAc?.bankBranchName,
            bankAccountId: +values?.bankAc?.value,
            bankAccountNumber: values?.bankAc?.label,
            placedInBank: values?.placedInBank,
            placingDate: _todayDate(),
            instrumentId: values?.instrumentType.value,
            instrumentName: values?.instrumentType.label,
            instrumentNo: values?.instrumentNo,
            instrumentDate: _todayDate(),
          },
          objRow: {
            bankAccountId: +values?.bankAc?.bankId,
            bankAccNo: values?.bankAc?.label,
            businessTransactionId: +values?.transaction?.value,
            businessTransactionCode:
              values?.transaction?.businessTransactionCode,
            businessTransactionName: values?.transaction?.label,
            generalLedgerId: +values?.transaction?.generalLedgerId,
            generalLedgerCode: values?.transaction?.generalLedgerCode,
            generalLedgerName: values?.transaction?.generalLedgerName,
            amount: values?.amount,
            narration: values?.narration,
            accountingJournalId: 0,
            accountingJournalCode: "",
          },
        };
        createBankReceive_Api(
          payload,
          cb,
          getPaymentOrReceiveByIdFunc,
          setDisabled
        );
      }
    } else {
      setDisabled(false);
      
    }
  };

  useEffect(() => {
    if (bank) {
      getPaymentOrReceiveByIdFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank]);
  return (
    <>
      {isDisabled && <Loading />}
      <IForm
        title={`Create ${
          headerData?.values?.transactionType.value === 1
            ? "Receive Against Advance (Bank)"
            : headerData?.values?.transactionType.value === 2
            ? "Receive Without Reference (Bank)"
            : headerData?.values?.transactionType.value === 3
            ? "Advance Pay (Bank)"
            : "Expense Pay (Bank)"
        }`}
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          isEdit={bank || false}
          headerData={headerData}
          SBUDDL={SBUDDL}
          profitCenterDDL={profitCenterDDL}
          businessTransactionDDL={businessTransactionDDL}
          bankAcDDL={bankAcDDL}
          instrumentType={instrumentType}
          referenceTypeName={referenceTypeName}
        />
      </IForm>
    </>
  );
}
