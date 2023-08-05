import Axios from "axios";
import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from "../_metronic/layout";
import FormContainer from "../_metronic/_partials/dashboards/formContainer";
import BasePage from "./BasePage";
import { Logout } from "./modules/Auth";
import { LoginPage2 } from "./modules/Auth/pages/loginPage2/AuthPage";
import DepartmentalBalancedScorecard from "./modules/performanceManagement/departmentalKpi/balancedScore/Table/DepartmentalBalancedScorecard";
import KPIScoreCardNew from "./modules/performanceManagement/individualKpi/balancedScore/Table/KPIScoreCardNew";
import SBUBalancedScorecard from "./modules/performanceManagement/sbuKpi/balancedScore/Table/SBUBalancedScorecard";
import { serviceWorkerPoppup } from "./modules/_helper/serviceWorkerPoppup";
import { getOID_Action, getShippointDDLCommon_action } from "./modules/_helper/_redux/Actions";
import ErrorsPage from "./pages/ErrorsExamples/ErrorsPage";
import Maintenance from "./pages/Maintenance";
import TokenExpiredPopUp from "./TokenExpiredPopUp";
import * as requestFromServer from "./modules/Auth/_redux/Auth_Api";
import { authSlice } from "./modules/Auth/_redux/Auth_Slice";
import { getCookie } from "./modules/_helper/_cookie";

export function Routes() {

  const [isMaintenance, setMaintenance] = useState(false);
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


  const { actions } = authSlice;
  Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  serviceWorkerPoppup();
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
      dispatch(getOID_Action(profileData?.employeeId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // ======for peopleDesk user=====
  useEffect(() => {
    const loginInfoPeopleDesk = getCookie("loginInfoPeopleDesk")
    let info = JSON.parse(loginInfoPeopleDesk || "{}");
    if (info?.isAuth) {
      dispatch(
        // actions.LoginFetched(info)
        actions.LoginFetched({
          isAuth: info?.isAuth,
          tokenData: {
            token: info?.tokenData
          }
        })
      );
      if (info?.isAuth) {
        Axios.defaults.headers.common["Authorization"] = `Bearer ${info?.tokenData}`;
        requestFromServer.profileAPiCall(info?.email).then((res) => {
          dispatch(actions.ProfileFetched(res));
        }).catch(error => {
          console.log(error)
          dispatch(actions.LogOut())
        });
      }
    } else {
      if (window.location.origin === "https://erp.peopledesk.io") {
        dispatch(actions.LogOut());
        window.location.href = "https://arl.peopledesk.io"
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Switch>
      {isExpiredPassword && (
        <>
          <TokenExpiredPopUp isCancel={true} />
        </>
      )}
      {isMaintenance && <Maintenance />}
      {/* <Route path="/maintenance" component={Maintenance} /> */}
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
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "100vh",
              width: "100vw",
              opacity: 0.8,
              zIndex: 2,
            }}
          >
            <FormContainer />
          </div>
        </div>
      ) : (
        <Layout>
          <BasePage />
        </Layout>
      )}
    </Switch>
  );
}
