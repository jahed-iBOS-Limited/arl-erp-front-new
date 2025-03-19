/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getPlantNameDDL,
  getBillOfMaterialNameDDL,
  saveCreateData,
  getSinglePageData,
  saveEditData,
  getBomNameDDL,
  getWorkCenterNameDDL,
} from "../helper";
import Loading from "./../../../../_helper/_loading";

let initData = {
  plantName: "",
  shopFloorName: "",
  workCenterName: "",
  itemName: "",
  capacity: "",
  setUpTime: "",
  bomNameDDL: "",
  laborQty: "",
  laborTime: "",
  laborCost: "",
  machineTime: "",
};

export function RoutingForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singlePageData, setSinglePageData] = useState([]);
  const [plantNameDDL, setPlantNameDDL] = useState([]);
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [workCenterNameDDL, setWorkCenterNameDDL] = useState([]);
  const [itemNameDDL, setItemNameDDL] = useState([]);
  const [bomNameDDL, setBomNameDDL] = useState([]);
  const [billOfMaterialNameDDL, setBillOfMaterialNameDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getSinglePageData(id, setSinglePageData);
  }, [id]);

  useEffect(() => {
    getPlantNameDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantNameDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getBillOfMaterialNameDDL(setBillOfMaterialNameDDL);
  }, []);

  let singData = {};
  if (id && singlePageData.length > 0) {
    singData = {
      plantName: {
        label: singlePageData[0]?.plantName,
        value: singlePageData[0]?.plantId,
      },
      shopFloorName: {
        label: singlePageData[0]?.shopFloorName,
        value: singlePageData[0]?.shopFloorId,
      },
      workCenterName: {
        label: singlePageData[0]?.workCenterName,
        value: singlePageData[0]?.workCenterId,
      },
      itemName: {
        label: singlePageData[0]?.itemName,
        value: singlePageData[0]?.itemId,
      },
      capacity: singlePageData[0].capacity,
      setUpTime: singlePageData[0].setUpTime,
      bomNameDDL: {
        label: singlePageData[0]?.billOfMaterialName,
        value: singlePageData[0]?.billOfMaterialId,
      },
      laborQty: singlePageData[0].laborQty,
      laborTime: singlePageData[0].laborTime,
      laborCost: singlePageData[0].laborCost,
      machineTime: singlePageData[0].machineTime,
      routingId: singlePageData[0].routingId,
      lotSize: singlePageData[0].lotSize,
      uomid: singlePageData[0].uomid,
      workCenterCode: singlePageData[0].workCenterCode,
    };
  }
  const [rowDataCreate, setRowDataCreate] = useState([]);

  useEffect(() => {
    if (id && singData?.plantName && singData?.shopFloorName) {
      getWorkCenterNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singData.plantName.value,
        singData.shopFloorName.value,
        setWorkCenterNameDDL
      );

      getBomNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singData?.plantName.value,
        singData?.itemName.value,
        singData.shopFloorName.value,
        setBomNameDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singlePageData]);

  const saveHandler = async (values, cb) => {
    if (values) {
      if (id) {
        const payload = {
          routingId: +id,
          lotSize: values?.lotSize,
          uomid: values?.uomid,
          billOfMaterialId: values?.bomNameDDL.value,
          workCenterId: values?.workCenterName.value,
          workCenterCode: values?.workCenterCode,
          capacity: +values?.capacity,
          laborQty: +values?.laborQty,
          laborTime: +values?.laborTime,
          setupTime: +values?.setUpTime,
          machineTime: +values?.machineTime,
          laborCost: +values?.laborCost,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
        };

        saveEditData(payload, setDisabled);
      } else {
        const payload = {
          itemId: values?.itemName.value,
          lotSize: values?.bomNameDDL.lotSize,
          uomid: values?.bomNameDDL.baseUomid,
          billOfMaterialId: values?.bomNameDDL.value,
          workCenterId: values?.workCenterName.value,
          workCenterCode: values?.workCenterName.code,
          capacity: +values?.capacity,
          setUpTime: +values?.setUpTime,
          numMachineTime: +values?.machineTime,
          laborQty: +values?.laborQty,
          laborTime: +values?.laborTime,
          laborCost: +values?.laborCost,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          plantId: values?.plantName.value,

          shopFloorId: values?.shopFloorName.value,
          actionBy: profileData.userId,
        };
        saveCreateData(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Routing" : " Create Routing"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singData : initData}
          saveHandler={saveHandler}
          isEdit={id ? id : false}
          id={id}
          plantNameDDL={plantNameDDL}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          setRowDataCreate={setRowDataCreate}
          shopFloorDDL={shopFloorDDL}
          rowDataCreate={rowDataCreate}
          setWorkCenterNameDDL={setWorkCenterNameDDL}
          workCenterNameDDL={workCenterNameDDL}
          itemNameDDL={itemNameDDL}
          bomNameDDL={bomNameDDL}
          setItemNameDDL={setItemNameDDL}
          setShopFloorDDL={setShopFloorDDL}
          billOfMaterialNameDDL={billOfMaterialNameDDL}
          setBillOfMaterialNameDDL={setBillOfMaterialNameDDL}
          setBomNameDDL={setBomNameDDL}
        />
      </div>
    </IForm>
  );
}
