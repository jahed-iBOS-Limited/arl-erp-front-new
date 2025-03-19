import React, { useCallback, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { getCashJournalByCode } from "../../form/helper";
import Form from "./form";
import { saveAccountingJournal } from "../../helper";
import { confirmAlert } from "react-confirm-alert";

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

export default function CashJournalEditForm({
  history,
  match: {
    params: { id },
  },
})
 {
   const {journalCode} = useParams();
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const location = useLocation();
  const [singleItem, setSingleItem] = useState("");

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  // const singleData = useSelector((state) => {
  //   return state.costControllingUnit?.singleData;
  // }, shallowEqual);

  useEffect(() => {
    if(journalCode){
      getCashJournalByCode( journalCode, setSingleItem);
    }
  },[journalCode])

  useEffect(() => {
    if (singleItem) {
      const data = singleItem.filter((item ,index ) => index !== 0)
      setRowDto(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleItem]);


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
    if (journalCode && profileData?.accountId && selectedBusinessUnit?.value) {
      if (rowDto?.length === 0) {
        toast.warn("Please add transaction");
      } else {
        const objRow = rowDto.map((item) => {
          return {
            subGLTypeId: item?.partnerType?.value ||0,
            subGLTypeName: item?.partnerType?.label||"",
            accountingJournalId: item?.journalId,
            accountingJournalCode:journalCode,
            journalId: item.journalId,
            journalCode: journalCode,
            generalLedgerId: +item?.generalLedgerId,
            generalLedgerCode: item?.generalLedgerCode,
            generalLedgerName: item?.generalLedgerName,
            subGLId: +item?.subGLId,
            subGlCode: item?.subGlCode,
            subGLName: item?.subGLName,
            narration: item?.narration,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            sbuId: location?.state?.sbu?.value,
            accountingJournalTypeId: location?.state?.accountingJournalTypeId,
            transactionId: item?.transactionId,
            transactionDate: item?.transactionDate,
            bankSortName: item?.bankSortName|| "",
            instrumentTypeID: item?.instrumentTypeID,
            instrumentTypeName: item?.instrumentTypeName,
            instrumentNo: item?.instrumentNo || "",
            instrumentDate: item?.instrumentDate ,
            paytoName: item?.paytoName || "",
            actionBy: +profileData?.userId,
            isTransfer: false,
            numAmount: +item?.amount,
            debit: location?.state?.accountingJournalTypeId !== 1 ? +item?.amount : 0,
            credit: location?.state?.accountingJournalTypeId === 1 ? 1 * -+item?.amount : 0,
          };
        });
        objRow.unshift({
          subGLTypeId: 5,
          subGLTypeName: "Others",
          accountingJournalId: rowDto?.[0]?.journalId,
          accountingJournalCode:journalCode,
          journalId: rowDto?.[0]?.journalId,
          journalCode: journalCode,
          generalLedgerId: +rowDto?.[0]?.headerGLId || 0,
          generalLedgerCode: rowDto?.[0]?.headerGLCode || "",
          generalLedgerName: rowDto?.[0]?.headerGLName || "",
          subGLId: 0,
          subGlCode: "",
          subGLName: "",
          narration: rowDto?.[0]?.narration,
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          sbuId: location?.state?.sbu?.value,
          accountingJournalTypeId: location?.state?.accountingJournalTypeId,
          transactionId: rowDto?.[0]?.transactionId,
          transactionDate: rowDto?.[0]?.transactionDate || _todayDate(),
          bankSortName: values?.bankAcc?.label ? values?.bankAcc?.label.split(":")[0] : "",
          instrumentTypeID: rowDto?.[0]?.instrumentTypeID || 0,
          instrumentTypeName: rowDto?.[0]?.instrumentTypeName || "",
          instrumentNo: rowDto?.[0]?.instrumentNo || "",
          instrumentDate: rowDto?.[0]?.instrumentDate || _todayDate(),
          paytoName: rowDto?.[0]?.paytoName || "",
          actionBy: +profileData?.userId,
          isTransfer: false,
          numAmount: +netAmount,
          debit: location?.state?.accountingJournalTypeId === 1 ? netAmount : 0,
          credit: location?.state?.accountingJournalTypeId !== 1 ? 1 * -+netAmount : 0,
        });
        saveAccountingJournal({
          payload: {row:objRow},
          setDisabled,
          cb,
          IConfirmModal
         });

      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (values) => {
    const count = rowDto?.filter((item) => item?.transaction?.value === values?.transaction?.value).length;
    if (count === 0) {
      const newRowDto = {
          ...values,
          journalId:singleItem?.[0]?.accountingJournalId || 0,
          generalLedgerId: +values?.gl?.value,
          generalLedgerCode: values?.gl?.code,
          generalLedgerName: values?.gl?.label,
          subGLId: +values?.transaction?.value || 0,
          subGlCode: values?.transaction?.code || "",
          subGLName: values?.transaction?.label || "",
          receiveFrom: "",
          instrumentTypeID: 0,
          instrumentTypeName: "",
          instrumentNo: "",
          instrumentDate: null,
          bankSortName: "",
          placingDate: null,
          numAmount: +values?.amount || 0,
          paytoName: "",
          narration: values?.narration || "",
          transactionId: 0,
          transactionDate: values?.transactionDate,
          customerSupplierStatus: values?.customerSupplierStatus || "",
          headerSubGlName: "",
          headerSubGlId: 0,
          headerSubGlCode: "",
          headerGLName:values?.cashGLPlus?.value || 0,
          headerGLId:values?.cashGLPlus?.label || "",
          headerGLCode:values?.cashGLPlus?.code || "",
      }

      setRowDto([...rowDto, newRowDto]);
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
      title={`${journalCode?"Edit":"Create"} ${
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
        initData={initData}
        journalCode={journalCode}
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
        singleItem={singleItem}
      />
    </IForm>
  );
}
