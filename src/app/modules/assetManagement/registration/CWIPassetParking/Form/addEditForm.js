import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import "../assetParking.css";
import {
  getAssignToDDL, getDepartmenttDDL, getItemAttributeforCreate, getItemDDLforCreate, getresponsiblePersonDDL, getSingleDataForEdit, getSupplierDDLforCreate, saveAssetForData
} from "../helper";
import Form from "./form";

export default function AssetListForm({ currentRowData ,setIsShowModal }) {
  const location = useLocation();
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [singleData, setSingleData] = useState([]);
  const [assignTO, setAssignTo] = useState([]);
  const [responsiblePerson, setResponsiblePerson] = useState([]);
  const [department, setDepartment] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [itemAttribute, setItemAttribute] = useState([]);

  console.log(currentRowData, 'currentRowData')

  useEffect(() => {
    getSingleDataForEdit(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      currentRowData.intAssetId,
      setSingleData
    );
    getDepartmenttDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData.userId,
      setDepartment
    );
    getAssignToDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      currentRowData.intSbuId,
      setAssignTo
    );
    getresponsiblePersonDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      currentRowData.intSbuId,
      setResponsiblePerson
    );
    getItemDDLforCreate(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      currentRowData.intPlantId,
      currentRowData.intWarehouseId,
      setItemList
    );
    getSupplierDDLforCreate(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSupplierList
    );
    getItemAttributeforCreate(
      currentRowData.intItemId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setItemAttribute
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const onChangeForItem = (item) => {
    getItemAttributeforCreate(
      item.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setItemAttribute
    );
  };

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        assetId: currentRowData?.intAssetId || 0,
        assetDescription: values?.assetDes || "",
        accountId: profileData?.accountId || 0,
        plantId: currentRowData?.intPlantId || 0,
        plantName: currentRowData?.strPlantName || "",
        businessUnitId: selectedBusinessUnit?.value || 0,
        businessUnitName: selectedBusinessUnit?.label || "",
        sbuId: currentRowData?.intSbuId || 0,
        sbuName: currentRowData?.strSbuName || "",
        warehouseId: currentRowData?.intWarehouseId || 0,
        warehouseName: currentRowData?.strWarehouseName || "",
        itemId: values?.itemName?.value || 0,
        itemCode: values?.itemName?.code || "",
        itemName: values?.itemName?.label || "",
        nameManufacturer: values?.manuName || "",
        inventoryTransectionId:0,
        countryOrigin: values?.countryOrigin || "",
        supplierId: values?.businessPartnerName?.value || 0,
        supplierName: values?.businessPartnerName?.label || "",
        poId: 0,
        poNo: values?.referenceCode || "",
        acquisitionDate: values?.transactionDate,
        numInvoiceValue: +values?.transactionValue || 0,
        numOtherCost: 0,
        numAcquisitionValue: +values?.acquisitionValue || 0,
        numBookValue: 0,
        numTotalDepValue: +values?.depriValue || 0,
        depRunDate: values?.depriRunDate || "",
        warrentyEndDate: values?.warrentyEnd || "",
        location: values?.location || "",
        useTypeId: values?.usageType?.value || 0,
        useTypeName: values?.usageType?.label || "",
        useStatusId: 0,
        usingEmployeeId: values?.assignTo?.value || 0,
        usingEmployeName: values?.assignTo?.label || "",
        usingDepartmentId: values?.departnemt?.value || 0,
        departmentName: values?.departnemt?.label || "",
        responsibleEmployeeId: values?.resPerson?.value || 0,
        responsibleEmpName: values?.resPerson?.label || "",
        actionBy: profileData?.userId,
        assetTypeName: currentRowData?.strAssetTypeName || "",
        depRate: currentRowData?.numDepRate || 0,
        serialNo: values?.strManufacturerSerialNo,
        brtaVehicelTypeId: currentRowData?.intBrtaVehicelTypeId || 0
      };
      saveAssetForData(payload, ()=>{
        setItemAttribute([]);
        setIsShowModal(false);
      } , setDisabled);
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="AssetList">
      <IForm title="Edit Asset" getProps={setObjprops} isDisabled={isDisabled}>
        <Form
          {...objProps}
          initData={singleData}
          saveHandler={saveHandler}
          // disableHandler={disableHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          singleData={singleData}
          location={location.state}
          currentRowData={currentRowData}
          assignTO={assignTO}
          responsiblePerson={responsiblePerson}
          department={department}
          supplierList={supplierList}
          itemList={itemList}
          onChangeForItem={onChangeForItem}
          itemAttribute={itemAttribute}
          profileData={profileData}
        />
      </IForm>
    </div>
  );
}
