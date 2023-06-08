/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveEditDepartment,
  getDepartmentDDLAction,
  getDepartmentByIdAction,
  saveDepartment,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";

const initData = {
  id: undefined,
  departmentName: "",
  departmentCode: "",
  remarks: "",
};

export function DepartmentAddForm({
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
        getDepartmentByIdAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          id
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getDepartmentDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          departmentId: +id,
          departmentCode: values.departmentCode,
          departmentName: values.departmentName,
          remarks: values.remarks,
          actionBy: profileData.userId,
        };
        dispatch(saveEditDepartment(payload));
      } else {
        const payload = {
          departmentCode: values.departmentCode,
          departmentName: values.departmentName,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          remarks: values.remarks,
          actionBy: profileData.userId,
          lastActionDateTime: "2020-08-25T14:13:33.546Z",
          isActive: true,
        };

        dispatch(saveDepartment({ data: payload, cb }));
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
      title="Create Department"
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
