import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { getPartnerTypeDDL, saveAccountingJournal } from "../../helper";
import { getAdjustmentJournalByCode } from "../helper";
import Form from "./form";

const initData = {
  id: undefined,
  sbu: "",
  transactionDate: "",
  narration: "",
  transaction: "",
  debitCredit: "",
  amount: "",
  partnerType: "",
};

export default function AdjustmentJournal() {
  const {journalCode} = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData,setSingleData] = useState("");

  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);

  const location = useLocation();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getPartnerTypeDDL(setPartnerTypeDDL);
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if(journalCode){
      getAdjustmentJournalByCode( journalCode, setSingleData);
    }
  },[journalCode])

  useEffect(() => {
    if (singleData) {
      const data = [...singleData]
      //const row = data?.filter((item) => item?.subGLTypeId!==6)
      setRowDto(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);
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
    // const { accountId, userId: actionBy } = profileData;
    // const { value: businessunitid } = selectedBusinessUnit;

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const debitCalc = () => {
        const debit = rowDto
          .filter((itm) => itm.debitCredit === "Debit")
          .map((itm) => Math.abs(itm.amount))
          .reduce((sum, curr) => {
            return (sum += curr);
          }, 0);
        return (debit || 0).toFixed(4);
      };

      const creditCalc = () => {
        let credit = rowDto
          .filter((itm) => itm.debitCredit === "Credit")
          .map((itm) => Math.abs(itm.amount))
          .reduce((sum, curr) => {
            return (sum += curr);
          }, 0);
        return (credit || 0).toFixed(4);
      };

      if (journalCode) {
        if (debitCalc() !== creditCalc())
          return toast.warning("Debit & Credit must be equal");
          const objRow = rowDto.map((item) => {
            return {
              journalId:item?.journalId,
              journalCode,
              accountingJournalId: item?.journalId,
              accountingJournalCode: journalCode,
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
              transactionId : item?.transactionId || 0,
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
              debit:item?.debitCredit === "Debit" ? +item?.amount : 0,
              credit: item?.debitCredit === "Credit" ? -1 * item?.amount : 0,
            };
          });
          saveAccountingJournal({
            payload:{row:objRow},
            setDisabled,
            cb,
            IConfirmModal
           });
      } else {
        if (debitCalc() !== creditCalc())
          return toast.warning("Debit & Credit must be equal");
        // dispatch(
        //   // saveAdjustmentJournal({
        //   //   data: saveAdjustmentJournalData,
        //   //   cb,
        //   //   setDisabled,
        //   //   IConfirmModal,
        //   // })
        // );
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          const objRow = rowDto.map((item) => {
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
              debit:item?.debitCredit === "Debit" ? +item?.amount : 0,
              credit: item?.debitCredit === "Credit" ? -1 * item?.amount : 0,
            };
          });
          saveAccountingJournal({
            payload:{row:objRow},
            setDisabled,
            cb,
            IConfirmModal
           });
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const rowDtoHandler = (index, name, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  const setter = (values) => {
    const count = rowDto?.filter((item) => item?.transaction?.value === values?.transaction?.value).length;
    if (count === 0) {
      let data = [...rowDto];
      data.push({
      ...values,
      debitCredit:values?.debitCredit,
      journalId:journalCode ? singleData?.[0]?.journalId : 0,
      transactionId: 0
    });
    setRowDto(data);
    } else {
      toast.warn("Not allowed to duplicate transaction");
    }
    
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});
  return (
    <IForm
      title={
        journalCode
          ? `Edit Adjustment Journal(${journalCode ||
              ""})`
          : "Create Adjustment Journal"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        state={location?.state || ""}
        isEdit={journalCode || false}
        setRowDto={setRowDto}
        partnerTypeDDL={partnerTypeDDL}
        rowDtoHandler={rowDtoHandler}
        journalCode={journalCode}
      />
    </IForm>
  );
}
