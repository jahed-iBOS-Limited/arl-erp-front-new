import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getSinglePurchaseview } from './../helper';

const initData = {
  supplier: "",
  address: "",
  transactionDate: _todayDate(),
  tradeType: "",
  paymentTerm: "",
  vehicalInfo: "",
  refferenceNo: "",
  refferenceDate: _todayDate(),
  totalTdsAmount: "",
  totalVdsAmount: "",
  selectedItem: "",
  selectedUom: "",
  quantity: "",
  rate: "",
  totalAtv: "",
  totalAit: "",
  grnCode: ""
};

export default function PurchaseView({ viewClick, singleData, setSingleData }) {
  const [isDisabled, setDisabled] = useState(true);
  const [
    objProps,
    //  setObjprops
  ] = useState({});
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (viewClick?.taxPurchaseId) {
      getSinglePurchaseview(viewClick?.taxPurchaseId, setSingleData, setRowDto, setDisabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form
      {...objProps}
      initData={viewClick?.taxPurchaseId ? singleData : initData}
      profileData={profileData}
      selectedBusinessUnit={selectedBusinessUnit}
      isEdit={viewClick?.taxPurchaseId || false}
      setRowDto={setRowDto}
      rowDto={rowDto}
      isDisabled={isDisabled}
    />
  );
}
