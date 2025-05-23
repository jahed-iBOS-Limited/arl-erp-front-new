import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PowerBIReport from '../../../_helper/commonInputFieldsGroups/PowerBIReport';

const KeyRegisterReportRDLC = () => {
  const reportId = `d9072454-1b74-422b-ac5c-d6ed0fa45572`;
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const parameterValues = () => {
    return [{ name: 'Bunit', value: selectedBusinessUnit?.value?.toString() }];
  };
  return (
    <PowerBIReport
      reportId={reportId}
      groupId={groupId}
      parameterValues={parameterValues()}
      parameterPanel={true}
    />
  );
};

export default KeyRegisterReportRDLC;
