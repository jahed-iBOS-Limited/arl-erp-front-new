/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IForm from "../../../../_helper/_form";
import {
  saveShopFloor,
  getPlantNameDDl,
  getShopFloorById,
  editSingleData,
  getWareHouseDDL,
} from "../helper";
import Form from "./form";
import Loading from "./../../../../_helper/_loading";
import { useLocation } from "react-router";

let initData = {
  plantName: "",
  shopFloorName: "",
  shopFloorCode: "",
  warehouse: "",
  intLocation: "",
};

export default function ShopFloorForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [plantNameDDl, setPlantNameDDl] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [warehouseDDL, setWarehouseDDL] = useState([]);
  const [intLocationDDL, setIntLocationDDL] = useState([]);
  const location = useLocation();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPlantNameDDl(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantNameDDl
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);
  //singleData load
  useEffect(() => {
    if (id && profileData?.accountId && selectedBusinessUnit?.value) {
      getShopFloorById(
        id,
        selectedBusinessUnit?.value,
        profileData?.accountId,
        setSingleData
      );
    }
  }, [id, profileData.accountId, selectedBusinessUnit.value]);

  let singleInitData = {};
  if (id) {
    singleInitData = {
      plantName: {
        label: singleData[0]?.plantName,
        value: singleData[0]?.shopFloorId,
      },
      warehouse: {
        value: singleData[0]?.warehouseId,
        label: singleData[0]?.warehouseName,
      },
      intLocation: {
        value: singleData[0]?.locationId,
        label: singleData[0]?.locationName,
      },
      shopFloorName: singleData[0]?.shopFloorName,
      shopFloorCode: singleData[0]?.shopFloorCode,
    };
  }
  //save Handler
  const saveHandler = async (values, cb) => {
    // setDisabled(true);
    if (values) {
      if (id) {
        const payload = {
          shopFloorId: singleData[0]?.shopFloorId,
          shopFloorName: values?.shopFloorName,
          accountId: profileData?.accountId,
          plantId: values?.plantName?.value,
          businessUnitId: selectedBusinessUnit?.value,
          intActionBy: singleData[0]?.intActionBy,
        };
        editSingleData(payload, setDisabled);
      } else {
        const payload = {
          shopFloorCode: values?.shopFloorCode,
          shopFloorName: values?.shopFloorName,
          accountId: profileData?.accountId,
          plantId: values?.plantName?.value,
          warehouseId: values?.warehouse?.value,
          intLocationId: values?.intLocation?.value,
          businessUnitId: selectedBusinessUnit.value,
          actionBy: profileData?.userId,
        };
        saveShopFloor(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  useEffect(() => {
    getWareHouseDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      location?.state?.value,
      setWarehouseDDL
    );
  }, [location?.state]);

  return (
    <IForm
      title={id ? "Edit Shop Floor" : "Create Shop Floor"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          id ? singleInitData : { ...initData, plantName: location?.state }
        }
        saveHandler={saveHandler}
        plantNameDDl={plantNameDDl}
        isEdit={id ? id : false}
        warehouseDDL={warehouseDDL}
        setWarehouseDDL={setWarehouseDDL}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        intLocationDDL={intLocationDDL}
        setIntLocationDDL={setIntLocationDDL}
      />
    </IForm>
  );
}
