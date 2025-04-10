import { toArray } from 'lodash';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import IForm from '../../../_helper/_form';
import { getTargetAction, saveAchievementAction } from '../_redux/Actions';
import Form from './form';
import { getEmployeeApproveAndActiveByKPIId } from './helper';

export default function ViewForm({ currentItem }) {
  const [isDisabled, setDisabled] = useState(false);
  const { kpiId, frId, year, enroll, selectedYear, kpi, objective, setReport } =
    currentItem;

  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      target: state.indPmsAchievement?.target,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit, target } = storeData;
  const [rowDto, setRowDto] = useState({});

  const dispatch = useDispatch();

  const getTarget = () => {
    if (kpiId && frId && year) {
      dispatch(getTargetAction(kpiId, frId, year));
    }
  };

  useEffect(() => {
    getTarget();
  }, [kpiId, frId, year]);

  useEffect(() => {
    if (kpiId) {
      getEmployeeApproveAndActiveByKPIId(kpiId, setDisabled);
    }
  }, [kpiId]);

  const saveHandler = async (values, cb) => {
    const data = toArray(rowDto)?.map((itm, index) => ({
      ...itm,
      documentString:
        itm?.documentString || target?.objRow?.[index]?.documentString,
      numAchivment:
        itm.numAchivment >= 0 || itm.numAchivment <= 0
          ? parseFloat(itm.numAchivment)
          : target?.objRow?.[index]?.achivment,
      remarks: itm?.remarks,
    }));

    dispatch(saveAchievementAction({ data: data, cb }));
  };

  const rowDtoHandler = (name, value, sl, rowId) => {
    setRowDto({
      ...rowDto,
      [sl]: {
        ...rowDto[sl],
        [name]: value,
        rowId: rowId,
      },
    });
  };

  const [objProps, setObjprops] = useState({});
  return (
    <IForm title={''} getProps={setObjprops} isDisabled={isDisabled}>
      <Form
        {...objProps}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        target={target}
        rowDtoHandler={rowDtoHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        enroll={enroll}
        getTarget={getTarget}
        selectedYear={selectedYear}
        kpi={kpi}
        objective={objective}
        setReport={setReport}
      />
    </IForm>
  );
}
