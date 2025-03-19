import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getMonthName } from "../../../../_helper/monthIdToMonthName";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import Form from "./form";

let initData = {
  month: "",
};

export function BudgetEntryView() {
  const { state } = useLocation();
  const history = useHistory();

  const saveHandler = async (values, cb) => {
    console.log("values");
  };

  const [objProps] = useState({});

  return (
    <div className={`global-card-header`}>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader
          title={`Budget Entry View of ${getMonthName(state?.intMonth)}, ${
            state?.intYear
          }`}
        >
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={() => {
                history.goBack();
              }}
              className={"btn btn-light"}
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            <Form
              {...objProps}
              initData={initData}
              saveHandler={saveHandler}
              state={state}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
