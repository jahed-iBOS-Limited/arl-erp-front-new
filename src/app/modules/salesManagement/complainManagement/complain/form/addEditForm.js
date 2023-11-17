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
};

function ComplainForm() {
  const [singleData, setSingleData] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [fileObjects, setFileObjects] = useState([]);
  const { view, edit } = useParams();
  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
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
      delegateDateTime: new Date()
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
