/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_chartinghelper/loading/_loading";
import { createMotherVessel } from "../helper";
import Form from "./form";

const initData = {
  mvesselName: "",
};

export default function MotherVesselCreate({
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
    if (!values?.motherVesselId) {
      const payload = {
        mvesselId: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        mvesselName: values?.mvesselName || "",
        actionby: profileData?.userId,
      };
      createMotherVessel(payload, setLoading, () => {
        cb();
        viewHandler(0, 15);
        setOpen(false);
      });
    } else {
    }
  };

  const title = singleData?.consigneeId
    ? "Edit Mother Vessel"
    : "Create Mother Vessel";

  return (
    <>
      {loading && <Loading />}
      <Form
        title={title}
        initData={singleData?.motherVesselId ? singleData : initData}
        saveHandler={saveHandler}
        setLoading={setLoading}
      />
    </>
  );
}
