/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import { useHistory, useParams } from "react-router-dom";

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { fetchSingleData } from "../helper/Actions";

import { ViewTable } from "./ViewTable";

function EmpPositionGroupView() {

  const history = useHistory();
  let { id } = useParams();

  const [singleData, setSingleData] = useState([]);

  const backHandler = () => {
    history.goBack();
  };

  useEffect(()=> {
    if(id) {
      fetchSingleData(id, setSingleData)
    }
  }, [])

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="View Employee Position Group">
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="mt-0">
          <ViewTable singleData={singleData} />
        </div>
      </CardBody>
    </Card>
  );
}

export default EmpPositionGroupView;
