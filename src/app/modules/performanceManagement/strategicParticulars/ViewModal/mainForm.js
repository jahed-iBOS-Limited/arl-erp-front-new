/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import { useParams } from "react-router-dom";
import { getStrObjListAction, getStrTargetAction } from "../_redux/Actions";
import IForm from "../../../_helper/_form";

const initData = {};

export default function StrViewForm() {
  const [isDisabled, setDisabled] = useState(false);

  const dispatch = useDispatch();
  const params = useParams();
  const { strId, strTypeId } = params;

  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      strObjList: state.strategicParticularsTwo.strObjList,
      strTarget: state.strategicParticularsTwo.strTarget,
    };
  }, shallowEqual);

  const {
    profileData,
    selectedBusinessUnit,
    strObjList,
    strTarget,
  } = storeData;

  useEffect(() => {
    dispatch(getStrObjListAction(strTypeId, strId));
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strTypeId, strId]);

  useEffect(() => {
    dispatch(getStrTargetAction(11, strId));
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strId]);

  const [rowDto, setRowDto] = useState({});

  const saveHandler = async (values, cb) => {
    // const data = toArray(rowDto)?.map((itm, index) => ({
    //   ...itm,
    //   numAchivment: parseFloat(itm.numAchivment) || 0,
    // }));
    // // dispatch(saveAchievementAction({ data: data, cb }));
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  useEffect(() => {
    setRowDto([...strTarget]);
  }, [strTarget]);

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
    <IForm
      title="Strategic Plan"
      getProps={setObjprops}
      isDisabled={isDisabled}
      classes="str-ach-view-card"
    >
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDtoHandler={rowDtoHandler}
        rowDto={rowDto}
        strObjList={strObjList}
        strTarget={strTarget}
      />
    </IForm>
  );
}
