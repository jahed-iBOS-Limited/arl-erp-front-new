/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  saveBankJournal,
  // genarateChequeNo
} from "../../../financials/bankJournal/helper";
import { createPaymentVoucher } from "../helper";
import Loading from "./../../../../_helper/_loading";
import { confirmAlert } from "react-confirm-alert";
import {
  getPartnerTypeDDL,
} from "../../../financials/bankJournal/helper";
import { _dateFormatter } from './../../../../_helper/_dateFormate';


export default function BankJournalCreateForm({ journalType, setBankModelShow, gridData, values, getLanding }) {

  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);


  const initData = {
    bankAcc: "",
    partner: { value: gridData?.intPartnerId, label: gridData?.strPayee },
    receiveFrom: "",
    instrumentType: "",
    instrumentNo: "",
    instrumentDate: _todayDate(),
    headerNarration: "",
    placedInBank: false,
    placingDate: _todayDate(),
    paidTo: gridData?.strPayee,
    transferTo: "",
    sendToGLBank: "",
    transaction: "",
    partnerType: { value: 1, label: "Supplier" },
    // amount is for bank receive and bank payment row
    amount: gridData?.monAmount,
    // transferAmount is for bank transfer header
    transferAmount: "",
    narration: `${gridData?.strBillNo} ${gridData?.strPayee}`,
    transactionDate: _todayDate(),
    customerSupplierStatus: "customer",
    paymentType:values?.type
  };


  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  let netAmount = rowDto?.reduce((total, value) => total + value?.amount, 0)

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

  useEffect(() => {
    getPartnerTypeDDL(setPartnerTypeDDL);
  }, []);

  const saveHandler = async (value, cb) => {
    // setDisabled(true);
    if (values && profileData.accountId && selectedBusinessUnit) {


      if((values?.billType?.value === 1 || values?.billType?.value === 2 || values?.billType?.value === 5) && !value?.partner) return toast.warn("Partner is required")

      let payload = [
        {
          unitId: selectedBusinessUnit?.value,
          sbuId: values?.sbuUnit?.value,
          billId: gridData?.intBillId,
          bankAccountId: value?.bankAcc?.value || "",
          payDate: gridData?.paymentDate,
          billTypeId: gridData?.intBillType,
          billTypeName: values?.billType?.label,
          paymentType: values?.paymentType,
          isntrumentNo: value.instrumentNo,
          isntrumentTypeId: value?.instrumentType?.value,
          isntrumentTypeName: value?.instrumentType?.label,
          isntrumentDate: value?.instrumentDate,
          partnerId: value?.partner?.value,
          payeName: value?.partner?.label || value?.paidTo,
          debitGLId: gridData?.intDebitGL,
          cashGLId: 0,
          cashGlName: "",
          transectionDate: value?.transactionDate,
          narration: rowDto[0]?.narration,
          transectionTypeId: rowDto[0]?.transaction?.value,
          transectionTypeName: rowDto[0]?.transaction?.label,
          actionById: profileData?.userId,
          actionByName: profileData?.userName,
          numAmount: rowDto[0]?.amount,
          businessTransactionId : rowDto[0]?.transaction?.value,
          businessTransactionName: rowDto[0]?.transaction?.businessTransactionName,
          businessTransactionGLId : rowDto[0]?.transaction?.generalLedgerId,
          businessTransactionGLName : rowDto[0]?.transaction?.generalLedgerName,
        }
      ]

      if (rowDto.length === 0) {
        toast.warning("Please select at least one");
      } else {
        createPaymentVoucher(payload, cb, setBankModelShow, setDisabled, getLanding, values);
      }
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
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  // useEffect(() => {
  //   // if not id, that means this is for create form, then we will check this..
  //   if (!location?.state && !params?.id) {
  //     history.push("/financial-management/financials/bank");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={
        journalType === 4
          ? "Create Bank Receipt"
          : journalType === 5
            ? "Create Bank Payments"
            : "Create Bank Transfer"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        jorunalType={journalType}
        netAmount={netAmount}
        partnerTypeDDL={partnerTypeDDL}
        landingValues={values}
      />
    </IForm>
  );
}
