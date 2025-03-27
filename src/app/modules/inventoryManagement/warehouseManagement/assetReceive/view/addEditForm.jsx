


import React, { useState, useEffect } from "react";
import Form from "./form";
import {
  getSingleDataForEdit,
} from "../helper/Actions";
import ICustomCard from "../../../../_helper/_customCard";



export default function AssetReceiveViewForm({
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
      setRowDto(singleDataState?.objRow);
    }
  }, [singleDataState]);


  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <ICustomCard
        title="View Asset receive"
        backHandler={() => {
          history.goBack();
        }}
        renderProps={() => {}}
      >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={singleDataState?.objHeader}
          disableHandler={disableHandler}
          isEdit={id ? true : false}
          rowDto={rowDto}
        />
      </div>
    </ICustomCard>
  );
}
