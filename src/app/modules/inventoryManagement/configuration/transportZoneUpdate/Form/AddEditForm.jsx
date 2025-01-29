import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getZoneInfoByChallanCode,
  updateTransportZone,
} from "../helper";

let initData = {
  type: "",
  challanNo: "",
  shiptoPartyName: "",
  address: "",
  transportZone: "",
};

export function TransportZoneUpdateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const zoneDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);


  const saveHandler = async (values, cb) => {
    const payload = {
      deliveryCode: values?.challanNo,
      zoneId: values?.transportZone?.value,
      shipToPartnerId: values?.partner?.value,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
    };

    updateTransportZone(payload, setDisabled, cb);
  };

  const handleZoneInfo = (values, setFieldValue) => {
    // value 1 means Cahllan base
    if (values?.type?.value === 1) {
      getZoneInfoByChallanCode(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.challanNo,
        // (data) => setZoneInfo({ ...values, ...data }),
        setFieldValue
      );
    }
  };

  return (
    <IForm
      title={"Transport Zone Update"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={{ ...initData }}
          saveHandler={saveHandler}
          handleZoneInfo={handleZoneInfo}
          zoneDDL={zoneDDL}
        />
      </div>
    </IForm>
  );
}
