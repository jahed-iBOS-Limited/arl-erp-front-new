/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import Loading from "../../../../../helper/loading/_loading";
import { getBankDDL } from "../../../helper";
import { CreateOwnerInfo, EditOwnerInfo, GetOwnerInfoById } from "../helper";
import Form from "./form";

const initData = {
  ownerName: "",
  companyName: "",
  companyAddress: "",
  ownerEmail: "",
  contactNumber: "",
  ownerNidNo: "",
  isOwnCompany: false,
  ownerBankAccount: "",
  bankName: "",
};

export default function OwnerInfoForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [uploadImage, setUploadImage] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      GetOwnerInfoById(id, setLoading, setSingleData);
    }
  }, [profileData, selectedBusinessUnit, id]);

  useEffect(() => {
    getBankDDL(setBankDDL);
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    if (id) {
      const data = {
        ownerId: id,
        ownerName: values?.ownerName || "",
        ownerEmail: values?.ownerEmail,
        contactNumber: values.contactNumber,
        companyName: values.companyName,
        ownerNidNo: values.ownerNidNo,
        companyAddress: values.companyAddress,
        insertby: profileData.userId,
        filePath: uploadImage[0]?.id || "",
        isOwnCompany: values.isOwnCompany,

        ownerBankAccount: values?.ownerBankAccount,
        bankId: values?.bankName?.value,
        bankName: values?.bankName?.label,
        bankAddress: values?.bankName?.address,
        swiftCode: values?.bankName?.code,
      };
      EditOwnerInfo(data, setLoading);
    } else {
      const payload = {
        ownerName: values?.ownerName || "",
        ownerEmail: values?.ownerEmail,
        companyName: values?.companyName,
        ownerNidNo: values?.ownerNidNo,
        contactNumber: values?.contactNumber,
        companyAddress: values?.companyAddress,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        filePath: uploadImage[0]?.id || "",
        ownCompany: values?.isOwnCompany,

        ownerBankAccount: values?.ownerBankAccount,
        bankId: values?.bankName?.value,
        bankName: values?.bankName?.label,
        bankAddress: values?.bankName?.address,
        swiftCode: values?.bankName?.code,
      };
      CreateOwnerInfo(payload, setLoading, cb);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "view"
            ? "View Ship Owner"
            : type === "edit"
            ? "Edit Ship Owner"
            : "Create Ship Owner"
        }
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        setUploadImage={setUploadImage}
        setLoading={setLoading}
        bankDDL={bankDDL}
        setBankDDL={setBankDDL}
      />
    </>
  );
}
