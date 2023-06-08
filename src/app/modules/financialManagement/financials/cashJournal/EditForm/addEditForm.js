/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useCallback, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import { saveCashJournal_Action } from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { getcashJournalSingleData_api } from "./../helper";
import Loading from "./../../../../_helper/_loading";
import { confirmAlert } from "react-confirm-alert";

const initData = {
  id: undefined,
  sbu: "",
  cashGLPlus: "",
  receiveFrom: "",
  headerNarration: "",
  partner: "",
  profitCenter: "",
  transaction: "",
  amount: "",
  gl: "",
  narration: "",
  paidTo: "",
  costCenter: "",
  trasferTo: "",
  gLBankAc: "",
  transactionDate: "",
  partnerType: "",
};

export default function CashJournaEditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const { state: headerData } = useLocation();
  const [singleData, setSingleData] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const dispatch = useDispatch();

  let netAmount = useCallback(
    rowDto?.reduce((total, value) => total + +value?.amount, 0),
    [rowDto]
  );

  const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "Ok",
          onClick: () => noAlertFunc(),
        },
      ],
    });
  };

  const saveHandler = async (values, cb) => {
    // for cash receipts and payment we need rowDto
    if (headerData?.accountingJournalTypeId !== 3 && rowDto?.length === 0)
      return toast.warn("Please add transaction");
    if(headerData?.accountingJournalTypeId===1){
      if(values?.revenueCenter || values?.revenueElement){
        if(!( values?.revenueCenter && values?.revenueElement)){
          return toast.warn("Please add Revenue center or Revenue element");
        }
      }
    }else{
      if(values?.costCenter || values?.costElement){
        if(!( values?.costCenter && values?.costElement)){
          return toast.warn("Please add Cost center or Cost element");
        }
      }
    }
    const transferJournalRowDto = [
      {
        rowId: singleData?.objRow?.[0]?.rowId || 0,
        bankAccountId:
          values?.trasferTo?.value === 2 ? 0 : values?.gLBankAc?.value,
        bankAccNo:
          values?.trasferTo?.value === 2 ? "" : values?.gLBankAc?.label,
        businessTransactionId: 0,
        businessTransactionCode: "",
        businessTransactionName: "",

        generalLedgerId:
          values?.trasferTo?.value === 2
            ? values?.gLBankAc?.value
            : values?.gLBankAc?.generalLedgerId,

        generalLedgerCode: values?.gLBankAc?.generalLedgerCode,
        generalLedgerName:
          values?.trasferTo?.value === 2
            ? values?.gLBankAc?.label
            : values?.gLBankAc?.generalLedgerName,

        amount: +values.amount,
        narration: values?.headerNarration,
      },
    ];
    // Cash receipts Journal and Cash playment Journal Row part
    const objRow = rowDto.map((item) => ({
      bankAccountId: 0,
      bankAccNo: "",
      businessTransactionId: item?.transaction?.value,
      businessTransactionCode: item?.transaction?.code,
      businessTransactionName: item?.transaction?.label,
      generalLedgerId: item?.gl?.value,
      generalLedgerCode: item?.gl?.code,
      generalLedgerName: item?.gl?.label,
      narration: item?.narration,
      businessPartnerId: item?.partnerType?.label === "Others"
      ? 0
      : item?.transaction?.value,
      businessPartnerCode: item?.partnerType?.label === "Others"
      ? ""
      : item?.transaction?.code,
      businessPartnerName: item?.partnerType?.label === "Others"
      ? ""
      : item?.transaction?.label,
      partnerTypeName: item?.partnerType?.label || "",
      partnerTypeId: item?.partnerType?.value || 0,
      rowId: item?.rowId || 0,
      amount: +item?.amount,
      subGLId: item?.transaction?.value,
      subGlCode: item?.transaction?.code,
      subGLName: item?.transaction?.label,
      subGLTypeId: item?.partnerType?.reffPrtTypeId,
      subGLTypeName: item?.partnerType?.label,
    }));
    const isRevenue = (headerData?.accountingJournalTypeId === 1 && values?.revenueCenter && values?.revenueElement) 
    const isCostCenter = (headerData?.accountingJournalTypeId !== 1 && values?.costCenter && values?.costElement) 
    const payload = {
      objHeader: {
        cashJournalId: singleData?.objHeader?.cashJournalId || 0,
        cashJournalCode: "",
        journalDate: values?.transactionDate,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        sbuid: headerData?.sbu?.value,
        receiveFrom:
          headerData?.accountingJournalTypeId === 1 ? values?.receiveFrom : "",
        transferTo:
          headerData?.accountingJournalTypeId === 3
            ? values?.trasferTo?.label
            : "",
        paidTo: headerData?.accountingJournalTypeId === 2 ? values?.paidTo : "",
        generalLedgerId: values?.cashGLPlus?.value,
        generalLedgerCode: values?.cashGLPlus?.generalLedgerCode,
        generalLedgerName: values?.cashGLPlus?.label,
        amount:
          headerData?.accountingJournalTypeId === 3
            ? +values?.amount
            : +netAmount,
        narration: values?.headerNarration,
        posted: false,
        partnerTypeName: values?.partnerType?.label || "",
        partnerTypeId: values?.partnerType?.value || 0,
        businessPartnerId: values?.partnerType?.label === "Others"
        ? 0
        : values?.transaction?.value,
        businessPartnerCode:
        values?.partnerType?.label === "Others"
        ? ""
        : values?.transaction?.code,
        businessPartnerName: values?.partnerType?.label === "Others"
        ? ""
        : values?.transaction?.label,
        accountingJournalTypeId: headerData?.accountingJournalTypeId,
        directPosting: true,
        actionBy: profileData?.userId,
        controlType: isRevenue ? "revenue": isCostCenter ? "cost":"",
        costRevenueName: isRevenue ? values?.revenueCenter?.label : isCostCenter ? values?.costCenter?.label : "",
        costRevenueId: isRevenue ? values?.revenueCenter?.value : isCostCenter  ? values?.costCenter?.value : 0,
        elementName: isRevenue ? values?.revenueElement?.label : isCostCenter  ? values?.costElement?.label : "",
        elementId: isRevenue ? values?.revenueElement?.value : isCostCenter  ? values?.costElement?.value : 0,
      },
      objRowList:
        headerData.accountingJournalTypeId === 3
          ? transferJournalRowDto
          : objRow,
    };

    dispatch(
      saveCashJournal_Action({
        data: payload,
        cb,
        setDisabled,
        IConfirmModal,
      })
    );
  };

  useEffect(() => {
    if (id && headerData?.accountingJournalTypeId) {
      getcashJournalSingleData_api(
        id,
        headerData?.accountingJournalTypeId,
        setSingleData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, headerData]);

  useEffect(() => {
    if (singleData?.objRow?.length > 0) {
      setRowDto(singleData?.objRow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const setter = (values) => {
    const count = rowDto?.filter(
      (item) => item?.transaction?.value === values?.transaction?.value
    ).length;
    if (count === 0) {
      setRowDto([...rowDto, values]);
    } else {
      toast.warn("Not allowed to duplicate transaction");
    }
  };
  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  return (
    <IForm
      title={`Create ${
        headerData?.accountingJournalTypeId === 1
          ? "Cash Receipts Journal"
          : headerData?.accountingJournalTypeId === 2
          ? "Cash Payments Journal"
          : "Cash Transfer Journal"
      }`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData?.objHeader || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        headerData={headerData}
        setter={setter}
        rowDto={rowDto}
        remover={remover}
        id={id}
        netAmount={netAmount}
      />
    </IForm>
  );
}
