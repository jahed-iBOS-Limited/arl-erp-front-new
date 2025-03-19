import React from 'react';

import { shallowEqual, useSelector } from 'react-redux';
import ICustomCard from '../../../../_helper/_customCard';
import HeaderForm from './Landing/form';

export default function ShippingRFQLanding() {

  // eslint-disable-next-line no-unused-vars
  const {profileData, selectedBusinessUnit} = useSelector(
    (state) => state.authData,
    shallowEqual
  );


  return (
    <div style={{ height: "100%"}} className="purchase-order">
      <ICustomCard
        title="Request For Quotation"
      >
        <HeaderForm />
      </ICustomCard>
    </div>
  )
}
