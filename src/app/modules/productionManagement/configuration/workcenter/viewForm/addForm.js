import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";

import { getWorkCenterById } from "../helper";
import Form from "./form";

const initData = {
  plantName: "",
  productionLine: "",
  workcenterName: "",
  workcenterCode: "",
  workCenterCapacity: "",
  uomName: "",
  itemName: "",
  itemCode: "",
  setupTime: "",
  machineTime: "",
  laborQty: "",
  laborTime: "",
  laborCost: "",
  assetId: "",
  employeeId: "",
  shopFloorId: "",
};

export default function WorkCenterViewForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);

  const [singleData, setSingleData] = useState("");
  const [singleRowData, setSingleRowData] = useState("");

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getWorkCenterById(
      id,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSingleData,
      setSingleRowData
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWorkCenterById]);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <ICustomCard
      title="View Work Center"
      backHandler={() => history.goBack()}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        singleRowData={singleRowData}
        disableHandler={disableHandler}
        isEdit={id || false}
      />
    </ICustomCard>
  );
}
