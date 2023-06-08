/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from "react";
import IForm from "../../../../_helper/_form";
import ReceiveInventory from "./receiveInventory/createForm";
import { IQueryParser } from "../../../../_helper/_queryParser";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function ForminvTransImport() {
  const [isDisabled, setDisabled] = useState(true);
  const [title, setTitle] = useState(null);
  const [InvForm, setInvForm] = useState(<></>);

  const potype = IQueryParser("potype");
  const location = useLocation();

  const lastInvData = useSelector((state) => state?.localStorage?.lastInvData);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});
  useEffect(() => {
    setInvForm(
      <ReceiveInventory
        disableHandler={disableHandler}
        landingData={location.state}
        {...objProps}
      />
    );
    setTitle(
      `Create Inventory Transaction Import ${lastInvData ? lastInvData : ""}`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potype, objProps, lastInvData]);

  return (
    <IForm title={title} getProps={setObjprops} isDisabled={isDisabled}>
      {InvForm}
    </IForm>
  );
}
