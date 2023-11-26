import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import Form from "./form";

export default function TdsVdsJvLanding() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});



  // const [statusState,setStatusState] = useState()

  const { financialsPaymentAdvice } = useSelector((state) => {
    return state.localStorage;
  }, shallowEqual);





  //   const params = useParams();
  //   const location = useLocation();


 

  //   const prepareChequeVoucher = (values,data) =>{
  //     let payload = [
  //       {
  //         unitId: selectedBusinessUnit?.value,
  //         sbuId: values?.sbuUnit?.value,
  //         billId: data?.intBillId,
  //         bankAccountId: values?.accountNo?.value || 0,
  //         payDate: values?.payDate,
  //         billTypeId: data?.intBillType,
  //         billTypeName: values?.billType?.label,
  //         paymentType: values?.type?.label,
  //         isntrumentNo: "",
  //         isntrumentTypeId: values?.type?.value,
  //         isntrumentTypeName: values?.type?.label,
  //         isntrumentDate: values?.payDate,
  //         partnerId: data?.intPartnerId,
  //         payeName: data?.strPayee,
  //         debitGLId: data?.intDebitGL || 0,
  //         cashGLId: values?.cashGl?.value || 0,
  //         cashGlName: values?.cashGl?.label || '',
  //         transectionDate:data?.paymentDate,
  //         narration: data?.strDescription,
  //         transectionTypeId: 0,
  //         transectionTypeName: "",
  //         actionById: profileData?.userId,
  //         actionByName:profileData?.userName,
  //         numAmount: data?.monAmount
  //         }]
  //         createPaymentVoucher(payload, ()=>{} , null , setDisabled);
  //   }

  const saveHandler = async (values, cb) => {
    console.log("save");
  };

  return (
    <IForm
      title={"TDS VDS JV Create"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenSave={true}
      isHiddenReset={true}
      supportButtons={
        financialsPaymentAdvice?.status?.value === 1
          ? [
              {
                label: "Prepare Voucher",
                className: "btn btn-primary",
              },
            ]
          : []
      }
    >
      {isDisabled && <Loading />}
      <Form {...objProps}/>
    </IForm>
  );
}
