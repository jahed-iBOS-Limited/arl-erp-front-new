

import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  createRouteSetupConfig,
  getRouteConfigById,
  editRoutePlanConfig,
} from "../helper";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";

const initData = {
  entryDay: "",
  editedDay: "",
  approvalStatus: false,
};

export default function RouteSetupConfigForm() {
  const params = useParams();
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  useEffect(() => {
    if (params?.id) {
      getRouteConfigById(params?.id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    setDisabled(true);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          autoId: params?.id,
          lastRoutePlanEntryDay: values.entryDay,
          lastRoutePlanEditDay: values.editedDay,
          isApproveRequired: values.approvalStatus,
          actionBy: profileData?.userId,
          isActive: true,
        };

        editRoutePlanConfig(payload, setDisabled);
      } else {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          lastRoutePlanEntryDay: values.entryDay,
          lastRoutePlanEditDay: values.editedDay,
          isApproveRequired: values.approvalStatus,
          actionBy: profileData?.userId,
        };

        createRouteSetupConfig(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title="Create Plan Setup Config"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={params?.id || false}
      />
    </IForm>
  );
}
