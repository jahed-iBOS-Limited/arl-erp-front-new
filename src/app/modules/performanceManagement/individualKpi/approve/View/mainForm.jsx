/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import { getTargetAction, saveAchievementAction } from "../_redux/Actions";
import { toArray } from "lodash";

const initData = {};

export default function ViewForm() {
  const [isDisabled, setDisabled] = useState(false);
  const params = useParams();
  const { kpiId, frId, year, enroll } = params;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kpiId, frId, year]);

  const saveHandler = async (values, cb) => {
    const data = toArray(rowDto)?.map((itm, index) => ({
      ...itm,
      numAchivment: parseFloat(itm.numAchivment) || 0,
      approvedBy: profileData?.userId,
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
        getTarget={getTarget}
      />
    </IForm>
  );
}
