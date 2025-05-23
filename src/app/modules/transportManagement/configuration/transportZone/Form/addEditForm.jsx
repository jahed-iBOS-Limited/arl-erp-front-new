import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Form from './form';
import {
  saveTransportZone,
  saveEditedTransportZone,
  getTransportZoneById,
  setTransportZoneSingleEmpty,
} from '../_redux/Actions';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';

const initData = {
  id: undefined,
  transportZoneName: '',
  divisionName: '',
  districtName: '',
};

export default function TransportZoneForm({
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

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.transportZone?.singleData;
  }, shallowEqual);
  const dispatch = useDispatch();
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getTransportZoneById(id));
    } else {
      dispatch(setTransportZoneSingleEmpty());
    }
  }, [id]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          transportZoneId: values.transportZoneId,
          transportZoneName: values.transportZoneName,
          actionBy: profileData.userId,
          districtId: values?.districtName?.value || 0,
        };
        dispatch(saveEditedTransportZone(payload, setDisabled));
      } else {
        const payload = {
          transportZoneName: values.transportZoneName,
          businessUintid: selectedBusinessUnit.value,
          actionBy: profileData.userId,
          accountId: profileData.accountId,
          districtId: values?.districtName?.value || 0,
        };
        dispatch(saveTransportZone({ data: payload, cb }, setDisabled));
      }
    } else {
    }
  };
  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };
  return (
    <IForm
      title={id ? 'Edit Transport Zone' : 'Create Transport Zone'}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
      />
    </IForm>
  );
}
