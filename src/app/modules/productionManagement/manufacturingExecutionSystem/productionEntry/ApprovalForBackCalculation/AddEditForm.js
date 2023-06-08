/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getPlantNameDDL,
  getShiftDDL,
  // editApprovalProductionEntry,
  getsbuDDL,
  getSingleDataByForBackCalculation,
  editApprovalProductionEntryForBackCalculation,
} from "../helper";
import Form from "./Form";
import Loading from "./../../../../_helper/_loading";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

let initData = {
  id: undefined,
  plantName: "",
  productionOrder: "",
  orderQty: "",
  dteProductionDate: _todayDate(),
  shift: "",
  itemName: "",
  goodQty: "",
  goodReceivedQty: "",
  othersOutputItem: "",
  othersOutputQty: "",
  sbu: "",
  productionEntryCode: "",
  // costCenter: "",
  // profitcenter: "",
};

export default function ProductionEntryBackCalculationApprovalForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [plantNameDDL, setPlantNameDDL] = useState([]);
  const [shiftDDL, setShiftDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [sbuDDL, setsbuDDL] = useState([]);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(false);
  const [singleBackCalculationData, setSingleBackCalculationData] = useState(
    {}
  );
  const [singleDataForLocation, getSingleDataForLocation, locationLoading] = useAxiosGet()

  const params = useParams();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getsbuDDL(profileData?.accountId, selectedBusinessUnit?.value, setsbuDDL);
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (params?.bId) {
      getSingleDataByForBackCalculation(
        params?.bId,
        setSingleBackCalculationData,
        setRowData
      );
    }
  }, [params?.bId]);

  // console.log("singleBackCalculationData: ", singleBackCalculationData);

  const saveHandler = (values, cb) => {
    if (values && profileData.accountId && selectedBusinessUnit) {
      if (params?.bId) {
        const objRowData = rowData?.map((item) => {
          return {
            // productionId: +params?.bId,
            // productionCode: singleBackCalculationData?.header?.productionCode,
            // productionDate: _dateFormatter(
            //   singleBackCalculationData?.dteProductionDate
            // ),
            // accountId: profileData?.accountId,
            // businessUnitId: selectedBusinessUnit?.value,
            // plantId: singleBackCalculationData?.plantName?.value,
            // sbuId: values?.sbu?.value,
            // shiftId: singleBackCalculationData?.shift?.value,
            // itemId: +item?.itemId,
            // itemName: item?.itemName,
            // itemQty: +item.approvedQuantity,
            productionDate: _dateFormatter(item?.productionDate),
            itemId: +item?.itemId,
            itemName: item?.itemName,
            itemQty: +item?.approvedQuantity,
            uoMId: item?.uomid,
            uoMName: item?.uomname,
            isMain: item?.isMain
          };
        });

        const payload = {
          header: {
            // productionId: +params?.bId,
            // accountId: profileData.accountId,
            // businessUnitId: selectedBusinessUnit.value,
            // plantId: values?.plantName?.value,
            // shopFloorId: values?.shopFloor?.value,
            // shopFloorName: values?.shopFloor?.label,
            // actionBy: profileData?.userId,
            // shiftId: values?.shift?.value,
            // sbuId: values?.sbu?.value,

            productionId: +params?.bId,
            productionCode: values?.header?.productionCode,
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            billofMaterialId: values?.header?.billOfMaterialId,
            plantId: values?.plantId,
            plantName: values?.plantName?.label,
            sbuId: values?.sbu?.value,
            sbuName: values?.sbu?.label,
            warehouseId: values?.wareHouse?.value,
            warehouseName: values?.wareHouse?.label,
            locationId: singleDataForLocation?.header?.locationData?.value || 0,
            locationName: singleDataForLocation?.header?.locationData?.label || "",
            shiftId: values?.shift?.value,
            shiftName: values?.shift?.label,
            actionBy: profileData?.userId,
            shopFloorId: values?.shopFloor?.value,
            shopFloorName: values?.shopFloor?.label,
            costCenterId: values?.costCenter?.value || 0,
            costCenterName: values?.costCenter?.label || "",
            profitCenterId:values?.profitcenter?.value || 0,
            profitCenterName: values?.profitcenter?.label || "",
          },
          row: objRowData,
        };
        window.paylaod = payload;
        if (!values?.sbu?.value) {
          toast.warn("Please select SBU");
        } else {
          editApprovalProductionEntryForBackCalculation(
            payload,
            setDisabled,
            setSaveBtnDisabled
          );
        }
      }
    }
  };

  useEffect(() => {
    getPlantNameDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlantNameDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value, setPlantNameDDL]);

  useEffect(() => {
    getShiftDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShiftDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const rowDto = singleBackCalculationData?.row;
  // console.log(rowDto)

  const dataHandler = (name, value, sl) => {
    const xData = [...rowData];
    xData[sl][name] = value;
    setRowData([...xData]);
  };

  return (
    <IForm
      title="Approve Production Entry"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset
      isHiddenSave={saveBtnDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.bId ? singleBackCalculationData : initData}
        saveHandler={saveHandler}
        plantNameDDL={plantNameDDL}
        singleBackCalculationData={singleBackCalculationData}
        shiftDDL={shiftDDL}
        rowData={rowData}
        setRowData={setRowData}
        isEdit={params?.bId ? true : false}
        dataHandler={dataHandler}
        sbuDDL={sbuDDL}
        selectedBusinessUnit={selectedBusinessUnit}
        profileData={profileData}
        rowDto={rowDto}
        getSingleDataForLocation={getSingleDataForLocation}
        productionId={params?.bId}
        locationLoading={locationLoading}
      />
    </IForm>
  );
}
