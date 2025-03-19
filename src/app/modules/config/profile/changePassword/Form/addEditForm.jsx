/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { savePasswordUpdate_Action } from "./../_redux/Actions";
import { Logout } from "../../../../Auth/_redux/Auth_Actions";
import { clearLocalStorageAction } from './../../../../_helper/reduxForLocalStorage/Actions';

const initData = {
  id: undefined,
  oldPassword: "",
  newPassword: "",
  confirmPassowrd: "",
};

export default function ChangePassWordForm({ history }) {
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});
  const [showpassword, SetShowpassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassowrd: false,
  });

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const dispatch = useDispatch();
  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      dispatch(
        savePasswordUpdate_Action(
          profileData.loginId,
          values.oldPassword,
          values.confirmPassowrd,
          cb
        )
      );
    } else {
      setDisabled(false);
      
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const logoutClick = () => {
    dispatch(Logout());
    dispatch(clearLocalStorageAction())
    history.push("/logout");
  };

  const showPasswordHandler = (value) => {
    if (value === "oldPassword") {
      const oldPassword = { ...showpassword };
      oldPassword.oldPassword = !oldPassword.oldPassword;
      SetShowpassword(oldPassword);
    }
    if (value === "newPassword") {
      const newPassword = { ...showpassword };
      newPassword.newPassword = !newPassword.newPassword;
      SetShowpassword(newPassword);
    }
    if (value === "confirmPassowrd") {
      const confirmPassowrd = { ...showpassword };
      confirmPassowrd.confirmPassowrd = !confirmPassowrd.confirmPassowrd;
      SetShowpassword(confirmPassowrd);
    }
  };

  return (
    <div className="change_new_password">
      <IForm
        title="Change New Password"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
          logoutClick={logoutClick}
          showPasswordHandler={showPasswordHandler}
          showpassword={showpassword}
        />
      </IForm>
    </div>
  );
}
