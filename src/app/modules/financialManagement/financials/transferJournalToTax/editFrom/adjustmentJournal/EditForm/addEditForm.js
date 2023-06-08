/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual} from "react-redux";
import Form from "./form";
import { useLocation } from "react-router-dom";
import { _todayDate } from "../../../../../../_helper/_todayDate";
import IForm from "../../../../../../_helper/_form";
import Loading from "../../../../../../_helper/_loading";
import { getAdjustmentJournalById, getPartnerTypeDDL } from "../helper";
import { commonTransferJournal } from "../../../helper";

const initData = {
  id: undefined,
  sbu: "",
  transactionDate: _todayDate(),
  headerNarration: "",
  transaction: "",
  debitCredit: "",
  amount: "",
  partnerType: "",
  revenueElement:"",
  revenueCenter:"",
  costCenter:"",
  costElement:""
};

export default function AdjustmentJournalCreateForm({journalId, viewData, sbu, setShow}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState({});

  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);
// location is undefined in main source file
  const location = useLocation();
  // const { id } = useParams();
  const id = journalId;

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getPartnerTypeDDL(setPartnerTypeDDL);
  }, [profileData, selectedBusinessUnit]);


  useEffect(() => {
    if (id) {
      getAdjustmentJournalById(id, setSingleData, setRowDto);
    }
  }, [id]);


  const saveHandler = async (values, cb) => {

    let newData = rowDto.map((item) => ({
      ...item,
      amount: item?.debitCredit === "Credit" ? item?.amount : +item?.amount,
    }));

    const payload =  newData?.map((item)=>({
      accountId:  +profileData?.accountId,
      businessUnitId: +selectedBusinessUnit?.value,
      sbuId: sbu?.value,
      accountingJournalTypeId: viewData?.accountingJournalTypeId,
      accountingJournalId: viewData?.adjustmentJournalId,
      accountingJournalCode: viewData?.adjustmentJournalCode,
      transactionDate: values?.transactionDate,
      bankSortName: viewData?.bankName || "",
      instrumentTypeID: +values?.instrumentType?.value || 0,
      instrumentTypeName: values?.instrumentType?.label || "",
      instrumentNo: values?.instrumentNo || "",
      instrumentDate: values?.instrumentDate || null,
      paytoName: values?.transaction?.label,
      journalId: viewData?.adjustmentJournalId,
      journalCode: viewData?.adjustmentJournalCode,
      actionBy:  profileData?.userId,
      isTransfer: true,
      narration: values?.headerNarration,
      generalLedgerId: item?.gl?.value || 0,
      generalLedgerCode: item?.gl?.code || "",
      generalLedgerName: item?.gl?.label || "",
      subGLId: item?.transaction?.value,
      subGlCode: item?.transaction?.code,
      subGLName: item?.transaction?.label,
      subGLTypeId: item?.partnerType?.reffPrtTypeId,
      subGLTypeName: item?.partnerType?.label,
      numAmount: +item?.amount,
      debit: item?.debitCredit === "Debit" ? item?.amount : 0,
      credit:item?.debitCredit === "Credit" ? -item?.amount : 0,
    }))

    commonTransferJournal({row:payload},  ()=>{setShow(false)});
    
  };

  const rowDtoHandler = (index, name, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  const setter = (payload, values) => {
    let data = [...rowDto];
    data.push({
      ...payload,
      adjustmentJournalId: 0,
      adjustmentJournalCode: "string",
    });
    setRowDto(data);
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={`Edit Adjustment Journal(${viewData?.adjustmentJournalCode ||
        ""})`}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenReset={true}
      submitBtnText={"Transfer"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        state={location?.state || ""}
        isEdit={id || false}
        setRowDto={setRowDto}
        partnerTypeDDL={partnerTypeDDL}
        rowDtoHandler={rowDtoHandler}
      />
    </IForm>
  );
}
