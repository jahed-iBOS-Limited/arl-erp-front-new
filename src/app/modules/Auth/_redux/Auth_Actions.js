import * as requestFromServer from "./Auth_Api";
import { authSlice } from "./Auth_Slice";
import { toast } from "react-toastify";
import axios from "axios";
import { setCookie, setPeopledeskCookie } from "../../_helper/_cookie";
const { actions } = authSlice;

export const saveChatInfoAction = (email, name, accountId, userId) => (
  dispatch
) => {
  return requestFromServer
    .saveChatInfo(email, name, accountId, userId)
    .then((res) => {
      dispatch(actions.setChatInfo(res?.data));
    })
    .catch((error) => {
      console.log("Something went wrong");
    });
};

export const passwordExpiredAndForceLogoutAction = (email) => (dispatch) => {
  return requestFromServer
    .passwordExpiredAndForceLogout(email)
    .then((res) => {
      if (res?.data?.forceLogout) {
        dispatch(Logout());
      }
      dispatch(actions.setForceLogout(res?.data?.forceLogout));
      dispatch(actions.setExpiredPassword(res?.data?.isExpire));
    })
    .catch((error) => {});
};

export const passwordExpiredUpdateAction = (isExpired) => (dispatch) => {
  dispatch(actions.setExpiredPassword(isExpired));
};
export const setEmailAction = (email) => (dispatch) => {
  dispatch(actions.setEmail(email));
};

export const getUserRoleAction = (userId) => (dispatch) => {
  return requestFromServer
    .getUserRole(userId)
    .then((res) => {
      dispatch(actions.setUserRole(res?.data));
    })
    .catch((error) => {
      console.log("Something went wrong");
      dispatch(actions.setUserRole([]));
    });
};

export const otpSendAndVerify = async (
  token,
  setLoading,
  userId,
  type,
  otp,
  loginAction
) => {
  setLoading(true);
  axios({
    method: "get",
    url: `/fino/CommonFino/CheckTwoFactorApproval?OtpType=${type}&intUnitId=4&strTransectionType=Login&intTransectionId=${userId}&strCode=${"123"}&intActionById=${userId}&strOTP=${otp ||
      ""}&CancelType=1`,
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (response?.data?.status === 0) {
        setLoading(false);
        alert(response?.data?.message || "Try again");
        // toast.warn(response?.data?.message || "Try again")
        return null;
      }

      if (type === 2) {
        loginAction(true);
      }
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      if (type === 2) {
        toast.warn(error?.response?.data?.message || "Verification failed");
      }
    });
};

export const Login = (
  email,
  password,
  setLoading,
  cb,
  setIsOtp,
  isSkipOtp,
  setUserId,
  setToken
) => (dispatch) => {
  setLoading && setLoading(true);
  return (
    requestFromServer
      .loginApiCall(email, password)
      .then((response) => {
        if (response?.data?.isOTP && !isSkipOtp) {
          setToken(response?.data?.token);
          otpSendAndVerify(
            response?.data?.token,
            setLoading,
            response?.data?.userId,
            1
          );
          setIsOtp(true);
          setUserId(response?.data?.userId);
          setLoading && setLoading(false);
          return null;
        }
        dispatch(
          actions.LoginFetched({ isAuth: true, tokenData: response?.data })
        );
        setLoading && setLoading(false);

        if (cb) {
          cb();
        }
        if (isSkipOtp || !response?.data?.isOTP) {
          setLoading && setLoading(true);
          return requestFromServer.profileAPiCall(email).then((res) => {
            dispatch(actions.ProfileFetched(res));
            setLoading && setLoading(false);
            const { emailAddress, userId, accountId, userName } = res?.data[0];
            dispatch(
              saveChatInfoAction(emailAddress, userName, accountId, userId)
            );
          });
        }
      })
      // .then(() => {
      //   setLoading && setLoading(false);

      // })
      .catch((error) => {
        toast.error("Login Failed");
        error.clientMessage = "Can't find users";
        dispatch(actions.catchError());
        setLoading && setLoading(false);
      })
  );
};

// Logout user
export const Logout = () => (dispatch) => {
  setCookie("loginInfoRegister", JSON.stringify({}), 100);
  setPeopledeskCookie("loginInfoPeopleDesk", JSON.stringify({}), 100);
  return dispatch(actions.LogOut());
};

export const setIsExpiredTokenActions = (payload) => (dispatch) => {
  return dispatch(actions.setIsExpiredToken(payload));
};

export const setIsTokenActions = (payload) => (dispatch) => {
  return dispatch(actions.setIsToken(payload));
};

// Set business unit true
export const SetBusinessUnitTrue = () => (dispatch) => {
  return dispatch(actions.SetBusinessUnitTrue());
};

// Set business unit in dropdown
export const SetBusinessUnit = (v) => (dispatch) => {
  dispatch(actions.SetBusinessUnit(v));
};

export const setBuList = (userId, accountId, CB) => (dispatch) => {
  // dispatch(actions.startCall({ callType: callTypes.action }));
  requestFromServer.getBuPermission(userId, accountId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data.length) {
      let unitList = [];
      data &&
        data.forEach((item) => {
          let items = {
            ...item,
            value: item.organizationUnitReffId,
            label: item.organizationUnitReffName,
            address: item.businessUnitAddress,
            imageId: item?.image,
          };
          unitList.push(items);
        });
        CB && CB(unitList)
      dispatch(actions.SetBusinessUnitList(unitList));
    }
  });
};

// action for get Menu data
export const getMenu_action = (userId) => (dispatch) => {
  return requestFromServer
    .getMenu(userId)
    .then((res) => {
      const menuList = manuFilterFunc([...res.data]);
      return dispatch(actions.SetMenu(menuList));
    })
    .catch((err) => {
      console.log(err);
    });
};

const manuFilterFunc = (manuList) => {
  let menuList = [...manuList];
  const modifid = menuList.map((menuItem) => {
    // check if the vat menu is found
    const isVatMenuList = menuItem?.id === 11;
    if (isVatMenuList) {
      // Remove items with IDs 65,25,27, 32, 37, 38, 74 from the subs list
      menuItem.subs = menuItem?.subs?.filter((subItem) => {
        if ([65, 25, 27, 32, 37, 38, 74].includes(subItem?.id)) return false;
        // check if the report menu is found
        if (subItem?.id === 53) {
          // 53 is the id of the item you want to remove  from the subs list
          subItem.nestedSubs = subItem?.nestedSubs?.filter((subItem) => {
            // Remove items with IDs 670,338,299, 289, 288, 285, 284, 283, 282, 280, 274, 272, 270, 268 from the nestedSubs list
            if (
              [
                670,
                338,
                299,
                289,
                288,
                285,
                284,
                283,
                282,
                280,
                274,
                272,
                270,
                268,
              ].includes(subItem?.id)
            )
              return false;
            return subItem;
          });
        }
        // check if the sales menu is found
        if (subItem?.id === 26) {
          // 26 is the id of the item you want to remove  from the subs list
          subItem.nestedSubs = subItem?.nestedSubs?.filter((subItem) => {
            // Remove items with IDs 164, 111 from the nestedSubs list
            if ([164, 111].includes(subItem?.id)) return false;
            if (subItem?.id === 174) {
              subItem.label = "Sales Invoice";
            }
            return subItem;
          });
        }
        return subItem;
      });
      // menuItem subs list find index
    }
    return menuItem;
  });

  return modifid;
};
