/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  saveEditedPartnerTransportZoneAction,
  savePartnerTransportZoneAction,
  GetPartnerTransportZoneById,
} from "../helper";

const initData = {
  id: undefined,
  shippoint: "",
  soldToPartner: "",
  shipToPartner: "",
  transportZone: "",
  rate: "",
  distanceKm: "",
  vehicleCapacity: "",
};

export default function PartnerThanaRateForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      GetPartnerTransportZoneById(id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          id: +id,
          thanaId: 0,
          perBagPrice: values?.rate,
          vehicleCapacityId: values?.vehicleCapacity?.value || 0,
          vehicleCapacityName: values?.vehicleCapacity?.label || "",
          actionBy: profileData?.userId,
        };
        saveEditedPartnerTransportZoneAction(payload, setDisabled);
      } else {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          shippointId: values?.shippoint?.value,
          // partnerId: values?.soldToPartner?.value,
          // shiptoPartnerId: values?.shipToPartner?.value,
          transportZoneId: values?.transportZone?.value,
          vehicleCapacityId: values?.vehicleCapacity?.value || 0,
          vehicleCapacityName: values?.vehicleCapacity?.label || "",
          perBagPrice: values?.rate,
          distanceKm: values?.distanceKm,
          actionBy: profileData.userId,
        };
        savePartnerTransportZoneAction(payload, cb, setDisabled);
      }
    } else {
    }
  };

  const [objProps, setObjprops] = useState({});
  return (
    <IForm
      title="Create Partner Transport Zone Setup"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
      />
    </IForm>
  );
}
