import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { GetValueAdditionView } from "../helper";
import Form from "./form";
const initData = {
  valueAdditionName: "",
};
export default function ValueAdditionViewForm({ id }) {
  const [, setDisabled] = useState(true);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //SingleData to view
  const [singleData, setSingleData] = useState("");

  // Get BusinessUnitTaxInfo view data
  useEffect(() => {
    if (id) {
      GetValueAdditionView(id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {};

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <Form
      initData={singleData || initData}
      //initData={id ? singleData : initData}
      saveHandler={saveHandler}
      disableHandler={disableHandler}
      accountId={profileData?.accountId}
      selectedBusinessUnit={selectedBusinessUnit}
      // isEdit={id || false}
      isDisabled={true}
    />
  );
}
