import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import Form from "./form";

export default function TdsVdsJvLanding() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});

  // const [statusState,setStatusState] = useState()

  const { financialsPaymentAdvice } = useSelector((state) => {
    return state.localStorage;
  }, shallowEqual);



  return (
    <IForm
      title={"TDS VDS JV Create"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenSave={false}
      isHiddenReset={true}
      // supportButtons={
      //   financialsPaymentAdvice?.status?.value === 1
      //     ? [
      //         {
      //           label: "Prepare Voucher",
      //           className: "btn btn-primary",
      //         },
      //       ]
      //     : []
      // }
    >
      <Form {...objProps} setDisabled={setDisabled}/>
    </IForm>
  );
}
