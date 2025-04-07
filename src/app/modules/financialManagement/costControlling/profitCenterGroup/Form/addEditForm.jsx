import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Form from './form';
import {
  getGroupParentDDLAction,
  saveProfitCentedGroup,
  saveEditedControllingUnit,
  getProfitCenterGroupDataById,
  setProfitCenterGroupDataSingleEmpty,
} from '../_redux/Actions';
import IForm from '../../../../_helper/_form';
import { getControllingUnitDDLAction } from '../../../../_helper/_redux/Actions';
import Loading from './../../../../_helper/_loading';

const initData = {
  id: undefined,
  profitCenterGroupCode: '',
  profitCenterGroupName: '',
  controllingUnit: '',
  profitCenterGroupParent: '',
};

export default function ProfitCenterGroupFrom({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlUnitDDL from store
  const controlUnitDDL = useSelector((state) => {
    return state?.commonDDL?.controllingDDL;
  }, shallowEqual);

  // get groupParentDDL from store
  const groupParentDDL = useSelector((state) => {
    return state?.profitCenterGroup?.groupParentDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const controllingUnit = useSelector((state) => {
    return state.profitCenterGroup?.singleData;
  }, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getProfitCenterGroupDataById(id));
    } else {
      dispatch(setProfitCenterGroupDataSingleEmpty());
    }
  }, [id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getControllingUnitDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          profitCenterGroupId: +id,
          profitCenterGroupCode: values.profitCenterGroupCode,
          profitCenterGroupName: values.profitCenterGroupName,
          profitCenterGroupParantId: values?.profitCenterGroupParent?.value,
          profitCenterGroupParantName: values.profitCenterGroupParent?.label,
          controllingUnitId: values?.controllingUnit?.value,
          actionBy: profileData.userId,
          businessUnitId: selectedBusinessUnit.value,
          accountId: profileData.accountId,
        };
        dispatch(saveEditedControllingUnit(payload, setDisabled));
      } else {
        const payload = {
          profitCenterGroupCode: values.profitCenterGroupCode,
          profitCenterGroupName: values.profitCenterGroupName,
          profitCenterGroupParantId: values?.profitCenterGroupParent?.value,
          profitCenterGroupParantName: values.profitCenterGroupParent?.label,
          controllingUnitId: values?.controllingUnit?.value,
          actionBy: profileData.userId,
          businessUnitId: selectedBusinessUnit.value,
          accountId: profileData.accountId,
        };
        dispatch(saveProfitCentedGroup({ data: payload, cb, setDisabled }));
      }
    } else {
      setDisabled(false);
    }
  };

  const getGroupParentDDL = (cuId) => {
    if (selectedBusinessUnit?.value && profileData?.accountId && cuId) {
      dispatch(
        getGroupParentDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          cuId
        )
      );
    }
  };
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Profit Center Group"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={controllingUnit || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        controlUnitDDL={controlUnitDDL}
        groupParentDDL={groupParentDDL}
        getGroupParentDDL={getGroupParentDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
