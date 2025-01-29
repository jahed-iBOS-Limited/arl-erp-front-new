import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  getShipmentByID,
  GetFuelConstInfoById_api,
  GetPartnerShippingInformation_api,
  // getBUMilageAllowance,
  GetShipmentCostEntryStatus_api,
} from "../helper";
import { GetShipToPartnerDistanceByShipmentId_api } from "./../helper";
import Loading from "./../../../../_helper/_loading";

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
  // const [buMilage, setBuMilage] = useState("");
  const [, setEntryStatus] = useState("");

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  

  useEffect(() => {
    if (id) {
      GetFuelConstInfoById_api(id, setFuleCost);
      GetShipmentCostEntryStatus_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        id,
        setEntryStatus
      );
      // }
      getShipmentByID(id, setSingleData, setRowDto, setDisabled, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
      />
    </div>
  );
}
