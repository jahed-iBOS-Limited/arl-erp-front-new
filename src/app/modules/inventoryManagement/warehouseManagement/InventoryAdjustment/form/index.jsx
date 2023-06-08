import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import CreateForm from "./CreateForm";

const InventoryAdjustmentCreate = () => {
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});
  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  const location = useLocation();
  return (
    <IForm title={"Create Adjust Inventory"} getProps={setObjprops} isDisabled={isDisabled}>
      <CreateForm disableHandler={disableHandler} landingData={location.state} {...objProps} />
    </IForm>
  );
};

export default InventoryAdjustmentCreate;
