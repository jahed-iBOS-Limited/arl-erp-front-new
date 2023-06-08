/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { isUniq } from "../../../../_helper/uniqChecker";
import Loading from "../../../../_helper/_loading";
import { saveDocumentType, getSingleDataById, saveEditedDocumentType } from './../helper';

const initData = {
  documnetType: "",
};

export default function CreateDocumentTypeForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const params = useParams();


  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

    useEffect(() => {
      if (params?.id) {
        getSingleDataById(params?.id, setSingleData);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);


  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (params?.id) {
        const payload = {
          accountId: +profileData?.accountId,
          docTypeId: +params?.id,
          docType: values?.documnetType,
          isActive: true,
        };
        saveEditedDocumentType(payload, setDisabled);
      } else {
        const payload = {
          docType: values?.documnetType,
          accountId: +profileData?.accountId,
          isActive: true,
          actionBy: +profileData?.userId,
          lastActionDateTime: "2021-03-07T09:19:07.514Z",
        };
        saveDocumentType(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };


  return (
    <IForm
      title={params?.id ? "Edit Document Type" : "Create Document Type"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        isEdit={params?.id || false}
        id={params?.id}
        setRowDto={setRowDto}
      />
    </IForm>
  );
}
