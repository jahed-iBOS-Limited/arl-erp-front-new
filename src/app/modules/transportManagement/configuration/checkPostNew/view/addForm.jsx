/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useHistory } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getCheckPostListById } from "../helper";
import ICard from "../../../../_helper/_card";

const initData = {
  checkPostName: "",
};

export default function CheckPostNewViewForm({ id }) {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const history = useHistory();

  // taxbranch ddl
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (id) {
      getCheckPostListById(id, setSingleData);
    }
  }, [profileData, id]);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  const backHandler = () => {
    history.goBack();
  };
  return (
    <ICard
      getProps={setObjprops}
      isDisabled={isDisabled}
      title={"View Check Post List"}
    >
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        disableHandler={disableHandler}
        rowDto={rowDto}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={id || false}
      />
    </ICard>
  );
}
