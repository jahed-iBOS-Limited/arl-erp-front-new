/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  GetSBUListDDLAction,
  saveDistributionChannel,
  saveEditedDistributionChannel,
  getDistributionChannelById,
  setDistributionChannelSingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  distributionChannelCode: "",
  distributionChannelName: "",
  SBU: "",
  salesOrderValidityDays: "",
};

export default function DistributionChannelForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get emplist ddl from store
  const SBUListDDL = useSelector((state) => {
    return state?.distributionChannel?.SBUListDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.distributionChannel?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getDistributionChannelById(id, setDisabled));
    } else {
      dispatch(setDistributionChannelSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        GetSBUListDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          distributionChannelId: +id,
          accountId: profileData.accountId,
          distributionChannelName: values.distributionChannelName,
          businessUnitId: selectedBusinessUnit.value,
          salesOrderValidityDays: +values?.salesOrderValidityDays,
        };
        dispatch(saveEditedDistributionChannel(payload, setDisabled));
      } else {
        const payload = {
          accountId: profileData.accountId,
          distributionChannelCode: values.distributionChannelCode,
          distributionChannelName: values.distributionChannelName,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          sbuid: values.SBU.value,
          sbuname: values.SBU.label,
          actionBy: profileData.userId,
          salesOrderValidityDays: +values?.salesOrderValidityDays,
        };
        dispatch(saveDistributionChannel({ data: payload, cb }, setDisabled));
      }
    } else {
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };
  return (
    <IForm
      title={id ? "Edit Distribution Channel" : "Create Distribution Channel"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        SBUListDDL={SBUListDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
