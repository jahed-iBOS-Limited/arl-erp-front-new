import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { fetchCommonDDL } from "./helper";

const ShipPointShipMentDDL = ({ obj }) => {
  const { values, errors, touched, setFieldValue, isEditingMode } = obj;

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
    // inital shippoint ddl load
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
          isDisabled: isEditingMode,
          cb: function cb(valueOption) {
            // call shipment ddl on shippont change
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
          ddl: [{ value: 0, label: "All" }, ...shipmentLoadDDL],
          label: "Shipment",
          values,
          errors,
          touched,
          setFieldValue,
          isDisabled: isEditingMode,
        }}
      />
    </>
  );
};

export default ShipPointShipMentDDL;

// common ddl component
export function CommonDDLFieldComponent({ obj }) {
  // obj
  const {
    name,
    ddl,
    label,
    values,
    errors,
    touched,
    setFieldValue,
    cb,
    isDisabled,
  } = obj;

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
        isDisabled={isDisabled}
      />
    </div>
  );
}
