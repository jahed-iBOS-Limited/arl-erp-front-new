/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import {
  getAssetCategoryList,
  getAssignToDDL,
  getBrtaDDL,
  getDepartmenttDDL,
  getItemAttributeforCreate,
  getItemDDLforCreate,
  getSingleDataForEdit,
  getSupplierDDLforCreate,
  getresponsiblePersonDDL,
  saveAssetListEdit,
} from "../helper";
import Form from "./form";

import { useLocation } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import "../assetList.css";

export default function AssetListForm({ currentRowData }) {
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
  const [categoryDDL, setCategoryDDL] = useState([])
  const [brtaList, setbrtaList] = useState([]);
  const [
    profitCenterDDL,
    getProfitCenterDDL,
    ,
    setProfitCenterDDL,
  ] = useAxiosGet();


  console.log(singleData, 'singleData')
  useEffect(() => {
    getAssetCategoryList(setCategoryDDL)
  },[])

  useEffect(() => {
    getProfitCenterDDL(
      `/costmgmt/ProfitCenter/GetProfitCenterInformation?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        const newData = data?.map((itm) => {
          itm.value = itm?.profitCenterId;
          itm.label = itm?.profitCenterName;
          return itm;
        });
        setProfitCenterDDL(newData);
      }
    );
    getSingleDataForEdit(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      currentRowData.assetId,
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
      currentRowData.sbuId,
      setAssignTo
    );
    getresponsiblePersonDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      currentRowData.sbuId,
      setResponsiblePerson
    );
    getItemDDLforCreate(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      currentRowData.plantId,
      currentRowData.warehouseId,
      setItemList
    );
    getSupplierDDLforCreate(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSupplierList
    );
    // getItemAttributeforCreate(
    //   currentRowData.itemId,
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   setItemAttribute
    // );
    getBrtaDDL(setbrtaList)
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
      // console.log(values)
      const payload = {
        assetId: currentRowData.assetId || 0,
        assetDescription: values.assetDes || "",
        accountId: profileData?.accountId,
        plantId: currentRowData.plantId || 0,
        plantName: currentRowData.plantName || "",
        businessUnitId: selectedBusinessUnit?.value,
        businessUnitName: selectedBusinessUnit?.label,
        sbuId: currentRowData.sbuId || 0,
        sbuName: currentRowData.sbuName || "",
        warehouseId: currentRowData.warehouseId || 0,
        warehouseName: currentRowData.warehouseName || "",
        itemId: values.itemName.value || 0,
        itemCode: values.itemName.code || "",
        itemName: values.itemName.label || "",
        nameManufacturer: values.manuName || "",
        countryOrigin: values.countryOrigin || "",
        supplierId: values.businessPartnerName.value || 0,
        supplierName: values.businessPartnerName.label || "",
        poId: 0,
        poNo: values.referenceCode || "",
        acquisitionDate: values.transactionDate,
        numInvoiceValue: +values.transactionValue || 0,
        numOtherCost: 0,
        numAcquisitionValue: +values.acquisitionValue || 0,
        numBookValue: 0,
        numTotalDepValue: +values.depriValue || 0,
        depRunDate: values.depriRunDate,
        warrentyEndDate: values.warrentyEnd,
        location: values.location || "",
        useTypeId: values.usageType.value || 0,
        useTypeName: values.usageType.label ||"",
        useStatusId: 0,
        usingEmployeeId: values.assignTo.value || 0,
        usingEmployeName: values.assignTo.label || "",
        usingDepartmentId: values.departnemt.value || 0,
        departmentName: values.departnemt.label || "",
        responsibleEmployeeId: values.resPerson.value || 0,
        responsibleEmpName: values.resPerson.label || "",
        actionBy: profileData.userId,
        serialNo: values.strManufacturerSerialNo,
        assetName: values?.assetName || "",
        assetCategoryId: values?.category?.value || 0,
        assetCategoryName: values?.category?.label || "",
        brtaVehicelTypeId: values?.brtaType?.value,
        inventoryTransectionId: 0,
        depRate: 0,
        assetTypeName: "",
        quantity: 0,
        profitCenterId : values?.profitCenter?.value || 0,
        profitCenterName : values?.profitCenter?.label || "",
      };
      saveAssetListEdit(payload, setDisabled);
    } else {
      setDisabled(false);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

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
          categoryDDL={categoryDDL}
          brtaList={brtaList}
          profitCenterDDL={profitCenterDDL}
        />
      </IForm>
    </div>
  );
}
