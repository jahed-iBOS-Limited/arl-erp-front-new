/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveEditedPGI,
  getPGIById,
  setPGISingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";

const initData = {
  id: undefined,
  PGICode: "",
  PGIName: "",
  responsiblePerson: "",
};

export default function PGIForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get emplist ddl from store
  const empDDL = useSelector((state) => {
    return state?.pgi?.empDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.pgi?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getPGIById(id));
    } else {
      dispatch(setPGISingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          PGIId: +id,
          PGICode: values.PGICode,
          PGIName: values.PGIName,
          responsiblePerson: values?.responsiblePerson?.value,
          actionBy: profileData.userId,
          businessUnitId: selectedBusinessUnit.value,
          accountId: profileData.accountId,
        };
        dispatch(saveEditedPGI(payload));
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm title="Create PGI" getProps={setObjprops} isDisabled={isDisabled}>
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        empDDL={empDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
