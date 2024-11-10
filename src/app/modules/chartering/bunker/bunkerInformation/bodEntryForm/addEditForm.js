/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";
import Loading from "../../../../helper/loading/_loading";
import Form from "./form";
import { editBunkerInformation, saveBunkerInformation } from "../helper";
import { useLocation } from "react-router-dom";
import { getVesselDDL } from "../../helper";

const initData = {
  vesselName: "",
  voyageNo: "",
  voyageType: "",
  bodLsmgoQty: "",
  bodLsfo1Qty: "",
  bodLsfo2Qty: "",
};

export default function BODEntryForm() {
  const { charterType, type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const { state } = useLocation();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
  }, [profileData, selectedBusinessUnit, state]);

  const saveHandler = (values, cb) => {
    if (id) {
      const data = {
        bunkerInformationId: id,
        vesselId: values?.vesselName?.value,
        vesselName: values?.vesselName?.label,
        voyageNoId: values?.voyageNo?.value,
        voyageNo: values?.voyageNo?.label,
        bodLsmgoQty: values?.bodLsmgoQty,
        bodLsfo1Qty: +values?.bodLsfo1Qty,
        bodLsfo2Qty: +values?.bodLsfo2Qty,
      };
      editBunkerInformation(data, setLoading);
    } else {
      const payload = {
        vesselId: values?.vesselName?.value,
        vesselName: values?.vesselName?.label,
        voyageNoId: values?.voyageNo?.value,
        voyageNo: values?.voyageNo?.label,
        bodLsmgoQty: +values?.bodLsmgoQty,
        voyageTypeId: values?.voyageNo?.voyageTypeID,
        voyageTypeName: values?.voyageNo?.voyageTypeName,
        bodLsfo1Qty: +values?.bodLsfo1Qty,
        bodLsfo2Qty: +values?.bodLsfo2Qty,
      };
      saveBunkerInformation(payload, setLoading, cb);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        initData={
          id
            ? {
                ...state,
                vesselName: {
                  value: state?.vesselId,
                  label: state?.vesselName,
                },
                voyageNo: { value: state?.voyageNoId, label: state?.voyageNo },
                voyageType: state?.voyageTypeName,
              }
            : initData
        }
        saveHandler={saveHandler}
        viewType={type}
        charterType={charterType}
        vesselDDL={vesselDDL}
        setLoading={setLoading}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    </>
  );
}
