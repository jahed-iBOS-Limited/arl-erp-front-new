/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getPositionGroupDDL,
  saveHRPosition,
  getHRPositionById,
  editHRPosition,
} from "../helper";
import Loading from "../../../../_helper/_loading";

let initData;
export function HRPositionForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [positionGroupDDl, setPositionGroupDDl] = useState("");
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  useEffect(() => {
    getPositionGroupDDL(setPositionGroupDDl);
  }, []);

  useEffect(() => {
    getHRPositionById(id, setSingleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (id && singleData?.length > 0) {
    const {
      positionName,
      positionCode,
      positionType,
      positionGroupId,
      positionGroupName,
    } = singleData[0];

    initData = {
      positionName: positionName,
      positionCode: positionCode,
      positionType: positionType,
      positionGroup: { value: positionGroupId, label: positionGroupName },
    };
  } else {
    initData = {
      positionName: "",
      positionCode: "",
      positionType: "",
      positionGroup: "",
    };
  }

  const saveHandler = async (values, cb) => {
    if (values) {
      if (id) {
        const payload = {
          positionId: +id,
          positionCode: values?.positionCode,
          positionName: values?.positionName,
          positionGroupId: values?.positionGroup.value,
          actionBy: profileData?.userId,
        };
        editHRPosition(payload, cb, setDisabled);
      } else {
        const payload = {
          positionCode: values?.positionCode,
          positionName: values?.positionName,
          positionGroupId: values?.positionGroup?.value,
          accountId: profileData?.accountId,
          actionBy: profileData?.userId,
        };

        saveHRPosition(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Employee HR Position" : "Create Employee HR Position"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          positionGroupDDl={positionGroupDDl}
          isEdit={id || false}
        />
      </div>
    </IForm>
  );
}
