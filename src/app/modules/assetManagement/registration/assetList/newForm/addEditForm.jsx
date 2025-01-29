/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { getItemAttributeforCreate, getSingleDataForEdit } from "../helper";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import "../assetList.css";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getMaintenanceReport } from "../helper"

export default function AssetListCreateForm({ currentRowData }) {
  const location = useLocation();
  const [isDisabled, setDisabled] = useState(true);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [singleData, setSingleData] = useState([])
  const [itemAttribute, setItemAttribute] = useState([]);
  const [maintenanceRowDto, setMaintenanceRowDto] = useState([]);
  const [assignRowDto, setAssignRowDto] = useState([]);
  useEffect(() => {
    getSingleDataForEdit(profileData?.accountId,
      selectedBusinessUnit?.value, currentRowData.assetId, setSingleData)
    getItemAttributeforCreate(currentRowData.itemId, profileData?.accountId,
      selectedBusinessUnit?.value, setItemAttribute)

  }, [profileData?.accountId,
  selectedBusinessUnit?.value]);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  useEffect(() => {
    if (currentRowData) {
      getMaintenanceReport(
        1,
        selectedBusinessUnit?.value,
        currentRowData?.plantId,
        2,
        _dateFormatter(new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
        _todayDate(),
        currentRowData?.assetId || 0,
        setMaintenanceRowDto,
        setDisabled
      );
    }

  }, [currentRowData])

  return (
    <div className="AssetListView">
      <IForm
        title="View Asset"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        <Form
          {...objProps}
          initData={singleData}
          disableHandler={disableHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          location={location.state}
          itemAttribute={itemAttribute}
          maintenanceRowDto={maintenanceRowDto}
          setMaintenanceRowDto={setMaintenanceRowDto}
          setDisabled={setDisabled}
          currentRowData={currentRowData}
          assignRowDto={assignRowDto}
        />
      </IForm>
    </div>
  );
}
