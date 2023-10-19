import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import Form from "./form";
import { useParams } from "react-router";
import { createComplain, getComplainById, updateComplain } from "../helper";

const initData = {
  requestDateTime: _todayDate(),
  customerName: "",
  complainByName: "",
  contactNo: "",
  complainCategoryName: "",
  issueTitle: "",
  remarks: "",
  attachment: "",
};

function ComplainForm() {
  const [singleData, setSingleData] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [fileObjects, setFileObjects] = useState([]);
  const { id } = useParams();
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
      assignTo: 0,
      assignToName: "",
      assignBy: 0,
      statusId: 0,
      status: "",
      remarks: values?.remarks || " ",
      complainByName: values?.complainByName || "",
      contactNo: values?.contactNo || "",
      complainId: +id || 0,
      complainByClient: "",
    };

    if (id) {
      updateComplain(payload, setLoading);
    } else {
      createComplain(payload, setLoading, cb);
    }
  };

  useEffect(() => {
    if (id) {
      getComplainById(id, setLoading, setSingleData);
    }
  }, [id]);
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
      />
    </>
  );
}

export default ComplainForm;
