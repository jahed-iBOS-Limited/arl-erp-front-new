import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";

import {
  GetComponentDDL,
  saveMillageSetUp,
  GetMillagePagination,
} from "../helper";

import Loading from "../../../../_helper/_loading";

const initData = {
  millageComponent: "",
  millage: "",
  minimumamount: "",
  maximumamount: "",
};

export default function MillageSetUpCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const params = useParams();
  const [millageComponent, setMillageComponent] = useState([]);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      GetComponentDDL(profileData.accountId, setMillageComponent);
      GetMillagePagination(
        profileData.accountId,
        selectedBusinessUnit.value,
        setSingleData
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        accountId: +profileData?.accountId,
        millageCostComponentId: +values?.millageComponent?.value,
        businessUnitId: +selectedBusinessUnit?.value,
        millage: +values?.millage,
        minimumAmount: +values?.minimumamount,
        maximumAmount: +values?.maximumamount,
      };
      saveMillageSetUp(payload, setDisabled);
    }
  };

  return (
    <IForm
      title={"Millage Set-Up"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        singleData={singleData}
        millageComponent={millageComponent}
        isEdit={params?.id || false}
        setRowDto={setRowDto}
      />
    </IForm>
  );
}
