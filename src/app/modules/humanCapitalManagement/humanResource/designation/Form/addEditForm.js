/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveDesignation,
  saveEditDesignation,
  getDesignationByIdAction,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";

const initData = {
  id: undefined,
  designationCode: "",
  designationName: "",
  remarks: "",
};

export function DesignationAddForm({
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

  const singleData = useSelector((state) => {
    return state.department?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(
        getDesignationByIdAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          id
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          designationId: +id,
          designationCode: values.designationCode,
          designationName: values.designationName,
          remarks: values.remarks,
          actionBy: profileData.userId,
        };
        dispatch(saveEditDesignation(payload));
      } else {
        const payload = {
          designationCode: values.designationCode,
          designationName: values.designationName,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          remarks: values.remarks,
          actionBy: profileData.userId,
          lastActionDateTime: "2020-08-25T14:13:33.546Z",
        };

        dispatch(saveDesignation({ data: payload, cb }));
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
    <IForm
      title="Create Designation"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
          accountId={profileData?.accountId}
          businessUnit={selectedBusinessUnit.label}
          isEdit={id || false}
        />
      </div>
    </IForm>
  );
}
