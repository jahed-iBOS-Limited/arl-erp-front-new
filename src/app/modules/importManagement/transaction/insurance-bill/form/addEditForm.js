/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import Form from "./../../../../rtmManagement/configuration/calendarSetup/form/form";
const initData = {};

export default function AddEditFrom({
  history,
  match: {
    params: { pId },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [initDataForEdit, setInitDataForEdit] = useState({});

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setter = (values, setFieldValue) => {};

  const remover = (i) => {
    const filterData = rowDto.filter((item, index) => i !== index);
    setRowDto(filterData);
  };

  const saveHandler = (values, cb) => {};
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Insurance Bill"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        setter={setter}
        // warehouseList={warehouseList}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        history={history?.location?.state}
        pId={pId}
      />
    </IForm>
  );
}
