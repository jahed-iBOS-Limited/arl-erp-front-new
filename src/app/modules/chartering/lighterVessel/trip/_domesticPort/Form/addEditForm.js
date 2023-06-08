/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_chartinghelper/loading/_loading";
import { createPort } from "../helper";
import Form from "./form";

const initData = {
  portName: "",
  portAddress: "",
};

export default function DomesticPortCreate({
  singleData,
  setOpen,
  viewHandler,
}) {
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    if (!values?.portId) {
      const payload = {
        domesticPortId: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        portName: values?.portName || "",
        portAddress: values?.portAddress || "",
        actionby: profileData?.userId,
      };
      createPort(payload, setLoading, () => {
        cb();
        viewHandler(0, 15);
        setOpen(false);
      });
    } else {
    }
  };

  const title = singleData?.portId ? "Edit Port" : "Create Port";

  return (
    <>
      {loading && <Loading />}
      <Form
        title={title}
        initData={singleData?.portId ? singleData : initData}
        saveHandler={saveHandler}
        setLoading={setLoading}
      />
    </>
  );
}
