/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Select from "react-select";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { isObject } from "lodash";
import { useHistory } from "react-router-dom";
import {
  SetBusinessUnit,
  setBuList,
} from "../../../../../app/modules/Auth/_redux/Auth_Actions";
import { clearLocalStorageAction } from "../../../../../app/modules/_helper/reduxForLocalStorage/Actions";
import {
  getCookie,
  setCookie,
} from "../../../../../app/modules/_helper/_cookie";

export default function SelectUnit() {
  const dispatch = useDispatch();
  let history = useHistory();
  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get selected business unit list from store
  const buList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  useEffect(() => {
    if (isObject(profileData) && Object.keys(profileData).length) {
      const { userId, accountId } = profileData;
      dispatch(
        setBuList(userId, accountId, (resData) => {
          if (!selectedBusinessUnit?.value && resData?.length > 0) {
            dispatch(SetBusinessUnit(resData[0]));
          }
        })
      );
    }
  }, [profileData]);

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 30,
      minWidth: 220,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      marginTop: "-5px",
    }),
    placeholder: (defaultStyles) => ({
      ...defaultStyles,
      top: "41%",
    }),
    singleValue: (defaultStyles) => ({
      ...defaultStyles,
      top: "45%",
    }),
  };

  return (
    <div>
      <Select
        options={buList}
        components={{
          IndicatorSeparator: () => null,
        }}
        styles={customStyles}
        value={selectedBusinessUnit || (buList && buList[0])}
        defaultValue={selectedBusinessUnit || (buList && buList[0])}
        placeholder='Select Unit'
        onChange={(valueOption) => {
          dispatch(SetBusinessUnit(valueOption));
          
          const loginInfoPeopleDesk = getCookie("loginInfoPeopleDesk");
          let info = JSON.parse(loginInfoPeopleDesk || "{}");
          if (info?.isAuth) {
            console.log('info', info)
            setCookie(
              "loginInfoPeopleDesk",
              JSON.stringify({
                ...info,
                peopleDeskBuId: valueOption.value,
              }),
              100
            );
          }

          dispatch(clearLocalStorageAction());
          history.push({
            pathname: `/`,
          });
        }}
      />
    </div>
  );
}
