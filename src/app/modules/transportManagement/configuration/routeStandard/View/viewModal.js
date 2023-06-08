/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IForm from "../../../../_helper/_form";
import Form from "./form";

import { GetRouteStandardCostDetails_api } from "../helper";
import Loading from './../../../../_helper/_loading';

const initData = {
  id: undefined,
  transportOrganizationName: "",
  routeName: "",
  itemLists: [],
};

export default function RouteStandardViewModal({ landingData, type }) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const tableDataGetFunc = (orgId, routeId, setFieldValue, id) => {
    GetRouteStandardCostDetails_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      orgId,
      routeId,
      setFieldValue,
      id,
      setDisabled
    );
  };

  useEffect(() => {
    if ( landingData?.transportOrganizationId && landingData?.routeId) {
      tableDataGetFunc(
        landingData?.transportOrganizationId,
        landingData?.routeId,
        setSingleData,
        0
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ landingData]);

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title='View Route Cost Setup'
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenSave={type === "view"}
      isHiddenReset={type === "view"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={landingData ? singleData : initData}
        // disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={landingData}
        type={type}
      />
    </IForm>
  );
}
