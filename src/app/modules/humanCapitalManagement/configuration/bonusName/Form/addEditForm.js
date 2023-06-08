/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";

import {
  fetchSingleData,
  createBonus,
  editSingleData,
} from "../helper/Actions";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";

let initData = {
  bonusName: "",
  bonusDescription: "",
};

export function BonusNameForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const [singleDataState, setSingleDataState] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get Single Data
  useEffect(() => {
    if (id) {
      fetchSingleData(id, setSingleDataState);
    }
  }, [id]);

  const saveHandler = async (values, cb) => {
    if (values) {
      if (id) {
        let payload = {
          bonusId: +id,
          bonusName: values?.bonusName.trim(),
          bonusDescription: values?.bonusDescription
            ? values?.bonusDescription.trim()
            : values?.bonusName.trim(),
          isActive: true,
        };
        editSingleData(payload, setDisabled);
      } else {
        let payload = {
          bonusName: values?.bonusName.trim(),
          bonusDescription: values?.bonusDescription
            ? values?.bonusDescription.trim()
            : values?.bonusName.trim(),
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
          lastActionDateTime: _todayDate(),
          isActive: true,
        };
        createBonus(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Bonus Name" : "Create Bonus Name"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={id}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singleDataState : initData}
          saveHandler={saveHandler}
          isEdit={id}
          singleDataState={singleDataState}
        />
      </div>
    </IForm>
  );
}
