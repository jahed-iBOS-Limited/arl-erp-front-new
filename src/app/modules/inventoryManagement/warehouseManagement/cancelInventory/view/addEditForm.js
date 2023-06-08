/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";
import { getSingleData } from "../helper";

const initData = {
  requestDate: "",
  validTill: "",
  dueDate: "",
  referenceId: "",
  item: "",
  quantity: "",
  remarks: ""
};

export default function ViewItemRequestForm({
  history,
  match: {
    params: { id },
  },
}) {
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
        title="View Item Request"
        backHandler={() => {
          history.goBack();
        }}
        renderProps={() => {}}
      >
        <Form
          {...objProps}
          initData={id ? singleData[0] : initData}
          disableHandler={disableHandler}
          singleData={singleData}
        />
      </ICustomCard>
    </div>
  );
}
