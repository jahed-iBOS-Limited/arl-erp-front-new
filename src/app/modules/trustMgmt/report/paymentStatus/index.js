import React, { useState } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import Form from "./form";
import PaymentTable from "./paymentStatusTable";
import "./style.css";

const initData = {
  fromDate: "",
  toDate: "",
  unitName: "",
  paymentStatus: "",
  paymentType:"",
};

export default function PaymentStatus() {
  const [isDisabled, ] = useState(false);
  const [, setObjprops] = useState({});
  const [rowDto, getData, , ] = useAxiosGet();


  return (
    <IForm
      title={"Payment Status"}
      getProps={setObjprops}
      isHiddenBack={true}
      isHiddenReset={true}
      isHiddenSave={true}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        initData={initData}
        getData={getData}
        rowDto={rowDto}
      />
      <PaymentTable rowDto={rowDto}/>
    </IForm>
  );
}
