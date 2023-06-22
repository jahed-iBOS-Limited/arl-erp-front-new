/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams, useHistory } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";

const initData = {
  shippingPoint: "",
  route: "",
  wareHouse: "",
  transportZone: "",
};

export default function ShippingPointTransportZoneForm() {
  const { id } = useParams();
  const { location: state } = useLocation();
  const history = useHistory();
  const [shipPointDDL, getShipPointDDL, shipPointDDLLoader] = useAxiosGet();
  const [
    TransportZoneDDL,
    getTransportZoneDDL,
    TransportZoneDDLLoader,
  ] = useAxiosGet();
  const [routeDDL, getRouteDDL, routeDDLLoader] = useAxiosGet();
  const [wareHouseDDL, getWareHouseDDL, wareHouseDDLLoader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [modifyData, setModifyData] = useState({});

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    const payload = {
      intAutoId: id ? +id : 0,
      intBusinessUnitId: buId,
      intAccountId: accId,
      intShipPointId: values?.shippingPoint?.value,
      intWhid: values?.wareHouse?.value,
      intTransportZoneId: values?.transportZone?.value,
      intRouteId: values?.route?.value,
      userId: id ? userId : null,
    };
    saveData(
      id
        ? `/oms/POSDamageEntry/EditWareHouseZone`
        : `/oms/POSDamageEntry/CreateWareHouseZone`,
      payload,
      cb,
      true
    );
  };
  useEffect(() => {
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    getTransportZoneDDL(
      `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (state) {
      getWareHouseDDL(
        `/wms/ShipPoint/GetTransportShipPointWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&ShipPointid=${state?.intShipPointId}`
      );
      getRouteDDL(
        `/wms/ShipPoint/GetTransportZoneRouteDDL?accountId=${accId}&businessUnitId=${buId}&TransportZoneId=${state?.intTransportZoneId}`
      );
      setModifyData({
        shippingPoint: {
          value: state?.intShipPointId,
          label: state?.shipPointName,
        },
        route: {
          value: state?.intRouteId,
          label: state?.routeName,
        },
        wareHouse: {
          value: state?.intWhid,
          label: state?.wareHouseName,
        },
        transportZone: {
          value: state?.intTransportZoneId,
          label: state?.transPortZoneName,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId, state]);

  const title = id
    ? "Edit Shipping Point Transport Zone"
    : "Create Shipping Point Transport Zone";

  const loading =
    shipPointDDLLoader ||
    TransportZoneDDLLoader ||
    routeDDLLoader ||
    wareHouseDDLLoader ||
    saveDataLoader;

  return (
    <>
      <Form
        obj={{
          id,
          buId,
          accId,
          title,
          history,
          loading,
          routeDDL,
          getRouteDDL,
          saveHandler,
          shipPointDDL,
          wareHouseDDL,
          getWareHouseDDL,
          TransportZoneDDL,
          initData: id ? modifyData : initData,
        }}
      />
    </>
  );
}
