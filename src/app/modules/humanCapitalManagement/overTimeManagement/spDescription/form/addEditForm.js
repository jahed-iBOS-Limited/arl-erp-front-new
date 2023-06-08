import React, { useState, useEffect } from "react";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getDocumentDetails,
  getDocumentTypeDDL,
  saveAllDevDocumentDetails,
} from "../helper";

let initData = {
  documentType: "",
  documentTypeTwo: "",
  systemDefineName: "",
  displayName: "",
  description: "",
};

export function SpDescriptionFrom({
  history,
  match: {
    params: { id },
  },
}) {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [documentTypeDDL, setDocumentTypeDDL] = useState([]);
  const [documentDetails, setDocumentDetails] = useState([]);
  const [documentId, setDocumentId] = useState(0);

  useEffect(() => {
    getDocumentTypeDDL(setDocumentTypeDDL);
  }, []);

  const saveHandler = async (values, cb) => {
    if (documentId > 0) {
      let saveData = {
        intId: documentId,
        intDocumentTypeId: values?.documentType?.value,
        strDocumentTypeName: values?.documentType?.label,
        strSystemName: values?.systemDefineName,
        strDisplayName: values?.displayName,
        strDescription: values?.description,
      };

      const callBack = () => {
        getDocumentDetails(setDocumentDetails, values?.documentTypeTwo?.value);
      };

      saveAllDevDocumentDetails(saveData, callBack);
      cb && cb();
    } else {
      let saveData = {
        intId: documentId,
        intDocumentTypeId: values?.documentType?.value,
        strDocumentTypeName: values?.documentType?.label,
        strSystemName: values?.systemDefineName,
        strDisplayName: values?.displayName,
        strDescription: values?.description,
      };

      saveAllDevDocumentDetails(saveData, cb);
      cb && cb();
    }
  };

  console.log("normal", documentId);

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Sp Description"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          documentTypeDDL={documentTypeDDL}
          setDocumentTypeDDL={setDocumentTypeDDL}
          getDocumentTypeDDL={getDocumentTypeDDL}
          documentDetails={documentDetails}
          setDocumentDetails={setDocumentDetails}
          setDocumentId={setDocumentId}
          documentId={documentId}
        />
      </div>
    </IForm>
  );
}
