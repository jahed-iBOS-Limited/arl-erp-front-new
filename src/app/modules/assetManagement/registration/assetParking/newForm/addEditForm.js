/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  getAssignToDDLforCreate,
  getresponsiblePersonDDLforCreate,
  saveAssetForData,
  getDepartmenttDDL,
  getItemDDLforCreate,
  getSupplierDDLforCreate,
  getItemAttributeforCreate,
  getBrtaDDL,
  getAssetCategoryList
} from "../helper";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import "../assetParking.css";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { confirmAlert } from "react-confirm-alert";

const _WrrentyDate = () => {
  var today = new Date();
  const warentyDate =
    today.getFullYear() +
    1 +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  return warentyDate;
};

const initData = {
  itemName: "",
  // uoMname: "",
  transactionQuantity: "",
  referenceCode: "",
  businessPartnerName: "",
  transactionDate: _todayDate(),
  transactionValue: "",
  acquisitionValue: "",
  manuName: "",
  countryOrigin: "",
  warrentyEnd: _WrrentyDate(),
  location: "",
  depriValue: "",
  depriRunDate: _todayDate(),
  assignTo: "",
  usageType: "",
  resPerson: "",
  assetDes: "",
  departnemt: "",
  assetType: "",
  manuSerialNumber: "",
  brtaType:"",
  assetName:"",
  category:"",
  itemCategory:"",
  lifeTimeYear: "",
  depRunRate: "",
};

export default function AssetParkingCreateForm({
  sbuName,
  plantName,
  warehouseName,
  setIsShowModal
}) {
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

  const [itemList, setItemList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [assignTO, setAssignTo] = useState([]);
  const [responsiblePerson, setResponsiblePerson] = useState([]);
  const [department, setDepartment] = useState([]);
  const [itemAttribute, setItemAttribute] = useState([]);
  const [uomList, setUOMList] = useState([]);
  const [brtaList, setbrtaList] = useState([]);
  const [categoryDDL, setCategoryDDL] = useState([])

  useEffect(() => {
    getDepartmenttDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData.userId,
      setDepartment
    );
    getAssignToDDLforCreate(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      sbuName?.value,
      setAssignTo
    );
    getresponsiblePersonDDLforCreate(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      sbuName?.value,
      setResponsiblePerson
    );
    getItemDDLforCreate(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      plantName?.value,
      warehouseName?.value,
      setItemList
    );
    getSupplierDDLforCreate(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSupplierList
    );
    getBrtaDDL(setbrtaList)
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    getAssetCategoryList(setCategoryDDL)
  },[])

  const onChangeForItem = (item) => {
    getItemAttributeforCreate(
      item?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setItemAttribute
    );
  };

   //save event Modal (code see)
   const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "Ok",
          onClick: () => noAlertFunc(),
        },
      ],
    });
  };

  const saveHandler = async (values, cb) => {
    
    
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        assetId:0,
        assetDescription: values.assetDes || "",
        accountId: profileData?.accountId || 0,
        plantId: plantName.value || 0,
        plantName: plantName.label || "",
        businessUnitId: selectedBusinessUnit?.value || 0,
        businessUnitName: selectedBusinessUnit?.label || "",
        sbuId: sbuName.value || 0,
        sbuName: sbuName.label || "",
        warehouseId: warehouseName.value || 0,
        warehouseName: warehouseName.label || "",
        itemId: values.itemName.value || 0,
        itemCode: values.itemName.code || "",
        itemName: values.itemName.label || "",
        nameManufacturer: values.manuName || "",
        inventoryTransectionId:0,
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
        depRunDate: values.depriRunDate || "",
        warrentyEndDate: values.warrentyEnd || "",
        location: values.location || "",
        useTypeId: values.usageType.value || 0,
        useTypeName: values.usageType.label || "",
        useStatusId: 0,
        usingEmployeeId: values.assignTo.value || 0,
        usingEmployeName: values.assignTo.label || "",
        usingDepartmentId: values.departnemt.value || 0,
        departmentName: values.departnemt.label || "",
        responsibleEmployeeId: values.resPerson.value || 0,
        responsibleEmpName: values.resPerson.label || "",
        actionBy: profileData.userId,
        assetTypeName: values?.assetType?.label || "",
        depRate: +values?.depRunRate || 0,
        lifeTimeYear: +values?.lifeTimeYear || 0,
        serialNo: values?.manuSerialNumber,
        brtaVehicelTypeId: values?.brtaType?.value || 0,
        assetName: values?.assetName || "",
        assetCategoryId: values?.category?.value || 0,
        assetCategoryName: values?.category?.label || "",
      };
     // window.payload = payload
      saveAssetForData(payload, cb, setItemAttribute, setDisabled, setIsShowModal ,IConfirmModal);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="AssetParking">
      <IForm
        title="Create Asset Parking"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          // disableHandler={disableHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          itemList={itemList}
          location={location.state}
          supplierList={supplierList}
          assignTO={assignTO}
          responsiblePerson={responsiblePerson}
          department={department}
          onChangeForItem={onChangeForItem}
          itemAttribute={itemAttribute}
          plId= {plantName.value}
          whId = {warehouseName.value}
          setUOMList={setUOMList}
          uomList={uomList}
          profileData={profileData}
          brtaList={brtaList}
          categoryDDL={categoryDDL}
        />
      </IForm>
    </div>
  );
}
