/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../../../_helper/_form";
import Form from "./form";
import Loading from "../../../../../../_helper/_loading";
import { _todayDate } from "../../../../../../_helper/_todayDate";
import { singleDataById } from "../helper";
import { commonTransferJournal } from "../../../helper";

const initData = {
  bankAcc: "",
  partner: "",
  receiveFrom: "",
  instrumentType: "",
  instrumentNo: "",
  instrumentDate: _todayDate(),
  headerNarration: "",
  placedInBank: false,
  placingDate: _todayDate(),
  paidTo: "",
  transferTo: "",
  sendToGLBank: "",
  transaction: "",
  // amount is for bank receive and bank payment row
  amount: "",
  // transferAmount is for bank transfer header
  transferAmount: "",
  narration: "",
  transactionDate: "",
  customerSupplierStatus: "",
};

export default function BankJournalEditForm({ journalTypeId, journalId, sbu, viewData, setShow}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [objProps, setObjprops] = useState({});
  const [singleData, setSingleData] = useState([]);
  
  let netAmount = rowDto?.reduce((total, value) => total + +value?.amount, 0);
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const saveHandler = async (values, cb) => {

    let rowPayload = {
      accountId:  +profileData?.accountId,
      businessUnitId: +selectedBusinessUnit?.value,
      sbuId: sbu?.value,
      accountingJournalTypeId: journalTypeId,
      accountingJournalId: journalId,
      accountingJournalCode: viewData?.bankJournalCode,
      transactionDate: values?.transactionDate,
      bankSortName: viewData?.bankName,
      instrumentTypeID: +values?.instrumentType?.value || 0,
      instrumentTypeName: values?.instrumentType?.label || "",
      instrumentNo: values?.instrumentNo || "",
      instrumentDate: values?.instrumentDate || "",
      paytoName: values?.paidTo || values?.receiveFrom || "",
      journalId: journalId,
      journalCode: viewData?.bankJournalCode,
      actionBy:  profileData?.userId,
      isTransfer: true,
      narration: values?.headerNarration,
      generalLedgerId: values?.bankAcc?.generalLedgerId,
      generalLedgerCode: values?.bankAcc?.generalLedgerCode,
      generalLedgerName: values?.bankAcc?.generalLedgerName,
      subGLId: values?.bankAcc?.bankId,
      subGlCode: values?.bankAcc?.bankAccNo,
      subGLName: values?.bankAcc?.bankName,
      subGLTypeId: 6,
      subGLTypeName: "Bank",
      numAmount: +netAmount,
      debit: journalTypeId === 4 ? +netAmount : 0,
      credit: journalTypeId !== 4 ? -(+netAmount) : 0,
    }

    const payload =  rowDto?.map((item)=>({
      accountId:  +profileData?.accountId,
      businessUnitId: +selectedBusinessUnit?.value,
      sbuId: sbu?.value,
      accountingJournalTypeId: journalTypeId,
      accountingJournalId: journalId,
      accountingJournalCode: viewData?.bankJournalCode,
      transactionDate: values?.transactionDate,
      bankSortName: viewData?.bankName,
      instrumentTypeID: +values?.instrumentType?.value || 0,
      instrumentTypeName: values?.instrumentType?.label || "",
      instrumentNo: values?.instrumentNo || "",
      instrumentDate: values?.instrumentDate || "",
      paytoName: values?.paidTo || values?.receiveFrom || "",
      journalId: journalId,
      journalCode: viewData?.bankJournalCode,
      actionBy:  profileData?.userId,
      isTransfer: true,
      narration: values?.headerNarration,
      generalLedgerId: item?.gl?.value,
      generalLedgerCode:  item?.gl?.code,
      generalLedgerName: item?.gl?.label,
      subGLId: item?.transaction?.value,
      subGlCode: item?.transaction?.code,
      subGLName: item?.transaction?.label,
      subGLTypeId: item?.partnerType?.reffPrtTypeId,
      subGLTypeName: item?.partnerType?.label,
      numAmount: +item?.amount,
      debit: journalTypeId !== 4 ? +item?.amount : 0,
      credit: journalTypeId === 4 ? -(+item?.amount) : 0,
    }))

    commonTransferJournal({row:[rowPayload, ...payload]}, ()=>{setShow(false)});

  };

  const setter = (values) => {
    const count = rowDto?.filter(
      (item) => item?.transaction?.value === values?.transaction?.value
    ).length;
    if (count === 0) {
      setRowDto([...rowDto, { ...values, narration: values?.headerNarration }]);
    } else {
      toast.warn("Not allowed to duplicate transaction");
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  // Single Data api call
  useEffect(() => {
    if (journalId && journalTypeId) {
      singleDataById(journalId, journalTypeId, setSingleData);
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journalId, journalTypeId]);

  useEffect(() => {
    if (singleData?.objRow?.length > 0) {
      setRowDto(singleData.objRow);
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);


  const rowDtoHandler = (index, name, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  return (
    <IForm
      title={journalTypeId === 4 ? `Edit Bank Receipts(${viewData?.bankJournalCode ||
        ""})`: journalTypeId === 5 ? `Edit Bank Payments(${viewData?.bankJournalCode ||
          ""})` : journalTypeId === 6 ? `Edit Bank Transfer(${viewData?.bankJournalCode ||
            ""})` : ""}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenReset={true}
      submitBtnText={"Transfer"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData?.objHeader || initData}
        saveHandler={saveHandler}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        jorunalType={journalTypeId}
        isEdit={journalId || false}
        netAmount={netAmount}
        rowDtoHandler={rowDtoHandler}
      />
    </IForm>
  );
}
