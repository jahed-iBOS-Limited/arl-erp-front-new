import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { _todayDate } from '../../../../_helper/_todayDate';
import { getLoanRegisterById } from '../helper';
import Loading from '../../../../_helper/_loading';
import SCFRegisterViewForm from './form';
import IForm from '../../../../_helper/_form';

const initData = {
  bank: '',
  facility: '',
  account: '',
  openingDate: _todayDate(),
  loanAccNo: '',
  termDays: '',
  principle: '',
  interestRate: '',
  remarks: '',
};

export default function SCFRegisterViewPage({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {};
  useEffect(() => {
    getLoanRegisterById(+id, setSingleData, setDisabled);
  }, [id]);

  return (
    <IForm
      customTitle={`View SCF Register`}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={true}
    >
      {isDisabled && <Loading />}
      <SCFRegisterViewForm
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
      />
    </IForm>
  );
}
