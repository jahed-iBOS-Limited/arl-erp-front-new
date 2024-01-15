/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { radioStyle } from "./helper";
import NewSelect from "../../_helper/_select";
import {
  GetDomesticPortDDL,
  getMotherVesselDDL,
} from "../allotment/confirmBySupervisor/helper";
import { shallowEqual, useSelector } from "react-redux";

export const BADCBCICForm = ({
  values,
  setFieldValue,
  disabled,
  onChange,
  colSize,
}) => {
  return (
    <div className={`${colSize ? colSize : "col-12"}  mt-3 d-flex`}>
      <div className="d-flex align-items-center mr-5">
        <input
          style={radioStyle}
          type="radio"
          name="type"
          id="badc"
          value={values?.type}
          checked={values?.type === "badc"}
          onChange={() => {
            setFieldValue("type", "badc");
            onChange && onChange("type", values, "badc", setFieldValue);
          }}
          disabled={disabled || false}
        />
        <label htmlFor="badc" className="ml-1">
          <h3>BADC</h3>
        </label>
      </div>
      <div className="d-flex align-items-center ml-5">
        <input
          style={radioStyle}
          type="radio"
          name="type"
          id="bcic"
          value={values?.type}
          checked={values?.type === "bcic"}
          onChange={() => {
            setFieldValue("type", "bcic");
            onChange && onChange("type", values, "bcic", setFieldValue);
          }}
          disabled={disabled || false}
        />
        <label htmlFor="bcic" className="ml-1">
          <h3>BCIC</h3>
        </label>
      </div>
    </div>
  );
};

export const PortAndMotherVessel = ({ obj }) => {
  const {
    values,
    setFieldValue,
    onChange,
    disabled,
    port,
    motherVessel,
    colSize,
    allElement,
  } = obj;
  const [portDDL, setPortDDL] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    if (port === false) {
      getMotherVesselDDL(accId, buId, 0, setMotherVesselDDL);
    }
  }, [accId, buId]);

  const portList =
    allElement !== false ? [{ value: 0, label: "All" }, ...portDDL] : portDDL;

  const motherVesselList =
    allElement !== false
      ? [{ value: 0, label: "All" }, ...motherVesselDDL]
      : motherVesselDDL;

  return (
    <>
      {port !== false && (
        <div className={colSize || "col-lg-3"}>
          <NewSelect
            name="port"
            options={portList}
            value={values?.port}
            label="Port"
            placeholder="Port"
            onChange={(e) => {
              setFieldValue("port", e);
              setFieldValue("motherVessel", "");
              getMotherVesselDDL(accId, buId, e?.value, setMotherVesselDDL);
              onChange && onChange("port", { ...values, port: e });
            }}
            isDisabled={disabled?.port}
          />
        </div>
      )}
      {motherVessel !== false && (
        <div className={colSize || "col-lg-3"}>
          <NewSelect
            name="motherVessel"
            options={motherVesselList || []}
            value={values?.motherVessel}
            label="Mother Vessel"
            placeholder="Mother Vessel"
            onChange={(e) => {
              setFieldValue("motherVessel", e);
              onChange &&
                onChange("motherVessel", { ...values, motherVessel: e });
            }}
            isDisabled={
              disabled?.motherVessel || (port !== false && !values?.port)
            }
          />
        </div>
      )}
    </>
  );
};
