/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
// import { createPurchase, getSinglePurchase, editPurchase } from "../helper";
import { useParams } from "react-router-dom";

import { _todayDate } from "../../../../_helper/_todayDate";

import {
  getOutletProfileById,
  GetOutletProfileTypeAttributes,
  editOutlateProfile,
  getBeatApiDDL,
  Attachment_action,
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

export default function OutlateProfileEditFrom() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);

  const [outletData, setOutlet] = useState([]);
  const params = useParams();
  const [singleData, setSingleData] = useState("");
  const [beatNameDDL, setBeatNameDDL] = useState("");
  const [collerCompanyDDL, isCollerCompany] = useState([]);

  const [attributes, setAttributes] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);

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

  // useEffect(() => {
  //   if (params?.id) {
  //     getBeatApiDDL(singleData?.routeName?.value, setBeatNameDDL);
  //   }
  // }, [params?.id, singleData]);

  useEffect(() => {
    // if ((profileData.accountId, selectedBusinessUnit.value)) {
    //   GetOutletProfileTypeAttributes(
    //     profileData.accountId,
    //     selectedBusinessUnit.value,
    //     setAttributes
    //   );
    // }
    operation();
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const attributeData = attributes.map((item) => {
          const selectedValue = values[item?.objAttribute?.outletAttributeName];
          //console.log(item);
          const find = outletData.find(
            (outlet) =>
              outlet.outletAttributeName ===
              item?.objAttribute?.outletAttributeName
          );
          return {
            rowId: +find?.rowId || 0,
            outletId: +params.id || 0,
            outletName: singleData.outletName || "",
            outletAttributeId: item.objAttribute.outletAttributeId || 0,
            attributeValueId: selectedValue?.value || 0,
            outletAttributeValueName: selectedValue?.label || "",
            attributeValueDate: _todayDate(),
          };
        });

        const payload = {
          objProfile: {
            outletID: +params?.id || 0,
            strOwnerName: values?.ownerName || "",
            strOutletAddress: values?.outletAddress || "",
            maritatualStatusId: values?.marrigeSatus?.value || 0,
            maritatualStatus: values?.marrigeSatus?.label || "",
            actionBy: profileData?.userId || 0,
            dateOfBirth: values?.dateOfBirth || null,
            marriageDate: values?.marriageDate || null,
            emailAddress: values?.emailAddress || "",
            latitude: values?.lattitude || "",
            longitude: values?.longitude || "",
            outletImagePath: values?.attachment || "",
            contactType: values?.contactType || "",
            // outletImagePathNew: "string",
            isProfileComplete: values.isComplete,
            maxSalesItem: values?.maxSales?.value || 0,
            maxSalesItemName: values?.maxSales?.label || "",
            tradeLicenseNo: values?.tradeLicense || "",
            ownerNIDNo: values?.ownerNid || "",
            monMonthlyAvgSales: +values?.avgSalesAmount || 0,
            cooler: values?.isColler ? values?.isColler : false,
            coolerCompanyId: values?.collerCompany
              ? values?.collerCompany?.value
              : 0,
            coolerCompanyName: values?.collerCompany
              ? values?.collerCompany?.label
              : " ",
          },
          objAttr: attributeData,
        };
        editOutlateProfile(payload, setDisabled);
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
        fileObjects={fileObjects}
        setFileObjects={setFileObjects}
        outletId={params?.id}
        collerCompanyDDL={collerCompanyDDL}
      />
    </IForm>
  );
}
