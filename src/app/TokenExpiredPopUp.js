import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  getMenu_action,
  getUserRoleAction,
  Login,
  Logout,
  passwordExpiredUpdateAction,
  setBuList,
} from './modules/Auth/_redux/Auth_Actions';

import axios from 'axios';
import BlackLogo from './logo/logoBlack.png';
import Loading from './modules/_helper/_loading';
import { clearLocalStorageAction } from './modules/_helper/reduxForLocalStorage/Actions';

const TokenExpiredPopUp = ({ isCancel }) => {
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const profileData = useSelector(
    (state) => state?.authData?.profileData,
    shallowEqual,
  );

  const { isExpiredPassword, email } = useSelector(
    (state) => state?.authData,
    shallowEqual,
  );
  // let isExpiredPassword = true;

  const errorColor = useSelector(
    (state) => state?.authData?.msg?.color,
    shallowEqual,
  );

  const updatePassword = async () => {
    try {
      await axios.put(`/domain/Information/Basic`, {
        userId: profileData?.loginId || email,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      dispatch(passwordExpiredUpdateAction(false));
    } catch (error) {
      alert('Failed, please try again');
    }
  };

  const cb = () => {
    dispatch(getUserRoleAction(profileData?.userId));
    dispatch(setBuList(profileData?.userId, profileData?.accountId));
    dispatch(getMenu_action(profileData?.userId));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isExpiredPassword) {
      if (!oldPassword || !newPassword || !confirmPassword)
        return alert('All fields are required');

      if (newPassword?.length < 6)
        return alert('Password should be atleast six character');

      if (confirmPassword !== newPassword)
        return alert('Confirm password does not match');
      updatePassword();
    } else {
      dispatch(Login(profileData?.emailAddress, password, setLoading, cb));
    }
  };
  useEffect(() => {
    setTimeout(() => {
      if (document.querySelector("div[tabindex='-1']")) {
        document
          .querySelector("div[tabindex='-1']")
          .removeAttribute('tabindex');
      }
    }, 5000);
  }, []);

  return (
    <div className="token-expired">
      {loading && <Loading />}
      <div className="expired-content">
        <img src={BlackLogo} alt="iBOS Logo" />
        <form className="expired-form" onSubmit={(e) => submitHandler(e)}>
          {!isExpiredPassword && (
            <>
              {errorColor === 'error' && (
                <p className="text-danger">Login Failed</p>
              )}
            </>
          )}

          {isExpiredPassword ? (
            <p className="text-left">
              Your password has expired. <br /> Please change password to
              continue
            </p>
          ) : (
            <p className="text-left">
              Your session has expired. <br /> Please confirm password to
              continue
            </p>
          )}

          {isExpiredPassword ? (
            <>
              <p className="text-left mb-0 mt-1">Old Password</p>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mb-1"
              />
              <p className="text-left mb-0">New Password</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-1"
              />
              <p className="text-left mb-0">Confirm Password</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-4"
              />
              <div className="d-flex">
                <button
                  style={{ maxWidth: '50%' }}
                  className="mr-1 btn btn-primary w-100 d-block"
                  type="submit"
                >
                  Update
                </button>
                {isCancel ? (
                  <button
                    style={{ maxWidth: '50%' }}
                    className="btn btn-primary w-100 d-block"
                    type="button"
                    onClick={() => {
                      dispatch(passwordExpiredUpdateAction(false));
                    }}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    style={{ maxWidth: '50%' }}
                    className="btn btn-primary w-100 d-block"
                    type="button"
                    onClick={() => {
                      dispatch(Logout());
                      dispatch(clearLocalStorageAction());
                    }}
                  >
                    Logout
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-left">Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="d-flex">
                <button
                  style={{ maxWidth: '50%' }}
                  className="mr-1 btn btn-primary w-100 d-block"
                  type="submit"
                >
                  Confirm password
                </button>
                <button
                  style={{ maxWidth: '50%' }}
                  className="btn btn-primary w-100 d-block"
                  type="button"
                  onClick={() => {
                    dispatch(Logout());
                    dispatch(clearLocalStorageAction());
                  }}
                >
                  Logout
                </button>
              </div>
              <p style={{ fontSize: '12px' }} className="mt-3">
                Tip: This password confirmation is for your security. We won’t
                ask for your password again for one hour
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default TokenExpiredPopUp;
