/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  getMenu_action,
  getUserRoleAction,
  passwordExpiredAndForceLogoutAction,
  setIsExpiredTokenActions,
} from "../../../../../app/modules/Auth/_redux/Auth_Actions";
import { HubConnectionBuilder } from "@microsoft/signalr";

import Axios from "axios";
import { redirectToIbosRegister } from "./helper";
import { setCookie } from "../../../../../app/modules/_helper/_cookie";
export function AsideMenuList({ layoutProps }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const getMenuItemActive = (url) => {
    return checkIsActive(location, url)
      ? " menu-item-active menu-item-open "
      : "";
  };

  const { profileData, menu, isAuth, email, tokenData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );

  const [connection, setConnection] = useState(null);

  useEffect(() => {
    dispatch(getMenu_action(profileData?.userId));
  }, [profileData]);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://signal.peopledesk.io/NotificationHub")
      .withAutomaticReconnect()
      .build();
    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on(`sendToGlobalAllOnlyForERPControls`, (data) => {
            console.log("sig");
            dispatch(getMenu_action(profileData?.userId));
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  useEffect(() => {
    dispatch(getUserRoleAction(profileData?.userId));
    dispatch(passwordExpiredAndForceLogoutAction(profileData?.loginId));
  }, []);

  // Add a request interceptor
  Axios.interceptors.request.use(
    function(config) {
      return config;
    },
    function(error) {
      if (
        error?.response?.data?.message ===
        "No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions)."
      ) {
        dispatch(setIsExpiredTokenActions(true));
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    }
  );

  // Add a response interceptor
  Axios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      if (
        error?.response?.data?.message ===
        "No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions)."
      ) {
        dispatch(setIsExpiredTokenActions(true));
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    }
  );

  let history = useHistory();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        {/* <li
          className={`menu-item ${getMenuItemActive("/dashboard")}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">DASHBOARD</span>
          </NavLink>
        </li> */}
        {/*end::1 Level*/}

        {/* Material-UI */}
        {/*begin::1 Level*/}
        {/*begin:: Performance Management*/}

        {menu?.map((menuOne, index) => (
          <>
            {/* {index === 0 ? (
              <li
                className={`menu-item ${getMenuItemActive("/dashboard")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/dashboard">
                  <span className="svg-icon menu-icon">
                    <SVG src={toAbsoluteUrl(toAbsoluteUrl(menuOne?.icon))} />
                  </span>
                  <span className="menu-text">DASHBOARD</span>
                </NavLink>
              </li>
            ) : (
              
            )} */}
            {/* <li
                key={index}
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  menuOne?.to
                )} ${selectedBusinessUnit?.value === 184 &&
                  menuOne?.id === 8 &&
                  "d-none"}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              > */}
            <li
              key={index}
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                menuOne?.to
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to={menuOne?.to}>
                <span className="svg-icon menu-icon">
                  {/* {index === 0 ? (
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/iBOS/Dashboard.svg")}
                  />
                ) : (
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")}
                  />
                )} */}

                  <SVG src={toAbsoluteUrl(menuOne?.icon)} />
                </span>
                <span
                  onClick={() => {
                    if (menuOne?.id === 27) {
                      setCookie(
                        "loginInfoRegister",
                        JSON.stringify({
                          isAuth,
                          email,
                          tokenData,
                          buId: selectedBusinessUnit?.value,
                        }),
                        100
                      );

                      setTimeout(() => {
                        redirectToIbosRegister();
                      });
                    }
                  }}
                  className="menu-text"
                >
                  {" "}
                  {menuOne?.label}{" "}
                </span>
                <i className="menu-arrow" />
              </NavLink>
              <div className="menu-submenu ">
                <i className="menu-arrow" />
                <ul className="menu-subnav">
                  <li
                    className="menu-item  menu-item-parent"
                    aria-haspopup="true"
                  >
                    <span className="menu-link">
                      <span className="menu-text"> {menuOne?.label} </span>
                    </span>
                  </li>

                  {/* Inputs */}
                  {/*begin::2 Level*/}
                  {menuOne?.subs?.map((menuTwo, index) => (
                    <li
                      key={index}
                      className={`menu-item menu-item-submenu ${getMenuItemActive(
                        menuTwo?.to
                      )}`}
                      aria-haspopup="true"
                      data-menu-toggle="hover"
                    >
                      <NavLink
                        className="menu-link menu-toggle"
                        to={menuTwo?.to}
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span
                          className="menu-text"
                          onClick={() => {
                            if (menuTwo?.label === "DashBoard") {
                              history.push(`/mngVat/cnfg-vat/dashboard`);
                            } else if (menuTwo?.label === "Turnover Tax") {
                              history.push(`/mngVat/turnoverTax`);
                            }
                            if (!menuTwo?.isSecondLabel) {
                              history.push(menuTwo?.to);
                            }
                          }}
                        >
                          {menuTwo?.label}{" "}
                        </span>
                        {menuTwo?.isSecondLabel && <i className="menu-arrow" />}
                      </NavLink>
                      <div className="menu-submenu ">
                        <i className="menu-arrow" />
                        <ul className="menu-subnav">
                          {/*begin::3 Level*/}
                          {menuTwo?.nestedSubs?.map((menuThree, index) => (
                            <li
                              key={index}
                              className={`menu-item  ${getMenuItemActive(
                                menuThree?.to
                              )}`}
                              aria-haspopup="true"
                            >
                              <NavLink className="menu-link" to={menuThree?.to}>
                                <i className="menu-bullet menu-bullet-dot">
                                  <span />
                                </i>
                                <span className="menu-text">
                                  {menuThree?.label}
                                </span>
                              </NavLink>
                            </li>
                          ))}
                          {/*end::3 Level*/}
                        </ul>
                      </div>
                    </li>
                  ))}
                  {/*end::2 Level*/}
                </ul>
              </div>
            </li>
          </>
        ))}
        {/*end::1 Level*/}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
