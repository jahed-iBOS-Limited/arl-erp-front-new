import React, { useEffect } from "react";
import NewSelect from "../../../_helper/_select";
import { fetchCommonDDL } from "./helper";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_helper/_loading";

const ShipPointShipMentDDL = ({ obj }) => {
  const { values, errors, touched, setFieldValue } = obj;

  //redux
  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  // api action
  const [shipPointDDL, getShipPointDDL, getShipPointDDLLoading] = useAxiosGet();

  const [
    shipmentLoadDDL,
    getShipmentLoadDDL,
    getShipmentLoadDDLLoading,
  ] = useAxiosGet();

  // use effect initial load
  useEffect(() => {
    fetchCommonDDL({
      getApi: getShipPointDDL,
      apiName: "shipPoint",
      values: {},
      selectedBusinessUnit,
      profileData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // loading
  const isLoading = getShipmentLoadDDLLoading || getShipPointDDLLoading;

  return (
    <>
      {isLoading && <Loading />}
      <CommonDDLFieldComponent
        obj={{
          name: "shippoint",
          ddl: shipPointDDL,
          label: "Shippoint",
          values,
          errors,
          touched,
          setFieldValue,
          cb: function cb(valueOption) {
            fetchCommonDDL({
              getApi: getShipmentLoadDDL,
              apiName: "shipmentLoading",
              values: {
                ...values,
                shippoint: valueOption,
              },
              selectedBusinessUnit,
              profileData,
            });
          },
        }}
      />

      <CommonDDLFieldComponent
        obj={{
          name: "shipment",
          ddl: shipmentLoadDDL,
          label: "Shipment",
          values,
          errors,
          touched,
          setFieldValue,
        }}
      />
    </>
  );
};

export default ShipPointShipMentDDL;

// common ddl component
export function CommonDDLFieldComponent({ obj }) {
  // obj
  const { name, ddl, label, values, errors, touched, setFieldValue, cb } = obj;

  //  ddl
  return (
    <div className="col-lg-3">
      <NewSelect
        name={name}
        options={ddl || []}
        value={values[name]}
        label={label}
        onChange={(valueOption) => {
          setFieldValue(name, valueOption);
          cb && cb(valueOption);
        }}
        errors={errors}
        touched={touched}
      />
    </div>
  );
}
