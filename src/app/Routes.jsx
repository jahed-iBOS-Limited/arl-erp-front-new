import { HubConnectionBuilder } from '@microsoft/signalr';
import { default as Axios, default as axios } from 'axios';
import React, { useEffect, useState, lazy } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../_metronic/_partials/dashboards/formContainer';
import { Layout } from '../_metronic/layout';
import BasePage from './BasePage';
import { publicRouteList } from './PublicRoutes';
import TokenExpiredPopUp from './TokenExpiredPopUp';
import { Logout } from './modules/Auth';
import * as requestFromServer from './modules/Auth/_redux/Auth_Api';
import { authSlice } from './modules/Auth/_redux/Auth_Slice';
import { LoginPage2 } from './modules/Auth/pages/loginPage2/AuthPage';
import { getCookie } from './modules/_helper/_cookie';
import {
  getOID_Action,
  getShippointDDLCommon_action,
} from './modules/_helper/_redux/Actions';
import {
  setNotifyCountAction,
  setSignalRConnectionAction,
} from './modules/_helper/chattingAppRedux/Action';
import ErrorsPage from './pages/ErrorsExamples/ErrorsPage';
import { clearLocalStorageAction } from './modules/_helper/reduxForLocalStorage/Actions';

const DepartmentalBalancedScorecard = lazy(
  () =>
    import(
      './modules/performanceManagement/departmentalKpi/balancedScore/Table/DepartmentalBalancedScorecard'
    )
);
const KPIScoreCardNew = lazy(
  () =>
    import(
      './modules/performanceManagement/individualKpi/balancedScore/Table/KPIScoreCardNew'
    )
);
const SBUBalancedScorecard = lazy(
  () =>
    import(
      './modules/performanceManagement/sbuKpi/balancedScore/Table/SBUBalancedScorecard'
    )
);
const Maintenance = lazy(() => import('./pages/Maintenance'));

