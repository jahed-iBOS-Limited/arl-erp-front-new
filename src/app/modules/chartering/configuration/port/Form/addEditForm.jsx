/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { GetCountryDDL } from "../../../helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import { createPort, updatePort } from "../helper";
import Form from "./form";

const initData = {
  portName: "",
  portCountry: "",
  portAddress: "",
};

export default function PortForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [countryDDL, setCountryDDL] = useState([]);
  const { state } = useLocation();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetCountryDDL(setCountryDDL);
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    if (id) {
      const data = {
        porteId: id,
        portName: values.portName,
        portAddress: values.portAddress,
        portCountry: values.portCountry?.label,
        portCountryId: values.portCountry?.value,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
      };
      updatePort(data, setLoading);
    } else {
      const payload = {
        portName: values.portName,
        portAddress: values.portAddress,
        portCountry: values.portCountry?.label,
        portCountryId: values.portCountry?.value,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
      };
      createPort(payload, setLoading, cb);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "edit"
            ? "Edit Port"
            : type === "view"
            ? "View Port"
            : "Create Port"
        }
        initData={
          id
            ? {
                ...state,
                portCountry: {
                  value: state?.portCountryId,
                  label: state?.portCountry,
                },
              }
            : initData
        }
        saveHandler={saveHandler}
        viewType={type}
        countryDDL={countryDDL}
      />
    </>
  );
}
