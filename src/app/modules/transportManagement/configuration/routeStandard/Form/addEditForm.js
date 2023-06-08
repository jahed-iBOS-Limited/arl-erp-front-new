/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation } from "react-router-dom";
import {
  createRouteStandardCost,

  GetRouteStandardCostDetails_api,
} from "../helper";

const initData = {
  id: undefined,
  transportOrganizationName: "",
  routeName: "",
  itemLists: [],
};

export default function RouteStandardForm({
  history,
  match: {
    params: { id, type },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");
  const { state: landingData } = useLocation();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = values?.itemLists?.map((itm) => ({
        standardCostId: itm?.standardCostId || 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        transportOrganizationId: itm?.transportOrganizationId || 0,
        businessTransactionId: itm?.businessTransactionId || 0,
        routeId: itm?.routeId || 0,
        transportRouteCostComponentId: itm?.transportRouteCostComponentId || 0,
        amount: +itm?.amount || 0,
        actionBy: profileData?.userId,
      }));
      createRouteStandardCost(payload, cb, setDisabled, id);
    } else {
      setDisabled(false);
    }
  };
  const [objProps, setObjprops] = useState({});

  const tableDataGetFunc = (orgId, routeId, setFieldValue, id) => {
    GetRouteStandardCostDetails_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      orgId,
      routeId,
      setFieldValue,
      id,
      isDisabled
    );
  };

 useEffect(() => {
    if (id && landingData?.transportOrganizationId && landingData?.routeId) {
      tableDataGetFunc(
        landingData?.transportOrganizationId,
        landingData?.routeId,
        setSingleData,
        id
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, landingData]);

  return (
    <IForm
      title='Create Route Cost Setup'
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={type === "view"}
      isHiddenReset={type === "view"}
    >
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        tableDataGetFunc={tableDataGetFunc}
      />
    </IForm>
  );
}
