import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import Form from "./form";
import { useParams } from "react-router";
import { createComplain, getComplainById, updateComplain } from "../helper";

const initData = {
  occurrenceDate: _todayDate(),
  respondentType: {
    value: 1,
    label: "Employee",
  },
  respondentName: "",
  respondentContact: "",
  issueType: "",
  issueTitle: "",
  distributionChannel: "",
  product: "",
  issueDetails: "",
  // new add
  occurrenceTime: "",
  respondentBusinessUnit: "",
  respondent: "",
  respondentOrg: "",
  designationOrRelationship: "",
  additionalCommentAndSuggestion: "",
  itemCategory: "",
  challanOrPO: "",
  deliveryDate: "",
  reference: "",
};

function ComplainForm() {
  const [singleData, setSingleData] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [fileObjects, setFileObjects] = useState([]);
  const { view, edit } = useParams();
  // get user profile data from store
  const {
    profileData: { accountId: accId, userId, userName },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    const payload = {
      complainId: +edit || 0,
      requestDateTime: values?.occurrenceDate || new Date(),
      complainCategoryId: values?.issueType?.value || 0,
      complainCategoryName: values?.issueType?.label || "",
      issueTitle: values?.issueTitle || "",
      accountId: accId,
      businessUnitId: buId,
      description: values?.issueDetails || "",
      attachment: values?.attachment || "",
      actionById: userId,
      statusRemarks: values?.issueDetails || "",
      contactNo: values?.respondentContact || "",
      respondentTypeId: values?.respondentType?.value || 0,
      respondentTypeName: values?.respondentType?.label || "",
      respondentId: values?.respondentName?.value || 0,
      respondentName: values?.respondentName?.label || "",
      itemId: values?.product?.value || 0,
      distributionChannelId: values?.distributionChannel?.value || 0,
      delegateToId: 0,
      statusId: 0,
      status: "",
      delegateDateTime: new Date(),
      complainNo: singleData?.complainNo || "",
      actionByName: userName,
      distributionChannelName: values?.distributionChannel?.label || "",
      respondentBusinessUnitId: values?.respondentBusinessUnit?.value || 0,
      respondentBusinessUnitIdName: values?.respondentBusinessUnit?.label || "",
      respondentOrg: values?.respondentOrg || "",
      strDesignationOrRelationship: values?.designationOrRelationship || "",
      commentAndSuggestion: values?.additionalCommentAndSuggestion || "",
      itemCategoryId: values?.itemCategory?.value || 0,
      itemCategoryName: values?.itemCategory?.label || "",
      challanOrPoId: values?.challanOrPO?.value || 0,
      challanOrPoName: values?.challanOrPO?.label || "",
      deliveryDate: values?.deliveryDate || "",
      reference: values?.reference || "",
      occurrenceTime: values?.occurrenceTime || "",
      
      sl: 0,
      itemName: "",
      delegateToName: "",
      delegateById: 0,
      delegateByName: "",
      investigatorAssignById: 0,
      investigatorAssignByName: {},
      investigatorAssignDate: "",
      finishDateTime: "",
      isActive: true,
      lastActionDateTime: new Date(),
      totalTime: "",
      isReopen: true,
      respondentType: "",
    };

    if (edit) {
      updateComplain(payload, setLoading);
    } else {
      createComplain(payload, setLoading, cb);
    }
  };

  useEffect(() => {
    if (edit || view) {
      const id = edit || view;
      getComplainById(id, accId, buId, setLoading, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit, view]);
  const isLoader = loading;

  return (
    <>
      {isLoader && <Loading />}
      <Form
        initData={singleData || initData}
        saveHandler={saveHandler}
        history={history}
        accId={accId}
        buId={buId}
        fileObjects={fileObjects}
        setFileObjects={setFileObjects}
        setLoading={setLoading}
        view={view}
      />
    </>
  );
}

export default ComplainForm;
