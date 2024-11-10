/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useSelector } from "react-redux";
import { getShippointDDL } from "../../../../financialManagement/invoiceManagementSystem/billregister/helper";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import Form from "./form";

const initData = {
  supplier: "",
  billNo: "",
  billDate: _todayDate(),
  paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  narration: "",
  billAmount: "",
  warehouse: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  fromTime: _todaysStartTime(),
  toTime: _todaysEndTime(),
};

export default function LabourCostReport() {
  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  const [shippointDDL, setShippointDDL] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [purchaseOrderDDL, setpurchaseOrderDDL] = useState([]);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    if (accId && buId) {
      getShippointDDL(userId, accId, buId, setShippointDDL);
    }
  }, [accId, buId, userId]);

  const [objProps, setObjprops] = useState({});
  return (
    <>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        // saveHandler={saveHandler}
        accId={accId}
        buId={buId}
        setpurchaseOrderDDL={purchaseOrderDDL}
        setpurchaseOrdrDDL={setpurchaseOrderDDL}
        gridData={gridData}
        setGridData={setGridData}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        purchaseOrderDDL={purchaseOrderDDL}
        shippointDDL={shippointDDL}
        setDisabled={setDisabled}
      />
    </>
  );
}
