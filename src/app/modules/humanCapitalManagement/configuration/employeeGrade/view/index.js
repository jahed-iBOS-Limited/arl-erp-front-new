/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"
import { useHistory } from "react-router-dom";

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";

import { ViewTable } from "./ViewTable";

function EmployeeGradeView() {
  const history = useHistory()

  const backHandler = () => {
    history.goBack();
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="View Employee Grade">
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="mt-0">
          <ViewTable />
        </div>
      </CardBody>
    </Card>
  );
}

export default EmployeeGradeView;
