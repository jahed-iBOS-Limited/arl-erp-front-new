import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import { CreateSalesInvoiceDetails } from "../helper";
import Form from "./form";

const initData = {
  id: undefined,
  billNo: "",
  date: _todayDate(),
  poNo: "",
  amount: "",
  duductedAIT: "",
  receivedAIT: "",
  challan: "",
  ChallanDate: _todayDate(),
};

export default function SalesInvoiceVSPaymentCreate({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get single controlling  unit from store
  const controllingUnit = useSelector((state) => {
    return state.profitCenterGroup?.singleData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = rowDto?.map((itm) => ({
        salesInvoiceId: +itm?.billNo || 0,
        refference: "",
        paymentAmount: itm?.amount || 0,
        paymentDate: itm?.date,
        deductedAit: +itm?.deductedAIT || 0,
        recivedAit: itm?.receivedAIT || 0,
        aitchallan: itm?.challan,
        aitchallanDate: itm?.ChallanDate,
        remarks: itm?.remarks || "",
      }));
      CreateSalesInvoiceDetails(payload, cb);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Sales Invoice Vs Payment Create"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={controllingUnit || initData}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        saveHandler={saveHandler}
        setRowDto={setRowDto}
        rowDto={rowDto}
      />
    </IForm>
  );
}
