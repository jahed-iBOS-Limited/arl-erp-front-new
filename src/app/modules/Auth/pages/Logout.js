import React from "react";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { useSelector, shallowEqual } from "react-redux";

export default function Logout() {
  const isAuth = useSelector(
    (state) => {
      return state.authData.isAuth
    },
    shallowEqual

  );
  return (
    <div>
      {!isAuth ? <LayoutSplashScreen /> : <Redirect to="/auth/login" />}
    </div>
  )
}

