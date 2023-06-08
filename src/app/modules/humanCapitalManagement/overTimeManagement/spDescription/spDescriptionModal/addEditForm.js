import React, { useState } from "react";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { addDocumentType } from "../helper";
import { toast } from "react-toastify";

let initData = {
  documentType: "",
};

export function SpDescriptionModal({ setDocumentTypeDDL, getDocumentTypeDDL }) {
  const [objProps, setObjprops] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [documentType, setDocumentType] = useState([]);

  const saveHandler = async () => {
    if (documentType.length) {
      const saveData = documentType.map((item) => ({
        intId: 0,
        strName: item.name,
      }));
      const cb = () => {
        getDocumentTypeDDL(setDocumentTypeDDL);
      };
      addDocumentType(saveData, cb);
      setDocumentType([]);
    } else {
      toast.warn("Please insert at least one data");
    }
  };

  const addHandler = (name) => {
    let modifyObj = { name, id: 0 };
    let newArray = [...documentType];
    let findingData = newArray.find(
      (data) =>
        data?.name.trim().toLowerCase() === modifyObj?.name.trim().toLowerCase()
    );
    if (findingData) {
      toast.warn("Data Already Exist");
    } else {
      newArray.push(modifyObj);
    }
    setDocumentType([...newArray]);
  };

  const removeHandler = (id) => {
    setDocumentType(documentType.filter((itm, idx) => idx !== id));
  };

  return (
    <IForm
      title={"Sp Description Modal"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          documentType={documentType}
          setDocumentType={setDocumentType}
          addHandler={addHandler}
          removeHandler={removeHandler}
        />
      </div>
    </IForm>
  );
}
