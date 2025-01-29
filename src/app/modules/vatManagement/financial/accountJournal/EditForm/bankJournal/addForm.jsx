/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { getTaxAccountingJournalByCode } from "../../form/helper";
import { saveAccountingJournal } from "../../helper";
import Form from "./form";

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
  partnerType: "",
  isCheck: false,
  amount: "",
  transferAmount: "",
  narration: "",
  transactionDate: "",
  customerSupplierStatus: "",
};

export default function BankJournalEdit() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [instrumentNoByResponse, setInstrumentNoByResponse] = useState("");
  const history = useHistory();
  const { journalCode } = useParams();
  const location = useLocation();
  const [transaction, setTransaction] = useState(null)
  const [bankShortname, setBankShortname] = useState(null)

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const { bankJournalCreate } = useSelector((state) => state?.localStorage, shallowEqual);
  useEffect(() => {
    if (journalCode) {
      getTaxAccountingJournalByCode(journalCode, setSingleData);
    }
  }, [journalCode]);

  useEffect(() => {
    if (singleData) {
      setTransaction(`${singleData?.[0]?.bankSortName}:${singleData?.[0]?.subGlCode}`)
      setBankShortname(singleData?.[0]?.bankSortName)
      const data = singleData.filter((item ,index ) => index !== 0)
     //const row = data?.filter((item) => item?.subGLTypeId!==6)
      setRowDto(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  let netAmount = rowDto?.reduce((total, value) => total + +value?.amount, 0);

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

  const dispatch = useDispatch();

  const saveHandler = async (values, cb) => {
    // dispatch(setBankJournalCreateAction(values));
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
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
            debit: location?.state?.accountingJournalTypeId !== 4 ? +item?.amount : 0,
            credit: location?.state?.accountingJournalTypeId === 4 ? 1 * -+item?.amount : 0,
          };
        });
        objRow.unshift({
          subGLTypeId: 6,
          subGLTypeName: "Bank",
          accountingJournalId: rowDto?.[0]?.journalId,
          accountingJournalCode:journalCode,
          journalId: rowDto?.[0]?.journalId,
          journalCode: journalCode,
          generalLedgerId: +rowDto?.[0]?.headerGLId,
          generalLedgerCode: rowDto?.[0]?.headerGLCode,
          generalLedgerName: rowDto?.[0]?.headerGLName,
          subGLId: values?.bankAcc?.value || rowDto?.[0]?.headerSubGlId,
          subGlCode: values?.bankAcc?.bankAccNo || rowDto?.[0]?.headerSubGlCode,
          subGLName: values?.bankAcc?.bankName || rowDto?.[0]?.headerSubGlName,
          narration: rowDto?.[0]?.narration,
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          sbuId: location?.state?.sbu?.value,
          accountingJournalTypeId: location?.state?.accountingJournalTypeId,
          transactionId: rowDto?.[0]?.transactionId,
          transactionDate: rowDto?.[0]?.transactionDate || _todayDate(),
          bankSortName: values?.bankAcc?.label ? values?.bankAcc?.label.split(":")[0] : bankShortname || "",
          instrumentTypeID: rowDto?.[0]?.instrumentTypeID || 0,
          instrumentTypeName: rowDto?.[0]?.instrumentTypeName || "",
          instrumentNo: rowDto?.[0]?.instrumentNo || "",
          instrumentDate: rowDto?.[0]?.instrumentDate || _todayDate(),
          paytoName: rowDto?.[0]?.paytoName || "",
          actionBy: +profileData?.userId,
          isTransfer: false,
          numAmount: +netAmount,
          debit: location?.state?.accountingJournalTypeId === 4 ? netAmount : 0,
          credit: location?.state?.accountingJournalTypeId !== 4 ? 1 * -+netAmount : 0,
        });
         saveAccountingJournal({
           payload:{row:objRow},
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
          journalId:singleData?.[0]?.journalId,
          generalLedgerId: +values?.gl?.value,
          generalLedgerCode: values?.gl?.code,
          generalLedgerName: values?.gl?.label,
          subGLId: +values?.transaction?.value,
          subGlCode: values?.transaction?.code,
          subGLName: values?.transaction?.label,
          receiveFrom:values?.receiveFrom,
          instrumentTypeID: values?.instrumentType?.value,
          instrumentTypeName: values?.instrumentType?.label,
          instrumentNo: values?.instrumentNo,
          instrumentDate: values?.instrumentDate,
          headerNarration: values?.headerNarration,
          bankSortName: values?.bankAcc?.label.split(":")[0],
          placingDate: values?.placingDate,
          numAmount: +values?.amount,
          paytoName: values?.paidTo,
          narration: values?.narration,
          transactionId: 0,
          transactionDate: values?.transactionDate,
          customerSupplierStatus: values?.customerSupplierStatus,
          headerSubGlName:values?.bankAcc?.bankName,
          headerSubGlId:values?.bankAcc?.value,
          headerSubGlCode:values?.bankAcc?.bankAccNo,
          headerGLName:values?.bankAcc?.generalLedgerName,
          headerGLId:values?.bankAcc?.generalLedgerId,
          headerGLCode:values?.bankAcc?.generalLedgerCode,
      }

      setRowDto([...rowDto, newRowDto]);
    } else {
      toast.warn("Not allowed to duplicate transaction");
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  useEffect(() => {
    // if not id, that means this is for create form, then we will check this..
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [objProps, setObjprops] = useState({});

  const rowDtoHandler = (index, name, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  return (
    <IForm
      title={location?.state?.accountingJournalTypeId === 4 ? `Edit Bank Receipt(${journalCode})` : location?.state?.accountingJournalTypeId === 5 ? `Edit Bank Payments(${journalCode})` : ""}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        jorunalType={location?.state?.accountingJournalTypeId}
        netAmount={netAmount}
        instrumentNoByResponse={instrumentNoByResponse}
        setInstrumentNoByResponse={setInstrumentNoByResponse}
        rowDtoHandler={rowDtoHandler}
        journalCode={journalCode}
        setRowDto={setRowDto}
        location={location}
        transaction={transaction}
      />
    </IForm>
  );
}
