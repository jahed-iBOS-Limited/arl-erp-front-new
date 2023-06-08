/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { getSingleDataForEdit } from "../helper/Actions";
import ICustomCard from "../../../../_helper/_customCard";
import { getserviceReceiveImageFile_api } from "./../helper/Actions";

export default function ServiceReceiveViewForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);

  const [singleDataState, setSingleDataState] = useState([]);
  const [rowDto, setRowDto] = useState([]);

  // Get Single Data
  useEffect(() => {
    if (id) {
      getSingleDataForEdit(id, setSingleDataState);
    }
  }, []);

  useEffect(() => {
    if (singleDataState) {
      setRowDto(singleDataState.objRow);
    }
  }, [singleDataState]);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});



  return (
    <ICustomCard
      title="View service receive"
      backHandler={() => {
        history.goBack();
      }}
      renderProps={() => {}}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={singleDataState.objHeader}
          disableHandler={disableHandler}
          isEdit={id ? true : false}
          rowDto={rowDto}
       
        />
      </div>
    </ICustomCard>
  );
}
