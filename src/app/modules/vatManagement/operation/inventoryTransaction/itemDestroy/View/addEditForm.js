import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { GetItemDestroyView } from "../helper";
import Form from "./form";

const initData = {
  branchName: "",
  branchAddress: "",
  transactionDate: "",
  vatTotal: "",
  referenceNo: "",
  referenceDate: "",
  sdChargeableValue: "",
  sdTotal: "",
  itemName: "",
  itemType: "",
  quantity: "",
};

export default function ItemDestroyViewForm({ id, typeId }) {
  const [singleData, setSingleData] = useState("");
  const [, setDisabled] = useState(true);
  const [objProps] = useState({});

  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //single Data
  useEffect(() => {
    if (id && typeId) {
      GetItemDestroyView(id, typeId, setSingleData, setRowDto);
    }
  }, [id, typeId]);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <Form
      {...objProps}
      initData={id && typeId ? singleData : initData}
      disableHandler={disableHandler}
      accountId={profileData?.accountId}
      selectedBusinessUnit={selectedBusinessUnit}
      isDisabled={true}
      rowDto={rowDto}
    />
  );
}
