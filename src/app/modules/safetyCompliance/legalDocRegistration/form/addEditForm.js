/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import { getBusinessUnitDDL_api } from "../../createDocument/helper";
import {
  GetLegalDocFileListById,
  GetLegalDocRegDataById,
  saveLegalDocumentRegistration
} from "../helper";
import Form from "./form";
import "./form.css";

let initData = {
  unit: "",
  workplaceGroup: "",
  workplace: "",
  documentName: "",
  renewalType: "",
  documentNo: "",
  contPerson: "",
  authority: "",
  address: "",
  renewalDate: "",
  expiryDate: "",
  documentStatus: "",
  lastUpdatedDate: "",
  // checkBox: "",
  remarks: "",
};

export function LegalDocRegistration() {
  const [isDisabled, setDisabled] = useState(false);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const location = useLocation();

  const [unitDDL, setUnitDDL] = useState([]);

  //  attachment file
  const [attachmentFile, setAttachmentFile] = useState("");
  const [attachmentFileName, setAttachmentFileName] = useState(null);
  const [attachmentFileArray, setAttachmentFileArray] = useState([]);
  const [businessUnit, setBusinessUnit] = useState(null);
  const [deletedRow, setDeletedRow] = useState([]);

  // single data state from id
  const [singleData, setSingleData] = useState({});

  const getDataById = () => {
    GetLegalDocRegDataById(location?.state?.id, setSingleData, setDisabled);
    GetLegalDocFileListById(
      location?.state?.id,
      setAttachmentFileArray,
      setDisabled
    );
  };

  useEffect(() => {
    getBusinessUnitDDL_api(profileData?.userId, profileData?.accountId, setUnitDDL )
    // Get document registration by id & File List By Registration id
    if (location?.state) {
      getDataById();
    }
  }, [profileData]);

  const remover = (idx) => {
    const data = attachmentFileArray.filter((item, index) => index !== idx);
    setAttachmentFileArray(data);
  };

  const saveHandler = (values, cb) => {
    // if (attachmentFileArray.length < 1)
    //   return toast.warn("Please add at least one row");

    let attachData = [...attachmentFileArray, ...deletedRow];

    const files = attachData?.map((item) => ({
      id: item?.isDelete ? item?.id : 0,
      intLegalDocumentRegId: location?.state?.id ? location?.state?.id : 0,
      strFileUrl:
        location?.state?.id && item?.strFileUrl
          ? item?.strFileUrl
          : item?.id || "",
      isActive: true,
      dteCreatedAt: _todayDate(),
      intCreatedBy: profileData?.userId,
      dteUpdatedBy: _todayDate(),
      intUpdatedBy: profileData?.userId,
      isDelete: item?.isDelete,
      isCreate: item?.isCreate,
    }));

    const payload = {
      strPartType: location?.state?.id
        ? "UpdateLegalDocumentRegistration"
        : "LegalDocumentRegistration",
      intBusinessUnitId: values?.unit?.value,
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      intWorkplaceId: values?.workplace?.value,
      intSBUId: 0,
      // strStatus: values?.checkBox ? "Applied" : "Updated",
      isActive: true,
      dteCreatedAt: _todayDate(),
      intCreatedBy: profileData?.userId,
      dteUpdatedAt: _todayDate(),
      intUpdatedBy: profileData?.userId,
      intLegalDocumentRegId: location?.state?.id ? location?.state?.id : 0,
      intLegalDocumentNameId: values?.documentName?.value,
      intEmployeeId: values?.contPerson?.value,
      strAuthorNameNAddress: values?.authority,
      dteRenewalDate: values?.renewalDate,
      dteExpiryDate: values?.expiryDate,
      strReferenceNo: values?.documentNo,
      dteLastUpdateDate: values?.lastUpdatedDate,
      strRenualType: values?.renewalType?.label,
      strAddressNCity: values?.address,
      strDocumentStatus: values?.documentStatus?.value,
      strRemarks: values?.remarks,
      legalDocumentFileViewModel: files,
    };
    saveLegalDocumentRegistration(payload, setDisabled, cb);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Legal Document Registration"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={location?.state?.id ? singleData : initData}
          saveHandler={saveHandler}
          unitDDL={unitDDL}
          remover={remover}
          setAttachmentFile={setAttachmentFile}
          attachmentFile={attachmentFile}
          businessUnit={businessUnit}
          setBusinessUnit={setBusinessUnit}
          attachmentFileArray={attachmentFileArray}
          setAttachmentFileArray={setAttachmentFileArray}
          attachmentFileName={attachmentFileName}
          setAttachmentFileName={setAttachmentFileName}
          regId={location?.state?.id}
          getDataById={getDataById}
          setDisabled={setDisabled}
          deletedRow={deletedRow}
          setDeletedRow={setDeletedRow}
        />
      </div>
    </IForm>
  );
}
