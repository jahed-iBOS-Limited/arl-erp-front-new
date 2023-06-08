/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_chartinghelper/loading/_loading";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import { createSurveyVessel, editSurveyVessel } from "../helper";
import Form from "./form";

const initData = {
  motherVessel: "",
  ref: "",
  cargo: "",
  lc: "",
  unit: "",
  arrivalDate: _todayDate(),
  quantity: "",
};

export default function SurveyVesselForm({
  singleData,
  setOpen,
  viewHandler,
  editViewTag,
}) {
  const [loading, setLoading] = useState(false);
  const [modifiedData, setModifiedData] = useState({});

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (editViewTag) {
      setModifiedData({
        motherVessel: singleData?.motherVesselName,
        ref: singleData?.referenceNo,
        cargo: { value: singleData?.cargoId, label: singleData?.cargoName },
        lc: singleData?.lcno,
        unit: {
          value: singleData?.surveyBusinessUnitId,
          label: singleData?.surveyBusinessUnitName,
        },
        arrivalDate: _dateFormatter(singleData?.arrivalDate),
        quantity: singleData?.blqty,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editViewTag]);

  const saveHandler = (values, cb) => {
    if (editViewTag === "edit") {
      const payload = {
        surveyId: singleData?.surveyId,
        motherVesselName: values?.motherVessel || "",
        referenceNo: values?.ref,
        cargoId: values?.cargo?.value || 0,
        cargoName: values?.cargo?.label || "",
        lcno: values?.lc,
        surveyBusinessUnitId: values?.unit?.value || 0,
        surveyBusinessUnitName: values?.unit?.label || "",
        arrivalDate: values?.arrivalDate,
        blqty: values?.quantity,
      };
      editSurveyVessel(payload, () => {
        cb();
        viewHandler(0, 15);
        setOpen(false);
      });
    } else {
      const payload = {
        accountId: profileData?.accountId,
        businessunitId: selectedBusinessUnit?.value,
        motherVesselName: values?.motherVessel || "",
        referenceNo: values?.ref,
        cargoName: values?.cargo?.label || "",
        lcno: values?.lc,
        surveyBusinessUnitId: values?.unit?.value || 0,
        surveyBusinessUnitName: values?.unit?.label || "",
        arrivalDate: values?.arrivalDate,
        blqty: values?.quantity,
        actionBy: profileData?.userId,
      };
      createSurveyVessel(payload, () => {
        cb();
        viewHandler(0, 15);
        setOpen(false);
      });
    }
  };

  const title =
    editViewTag === "view"
      ? "View Survey Vessel"
      : editViewTag === "edit"
      ? "Edit Survey Vessel"
      : "Create Survey Vessel";

  return (
    <>
      {loading && <Loading />}
      <Form
        title={title}
        initData={editViewTag ? modifiedData : initData}
        saveHandler={saveHandler}
        setLoading={setLoading}
        editViewTag={editViewTag}
      />
    </>
  );
}
