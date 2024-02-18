/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import { createRouteStandardCost } from "../helper";
import Form from "./form";
import Loading from "./../../../../_helper/_loading";
import { toast } from "react-toastify";

const initData = {
  id: undefined,
  transportOrganizationName: "",
  routeName: "",
  vehicleCapacity: "",
  componentName: "",
  amount: "",
  shipPoint: "",
  itemLists: [],
};

export default function RouteStandardForm({
  history,
  match: {
    params: { id, type },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

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
      if (values?.itemLists?.length === 0)
        return toast.warn("Please add atleast one item");

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
        vehicleCapacityName: itm?.vehicleCapacityName || 0,
        vehicleCapacityId: itm?.vehicleCapacityId || 0,
        shipPointId: itm?.shipPointId || 0,
        shipPointName: itm?.shipPointName || '',
      }));
      createRouteStandardCost(payload, cb, setDisabled, id);
    } else {
      setDisabled(false);
    }
  };
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title='Create Route Cost Setup'
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={type === "view"}
      isHiddenReset={type === "view"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        id={id}
        setDisabled={setDisabled}
      />
    </IForm>
  );
}
