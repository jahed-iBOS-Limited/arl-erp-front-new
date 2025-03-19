/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import Loading from "../../../_chartinghelper/loading/_loading";
import { createCargo, editCargo } from "../helper";
import Form from "./form";

const initData = {
  cargoGroup: "",
  cargoName: "",
  sf: "",
  required: false,
  notRequired: true,
};

export default function CargoForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    if (id) {
      const data = {
        cargoId: id,
        cargoName: values?.cargoName,
        preloadingSurvey: values?.required ? true : false,
        sfm3: values?.sf,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        cargoGroupId: values?.cargoGroup?.value,
        cargoGroupName: values?.cargoGroup?.label,
      };
      editCargo(data, setLoading);
    } else {
      const payload = {
        cargoName: values?.cargoName,
        preloadingSurvey: values?.required ? true : false,
        sfm3: values?.sf,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        cargoGroupId: values?.cargoGroup?.value,
        cargoGroupName: values?.cargoGroup?.label,
      };
      createCargo(payload, setLoading, cb);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={type === "edit" ? "Edit Cargo" : "Create Cargo"}
        initData={
          id
            ? {
                ...state,
                required: state?.preloadingSurvey,
                notRequired: state?.preloadingSurvey ? false : true,
                sf: state?.sfm3,
                cargoGroup: {
                  value: state?.cargoGroupId,
                  label: state?.cargoGroupName,
                },
              }
            : initData
        }
        saveHandler={saveHandler}
        viewType={type}
      />
    </>
  );
}
