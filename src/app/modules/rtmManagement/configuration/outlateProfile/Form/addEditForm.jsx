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
  GetOutletProfileTypeAttributes,
  editOutlateProfile,
  getBeatApiDDL,
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
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      isCollerCompany([
        { value: 1, label: "AFBL" },
        { value: 2, label: "PEPSI" },
        { value: 3, label: "COCA-COLA" },
        { value: 4, label: "OTHERS" },
      ]);
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (params?.id) {
      // getOutletProfileById(params?.id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const operation = async () => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      await GetOutletProfileTypeAttributes(
        profileData.accountId,
        selectedBusinessUnit.value,
        setAttributes
      );
    }

    if (params?.id) {
      await getOutletProfileById(params?.id, setSingleData, setOutlet);
    }
  };

  useEffect(() => {
    if (params?.id) {
      getBeatApiDDL(singleData?.routeName?.value, setBeatNameDDL);
    }
  }, [params?.id, singleData]);

  useEffect(() => {
    // if ((profileData.accountId, selectedBusinessUnit.value)) {
    //   GetOutletProfileTypeAttributes(
    //     profileData.accountId,
    //     selectedBusinessUnit.value,
    //     setAttributes
    //   );
    // }
    operation();
    navigator.geolocation.getCurrentPosition(function(position) {
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
