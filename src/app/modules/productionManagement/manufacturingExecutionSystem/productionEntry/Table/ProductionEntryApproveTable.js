import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ICustomCard from '../../../../_helper/_customCard';
import { GetMESConfigurationBusinessUnitWiseByAccountId } from '../helper';
import { ProductionEntryApproveRow } from './ProductionEntryApproveRow';

export default function ProductionEntryApproveTable() {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [data, setData] = useState({});

  useEffect(() => {
    GetMESConfigurationBusinessUnitWiseByAccountId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setData,
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <ICustomCard title="Production Entry Approve">
      <ProductionEntryApproveRow
        dataForBackCalculationCheck={data}
      ></ProductionEntryApproveRow>
    </ICustomCard>
  );
}
