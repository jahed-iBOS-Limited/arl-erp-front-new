/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useLocation } from "react-router-dom";
import IForm from "../../../../../_helper/_form";
import {
  recivePayment_SBU_Api,
  recivePayment_CashGL_Api,
  profitCenterDDL_Api,
  getBusinessTransactionDDL_api,
  createCashPayment_Api,
  createCashReceive_Api,
  getPaymentOrReceiveById_api,
  CreateJournalWithoutReference_api,
} from "../../helper";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Loading from "./../../../../../_helper/_loading";

const initData = {
  id: undefined,
  SBU: "",
  cashGLPlus: "",
  headerNarration: "",
  profitCenter: "",
  transaction: "",
  amount: "",
  GLInfo: "",
  narration: "",
};

export default function RecivePaymentCashForm({
  history,
  match: {
    params: { cash },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();

  const [SBUDDL, SetSBUDDL] = useState([]);
  const [cashGLDDL, SetCashGLDDL] = useState([]);
  const [profitCenterDDL, SetProfitCenterDDL] = useState([]);
  const [businessTransactionDDL, setBusinessTransactionDDL] = useState([]);
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
    recivePayment_CashGL_Api(
      profileData.accountId,
      selectedBusinessUnit.value,
      2,
      SetCashGLDDL
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPaymentOrReceiveByIdFunc = () => {
    const referenceTypeName =
      headerData?.values?.transactionType?.value === 1 ||
      headerData?.values?.transactionType?.value === 3
        ? "Advance"
        : "Expense";
    getPaymentOrReceiveById_api(
      cash,
      referenceTypeName,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      headerData?.values?.employeeEnroll?.value,
      setReferenceTypeName
    );
  };

  useEffect(() => {
    if (cash) {
      getPaymentOrReceiveByIdFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cash]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // Create Advance Pay (Cash)
      if (headerData?.values?.transactionType?.value === 3) {
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuid: values?.SBU?.value,
            generalLedgerId: values.cashGLPlus.value,
            generalLedgerCode: values.cashGLPlus.generalLedgerCode,
            generalLedgerName: values.cashGLPlus.label,
            amount: values?.amount,
            narration: values?.headerNarration,
            posted: true,
            businessPartnerId: headerData?.values?.employeeEnroll?.value,
            businessPartnerCode: "",
            businessPartnerName: headerData?.values?.employeeEnroll?.label,
            accountingJournalTypeId: 1,
            directPosting: true,
            actionBy: profileData?.userId,
            employeeId: headerData?.values?.employeeEnroll?.value,
            advanceId: +cash,
            expenceId: 0,
            bankId: 0,
            bankName: "",
            bankBranchId: 0,
            bankBranchName: "",
            bankAccountId: 0,
            bankAccountNumber: "",
            placedInBank: true,
            placingDate: _todayDate(),
            instrumentId: 0,
            instrumentName: "",
            instrumentNo: "",
            instrumentDate: _todayDate(),
          },
          objRow: {
            bankAccountId: 0,
            bankAccNo: "",
            businessTransactionId: values?.transaction?.value,
            businessTransactionCode: values.transaction.businessTransactionCode,
            businessTransactionName: values.transaction.label,
            generalLedgerId: values.transaction.generalLedgerId,
            generalLedgerCode: values.transaction.generalLedgerCode,
            generalLedgerName: values.transaction.generalLedgerName,
            amount: values?.amount,
            narration: values?.narration,
            accountingJournalId: 0,
            accountingJournalCode: "",
          },
        };
        createCashPayment_Api(
          payload,
          cb,
          getPaymentOrReceiveByIdFunc,
          setDisabled
        );
      } else if (headerData?.values?.transactionType?.value === 4) {
        //Create Expense Pay (Cash)
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuid: values?.SBU?.value,
            generalLedgerId: values.cashGLPlus.value,
            generalLedgerCode: values.cashGLPlus.generalLedgerCode,
            generalLedgerName: values.cashGLPlus.label,
            amount: values?.amount,
            narration: values?.headerNarration,
            posted: true,
            businessPartnerId: headerData?.values?.employeeEnroll?.value,
            businessPartnerCode: "",
            businessPartnerName: headerData?.values?.employeeEnroll?.label,
            accountingJournalTypeId: 1,
            directPosting: true,
            actionBy: profileData?.userId,
            employeeId: headerData?.values?.employeeEnroll?.value,
            advanceId: 0,
            expenceId: +cash,
            bankId: 0,
            bankName: "",
            bankBranchId: 0,
            bankBranchName: "",
            bankAccountId: 0,
            bankAccountNumber: "",
            placedInBank: true,
            placingDate: _todayDate(),
            instrumentId: 0,
            instrumentName: "",
            instrumentNo: "",
            instrumentDate: _todayDate(),
          },
          objRow: {
            bankAccountId: 0,
            bankAccNo: "",
            businessTransactionId: values?.transaction?.value,
            businessTransactionCode: values.transaction.businessTransactionCode,
            businessTransactionName: values.transaction.label,
            generalLedgerId: values.transaction.generalLedgerId,
            generalLedgerCode: values.transaction.generalLedgerCode,
            generalLedgerName: values.transaction.generalLedgerName,
            amount: values?.amount,
            narration: values?.narration,
            accountingJournalId: 0,
            accountingJournalCode: "",
          },
        };
        createCashReceive_Api(
          payload,
          cb,
          getPaymentOrReceiveByIdFunc,
          setDisabled
        );
      } else if (headerData?.values?.transactionType?.value === 1) {
        //Create Receive Against Advance (Cash)
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuid: values?.SBU?.value,
            generalLedgerId: values.cashGLPlus.value,
            generalLedgerCode: values.cashGLPlus.generalLedgerCode,
            generalLedgerName: values.cashGLPlus.label,
            amount: values?.amount,
            narration: values?.headerNarration,
            posted: true,
            businessPartnerId: headerData?.values?.employeeEnroll?.value,
            businessPartnerCode: "",
            businessPartnerName: headerData?.values?.employeeEnroll?.label,
            accountingJournalTypeId: 1,
            directPosting: true,
            actionBy: profileData?.userId,
            employeeId: headerData?.values?.employeeEnroll?.value,
            advanceId: +cash,
            expenceId: 0,
            bankId: 0,
            bankName: "",
            bankBranchId: 0,
            bankBranchName: "",
            bankAccountId: 0,
            bankAccountNumber: "",
            placedInBank: true,
            placingDate: _todayDate(),
            instrumentId: 0,
            instrumentName: "",
            instrumentNo: "",
            instrumentDate: _todayDate(),
          },
          objRow: {
            bankAccountId: 0,
            bankAccNo: "",
            businessTransactionId: values?.transaction?.value,
            businessTransactionCode: values.transaction.businessTransactionCode,
            businessTransactionName: values.transaction.label,
            generalLedgerId: values.transaction.generalLedgerId,
            generalLedgerCode: values.transaction.generalLedgerCode,
            generalLedgerName: values.transaction.generalLedgerName,
            amount: values?.amount,
            narration: values?.narration,
            accountingJournalId: 0,
            accountingJournalCode: "",
          },
        };
        createCashReceive_Api(
          payload,
          cb,
          getPaymentOrReceiveByIdFunc,
          setDisabled
        );
      } else if (headerData?.values?.transactionType?.value === 2) {
        //Create Receive Without Reference (Cash)
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          sbuId: values?.SBU?.value,
          headerNarration: values?.headerNarration,
          profitCenterId: values?.profitCenter?.value,
          transactionId: values?.transaction?.value,
          transactionName: values?.transaction?.label,
          amount: values?.amount,
          glId: values.cashGLPlus.value,
          glName: values.cashGLPlus.label,
          narration: values?.narration,
          actionBy: profileData?.userId,
        };

        CreateJournalWithoutReference_api(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
      
    }
  };

  return (
    <>
      {isDisabled && <Loading />}
      <IForm
        title={`Create ${
          headerData?.values?.transactionType.value === 1
            ? "Receive Against Advance (Cash)"
            : headerData?.values?.transactionType.value === 2
            ? "Receive Without Reference (Cash)"
            : headerData?.values?.transactionType.value === 3
            ? "Advance Pay (Cash)"
            : "Expense Pay (Cash)"
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
          isEdit={cash || false}
          headerData={headerData}
          SBUDDL={SBUDDL}
          cashGLDDL={cashGLDDL}
          profitCenterDDL={profitCenterDDL}
          businessTransactionDDL={businessTransactionDDL}
          referenceTypeName={referenceTypeName}
        />
      </IForm>
    </>
  );
}
