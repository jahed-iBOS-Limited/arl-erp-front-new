import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";

import Loading from "../../../../_helper/_loading";
import {
  CreateAllowForModification,
  EditAllowForModification_api,
  GetAllowForModificationById_api,
} from "./../helper";

const initData = {
  employeeName: "",
  ysnGhatInfo: false,
  ysnTransportZoneInfo: false,
  ysnItemInfo: false,
};

export default function ShipmentCostRatePermitForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const params = useParams();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        enrol: values?.employeeName?.value,
        ysnGhatInfo: values?.ysnGhatInfo || false,
        ysnTransportZoneInfo: values?.ysnTransportZoneInfo || false,
        ysnItemInfo: values?.ysnItemInfo || false,
        unitId: selectedBusinessUnit?.value,
        id: values?.id || 0,
      };
      if (params?.id) {
        EditAllowForModification_api(payload, setDisabled);
      } else {
        if (values?.isEditApiCall) {
          EditAllowForModification_api(payload, setDisabled);
        } else {
          CreateAllowForModification(payload, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      GetAllowForModificationById_api(params?.id, setSingleData, setDisabled);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return (
    <IForm
      title={"Create Shipment Cost Rate Permission"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        isEdit={params?.id || false}
        selectedBusinessUnit={selectedBusinessUnit}
        profileData={profileData}
      />
    </IForm>
  );
}
