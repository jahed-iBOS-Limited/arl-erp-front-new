/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./view";

import { saveCreateData, getSinglePageData, saveEditData } from "../helper";
import ICustomCard from "../../../../_helper/_customCard";

export function RoutingView({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [singlePageData, setSinglePageData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [plantNameDDL, setPlantNameDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [workCenterNameDDL, setWorkCenterNameDDL] = useState([]);
  const [itemNameDDL, setItemNameDDL] = useState([]);
  const [billOfMaterialName, setBillOfMaterialNameDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    getSinglePageData(id, setSinglePageData);
  }, [id]);

  let singData = {};
  if (id && singlePageData.length > 0) {
    singData = {
      plantName: {
        label: singlePageData[0]?.plantName,
        value: singlePageData[0]?.plantId,
      },
      shopFloorName: {
        label: singlePageData[0]?.shopFloorName,
        value: singlePageData[0]?.shopFloorId,
      },
      workCenterName: {
        label: singlePageData[0]?.workCenterName,
        value: singlePageData[0]?.workCenterId,
      },
      itemName: {
        label: singlePageData[0]?.itemName,
        value: singlePageData[0]?.itemId,
      },
      capacity: singlePageData[0].capacity,
      setUpTime: singlePageData[0].setUpTime,
      billOfMaterialName: {
        label: singlePageData[0]?.billOfMaterialName,
        value: singlePageData[0]?.billOfMaterialId,
      },
      laborQty: singlePageData[0].laborQty,
      laborTime: singlePageData[0].laborTime,
      laborCost: singlePageData[0].laborCost,
      machineTime: singlePageData[0].machineTime,
      routingId: singlePageData[0].routingId,
    };
  }
  const [rowDataCreate, setRowDataCreate] = useState([]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);

    if (values) {
      if (id) {
        const payload = {};

        saveEditData(payload);
      } else {
        const payload = {};
        saveCreateData(payload, cb);
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});
  const isView = history?.location?.state?.isView;

  function backHandler(){
    history.push("/production-management/configuration/routing/view")
  }

  return (
    <ICustomCard
      title={"View Routing"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      backHandler = {backHandler}
      >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={singData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
          isEdit={id ? id : false}
          id={id}
          plantNameDDL={plantNameDDL}
          profileData={profileData}
          setRowDataCreate={setRowDataCreate}
          shopFloorDDL={shopFloorDDL}
          rowDataCreate={rowDataCreate}
          setWorkCenterNameDDL={setWorkCenterNameDDL}
          workCenterNameDDL={workCenterNameDDL}
          itemNameDDL={itemNameDDL}
          setItemNameDDL={setItemNameDDL}
          billOfMaterialName={billOfMaterialName}
          setBillOfMaterialNameDDL={setBillOfMaterialNameDDL}
          isView={isView}
        />
      </div>
    </ICustomCard>
  );
}
