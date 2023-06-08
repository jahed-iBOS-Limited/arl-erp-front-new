import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import { createWorkplaceGroup, getWorkplaceGroupById, saveEditedWorkpalceGroup } from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  workplaceGroupCode: "",
  workplaceGroupName: "",
};

export default function WorkplaceGroupForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      getWorkplaceGroupById(id, setSingleData);
    }
  }, [id]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId) {
      if (id) {
        const payload = {
          workplaceGroupId: +id,
          workplaceGroupName: values?.workplaceGroupName,
          workplaceGroupCode: values?.workplaceGroupCode,
          accountId: profileData.accountId,
          actionBy: profileData.userId,
        };
        saveEditedWorkpalceGroup(payload, cb, setDisabled);
      } else {
        const payload = {
          workplaceGroupName: values?.workplaceGroupName,
          workplaceGroupCode: values?.workplaceGroupCode,
          accountId: profileData?.accountId,
          actionBy: profileData?.userId,
        };
        createWorkplaceGroup(payload, cb, setDisabled);
        // console.log(payload);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Workplace Group"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading/>}
      <Form
        {...objProps}
        initData={singleData[0] || initData}
        saveHandler={saveHandler}
        isEdit={id ? id : false}
      />
    </IForm>
  );
}
