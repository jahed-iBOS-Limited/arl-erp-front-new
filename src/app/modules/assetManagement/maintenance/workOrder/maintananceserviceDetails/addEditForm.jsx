/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICustomCard from "../../../../_helper/_customCard";
import {
  getWarehouseDDL,
  getServiceDDL,
  savesparePartsData,
  savesubserviceCostData,
  getSubTaskData,
  getPartsDDL,
  getMaintanaceItemTaskData,
  saveItemTaskforEdit,
  deleteItemData,
  saveSubTaskforEdit,
  deleteSubTaskData,
  getSubTaskListDDL,
} from "./helper";

const initData = {
  warehouse: "",
  parts: "",
  quantity: "",
  remarks: "",
  stockQuantity: "",
  value: "",
  serviceName: "",
  serviceCost: "",
  descriptionSub: "",
  costCenter: "",
  costElement: "",
  narration: "",
};

export default function MaintananceServiceDetailsForm({
  currentRowData,
  singleData,
}) {
  const [isDisabled, setDisabled] = useState(true);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  const [warehouseDDl, setWarehouseDDl] = useState([]);
  const [serviceDDL, setServiceDDL] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [subTask, setSubTask] = useState([]);
  const [sparePartsDDL, setSparePartsDDL] = useState([]);

  useEffect(() => {
    getWarehouseDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      singleData?.plantId,
      setWarehouseDDl
    );
    // getServiceDDL(
    //   profileData.accountId,
    //   selectedBusinessUnit.value,
    //   singleData.plantId,
    //   singleData.warehouseId,
    //   setServiceDDL
    // );

    getSubTaskData(currentRowData?.rowId, setSubTask);
    // getPartsDDL(profileData.accountId,
    //   selectedBusinessUnit.value,
    //   singleData.plantId,
    //   singleData.warehouseId,setSparePartsDDL)
    getMaintanaceItemTaskData(currentRowData?.rowId, setSpareParts);
  }, []);

  useEffect(() => {
    if (currentRowData?.rowId)
      getSubTaskListDDL(
        currentRowData?.rowId,
        selectedBusinessUnit.value,
        setServiceDDL
      );
  }, [currentRowData]);

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandlerforSpareParts = (name, value, sl) => {
    let data = [...spareParts];
    let _sl = data[sl];
    _sl[name] = +value;
    setSpareParts(data);
  };

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandlerforSubTask = (name, value, sl) => {
    let data = [...subTask];
    let _sl = data[sl];
    _sl[name] = +value;
    setSubTask(data);
  };

  const onClickForSparePArts = (values) => {
    let payload = {
      maintenanceId: currentRowData?.maintenanceId,
      mntTaskId: currentRowData?.rowId,
      itemId: values?.parts?.value,
      itemName: values?.parts?.label,
      uomId: values?.parts?.uomId,
      uomName: values?.parts?.uomName,
      numQuantity: +values?.quantity,
      numPrice: +values?.value,
      numAmount: +values?.value * values?.quantity,
      wareHouseId: values?.warehouse?.value,
      wareHouseName: values?.warehouse?.label,
      itemRequestId: 0,
      itemRequestCode: "",
      description: values?.narration,
      actionBy: profileData?.userId,
      intCostElementId: values?.costElement?.value,
    };
    savesparePartsData(payload, currentRowData?.rowId, setSpareParts);
  };

  const onClickforspareParts = (index) => {
    let data = spareParts[index];
    let payload = {
      ...data,
      numAmount: data.numQuantity * data.numPrice,
    };
    saveItemTaskforEdit(payload, currentRowData?.rowId, setSpareParts);
  };

  const onClickforDeletePArts = (id) => {
    deleteItemData(id, spareParts, setSpareParts);
  };

  const onClickForsubMntTask = (values) => {
    let payload = {
      maintenanceId: currentRowData?.maintenanceId,
      mntTaskId: currentRowData?.rowId,
      serviceId: values?.serviceName?.value,
      serviceName: values?.serviceName?.label,
      numAmount: values?.serviceCost,
      description: values?.descriptionSub,
      insertBy: profileData?.userId,
      actionBy: profileData?.userId,
    };

    savesubserviceCostData(payload, currentRowData?.rowId, setSubTask);
  };

  const onClicksubServiceParts = (index) => {
    let payload = subTask[index];

    saveSubTaskforEdit(payload);
  };

  const onClickforDeleteSubService = (rowId) => {
    deleteSubTaskData(rowId, subTask, setSubTask);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="">
      <ICustomCard title="Maintenance Service Details">
        <Form
          {...objProps}
          initData={initData}
          disableHandler={disableHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          warehouseDDl={warehouseDDl}
          serviceDDL={serviceDDL}
          onClickForSparePArts={onClickForSparePArts}
          spareParts={spareParts}
          onClickForsubMntTask={onClickForsubMntTask}
          subTask={subTask}
          sparePartsDDL={sparePartsDDL}
          rowDtoHandlerforSpareParts={rowDtoHandlerforSpareParts}
          rowDtoHandlerforSubTask={rowDtoHandlerforSubTask}
          onClickforspareParts={onClickforspareParts}
          onClickforDeletePArts={onClickforDeletePArts}
          onClicksubServiceParts={onClicksubServiceParts}
          onClickforDeleteSubService={onClickforDeleteSubService}
          plantId={singleData.plantId}
          whId={singleData.warehouseId}
          maintenanceId={currentRowData.maintenanceId}
        />
      </ICustomCard>
    </div>
  );
}
