import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

import { _todayDate } from "../../../../_helper/_todayDate";

import {
  createOutlateProfile,
  getOutletProfileById,
  editOutlateProfile,
  getFileListDDL,
  commonCollerCompanyDDL,
} from "../helper";
import ICustomCard from "../../../../_helper/_customCard";
import { operation } from "../../../../_helper/_commonApi";

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
  isColler: false,
  collerCompany: "",
};

export default function ViewOutletProfile() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [, setRowDto] = useState([]);

  const [outletData, setOutlet] = useState([]);
  const params = useParams();
  const [singleData, setSingleData] = useState("");
  const [imageDTO, setImageDTO] = useState([]);

  const [attributes, setAttributes] = useState([]);
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
    operation({
      profileData,
      selectedBusinessUnit,
      setAttributes,
      params,
      getOutletProfileById,
      setSingleData,
      setOutlet,
      cb: function () {
        getFileListDDL(params?.id, setImageDTO);
      },
    });
  }, []);

  const saveHandler = async (values, cb) => {
    setDisabled(true);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const attributeData = attributes.map((item) => {
          // const {} = item?.objAttribute
          const selectedValue = values[item?.objAttribute?.outletAttributeName];
          console.log(selectedValue);
          const find = outletData.find(
            (outlet) =>
              outlet.outletAttributeName ===
              item?.objAttribute?.outletAttributeName
          );
          // console.log(find)
          return {
            rowId: +find.rowId,
            attributeValueId: selectedValue?.value || 0,
            outletAttributeValueName:
              selectedValue?.label || selectedValue || "",
            attributeValueDate: "2021-01-11T05:41:45.587Z",
            actionBy: 0,
          };
        });

        const payload = {
          objProfile: {
            outletID: +params?.id,
            routeName: values.routeName?.label,
            outletName: values.outletName,

            ownerName: values.ownerName,
            mobileNumber: values.mobileNumber,
            businessType: values.businessType.value,
            dateOfBirth: values.dateOfBirth || "2021-01-11T05:41:45.587Z",
            marriageDate: values.marriageDate || "2021-01-11T05:41:45.587Z",
            emailAddress: values.emailAddress,
            latitude: values.lattitude,
            longitude: values.longitude,
            outletImagePath: "string",
            outletAddress: values.outletAddress,
            contactType: values.contactType,
            outletImagePathNew: "string",
          },
          objAttr: attributeData,
        };

        window.payload = payload;
        editOutlateProfile(payload);
      } else {
        const attributeData = attributes.map((item) => {
          // const {} = item?.objAttribute
          const selectedValue = values[item?.objAttribute?.outletAttributeName];
          console.log(selectedValue);
          return {
            outletAttributeId:
              selectedValue?.outletAttributeId ||
              item?.objAttribute?.outletAttributeId ||
              0,
            attributeValueId: selectedValue?.attributeValueId || 0,
            outletAttributeValueName:
              selectedValue?.outletAttributeValueName || selectedValue || "",
            attributeValueDate: "2021-01-11T05:41:45.587Z",
            actionBy: 0,
            lastActionDateTime: "2021-01-11T05:41:45.587Z",
          };
        });
        const payload = {
          outlet: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            routeId: values.routeName?.value,
            routeName: values.routeName?.label,
            outletName: values.outletName,
            ownerName: values.ownerName,
            mobileNumber: values.mobileNumber,
            businessType: values.businessType.value,
            dateOfBirth: values.dateOfBirth || "2021-01-11T05:41:45.587Z",
            marriageDate: values.marriageDate || "2021-01-11T05:41:45.587Z",
            emailAddress: values.emailAddress,
            latitude: values.lattitude,
            longitude: values.longitude,
            outletImagePath: "string",
            outletAddress: values.outletAddress,
            contactType: values.contactType,
            isProfileComplete: true,
            outletImagePathNew: "string",
          },
          attibute: attributeData,
        };

        createOutlateProfile(payload, cb);
      }
    } else {
      setDisabled(false);
    }
  };
  const history = useHistory();
  const backHandler = () => {
    history.goBack();
  };

  return (
    <ICustomCard
      title="View Outlet Profile"
      getProps={setObjprops}
      isDisabled={isDisabled}
      backHandler={backHandler}
      isHiddenSave
    >
      {/* {isDisabled && <Loading />} */}

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
        imageDTO={imageDTO}
        collerCompanyDDL={collerCompanyDDL}
      />
    </ICustomCard>
  );
}
