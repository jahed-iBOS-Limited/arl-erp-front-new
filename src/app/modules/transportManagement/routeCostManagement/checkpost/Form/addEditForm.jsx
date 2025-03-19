import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getCheckPostListDDL,
  getVehicleNoDDL,
  getVehiclePurposeTypeDDL,
  getPlantDDL,
  getShipPointDDL,
  saveCheckpostVehicleInOut,
  getCameFromDDL,
  getcheckPostItemView,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  checkPost: "",
  vehicleNo: "",
  driverName: "",
  driverContact: "",
  usePurpose: "",
  plant: "",
  shipPoint: "",
  cameFrom: "",
};

export default function CheckPostForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [checkPostDDL, setCheckPostDDL] = useState([]);
  const [purposeTypeDDL, setPurposeTypeDDL] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [vehicleNoDDL, setVehicleNoDDL] = useState([]);
  const [vehicleManualNoDDL, setVehicleManualNoDDL] = useState([]);
  const [cameFromDDL, setCameFromDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //  Get By Id
  useEffect(() => {
    getcheckPostItemView(id, setSingleData);
  }, [id]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getCheckPostListDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCheckPostDDL
      );
      getVehicleNoDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setVehicleNoDDL
      );
      getVehiclePurposeTypeDDL(setPurposeTypeDDL);
      getPlantDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantDDL
      );
      getShipPointDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShipPointDDL
      );
      getCameFromDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCameFromDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
      } else {
        const payload = {
          accountId: profileData?.accountId,
          checkpostId: values?.checkPost?.value,
          plantId: values?.plant?.value,
          shippointId: values?.shipPoint?.value || 0,
          vehicleId: values?.vehicleNo?.value,
          vehicleNo: values?.vehicleNo?.label,
          driverName: values?.driverName,
          driverContact: values?.driverContact,
          actionby: profileData?.userId,
          vehicleUsePurposeTypeId: values?.usePurpose?.value,
          purposeName: values?.usePurpose?.label,
          cameFrom: values?.cameFrom || 0,
        };
       saveCheckpostVehicleInOut(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Check Post In-Out"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        checkPostDDL={checkPostDDL}
        purposeTypeDDL={purposeTypeDDL}
        plantDDL={plantDDL}
        shipPointDDL={shipPointDDL}
        vehicleNoDDL={vehicleNoDDL}
        setVehicleNoDDL={setVehicleNoDDL}
        cameFromDDL={cameFromDDL}
        vehicleManualNoDDL={vehicleManualNoDDL}
        setVehicleManualNoDDL={setVehicleManualNoDDL}
      />
    </IForm>
  );
}
