/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import {
  getBuUnitDDL,
  getSBUList,
  getCashDDL,
  getPaymentAdviceIndoPagination,
  getAccountNoDDL,
  getTypeDDL
} from "../helper";
import { toast } from "react-toastify";
import { _todayDate } from "./../../../../_helper/_todayDate";
import {createPaymentVoucher } from "../helper";
// import { _dateFormatter } from './../../../../_helper/_dateFormate';
import "../paymentadvice.css"


export default function PaymentAdviceForm({
  history,
  match: {
    params: { id },
  },
}) {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [objProps, setObjprops] = useState({});
  const [allSelect, setAllSelect] = useState(false);


  // DDL state
  const [accountNoDDL, setAccountNoDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [unitDDL, setUnitDDL] = useState([]);
  const [sbuList, setSbuList] = useState([]);
  const [typeDDL, setTypeDDL] = useState([]);

  // const [statusState,setStatusState] = useState()

  const {financialsPaymentAdvice} = useSelector((state) => {
    return state.localStorage;
  }, shallowEqual);

  const initData = {
    date:financialsPaymentAdvice?.date || _todayDate(),
    sbuUnit: financialsPaymentAdvice?.sbuUnit || "",
    cashGl: financialsPaymentAdvice?.cashGl || "",
    accountNo:financialsPaymentAdvice?.accountNo || "",
    type:financialsPaymentAdvice?.type || "",
    status:financialsPaymentAdvice?.status || "",
    billType:financialsPaymentAdvice?.billType || "",
    payDate:_todayDate()
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    if (profileData?.userId && profileData?.accountId) {
      getBuUnitDDL(profileData?.userId, profileData?.accountId, setUnitDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      getSBUList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuList
      )
      getAccountNoDDL(profileData?.accountId, selectedBusinessUnit?.value, setAccountNoDDL);
      getCashDDL(profileData?.accountId, selectedBusinessUnit?.value, setBankDDL);
      getTypeDDL(setTypeDDL);
    }
  }, [profileData, selectedBusinessUnit]);


  const prepareChequeVoucher = (values,data) =>{
    let payload = [
      {
        unitId: selectedBusinessUnit?.value,
        sbuId: values?.sbuUnit?.value,
        billId: data?.intBillId,
        bankAccountId: values?.accountNo?.value || 0,
        payDate: values?.payDate,
        billTypeId: data?.intBillType,
        billTypeName: values?.billType?.label,
        paymentType: values?.type?.label,
        isntrumentNo: "",
        isntrumentTypeId: values?.type?.value,
        isntrumentTypeName: values?.type?.label,
        isntrumentDate: values?.payDate, 
        partnerId: data?.intPartnerId,
        payeName: data?.strPayee,
        debitGLId: data?.intDebitGL || 0,
        cashGLId: values?.cashGl?.value || 0,
        cashGlName: values?.cashGl?.label || '',
        transectionDate:data?.paymentDate,
        narration: data?.strDescription,
        transectionTypeId: 0,
        transectionTypeName: "",
        actionById: profileData?.userId,
        actionByName:profileData?.userName,
        numAmount: data?.monAmount
        }]
        createPaymentVoucher(payload, ()=>{} , null , setDisabled);
  } 

  const saveHandler = async (values, cb) => {
    if (values && profileData.accountId && selectedBusinessUnit) {       
      let payload = rowDto?.filter(data=> data?.isSelect).map(data =>{
        return {
          unitId: selectedBusinessUnit?.value,
          sbuId: values?.sbuUnit?.value,
          billId: data?.intBillId,
          bankAccountId: values?.accountNo?.value || 0,
          payDate: values?.payDate,
          billTypeId: data?.intBillType,
          billTypeName: values?.billType?.label,
          paymentType: values?.type?.label,
          isntrumentNo: "",
          isntrumentTypeId: values?.type?.value,
          isntrumentTypeName: values?.type?.label,
          isntrumentDate: values?.payDate, 
          partnerId: data?.intPartnerId,
          payeName: data?.strPayee,
          debitGLId: data?.intDebitGL || 0,
          cashGLId: values?.cashGl?.value || 0,
          cashGlName: values?.cashGl?.label || '',
          transectionDate:data?.paymentDate,
          narration: data?.strDescription,
          transectionTypeId: 0,
          transectionTypeName: "",
          actionById: profileData?.userId,
          actionByName:profileData?.userName,
          numAmount: data?.monAmount,
          numTds: +data?.numTds || 0,
          numVds: +data?.numVds ||0,
          }
      })
        // console.log(payload)
        if (payload.length === 0) {
          toast.warning("Please select at least one");
        } else {
          createPaymentVoucher(payload, cb , null , setDisabled);
        }      
    }
  };

  // const supportButton = 

  return (
    <IForm
      title={"Prepare Payment"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenSave={true}
      isHiddenReset={true}
      supportButtons={financialsPaymentAdvice?.status?.value === 1 ?[
        {
          label:"Prepare Voucher",
          className:"btn btn-primary",
        },
      ]:[]}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        profileData={profileData}
        rowDto={rowDto}
        setRowDto={setRowDto}
        location={location}
        accountNoDDL={accountNoDDL}
        bankDDL={bankDDL}
        unitDDL={unitDDL}
        setBankDDL={setBankDDL}
        setAccountNoDDL={setAccountNoDDL}
        setDisabled={setDisabled}
        id={params?.id}
        getPaymentAdviceIndoPagination={getPaymentAdviceIndoPagination}
        allSelect={allSelect}
        setAllSelect={setAllSelect}
        sbuList={sbuList}
        selectedBusinessUnit={selectedBusinessUnit}
        typeDDL={typeDDL}
        prepareChequeVoucher={prepareChequeVoucher}
      />
    </IForm>
  );
}
