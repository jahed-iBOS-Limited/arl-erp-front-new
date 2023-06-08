/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";

import { useLocation } from "react-router-dom";
import {
  createWorkCenter, editWorkCenter, getAssetIdDDL, getEmployeeIdDDL, getItemAttribute, getPlantNameDDL, getProductionLineDDL, getShopFloorIdDDL, getUOMDDL, getWorkCenterById
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import Form from "./form";

const initData = {
  plantName: "",
  productionLine: "",
  workcenterName: "",
  workcenterCode: "",
  workCenterCapacity: "",
  UomName: "",
  itemName: "",
  itemCode: "",
  setupTime: "",
  machineTime: "",
  laborQty: "",
  laborTime: "",
  laborCost: "",
  assetId: "",
  employeeId: "",
  shopFloorId: "",
  rowItemUOM: "",
};

export default function WorkCenterForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [productionLineDDL, setProductionLineDDL] = useState("");
  const [plantDDL, setPlantDDL] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [assetDDL, setAssetDDL] = useState("");
  const [itemNameDDL, setItemNameDDL] = useState("");
  const [shopfloorDDL, setShopFloorDDL] = useState("");
  const [singleData, setSingleData] = useState("");
  const [singleRowData, setSingleRowData] = useState("");
  const [uomDDL, setUomDDL] = useState("");
  const location = useLocation();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPlantNameDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPlantNameDDL]);

  useEffect(() => {
    getUOMDDL(profileData?.accountId, selectedBusinessUnit?.value, setUomDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   getShopFloorIdDDL(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setShopFloorDDL
  //   );
  // }, [getShopFloorIdDDL]);

  // useEffect(() => {
  //   getProductionLineDDL(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setProductionLineDDL
  //   );
  // }, [getProductionLineDDL]);

  // useEffect(() => {
  //   getAssetIdDDL(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setAssetDDL
  //   );
  // }, [getAssetIdDDL]);

  useEffect(() => {
    getEmployeeIdDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setEmployeeId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEmployeeIdDDL]);

  useEffect(() => {
    getWorkCenterById(
      id,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSingleData,
      setSingleRowData
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWorkCenterById]);

  useEffect(() => {
    if (id && singleData) {
      getItemAttribute(
        singleData?.plantName.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemNameDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (id && singleData) {
      getShopFloorIdDDL(
        singleData?.plantName.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShopFloorDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (id && singleData) {
      getAssetIdDDL(
        singleData?.plantName.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setAssetDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (id && singleData) {
      getProductionLineDDL(
        singleData?.shopFloorId?.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setProductionLineDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const onChangeForItem = (item) => {
    getItemAttribute(
      item?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setItemNameDDL
    );
  };

  const onChangeForShopFloor = (item) => {
    getShopFloorIdDDL(
      item?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShopFloorDDL
    );
  };
  const onChangeForProductionLineId = (item) => {
    getProductionLineDDL(
      item?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setProductionLineDDL
    );
  };
  const onChangeForAssetId = (item) => {
    getAssetIdDDL(
      item?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setAssetDDL
    );
  };

  const saveHandler = async (values, rowData, cb) => {
    // if (!values.assetId && !values.employeeId) {
    //   return toast.error("Please Select Assets Id or Employe Id");
    // }
    if (values) {
      if (id) {
        let payload = {
          editHeader: {
            workCenterId: +id,
            workCenterCode: values?.workcenterCode,
            workCenterName: values?.workcenterName,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            productionLineId: +values?.productionLine?.value,
            workCenterCapacity: +values?.workCenterCapacity,
            setUpTime: +values?.setupTime,
            machineTime: +values?.machineTime,
            laborQty: +values?.laborQty,
            laborTime: +values?.laborTime,
            laborCost: +values?.laborCost,
            plantId: +values?.plantName?.value,
            assetId: +values?.assetId?.value || 0,
            employeeId: +values?.employeeId?.value || 0,
            shopFloorId: +values?.shopFloorId?.value,
            shopFloorName: values?.shopFloorId.label,
            UomId: +values?.UomName?.value,
            actionBy: profileData?.userId,
          },
          editrow: rowData,
        };
        editWorkCenter(payload, setDisabled);
      } else {
        let payload = {
          objheader: {
            workCenterCode: values?.workcenterCode,
            workCenterName: values?.workcenterName,
            description: "",
            capacity: 0,
            UomId: 0,
            stdcapacity: +values?.workCenterCapacity,
            stdsetUpTime: +values?.setupTime,
            stdmachineTime: +values?.machineTime,
            stdlaborQty: +values?.laborQty,
            stdlaborTime: +values?.laborTime,
            stdlaborCost: +values?.laborCost,
            assetId: +values?.assetId?.value || 0,
            employeeId: +values?.employeeId?.value || 0,
            accountId: profileData?.accountId,
            plantId: +values?.plantName?.value,
            businessUnitId: selectedBusinessUnit?.value,
            shopFloorId: +values?.shopFloorId?.value,
            shopFloorName: values?.shopFloorId?.label,
            productionLineId: +values?.productionLine?.value,
            isActive: true,
            actionBy: profileData?.userId,
          },
          objrow: rowData,
        };
        createWorkCenter(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    onChangeForItem(location?.state);
    onChangeForShopFloor(location?.state);
    onChangeForAssetId(location?.state);
  }, [location?.state]);

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Work Center" : "Create Work Center"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : { ...initData, plantName: location?.state }}
        singleRowData={singleRowData}
        saveHandler={saveHandler}
        productionLineDDL={productionLineDDL}
        assetDDL={assetDDL}
        plantDDL={plantDDL}
        itemNameDDL={itemNameDDL}
        uomDDL={uomDDL}
        shopfloorDDL={shopfloorDDL}
        employeeId={employeeId}
        onChangeForItem={onChangeForItem}
        onChangeForShopFloor={onChangeForShopFloor}
        onChangeForProductionLine={onChangeForProductionLineId}
        onChangeForAssetId={onChangeForAssetId}
        isEdit={id || false}
      />
    </IForm>
  );
}
