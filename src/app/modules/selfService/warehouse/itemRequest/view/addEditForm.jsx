import React, { useEffect, useState } from 'react';
import { getSingleData } from '../../../../_helper/_commonApi';
import ICustomCard from '../../../../_helper/_customCard';
import Form from '../../../../_helper/_helperJsx/ItemRequest';

const initData = {
  requestDate: '',
  validTill: '',
  dueDate: '',
  referenceId: '',
  item: '',
  quantity: '',
  remarks: '',
};

export default function ViewItemRequestForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);

  const [singleData, setSingleData] = useState({});

  useEffect(() => {
    getSingleData(id, setSingleData);
  }, [id]);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <div className="purchaseInvoice">
      <ICustomCard
        title="View Item Request"
        backHandler={() => {
          history.goBack();
        }}
        renderProps={() => {}}
      >
        <Form
          initData={id ? singleData[0] : initData}
          disableHandler={disableHandler}
          singleData={singleData}
        />
      </ICustomCard>
    </div>
  );
}
