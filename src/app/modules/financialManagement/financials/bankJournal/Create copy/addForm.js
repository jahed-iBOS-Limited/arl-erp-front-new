/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  saveBankJournal,
  // genarateChequeNo
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { confirmAlert } from "react-confirm-alert";
import { setBankJournalCreateAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import "./style.css"

// const initData = {

// };

export default function BankJournalCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [instrumentNoByResponse, setInstrumentNoByResponse] = useState("");
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const [attachmentFile, setAttachmentFile] = useState("");

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const { bankJournalCreate } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );

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
    if(location?.state?.selectedJournal?.value === 5 && !params?.id && !attachmentFile){
      return toast.warn("Attachment Required")
    }
    if (values?.profitCenter?.value) {
      if (location?.state?.selectedJournal?.value === 4) {
          if (!values?.revenueCenter || !values?.revenueElement) {
            return toast.warn("Please add Revenue center or Revenue element");
          }
      } else {
          if (!values?.costCenter || !values?.costElement) {
            return toast.warn("Please add Cost center or Cost element");
          }
      }
    } 
    /* 
     // previous code 
     if (location?.state?.selectedJournal?.value === 4) {
      if (values?.revenueCenter || values?.revenueElement) {
        if (!(values?.revenueCenter && values?.revenueElement)) {
          return toast.warn("Please add Revenue center or Revenue element");
        }
      }
    } else {
      if (values?.costCenter || values?.costElement) {
        if (!(values?.costCenter && values?.costElement)) {
          return toast.warn("Please add Cost center or Cost element");
        }
      }
    } */
    
    // dispatch values for localStorageSlice
    dispatch(setBankJournalCreateAction(values));
    // setDisabled(true);

    // const chequeNo = await genarateChequeNo(
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   +values?.bankAcc?.bankId,
    //   +values?.bankAcc?.bankBranch_Id,
    //   +values?.bankAcc?.value,
    //   values?.bankAcc?.label,
    //   +values?.instrumentType?.value
    // );


    if (
      values &&
      profileData?.accountId &&
      selectedBusinessUnit?.value
      // chequeNo?.currentChequeNo
    ) {
      let type = location?.state?.selectedJournal?.value;
      // if id , then this is for edit , else this is for create
      if (params?.id) {
      } else {
        // obj row for bank receipt and bank payment
        let objRow = rowDto?.map((item) => ({
          rowId: 0,
          businessTransactionId: +item?.transaction?.value,
          businessTransactionCode: item?.transaction?.code,
          businessTransactionName: item?.transaction?.label,
          generalLedgerId: +item?.gl?.value,
          generalLedgerCode: item?.gl?.code,
          generalLedgerName: item?.gl?.label,
          amount: +item?.amount,
          narration: item?.narration,
          bankAcId: +values?.bankAcc?.value,
          bankAcNo: values?.bankAcc?.bankAccNo,
          partnerTypeName: item?.partnerType?.label || "",
          partnerTypeId: item?.partnerType?.reffPrtTypeId || 0,
          businessPartnerId:
            item?.partnerType?.label === "Others"
              ? 0
              : item?.transaction?.value,
          businessPartnerCode:
            item?.partnerType?.label === "Others"
              ? ""
              : item?.transaction?.code,
          businessPartnerName:
            item?.partnerType?.label === "Others"
              ? ""
              : item?.transaction?.label,
          subGLId: item?.transaction?.value,
          subGlCode: item?.transaction?.code,
          subGLName: item?.transaction?.label,
          subGLTypeId: item?.partnerType?.reffPrtTypeId,
          subGLTypeName: item?.partnerType?.label,
          controlType : type === 4 ? "Revenue" : type === 5 ? "Cost" : "",
          profitCenterId: item?.profitCenter?.value || 0,
          costRevenueName: item?.revenueCenter?.label || item?.costCenter?.label || "",
          costRevenueId: item?.revenueCenter?.value || item?.costCenter?.value || 0,
          elementName: item?.revenueElement?.label || item?.costElement?.label || "",
          elementId: item?.revenueElement?.value || item?.costElement?.value || 0,
          partnerBankId: item?.partnerBankAccount?.bankId || 0,
          partnerBankBranchId: item?.partnerBankAccount?.bankBranchId || 0,
          partnerBankAccountNo: item?.partnerBankAccount?.bankAccountNo || "",
          partnerBankAccountName: item?.partnerBankAccount?.bankName || "",
          partnerBankRoutingNumber: item?.partnerBankAccount?.routingNo || ""
        }));

        let transferRow = [
          {
            rowId: 0,
            businessTransactionId: 0,
            businessTransactionCode: "",
            businessTransactionName: "",
            generalLedgerId:
              values?.transferTo?.value === 1
                ? +values?.sendToGLBank?.value
                : +values?.bankAcc?.generalLedgerId,
            generalLedgerCode:
              values?.transferTo?.value === 1
                ? values?.sendToGLBank?.generalLedgerCode
                : values?.bankAcc?.generalLedgerCode,
            generalLedgerName:
              values?.transferTo?.value === 1
                ? values?.sendToGLBank?.label
                : values?.bankAcc?.generalLedgerName,
            amount: +values?.transferAmount,
            narration: values?.headerNarration,
            bankAcId:
              values?.transferTo?.value === 2 ? values?.sendToGLBank?.value : 0,
            bankAcNo:
              values?.transferTo?.value === 2
                ? values?.sendToGLBank?.bankAccNo
                : "",
            subGLId:
              values?.transferTo?.value === 2
                ? +values?.sendToGLBank?.value
                : 0, // bankaccId
            subGlCode: values?.sendToGLBank?.bankAccNo, // bankacc number
            subGLName:
              values?.transferTo?.value === 2
                ? values?.sendToGLBank?.label
                : "",
            subGLTypeId: 6, // 6
            subGLTypeName: "Bank Account", // "Bank Account"
          },
        ];
        const isRevenue = (type === 4 && values?.revenueCenter && values?.revenueElement) 
        const isCostCenter = (type !== 4 && values?.costCenter && values?.costElement) 
        const payload = {
          objHeader: {
            bankJournalId: 0,
            voucherDate: values?.transactionDate,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            sbuId: +location?.state?.selectedSbu?.value,
            bankId: +values?.bankAcc?.bankId,
            bankName: values?.bankAcc?.bankName,
            bankBranchId: +values?.bankAcc?.bankBranch_Id,
            bankBranchName: values?.bankAcc?.bankBranchName,
            bankAccountId: +values?.bankAcc?.value,
            bankAccountNumber: values?.bankAcc?.bankAccNo,
            receiveFrom: values?.receiveFrom || "",
            paidTo: values?.paidTo || "",
            transferTo: values?.transferTo?.label || "",
            placedInBank: values?.placedInBank,
            placingDate: values?.placingDate || "",
            //values?.placedInBank ? values?.placingDate : ""
            generalLedgerId: +values?.bankAcc?.generalLedgerId,
            generalLedgerCode: values?.bankAcc?.generalLedgerCode,
            generalLedgerName: values?.bankAcc?.generalLedgerName,
            amount: type === 6 ? +values?.transferAmount : +netAmount,
            narration: values?.headerNarration || "",
            posted: false,
            partnerTypeName: values?.partnerType?.label || "",
            partnerTypeId: values?.partnerType?.value || 0,
            businessPartnerId:
              values?.partnerType?.label === "Others"
                ? 0
                : values?.transaction?.value,
            businessPartnerCode:
              values?.partnerType?.label === "Others"
                ? ""
                : values?.transaction?.code,
            businessPartnerName:
              values?.partnerType?.label === "Others"
                ? ""
                : values?.transaction?.label,
            instrumentId: +values?.instrumentType?.value || 0,
            instrumentName: values?.instrumentType?.label || "",
            instrumentNo: values?.instrumentNo || "",
            instrumentDate: values?.instrumentDate || "",
            accountingJournalTypeId: type,
            directPosting: true,
            actionBy: +profileData?.userId,
            // Last Added
            chequeNo: values?.instrumentNo || "",
            controlType: isRevenue ? "revenue": isCostCenter ? "cost" : "" || "",
            costRevenueName: isRevenue ? values?.revenueCenter?.label : isCostCenter ? values?.costCenter?.label : "" ,
            costRevenueId: isRevenue ? values?.revenueCenter?.value : isCostCenter  ? values?.costCenter?.value : 0,
            elementName: isRevenue ? values?.revenueElement?.label : isCostCenter  ? values?.costElement?.label : "",
            elementId: isRevenue ? values?.revenueElement?.value : isCostCenter  ? values?.costElement?.value :0,
            ProfitCenterId: values?.profitCenter?.value,
            attachment: attachmentFile || "",
          },
          objRowList: type === 6 ? transferRow : objRow,
        };
        // if jorunal  type is bank transfer , don't need to check rowdto length
        if (type === 6) {
          saveBankJournal(payload, cb, setRowDto, setDisabled, IConfirmModal);
        } else {
          if (rowDto?.length === 0) {
            toast.warn("Please add transaction");
          } else {
            saveBankJournal(payload, cb, setRowDto, setDisabled, IConfirmModal);
          }
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (values) => {
    const count = rowDto?.filter(
      (item) => item?.transaction?.value === values?.transaction?.value
    ).length;

    if (location?.state?.selectedJournal?.value === 5) {
      setRowDto([...rowDto, values]);
    } else {
      if (count === 0) {
        setRowDto([...rowDto, values]);
      } else {
        toast.warn("Not allowed to duplicate transaction");
      }
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  useEffect(() => {
    // if not id, that means this is for create form, then we will check this..
    if (!location?.state && !params?.id) {
      history.push("/financial-management/financials/bank");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [objProps, setObjprops] = useState({});


  const rowDtoHandler = (index, name, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  console.log("rowDto",rowDto)


  return (
    <IForm
      title={
        location?.state?.selectedJournal?.value === 4
          ? "Create Bank Receipt"
          : location?.state?.selectedJournal?.value === 5
          ? "Create Bank Payments"
          : "Create Bank Transfer"
      }
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
        jorunalType={location?.state?.selectedJournal?.value}
        netAmount={netAmount}
        instrumentNoByResponse={instrumentNoByResponse}
        setInstrumentNoByResponse={setInstrumentNoByResponse}
        rowDtoHandler={rowDtoHandler}
        attachmentFile={attachmentFile}
        setAttachmentFile = {setAttachmentFile}
        isEdit={params?.id || false}
      />
    </IForm>
  );
}
