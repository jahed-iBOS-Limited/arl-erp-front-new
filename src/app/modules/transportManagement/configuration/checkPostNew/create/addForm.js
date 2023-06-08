import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import {
  createCheckPostList,
  editCheckPostList,
  getCheckPostListById,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  checkPostName: "",
};

export default function CheckPostNewCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const params = useParams();
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (params?.id) {
      getCheckPostListById(params?.id, setSingleData);
    }
  }, [profileData, params]);
  const saveHandler = async (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          checkPostId: +params?.id,
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          checkPostName: values?.checkPostName,
          actionBy: +profileData?.userId,
        };
        editCheckPostList(payload,setDisabled);
      } else {
        const payload = {
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          checkPostName: values?.checkPostName,
          actionBy: +profileData?.userId,
        };
        createCheckPostList(payload, cb,setDisabled);
      }
    } else {
      console.log(values)
    }
  };
  

  return (
    <IForm
      title={"Create Check Post List"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        rowDto={rowDto}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
      />
    </IForm>
  );
}
