/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import {
  createProductionLine,
  editProductionLine,
  getPlantNameDDL,
  getSingleDataById,
} from "../helper";
import Form from "./Form";
import Loading from "./../../../../_helper/_loading";

let initData = {
  id: undefined,
  productionLineName: "",
  productionLineCode: "",
  plantName: "",
  shopFloorName: "",
};

export default function ProductionLineForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [plantNameDDL, setPlantNameDDL] = useState([]);
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [singleData, setSingleData] = useState({});

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //USEPARAMS FOR ID
  const params = useParams();

  // FETCHING DATA
  useEffect(() => {
    getPlantNameDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlantNameDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    getSingleDataById(params?.id, setSingleData);
  }, [params.id]);

  const saveHandler = (values, cb) => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      if (params?.id) {
        const payload = {
          productionLineId: +params?.id,
          productionLineCode: values?.productionLineCode,
          productionLineName: values?.productionLineName,
          accountId: profileData?.accountId,
          plantId: values?.plantName?.value,
          businessUnitId: selectedBusinessUnit?.value,
          shopFloorId: values?.shopFloorName?.value,
          actionBy: profileData?.userId,
        };
        editProductionLine(payload, cb, setDisabled);
      } else {
        const payload = {
          productionLineCode: values?.productionLineCode,
          productionLineName: values?.productionLineName,
          accountId: profileData?.accountId,
          plantId: values?.plantName?.value,
          businessUnitId: selectedBusinessUnit?.value,
          shopFloorId: values?.shopFloorName?.value,
          actionBy: profileData?.userId,
        };
        createProductionLine(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title="Create Production Line"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={!params.id ? initData : singleData}
        saveHandler={saveHandler}
        plantNameDDL={plantNameDDL}
        shopFloorDDL={shopFloorDDL}
        setShopFloorDDL={setShopFloorDDL}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={params?.id ? true : false}
      />
    </IForm>
  );
}
