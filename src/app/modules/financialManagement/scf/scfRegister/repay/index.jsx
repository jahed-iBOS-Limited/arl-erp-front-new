import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import { createRepay } from '../helper';
import RepayForm from './form';

const initData = {
  account: '',
  instrumentNo: '',
  instrumentDate: _todayDate(),
  principalAmount: '',
  interestAmount: '',
  transDate: _todayDate(),
  numExciseDuty: '',
};

export default function SCFRegisterRepayCreate({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const singleData = useSelector((state) => {
    return state.costControllingUnit?.singleData;
  }, shallowEqual);
  const location = useLocation();

  const saveHandler = async (values, cb) => {
    if (
      location?.state?.principal &&
      values?.principal > location?.state?.principal
    ) {
      return toast.error("Principal amount can't be greater than reapy amount");
    }
    const sumCheck =
      values?.principalAmount + values?.interestAmount + values?.numExciseDuty;
    if (sumCheck <= 0) {
      return toast.error('At least one field must be greater than 0');
    }
    createRepay(
      profileData?.accountId,
      location?.state?.bu || selectedBusinessUnit?.value,
      +id,
      values?.account?.value,
      0,
      values?.instrumentNo,
      values?.instrumentDate,
      +values?.principalAmount,
      +values?.interestAmount,
      values?.transDate,
      profileData?.userId,
      values?.numExciseDuty || 0,
      cb
    );
  };

  return (
    <IForm
      customTitle={`Repay SCF Register`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <RepayForm
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        location={location}
      />
    </IForm>
  );
}
