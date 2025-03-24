/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
// import { createPurchase, getSinglePurchase, editPurchase } from "../helper";
import { useParams, useLocation } from "react-router-dom";

import { _todayDate } from "../../../../_helper/_todayDate";

import {
  createOutlateProfile,
  getOutletProfileById,
  editOutlateProfile,
  getBeatApiDDL,
  commonCollerCompanyDDL,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  businessType: "",
  routeName: "",
  outletName: "",
  outletAddress: "",
  ownerName: "",
  contactType: "",
  mobileNumber: "",
  emailAddress: "",
  dateOfBirth: _todayDate(),
  marriageDate: _todayDate(),
  lattitude: "",
  longitude: "",
  beatName: "",
  marriageSatus: "",
  isColler: false,
  collerCompany: "",
};

export default function OutlateProfileFrom() {
  const { state } = useLocation();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);

  const [outletData, setOutlet] = useState([]);
  const params = useParams();
  const [singleData, setSingleData] = useState("");
  const [beatNameDDL, setBeatNameDDL] = useState("");

  const [attributes, setAttributes] = useState([]);
  const [latutude, setLatitude] = useState("");
  const [longitude, setlongitude] = useState("");
  const [collerCompanyDDL, isCollerCompany] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      isCollerCompany(commonCollerCompanyDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (params?.id) {
      getBeatApiDDL(singleData?.routeName?.value, setBeatNameDDL);
    }
  }, [params?.id, singleData]);

  useEffect(() => {
    operation({
      profileData,
      selectedBusinessUnit,
      setAttributes,
      params,
      getOutletProfileById,
      setSingleData,
      setOutlet,
    });
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setlongitude(position.coords.longitude);
    });
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
      } else {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          routeId: values?.routeName?.value,
          routeName: values?.routeName?.label,
          outletName: values?.outletName,
          ownerName: values?.ownerName,
          beatId: values.beatName.value,
          beatName: values?.beatName?.label,
          latitude: latutude,
          longitude: longitude,
          actionBy: profileData.userId,
          mobileNumber: values?.mobileNumber,
          businessType: values.businessType.value,
          outletAddress: values?.outletAddress,
          cooler: values?.isColler,
          coolerCompanyId: values?.collerCompany
            ? values?.collerCompany?.value
            : 0,
          coolerCompanyName: values?.collerCompany
            ? values?.collerCompany?.label
            : " ",
        };
        createOutlateProfile(payload, cb, setDisabled);
      }
    }
  };

  return (
    <IForm
      title="Create Outlet Profile"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}

      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={params?.id || false}
        setRowDto={setRowDto}
        attributes={attributes}
        beatNameDDL={beatNameDDL}
        setBeatNameDDL={setBeatNameDDL}
        latutude={latutude}
        longitude={longitude}
        state={state}
        collerCompanyDDL={collerCompanyDDL}
      />
    </IForm>
  );
}
