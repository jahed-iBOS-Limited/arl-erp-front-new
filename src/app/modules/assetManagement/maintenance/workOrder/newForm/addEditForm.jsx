/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { _todayDate, _todayDateTime12HFormet } from "../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getServiceDDL, saveWorkOrderData } from "../helpers";

const initData = {
  assetNo: "",
  assetName: "",
  businessUnit: "",
  picked: "Preventive",
  service: "",
  priority: "",
  assetDate: _todayDateTime12HFormet(),
  problem: "",
};

export default function AssetOrderForm({
  currentRowData,
  sbuName,
  plantName,
  warehouseName,
  setGridData,
  setisShowModalforCreate
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

  const [serviceDDL, setServiceDDL] = useState([]);
  const [assetListDDL, setAssetListDDL] = useState([]);

  useEffect(() => {
    getServiceDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      plantName?.value,
      warehouseName?.value,
      setServiceDDL
    );
    // getAssetListDDL(plantName.value, setAssetListDDL);
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const isPreventive = () => {
        if(values?.picked === "OthersInstallation") {
          return 0;
        }
        return values.picked === "Preventive" ? true : false;
      }

      const payload = {
        assetId: values?.assetNo?.value,
        assetCode: values?.assetNo?.code,
        assetDescription: values?.assetNo?.label ? values?.assetNo?.label?.split("[")[0] : "",
        accountId: profileData?.accountId,
        sbuId: sbuName?.value,
        plantId: plantName?.value,
        businessUnitId: selectedBusinessUnit?.value,
        itemServiceId: values?.service?.value,
        itemServiceName: values?.service?.label,
        warehouseId: warehouseName?.value,
        warehouseName: warehouseName?.label,
        dueMaintenanceDate: _todayDate(),
        isPreventive: isPreventive(),
        IsOthersInstallation: values?.picked === "OthersInstallation" ? true : false,
        startDateTime: values?.assetDate,
        isComplete: false,
        status: "",
        costCenterId: 0,
        priority: values?.priority?.value,
        priorityName: values?.priority?.label,
        customerContactName: "",
        customerContactNo: "",
        problems: values?.problem,
        notes: "",
        actionBy: profileData?.userId,
      };
      saveWorkOrderData(
        payload,
        cb,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plantName?.value,
        setGridData,
        setDisabled,
        setisShowModalforCreate
      );
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="Assetorders">
      <IForm
        title="Work Order"
        getProps={setObjprops}
        isDisabled={isDisabled}
        isHiddenReset
        isHiddenBack
      >
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          // disableHandler={disableHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          serviceDDL={serviceDDL}
          assetListDDL={assetListDDL}
          plantId={plantName?.value}
          setAssetListDDL={setAssetListDDL}
        />
      </IForm>
    </div>
  );
}
