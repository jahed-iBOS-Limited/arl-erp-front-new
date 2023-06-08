/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";
import IForm from "../../_helper/_form";
import Loading from "../../_helper/_loading";
import { _todayDate } from "../../_helper/_todayDate";
import Form from "./form";
import { getBusinessUnitDDL_api, GetDocNameDataById, GetDocNameFileById } from "./helper";

const initData = {
  documentName: "",
  unit: "",
  workplaceGroup: "",
  workplace: "",
  reminderDate: "",
  frequency: "",
  textEditorData: "",
};

const CreateDocument = () => {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const location = useLocation();

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [objProps, setObjprops] = useState({});
  const [unitDDL, setUnitDDL] = useState([]);
  const [, getCreateDocument, isLoading] = useAxiosPost();
  const [workplaceDDL, getWp, , setWorkplaceDDL] = useAxiosGet();
  const [workplaceGroupDDL, getWpGroup, , setWorkplaceGroupDDL] = useAxiosGet();
  const [isDisabled, setDisabled] = useState(false);
  // const [textEditorData, setTextEditorData] = useState({});

  //  attachment file
  const [attachmentFile, setAttachmentFile] = useState("");
  const [attachmentFileName, setAttachmentFileName] = useState(null);
  const [attachmentFileArray, setAttachmentFileArray] = useState([]);
  const [deletedRow, setDeletedRow] = useState([]);

  // single data state from id
  const [singleData, setSingleData] = useState({});

  const getDataById = () => {
    GetDocNameDataById(location?.state?.id, setSingleData, setDisabled);
    GetDocNameFileById(
      location?.state?.id,
      setAttachmentFileArray,
      setDisabled
    );
  };

  useEffect(() => {
    getBusinessUnitDDL_api(profileData?.userId, profileData?.accountId, setUnitDDL )
    // Get document name by id & File List By Registration id
    if (location?.state) {
      getDataById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const remover = (idx) => {
    const data = attachmentFileArray.filter((item, index) => index !== idx);
    setAttachmentFileArray(data);
  };

  function stripHtml(html) {
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  const API = `/hcm/SafetyAndCompliance/LegalDocumentALL`;

  const saveHandler = async (values, cb) => {
    let attachData = [...attachmentFileArray, ...deletedRow];

    const files = attachData?.map((item) => ({
      intDocumentNameFileId: item?.isDelete ? item?.intDocumentNameFileId : 0,
      intDocumentNameId: location?.state?.id ? location?.state?.id : 0,
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
        ? "UpdateLegalDocumentName"
        : "CreateLegalDocumentName",
      intDocumentId: location?.state?.id ? location?.state?.id : 0,
      strDocumentName: values?.documentName,
      intBusinessUnitId: values?.unit?.value,
      intSBUId: 0,
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      intWorkplaceId: values?.workplace?.value,
      dteNotifyReminderDate: values?.reminderDate,
      strFrequency: values?.frequency,
      isActive: true,
      dteCreatedAt: _todayDate(),
      intCreatedBy: profileData?.userId,
      dteUpdatedAt: _todayDate(),
      intUpdatedBy: profileData?.userId,
      strDescription: stripHtml(values?.textEditorData),
      strDescriptionHTML: values?.textEditorData,
      legalDocumentNameFileViewModel: files,
    };
    getCreateDocument(API, payload, cb, true);
  };

  return (
    <IForm
      title={"Create Document Name"}
      getProps={setObjprops}
      isDisabled={isLoading}
      isHiddenBack={false}
    >
      {isLoading && <Loading />}
      <Form
        {...objProps}
        initData={location?.state?.id ? singleData : initData}
        profileData={profileData}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        saveHandler={saveHandler}
        unitDDL={unitDDL}
        setUnitDDL={setUnitDDL}
        workplaceGroupDDL={workplaceGroupDDL}
        setWorkplaceGroupDDL={setWorkplaceGroupDDL}
        workplaceDDL={workplaceDDL}
        setWorkplaceDDL={setWorkplaceDDL}
        getWp={getWp}
        getWpGroup={getWpGroup}
        getDataById={getDataById}
        setAttachmentFile={setAttachmentFile}
        setAttachmentFileName={setAttachmentFileName}
        setAttachmentFileArray={setAttachmentFileArray}
        attachmentFileArray={attachmentFileArray}
        attachmentFileName={attachmentFileName}
        setDeletedRow={setDeletedRow}
        attachmentFile={attachmentFile}
        setDisabled={setDisabled}
        remover={remover}
        deletedRow={deletedRow}
        regId={location?.state?.id}
        singleData={singleData}
      />
    </IForm>
  );
};

export default CreateDocument;
