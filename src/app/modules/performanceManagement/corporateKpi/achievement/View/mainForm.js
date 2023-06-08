import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { getTargetAction, saveAchievementAction } from "../_redux/Actions";
import { toArray } from "lodash";

const initData = {};

export default function ViewForm({ currentItem }) {
  const [isDisabled, setDisabled] = useState(false);

  const {
    kpiId,
    frId,
    year,
    enroll,
    selectedYear,
    kpi,
    objective,
    setReport,
  } = currentItem;

  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      target: state.corporatePmsAchievement?.target,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit, target } = storeData;
  const [rowDto, setRowDto] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    if (kpiId && frId && year) {
      dispatch(getTargetAction(kpiId, frId, year));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kpiId, frId, year]);

  const saveHandler = async (values, cb) => {
    const data = toArray(rowDto)?.map((itm, index) => ({
      ...itm,
      numAchivment: parseFloat(itm.numAchivment) || 0,
      remarks: itm?.remarks,
    }));
    dispatch(saveAchievementAction({ data: data, cb }));
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
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
    <IForm title={""} getProps={setObjprops} isDisabled={isDisabled}>
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        target={target}
        rowDtoHandler={rowDtoHandler}
        rowDto={rowDto}
        enroll={enroll}
        selectedYear={selectedYear}
        kpi={kpi}
        objective={objective}
        setReport={setReport}
      />
    </IForm>
  );
}
