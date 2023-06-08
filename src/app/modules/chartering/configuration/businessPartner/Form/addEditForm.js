/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";

import {
  createStakeholder,
  getStakeholderType,
  updateStakeholder,
  GetStakeholderById,
  getBusinessPartnerList,
} from "../helper";
import Form from "./form";
import { getBankDDL, GetCountryDDL } from "../../../helper";
import Loading from "../../../_chartinghelper/loading/_loading";

const initData = {
  companyName: "",
  picname: "",
  stakeholderType: "",
  port: "",
  mobileNo: "",
  email: "",
  country: "",
  address: "",
  bankName: "",
  bankAccountNo: "",
  bankAddress: "",
  swiftCode: "",
  ibancode: "",

  businessPartner: "",
};

export default function BusinessPartnerForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [stakeholderTypeDDL, setStakeholderTypeDDL] = useState([]);
  const [countryDDL, setCountryDDL] = useState([]);
  const [singleData, setSingleData] = useState(initData);
  const [bankDDL, setBankDDL] = useState([]);
  const [businessPartnerDDL, setBusinessPartnerDDL] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetCountryDDL(setCountryDDL);
    getStakeholderType(setStakeholderTypeDDL);
    getBankDDL(setBankDDL);

    getBusinessPartnerList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBusinessPartnerDDL
    );

    if (id) {
      GetStakeholderById(id, setLoading, setSingleData);
    }
  }, [profileData, selectedBusinessUnit, id]);

  const saveHandler = (values, cb) => {
    if (id) {
      const data = {
        stakeholderId: id,
        compnayName: values?.companyName,
        picname: values?.picname,
        stakeholderTypeId: values?.stakeholderType?.value,
        stakeholderTypeName: values?.stakeholderType?.label,
        portId: values?.port?.value,
        portName: values?.port?.label,
        mobileNo: values?.mobileNo,
        email: values?.email,
        country: values?.country?.value,
        countryName: values?.country?.label,
        address: values?.address,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        bankId: 0,
        bankName: values?.bankName,
        bankAddress: values?.bankAddress,
        swiftCode: values?.swiftCode,
        ibancode: values?.ibancode,
        bankAccountNo: values?.bankAccountNo,
        bisPartnerId: values?.businessPartner?.value,
        bisPartnerName: values?.businessPartner?.label,
      };
      updateStakeholder(data, setLoading);
    } else {
      const payload = {
        compnayName: values?.companyName,
        picname: values?.picname,
        stakeholderTypeId: values?.stakeholderType?.value,
        stakeholderTypeName: values?.stakeholderType?.label,
        portId: values?.port?.value,
        portName: values?.port?.label,
        mobileNo: values?.mobileNo,
        email: values?.email,
        country: values?.country?.value,
        countryName: values?.country?.label,
        address: values?.address,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        bankId: 0,
        bankName: values?.bankName,
        bankAddress: values?.bankAddress,
        swiftCode: values?.swiftCode,
        ibancode: values?.ibancode,
        bankAccountNo: values?.bankAccountNo,
        bisPartnerId: values?.businessPartner?.value,
        bisPartnerName: values?.businessPartner?.label,
      };
      createStakeholder(payload, setLoading, cb);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "edit"
            ? "Edit Business Partner"
            : type === "view"
            ? "View Business Partner"
            : "Create Business Partner"
        }
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        stakeholderTypeDDL={stakeholderTypeDDL}
        countryDDL={countryDDL}
        bankDDL={bankDDL}
        setBankDDL={setBankDDL}
        businessPartnerDDL={businessPartnerDDL}
      />
    </>
  );
}