export function Routes() {
  const [isMaintenance, setMaintenance] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const isAuthorized = useSelector((state) => {
    return state.authData.isAuth;
  }, shallowEqual);

  const authData = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const { token } = useSelector(
    (state) => state?.authData.tokenData,
    shallowEqual
  );
  const { profileData, selectedBusinessUnit, isExpiredPassword } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );
  const connection = useSelector(
    (state) => state?.chattingApp?.signalRConnection,
    shallowEqual
  );

  const notifyCount = useSelector(
    (state) => state?.chattingApp?.notifyCount,
    shallowEqual
  );

  const { actions } = authSlice;
  Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      dispatch(
        getShippointDDLCommon_action(
          profileData?.userId,
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(getOID_Action(profileData?.employeeId));
    }
  }, [profileData, selectedBusinessUnit]);

  // ======for peopleDesk user=====
  useEffect(() => {
    const loginInfoPeopleDesk = getCookie('loginInfoPeopleDesk');
    let info = JSON.parse(loginInfoPeopleDesk || '{}');

    // invalid user check for peopleDesk
    if (info?.isAuth && info?.email && profileData?.emailAddress) {
      if (profileData?.emailAddress !== info?.email) {
        if (window.location.origin === 'https://erp.peopledesk.io') {
          toast.error('Invalid User');
          dispatch(actions.LogOut());
          dispatch(clearLocalStorageAction());
          setTimeout(() => {
            window.location.reload();
          }, 500); // For clear profileData from redux properly
        }
      }
    }
    // if new user than login  "peopleDesk to erp" than login info and business unit set
    if (info?.isAuth && !selectedBusinessUnit?.value) {
      dispatch(
        actions.LoginFetched({
          isAuth: info?.isAuth,
          tokenData: {
            token: info?.tokenData,
          },
        })
      );
      Axios.defaults.headers.common['Authorization'] =
        `Bearer ${info?.tokenData}`;
      requestFromServer
        .profileAPiCall(info?.email)
        .then((res) => {
          dispatch(actions.ProfileFetched(res));
          dispatch(actions.setPeopledeskApiURL(info?.peopledeskApiURL || ''));
          connectionHub(info?.peopledeskApiURL);
          const data = res?.data?.[0];
          if (data?.accountId && data?.userId) {
            requestFromServer
              .getBuPermission(data?.userId, data?.accountId)
              .then((res) => {
                const findBu = res?.data?.find(
                  (item) =>
                    item?.organizationUnitReffId === info?.peopleDeskBuId
                );
                if (findBu) {
                  if (
                    selectedBusinessUnit?.value !==
                    findBu?.organizationUnitReffId
                  ) {
                    dispatch(
                      actions.SetBusinessUnit({
                        ...findBu,
                        value: findBu?.organizationUnitReffId,
                        label: findBu?.organizationUnitReffName,
                        address: findBu?.businessUnitAddress,
                        imageId: findBu?.image,
                        isReload: true,
                      })
                    );
                  }
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch(actions.LogOut());
        });
    }
    // if is not auth then redirect to peopledesk login page
    if (!info?.isAuth) {
      if (window.location.origin === 'https://erp.peopledesk.io') {
        dispatch(actions.LogOut());
        window.location.href = 'https://arl.peopledesk.io';
      }
    }
  }, []);

  useEffect(() => {
    const GetAppVersion_api = async () => {
      try {
        const res = await Axios.get(`/hcm/Basic/GetAppVersion`);
        if (res?.data?.isAppUnderMaintenance) {
          setMaintenance(true);
        }
      } catch (error) {
        // history.push("/maintenance");
      }
    };
    GetAppVersion_api();
  }, []);

  // ===============Notification ===============
  const employeeId = profileData?.employeeId;
  const signalR_KEY = 'iBOS__' + window.location.origin;
  const orgId = profileData?.accountId;

  const notify_KEY = signalR_KEY + '__notify_' + orgId + '_' + employeeId;
  const connectionHub = async (peopledeskApiURL) => {
    const notifyRes = await axios.get(
      `${peopledeskApiURL}/Notification/GetNotificationCountErp?employeeId=${employeeId}&accountId=${orgId}`
    );
    dispatch(setNotifyCountAction(notifyRes?.data));
    const connectionHub = new HubConnectionBuilder()
      .withUrl('https://signal.peopledesk.io/NotificationHub')
      .withAutomaticReconnect()
      .build();
    if (connectionHub) {
      connectionHub.start().then(() => {
        dispatch(setSignalRConnectionAction(connectionHub));
      });
    }
  };
  useEffect(() => {
    if (connection) {
      connection.on(`sendTo_${notify_KEY}`, (count) => {
        dispatch(setNotifyCountAction(notifyCount + 1));
        if (count) {
          toast.info('A new notification has come!!', {
            autoClose: 2000,
            limit: 10,
            closeOnClick: true,
            newestOnTop: true,
          });
          if (document.hidden) {
            if (Notification.permission === 'granted') {
              new Notification(`New notification !!!`, {
                body: 'A new notification has come!!',
              });
            }
          }
        }
      });
    }
  }, [connection]);

  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };

    if (
      import.meta.env.MODE === 'production' &&
      window.location.origin !== 'https://deverp.ibos.io' &&
      window.innerWidth > 768
    ) {
      document.addEventListener('contextmenu', handleContextmenu);
    }
    return function cleanup() {
      document.removeEventListener('contextmenu', handleContextmenu);
    };
  }, []);

  // useEffect(() => {
  //   let interval = null;
  //   if (
  //     import.meta.NODE_ENV === 'production' &&
  //     window.location.origin !== 'https://deverp.ibos.io'
  //   ) {
  //     interval = setInterval(() => {
  //       if (!isOpen) {
  //         detectBrowserConsole(setIsOpen);
  //       }
  //     }, 500);
  //   }
  //   return () => {
  //     interval && clearInterval(interval);
  //   };
  // }, [isOpen]);

  // if (isOpen) {
  //   return <div></div>;
  // }

  return (
    <Switch>
      {/* Public route here.... */}
      {publicRouteList?.length > 0 &&
        publicRouteList.map((route, index) => (
          <Route
            key={index}
            exact={true}
            path={route.path}
            component={route.component}
          />
        ))}
      {/* ============== */}

      {isExpiredPassword && (
        <>
          <TokenExpiredPopUp isCancel={true} />
        </>
      )}
      {isMaintenance && <Maintenance />}
      {!isAuthorized ? (
        <Route>
          <LoginPage2 />
        </Route>
      ) : (
        <Redirect from="/auth" to="/" />
      )}

      <Route path="/error" component={ErrorsPage} />
      <Route path="/logout" component={Logout} />

      {/* to show individual kpi scorecard in blank page without base layout as fer as requirement..we have to set the route outside of the base layout */}
      {isAuthorized && (
        <Route path="/individual-kpi-scorecard" component={KPIScoreCardNew} />
      )}
      {isAuthorized && (
        <Route
          path="/departmental-balanced-scorecard"
          component={DepartmentalBalancedScorecard}
        />
      )}
      {isAuthorized && (
        <Route
          path="/sbu-balanced-scorecard"
          component={SBUBalancedScorecard}
        />
      )}

      {!isAuthorized ? (
        <Redirect to="/auth/login" />
      ) : !authData.haveBusinessUnit ? (
        <div>
          <div
            style={{
              backgroundImage:
                "url('http://localhost:3000/static/media/loginBg.c4628164.png')",
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              height: '100vh',
              width: '100vw',
              opacity: 0.8,
              zIndex: 2,
            }}
          >
            <FormContainer />
          </div>
        </div>
      ) : (
        <>
          <Layout>
            <BasePage />
          </Layout>
        </>
      )}
    </Switch>
  );
}
