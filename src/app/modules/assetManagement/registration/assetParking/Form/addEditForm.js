/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  saveItemRequest,
  getAssetReceiveDDL,
  getAssignToDDL,
  getresponsiblePersonDDL,
  saveAssetData,
  getDepartmenttDDL,
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
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

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
  brtaType:"",
  assetName:"",
  category:"",
  lifeTimeYear: "",
  depRunRate: "",
};

export default function AssetParkingForm({ currentRowData,setIsShowModal }) {
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
  const [assetDetais, setAssetDetais] = useState([]);
  const [assignTO, setAssignTo] = useState([]);
  const [responsiblePerson, setResponsiblePerson] = useState([]);
  const [brtaList, setbrtaList] = useState([]);
  const [department, setDepartment] = useState([]);
  const [categoryDDL, setCategoryDDL] = useState([])
  const [profitCenterDDL, getProfitCenterDDL, profitCenterLoading, setProfitCenterDDL] = useAxiosGet() 

  
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

  useEffect(() => {
    getAssetCategoryList(setCategoryDDL)
  },[])

  useEffect(() => {
    getAssetReceiveDDL(
      currentRowData.assetReceiveId,
      currentRowData.itemId,
      setAssetDetais
    );
    getDepartmenttDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData.userId,
      setDepartment
    );
    getBrtaDDL(setbrtaList)
    getProfitCenterDDL(`/fino/CostSheet/ProfitCenterDetails?UnitId=${selectedBusinessUnit?.value}`,
    data => {
      const newData = data?.map(itm => {
         itm.value = itm?.profitCenterId;
         itm.label = itm?.profitCenterName;
         return itm;
      });
      setProfitCenterDDL(newData);
   })
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (assetDetais && assetDetais.sbuid) {
      getAssignToDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        assetDetais.sbuid,
        setAssignTo
      );
      getresponsiblePersonDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        assetDetais.sbuid,
        setResponsiblePerson
      );
    }
  }, [assetDetais]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        assetId:0,
        assetDescription: values.assetDes || "",
        accountId: profileData?.accountId,
        plantId: assetDetais.plantId || 0,
        plantName: assetDetais.plantName || "",
        businessUnitId: selectedBusinessUnit?.value,
        businessUnitName: selectedBusinessUnit?.label,
        sbuId: assetDetais.sbuid || 0,
        sbuName: assetDetais.sbuname || "",
        warehouseId: assetDetais.warehouseId || 0,
        warehouseName: assetDetais.warehouseName || "",
        itemId: assetDetais.itemId || 0,
        itemCode: assetDetais.itemCode || 0,
        itemName: assetDetais.itemName || "",
        nameManufacturer: values.manuName || "",
        inventoryTransectionId:assetDetais.assetReceiveId || 0,
        countryOrigin: values.countryOrigin || "",
        supplierId: assetDetais.businessPartnerId || 0,
        supplierName: assetDetais.businessPartnerName || "",
        poId: assetDetais.referenceId || 0,
        poNo: assetDetais.referenceCode || "",
        acquisitionDate: _dateFormatter(assetDetais.transactionDate),
        numInvoiceValue: assetDetais.transactionValue,
        numOtherCost: 0,
        numAcquisitionValue: assetDetais.transactionValue || 0,
        numBookValue: 0,
        numTotalDepValue: +values.depriValue || 0,
        depRunDate: values.depriRunDate,
        warrentyEndDate: values.warrentyEnd,
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
        serialNo: values?.manuSerialNumber,
        brtaVehicelTypeId: values?.brtaType?.value || 0,
        quantity: +values?.transactionQuantity || 0,
        assetName: values?.assetName || "",
        assetCategoryId: values?.category?.value || 0,
        assetCategoryName: values?.category?.label || "",
        depRate: +values?.depRunRate || 0,
        lifeTimeYear: +values?.lifeTimeYear || 0,
        profitCenterId: +values?.profitCenter?.value || 0,
        profitCenterName: values?.profitCenter?.label || "",
      };
      // console.log(payload,"payload")
      saveAssetData(payload, cb , setIsShowModal,setDisabled ,IConfirmModal);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="AssetParking">
      <IForm
        title="Create Asset Parking"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {profitCenterLoading && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          singleData={singleData}
          location={location.state}
          currentRowData={currentRowData}
          assetDetais={assetDetais}
          assignTO={assignTO}
          responsiblePerson={responsiblePerson}
          department={department}
          profileData={profileData}
          brtaList={brtaList}
          categoryDDL={categoryDDL}
          profitCenterDDL={profitCenterDDL}
        />
      </IForm>
    </div>
  );
}
