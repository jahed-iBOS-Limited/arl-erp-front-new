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
import { saveAccountingJournal } from "../../helper";
import Form from "./form";

// const initData = {

// };

export default function BankJournalCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [instrumentNoByResponse, setInstrumentNoByResponse] = useState("");
  const history = useHistory();
  const params = useParams();
  const location = useLocation();

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const { bankJournalCreate } = useSelector((state) => state?.localStorage, shallowEqual);

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
    console.log("values", values);
    console.log("rowDto", rowDto);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (rowDto?.length === 0) {
        toast.warn("Please add transaction");
      } else {
        const objRow = rowDto.map((item) => {
          // let negAmount = 1 * -+item?.amount;
          // let numAmount =
          //   item?.debitCredit === "Credit" ? negAmount : item?.debitCredit === "Debit" ? +item?.amount : location?.state?.accountingJournalTypeId !== 1 ? negAmount : +item?.amount;
          return {
            journalId: 0,
            journalCode: "",
            subGLTypeId: item?.partnerType?.value,
            subGLTypeName: item?.partnerType?.label,
            generalLedgerId: +item?.gl?.value,
            generalLedgerCode: item?.gl?.code,
            generalLedgerName: item?.gl?.label,
            subGLId: +item?.transaction?.value,
            subGlCode: item?.transaction?.code,
            subGLName: item?.transaction?.label,
            narration: item?.narration,
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
            numAmount: +item?.amount,
            debit:location?.state?.accountingJournalTypeId !== 4 ?  +item?.amount : 0,
            credit: location?.state?.accountingJournalTypeId === 4 ?  1 * -+item?.amount : 0,
          };
        });
        // console.log("payload",objRow)
        objRow.unshift({
          subGLTypeId: 6,
          subGLTypeName: "Bank",
          journalId: 0,
          journalCode: "",
          generalLedgerId: +values?.bankAcc?.generalLedgerId,
          generalLedgerCode: values?.bankAcc?.generalLedgerCode,
          generalLedgerName: values?.bankAcc?.generalLedgerName,
          subGLId: values?.bankAcc?.value,
          subGlCode: values?.bankAcc?.bankAccNo,
          subGLName:  values?.bankAcc?.bankName,
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
          debit: location?.state?.accountingJournalTypeId === 4 ? netAmount : 0,
          credit: location?.state?.accountingJournalTypeId !== 4 ? 1 * -+netAmount : 0, 
        })
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
      setRowDto([...rowDto, values]);
    } else {
      toast.warn("Not allowed to duplicate transaction");
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };
  console.log(rowDto);

  useEffect(() => {
    // if not id, that means this is for create form, then we will check this..
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [objProps, setObjprops] = useState({});

  console.log("bankJournalCreate", bankJournalCreate);

  const rowDtoHandler = (index, name, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  // console.log("rowDto", rowDto);

  return (
    <IForm
      title={location?.state?.accountingJournalTypeId === 4 ? "Create Bank Receipt" : location?.state?.accountingJournalTypeId === 5 ? "Create Bank Payments" : "Create Bank Transfer"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : bankJournalCreate}
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
        setRowDto={setRowDto}
      />
    </IForm>
  );
}
