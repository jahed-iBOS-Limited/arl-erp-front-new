import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  GetFuelConstInfoById_api,
  GetPartnerShippingInformation_api,
  getShipmentByID,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import { GetShipToPartnerDistanceByShipmentId_api } from "./../helper";
import Form from "./form";

const initData = {
  vehicleNo: "",
  driverName: "",
  routeName: "",
  distanceKm: "",
  shipmentDate: "",
  startMillage: "",
  endMillage: "",
  totalStandardCost: "",
  advanceAmount: "",
  totalActualCost: "",
  costComponent: "",
};

export default function ShipmentCostViewForm({ id, values }) {
  const [reset, setReset] = useState({ func: "" });
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [fuleCost, setFuleCost] = useState([]);
  const [distanceKM, setDistanceKM] = useState([]);
  const [vehicleReant, setVehicleReant] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // getBUMilageAllowance(
      //   profileData.accountId,
      //   selectedBusinessUnit.value,
      //   setBuMilage
      // );
    }
  }, [profileData, selectedBusinessUnit]);
  useEffect(() => {
    if (id) {
      GetFuelConstInfoById_api(id, setFuleCost);
      // GetShipmentCostEntryStatus_api(
      //   profileData.accountId,
      //   selectedBusinessUnit.value,
      //   id,
      //   setEntryStatus
      // );
      // if (values?.reportType?.label !== "Pending") {
      //   getShipmentByID(id, setSingleData, setRowDto, setDisabled, null, null, true);
      // } else {
      //   getShipmentByID(id, setSingleData, null, setDisabled, null, null, true);
      // }
      // getShipmentByID(
      //   id,
      //   setSingleData,
      //   setRowDto,
      //   setDisabled,
      //   null,
      //   null
      // );
      getShipmentByID({
        shipmentId: id,
        setter: setSingleData,
        setRowDto,
        setDisabled,
      });
    }

  }, []);

  // if Report type panding
  // useEffect(() => {
  //   if (values?.reportType?.label === "Pending" && buMilage?.configid) {
  //     let amount =
  //       +singleData?.distanceKm < +buMilage?.milage
  //         ? +singleData?.distanceKm * +buMilage?.minimumAmount
  //         : +singleData?.distanceKm * +buMilage?.maximumAmount;
  //     let obj = {
  //       transportRouteCostComponentId: buMilage?.configid,
  //       transportRouteCostComponent: buMilage?.componentName,
  //       standardCost: amount,
  //       actualCost: amount,
  //     };
  //     setRowDto([obj]);
  //   }
  //
  // }, [buMilage, singleData]);

  useEffect(() => {
    if (singleData?.shipmentId) {
      GetShipToPartnerDistanceByShipmentId_api(
        singleData?.shipmentId,
        setDistanceKM
      );
      GetPartnerShippingInformation_api(
        singleData?.shipmentId,
        setVehicleReant
      );
    }
  }, [singleData]);

  return (
    <div>
      {isDisabled && <Loading />}
      <Form
        initData={id ? singleData : initData}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        setRowDto={setRowDto}
        rowDto={rowDto}
        reset={reset}
        setReset={setReset}
        fuleCost={fuleCost}
        vehicleReant={vehicleReant}
        distanceKM={distanceKM}
        shipmentId={singleData?.shipmentId}
        landingValues={values}
      />
    </div>
  );
}
