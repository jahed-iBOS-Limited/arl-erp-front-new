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
  respondentType: "",
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
    profileData: { accountId: accId, userId, accountName },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    const payload = {
      requestDateTime: values?.requestDateTime || new Date(),
      complainCategoryId: values?.complainCategoryName?.value || 0,
      complainCategoryName: values?.complainCategoryName?.label || "",
      issueTitle: values?.issueTitle || "",
      accountId: accId,
      accountName: accountName,
      customerId: values?.customerName?.value || 0,
      customerName: values?.customerName?.label || "",
      description: values?.remarks || "",
      attachment: values?.attachment || "",
      actionById: userId,
      assignTo: singleData?.assignTo || 0,
      assignToName: singleData?.assignToName || "",
      assignBy: 0,
      statusId: singleData?.statusId,
      status: singleData?.status || "",
      contactNo: values?.contactNo || "",
      complainId: +edit || 0,
      complainByClient: "",
      // new field
      leadId: 0,
      complainNo: singleData?.complainNo || "",
      businessUnitId: buId,
      assignDateTime: new Date(),
      finishDateTime: new Date(),
      isActive: true,
      statusRemarks: values?.remarks || " ",
      intComplainByEmployee: 0,
      strComplainByEmployee: values?.complainByName || "",
      lastActionDateTime: new Date(),
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
