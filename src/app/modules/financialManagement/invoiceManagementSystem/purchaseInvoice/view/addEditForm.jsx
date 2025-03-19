/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";
import { getSingleData } from "../helper";
import { useParams } from 'react-router';
import { useHistory } from 'react-router';

const initData = {
  SBU: "",
  purchaseOrg: "",
  plant: "",
  warehouse: "",
  supplierName: "",
  purchaseOrder: "",
  invoiceNumber: "",
  invoiceDate: _todayDate(),
  comments: "",
  selectGRN: "",
  checked: false,
  ginvoiceAmount: "",
  deducationAmount: "",
};

export default function ViewPurchaseInvoiceForm() {
  const history = useHistory()
  const {id} = useParams();
  const [isDisabled, setDisabled] = useState(true);

  const [singleData, setSingleData] = useState({});


  useEffect(() => {
    getSingleData(id, setSingleData);
  }, [id]);


  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="purchaseInvoice">
      <ICustomCard
        title= {`Purchase Invoice [${singleData?.objHeaderDTO?.supplierInvoiceCode}]`}
        backHandler={() => {
          history.goBack();
        }}
        renderProps={() => {}}
      >
        <Form
          {...objProps}
          initData={id ? singleData : initData}
          disableHandler={disableHandler}
          singleData={singleData}
        />
      </ICustomCard>
    </div>
  );
}
