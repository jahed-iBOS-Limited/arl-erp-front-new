import React, { useCallback, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { saveAccountingJournal } from "../../helper";
import Form from "./form";

const initData = {
  id: undefined,
  partnerType: "",
  sbu: "",
  cashGLPlus: "",
  receiveFrom: "",
  headerNarration: "",
  partner: "",
  profitCenter: "",
  transaction: "",
  gl: "",
  amount: "",
  narration: "",
  paidTo: "",
  costCenter: "",
  trasferTo: "",
  gLBankAc: "",
  transactionDate: _todayDate(),
};

export default function CashJournalForm({
  history,
  match: {
    params: { id },
  },
})
 {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const location = useLocation();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const singleData = useSelector((state) => {
    return state.costControllingUnit?.singleData;
  }, shallowEqual);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let netAmount = useCallback(
    rowDto?.reduce((total, value) => total + +value?.amount, 0),
    [rowDto]
  );
  //save event Modal (code see)
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
    // dispatch(setBankJournalCreateAction(values));
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (rowDto?.length === 0) {
        toast.warn("Please add transaction");
      } else {

         const objRow = rowDto.map((item) => {
          return {
            journalId: 0,
            journalCode: "",
            subGLTypeId: item?.partnerType?.reffPrtTypeId || 0,
            subGLTypeName: item?.partnerType?.label || "",
            generalLedgerId: +item?.gl?.value || 0,
            generalLedgerCode: item?.gl?.code || "",
            generalLedgerName: item?.gl?.label || "",
            subGLId: +item?.transaction?.value || 0,
            subGlCode: item?.transaction?.code || "",
            subGLName: item?.transaction?.label || "",
            narration: item?.narration || "",
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            sbuId: location?.state?.sbu?.value,
            accountingJournalTypeId: location?.state?.accountingJournalTypeId,
            accountingJournalId: 0,
            accountingJournalCode: "",
            transactionId: item?.transactionId || 0,
            transactionDate: values?.transactionDate || _todayDate(),
            bankSortName:  "",
            instrumentTypeID: 0,
            instrumentTypeName:"",
            instrumentNo:  "",
            instrumentDate:null,
            paytoName: "",
            actionBy: +profileData?.userId,
            isTransfer: false,
            numAmount: +item?.amount,
            debit: location?.state?.accountingJournalTypeId !== 1 ?  +item?.amount : 0,
            credit: location?.state?.accountingJournalTypeId === 1 ?  1 * -+item?.amount : 0,
          };
        });

        objRow.unshift({
          subGLTypeId: 5,
          subGLTypeName: "Others",
          journalId: 0,
          journalCode: "",
          generalLedgerId: +values?.cashGLPlus?.value || 0,
          generalLedgerCode: values?.cashGLPlus?.generalLedgerCode || "",
          generalLedgerName: values?.cashGLPlus?.label || "",
          subGLId: 0,
          subGlCode: "",
          subGLName: "",
          narration: values?.narration,
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          sbuId: location?.state?.sbu?.value,
          accountingJournalTypeId: location?.state?.accountingJournalTypeId,
          accountingJournalId: 0,
          accountingJournalCode: "",
          transactionDate: values?.transactionDate || _todayDate(),
          bankSortName: values?.bankAcc?.label.split(":")[0] || "",
          instrumentTypeID: values?.instrumentType?.value || 0,
          instrumentTypeName: values?.instrumentType?.label || "",
          instrumentNo: values?.instrumentNo || "",
          instrumentDate: values?.instrumentDate || _todayDate(),
          paytoName: values?.paidTo || "",
          actionBy: +profileData?.userId,
          isTransfer: false,
          numAmount: +netAmount,
          debit: location?.state?.accountingJournalTypeId === 1 ? +netAmount : 0,
          credit: location?.state?.accountingJournalTypeId !== 1 ? 1 * -+netAmount : 0, 
        })
        saveAccountingJournal({
          payload: {row:objRow},
          setDisabled,
          cb,
          IConfirmModal
         });

        // saveAccountingJournal({
        //   profileData,
        //   selectedBusinessUnit,
        //   location,
        //   values,
        //   // rowDto,
        //   payload:{row:rowDto},
        //   cb,
        //   setRowDto,
        //   setDisabled,
        //   IConfirmModal,
        // });
      }
    } else {
      setDisabled(false);
    }
  };

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
        location?.state?.accountingJournalTypeId === 1
          ? "Cash Receipts Journal"
          : location?.state?.accountingJournalTypeId === 2
          ? "Cash Payments Journal"
          : "Cash Transfer Journal"
      }`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        headerData={location?.state}
        setter={setter}
        rowDto={rowDto}
        remover={remover}
        setRowDto={setRowDto}
        netAmount={netAmount}
      />
    </IForm>
  );
}
