import React, { useState, useEffect } from 'react';
import Form from './form';
import { _todayDate } from '../../../../_helper/_todayDate';
import ICustomCard from '../../../../_helper/_customCard';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { getSingleDataAction } from '../_redux/Actions';
import { getImageFile_api } from '../helper';
import { invTransactionSlice } from './../_redux/Slice';
import { toast } from 'react-toastify';
const { actions: slice } = invTransactionSlice;

const initData = {
  referenceTypeName: '',
  referenceCode: '',
  transactionTypeName: '',
  businessPartnerName: '',
  personnelName: '',
  comments: '',
};

export default function ViewInvTransactionForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const dispatch = useDispatch();

  // redux store data
  const { singleData } = useSelector((state) => state?.invTransa);

  useEffect(() => {
    dispatch(getSingleDataAction(id));
    return () => dispatch(slice.setSingleDDL([]));
  }, [id]);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="purchaseInvoice">
      <ICustomCard
        title="View Inventory Transaction"
        backHandler={() => {
          history.goBack();
        }}
        renderProps={() => {}}
      >
        <Form
          {...objProps}
          initData={id ? singleData[0]?.objHeader : initData}
          disableHandler={disableHandler}
          singleData={singleData}
        />
      </ICustomCard>
    </div>
  );
}
