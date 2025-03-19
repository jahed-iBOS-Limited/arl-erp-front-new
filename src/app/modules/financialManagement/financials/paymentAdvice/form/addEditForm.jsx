/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import {
  createPaymentVoucher,
  getAccountNoDDL,
  getBuUnitDDL,
  getCashDDL,
  getPaymentAdviceIndoPagination,
  getSBUList,
  getTypeDDL,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";
import Form from "./form";
// import { _dateFormatter } from './../../../../_helper/_dateFormate';
import "../paymentadvice.css";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

export default function PaymentAdviceForm({
  history,
  match: {
    params: { id },
  },
}) {
  //
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [objProps, setObjprops] = useState({});
  const [allSelect, setAllSelect] = useState(false);

  // DDL state
  const [accountNoDDL, setAccountNoDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [unitDDL, setUnitDDL] = useState([]);
  const [sbuList, setSbuList] = useState([]);
  const [typeDDL, setTypeDDL] = useState([]);

  // ref
  const scfSaveBtnRef = useRef(null);

  // api action
  const [
    bankAsPartnerDDL,
    getBankAsPartnerDDL,
    getBankAsPartnerDDLLoading,
  ] = useAxiosGet([]);

  // scf advice formik ref
  const scfAdviceFormikRef = useRef(null);

  const [
    ,
    scfAdiveAdjustmentJournal,
    scfAdiveAdjustmentJournalLoading,
  ] = useAxiosPost();

  // const [statusState,setStatusState] = useState()

  const { financialsPaymentAdvice } = useSelector((state) => {
    return state.localStorage;
  }, shallowEqual);

  const initData = {
    date: financialsPaymentAdvice?.date || _todayDate(),
    sbuUnit: financialsPaymentAdvice?.sbuUnit || "",
    cashGl: financialsPaymentAdvice?.cashGl || "",
    accountNo: financialsPaymentAdvice?.accountNo || "",
    type: financialsPaymentAdvice?.type || "",
    status: financialsPaymentAdvice?.status || "",
    billType: financialsPaymentAdvice?.billType || "",
    payDate: _todayDate(),
    bank: "",
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    if (profileData?.userId && profileData?.accountId) {
      getBuUnitDDL(profileData?.userId, profileData?.accountId, setUnitDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSBUList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuList
      );
      getAccountNoDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setAccountNoDDL
      );
      getCashDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBankDDL
      );
      getTypeDDL(setTypeDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  const prepareChequeVoucher = (values, data) => {
    let payload = [
      {
        unitId: selectedBusinessUnit?.value,
        sbuId: values?.sbuUnit?.value,
        billId: data?.intBillId,
        bankAccountId: values?.accountNo?.value || 0,
        payDate: values?.payDate,
        billTypeId: data?.intBillType,
        billTypeName: values?.billType?.label,
        paymentType: values?.type?.label,
        isntrumentNo: "",
        isntrumentTypeId: values?.type?.value,
        isntrumentTypeName: values?.type?.label,
        isntrumentDate: values?.payDate,
        partnerId: data?.intPartnerId,
        payeName: data?.strPayee,
        debitGLId: data?.intDebitGL || 0,
        cashGLId: values?.cashGl?.value || 0,
        cashGlName: values?.cashGl?.label || "",
        transectionDate: data?.paymentDate,
        narration: data?.strDescription,
        transectionTypeId: 0,
        transectionTypeName: "",
        actionById: profileData?.userId,
        actionByName: profileData?.userName,
        numAmount: data?.monAmount,
      },
    ];
    createPaymentVoucher(payload, () => {}, null, setDisabled);
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData.accountId && selectedBusinessUnit) {
      let payload = rowDto
        ?.filter((data) => data?.isSelect)
        .map((data) => {
          return {
            unitId: selectedBusinessUnit?.value,
            sbuId: values?.sbuUnit?.value,
            billId: data?.intBillId,
            bankAccountId: values?.accountNo?.value || 0,
            payDate: values?.payDate,
            billTypeId: data?.intBillType,
            billTypeName: values?.billType?.label,
            paymentType: values?.type?.label,
            isntrumentNo: "",
            isntrumentTypeId: values?.type?.value,
            isntrumentTypeName: values?.type?.label,
            isntrumentDate: values?.payDate,
            partnerId: data?.intPartnerId,
            payeName: data?.strPayee,
            debitGLId: data?.intDebitGL || 0,
            cashGLId: values?.cashGl?.value || 0,
            cashGlName: values?.cashGl?.label || "",
            transectionDate: data?.paymentDate,
            narration: data?.strDescription,
            transectionTypeId: 0,
            transectionTypeName: "",
            actionById: profileData?.userId,
            actionByName: profileData?.userName,
            numAmount: data?.monAmount,
            numTds: +data?.numTds || 0,
            numVds: +data?.numVds || 0,
          };
        });
      // console.log(payload)
      if (payload.length === 0) {
        toast.warning("Please select at least one");
      } else {
        createPaymentVoucher(payload, cb, null, setDisabled);
      }
    }
  };

  // handle scf bank adjustment journal
  const handleSCFBankAdjustmentJournal = (values, cb) => {
    const payload = rowDto
      ?.filter((item) => item?.isSelect)
      ?.map((filteredItem) => {
        return {
          unitId: selectedBusinessUnit?.value,
          sbuId: values?.sbuUnit?.value,
          billId: filteredItem?.intBillId,
          bankAccountId: values?.accountNo?.value || 0,
          payDate: values?.payDate,
          billTypeId: filteredItem?.intBillType,
          billTypeName: values?.billType?.label,
          paymentType: values?.type?.label,
          isntrumentNo: "",
          isntrumentTypeId: values?.type?.value,
          isntrumentTypeName: values?.type?.label,
          isntrumentDate: values?.payDate,
          partnerId: filteredItem?.intPartnerId,
          payeName: filteredItem?.strPayee,
          debitGLId: filteredItem?.intDebitGL || 0,
          cashGLId: values?.cashGl?.value || 0,
          cashGlName: values?.cashGl?.label || "",
          transectionDate: filteredItem?.paymentDate,
          narration: filteredItem?.strDescription,
          transectionTypeId: 0,
          transectionTypeName: "",
          actionById: profileData?.userId,
          actionByName: profileData?.userName,
          numAmount: filteredItem?.monAmount,
          numTds: +filteredItem?.numTds || 0,
          numVds: +filteredItem?.numVds || 0,
          businessTransactionId: 0,
          businessTransactionName: "",
          businessTransactionGLId: 0,
          businessTransactionGLName: "",
          bankAsPartnerId: values?.bank?.bankAsPartnerId || 0,
        };
      });

    // check an data is selected or not
    if (payload?.length > 0) {
      // console.log(payload);
      scfAdiveAdjustmentJournal(
        `/fino/PaymentRequest/PreparePaymentSCF`,
        payload,
        cb,
        true
      );
    } else {
      toast.warn("Select at least one data");
    }
  };

  return (
    <IForm
      title={"Prepare Payment"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenSave={true}
      isHiddenReset={true}
      supportButtons={
        financialsPaymentAdvice?.status?.value === 1 &&
        financialsPaymentAdvice?.type?.value !== 8
          ? [
              {
                label: "Prepare Voucher",
                className: "btn btn-primary",
              },
            ]
          : []
      }
      renderProps={() =>
        financialsPaymentAdvice?.status?.value === 1 &&
        financialsPaymentAdvice?.type?.value === 8 && (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => scfSaveBtnRef?.current?.click()}
          >
            Adjustment Journal
          </button>
        )
      }
    >
      {(isDisabled ||
        getBankAsPartnerDDLLoading ||
        scfAdiveAdjustmentJournalLoading) && <Loading />}
      <Form
        {...objProps}
        scfAdviceFormikRef={scfAdviceFormikRef}
        initData={initData}
        saveHandler={saveHandler}
        profileData={profileData}
        rowDto={rowDto}
        setRowDto={setRowDto}
        location={location}
        accountNoDDL={accountNoDDL}
        bankDDL={bankDDL}
        unitDDL={unitDDL}
        setBankDDL={setBankDDL}
        setAccountNoDDL={setAccountNoDDL}
        setDisabled={setDisabled}
        id={params?.id}
        getPaymentAdviceIndoPagination={getPaymentAdviceIndoPagination}
        allSelect={allSelect}
        setAllSelect={setAllSelect}
        sbuList={sbuList}
        selectedBusinessUnit={selectedBusinessUnit}
        typeDDL={typeDDL}
        prepareChequeVoucher={prepareChequeVoucher}
        getBankAsPartnerDDL={getBankAsPartnerDDL}
        bankAsPartnerDDL={bankAsPartnerDDL}
        scfSaveBtnRef={scfSaveBtnRef}
        handleSCFBankAdjustmentJournal={handleSCFBankAdjustmentJournal}
      />
    </IForm>
  );
}
