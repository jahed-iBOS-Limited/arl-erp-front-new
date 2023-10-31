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
  getProductionOrderDDL,
  getShiftDDL,
  getSingleDataByIdApprove,
  editApprovalProductionEntry,
  getsbuDDL,
} from "../helper";
import Form from "./Form";
import Loading from "./../../../../_helper/_loading";
import { toast } from "react-toastify";
import { IssueReturnHandler } from "./helper";

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
  wareHouse: "",
};

export default function ProductionEntryApprovalForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [plantNameDDL, setPlantNameDDL] = useState([]);
  const [productionOrderDDL, setProductionOrderDDL] = useState([]);
  const [shiftDDL, setShiftDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [sbuDDL, setsbuDDL] = useState([]);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(false);

  const params = useParams();

  console.log("params", params)

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getsbuDDL(profileData?.accountId, selectedBusinessUnit?.value, setsbuDDL);
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const saveHandler = (values, cb) => {
    if (values && profileData.accountId && selectedBusinessUnit) {
      if (params?.aId) {
        const objRowData = rowData?.map((item) => {
          return {
            productionRowId: item?.productionRowId,
            outputItemName: item.itemName,
            outputItemQty: +item.approvedQuantity,
            itemId: +item?.approvedintItemId,
            uomId: 0,
            isMainItem:item?.isMain,
            materialCost: item?.materialCost || 0,
            overheadCost: item?.overheadCost || 0,
            totalAmount: item?.totalAmount || 0,
          };
        });

        const payload = {
          editHeader: {
            productionId: +params?.aId,
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            plantId: values?.plantName?.value,
            shopFloorId: values?.shopFloor?.value,
            shopFloorName: values?.shopFloor?.label,
            actionBy: profileData?.userId,
            shiftId: values?.shift?.value,
            sbuId: values?.sbu?.value,
            warehouseId: values?.wareHouse?.value || 0,
          },
          editRow: objRowData,
        };
        window.paylaod = payload;
        if (!values?.sbu?.value) {
          toast.warn("Please select a SBU");
        } else {
          editApprovalProductionEntry(payload, setDisabled, setSaveBtnDisabled, IssueReturnHandler, values, rowData);
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
    getProductionOrderDDL(
      profileData.accountId,
      selectedBusinessUnit.value,
      setProductionOrderDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    getShiftDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShiftDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    getSingleDataByIdApprove(
      params?.aId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setSingleData,
      setRowData
    );
  }, [params?.aId, profileData.accountId, selectedBusinessUnit.value]);

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
        initData={params?.aId ? singleData : initData}
        saveHandler={saveHandler}
        plantNameDDL={plantNameDDL}
        productionOrderDDL={productionOrderDDL}
        shiftDDL={shiftDDL}
        rowData={rowData}
        setRowData={setRowData}
        isEdit={params?.aId ? true : false}
        dataHandler={dataHandler}
        sbuDDL={sbuDDL}
      />
    </IForm>
  );
}
