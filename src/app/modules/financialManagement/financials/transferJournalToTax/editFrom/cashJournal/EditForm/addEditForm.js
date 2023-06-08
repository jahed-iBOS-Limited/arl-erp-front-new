/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useCallback, useState } from "react";
import { useSelector, shallowEqual} from "react-redux";
import Form from "./form";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import IForm from "../../../../../../_helper/_form";
import Loading from "../../../../../../_helper/_loading";
import { getcashJournalSingleData_api} from "../helper";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";
import { commonTransferJournal } from "../../../helper";

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

export default function CashJournaEditForm({journalTypeId, journalId, viewData, sbu}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const { state: headerData } = useLocation();
  const [singleData, setSingleData] = useState([]);
  const id = journalId;

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  let netAmount = useCallback(
    rowDto?.reduce((total, value) => total + +value?.amount, 0),
    [rowDto]
  );

  const saveHandler = async (values, cb) => {

    
    const payload =  rowDto?.map((item)=>({
      accountId:  +profileData?.accountId,
      businessUnitId: +selectedBusinessUnit?.value,
      sbuId: sbu?.value,
      accountingJournalTypeId: journalTypeId,
      accountingJournalId: journalId,
      accountingJournalCode: viewData?.cashJournalCode,
      transactionDate:  _dateFormatter(values?.transactionDate),
      bankSortName: viewData?.bankName || "",
      instrumentTypeID: +values?.instrumentType?.value || 0,
      instrumentTypeName: values?.instrumentType?.label || "",
      instrumentNo: values?.instrumentNo || "",
      instrumentDate: values?.instrumentDate || "",
      paytoName: values?.transaction || "",
      journalId: journalId,
      journalCode: viewData?.cashJournalCode,
      actionBy:  profileData?.userId,
      isTransfer: true,
      narration: values?.headerNarration,
      // start below 
      generalLedgerId: item?.gl?.value,
      generalLedgerCode:  item?.gl?.code,
      generalLedgerName: item?.gl?.label,
      subGLId: item?.transaction?.value,
      subGlCode: item?.transaction?.code,
      subGLName: item?.transaction?.label,
      subGLTypeId: item?.partnerType?.reffPrtTypeId,
      subGLTypeName: item?.partnerType?.label,
      numAmount: item?.amount,
      debit: item?.amount,
      credit: -item?.amount,
    }))

    commonTransferJournal({row:payload});

  };

  useEffect(() => {
    if (id && journalTypeId) {
      getcashJournalSingleData_api(
        id,
        journalTypeId,
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
      title={`Edit ${
        journalTypeId === 1
          ? "Cash Receipts Journal"
          : journalTypeId === 2
          ? "Cash Payments Journal"
          : "Cash Transfer Journal"
      }`}
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
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        headerData={headerData}
        setter={setter}
        rowDto={rowDto}
        remover={remover}
        id={id}
        netAmount={netAmount}
        journalTypeId = {journalTypeId}
      />
    </IForm>
  );
}
