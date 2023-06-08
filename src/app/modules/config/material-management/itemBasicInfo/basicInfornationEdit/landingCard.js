import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import MainCollapsePanel from "./collapsableComponent/main";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { useHistory } from "react-router-dom";

export default function LandingCard() {
  let history = useHistory();
  const itemNameFromHistroy = history?.location?.state?.itemName;
  const itemCodeFromHistory = history?.location?.state?.itemCode;
  const itemNameFromCollapsed = history?.location?.state?.item?.itemName;
  const itemCodeFromCollapsed = history?.location?.state?.item?.itemCode;
  const backToPrevPage = () => {
    history.push(`/config/material-management/item-basic-info`);
  };
  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader
        title={`Edit item Info : [${itemNameFromHistroy ||
          itemNameFromCollapsed} - ${itemCodeFromHistory ||
          itemCodeFromCollapsed}]`}
      >
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToPrevPage}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="mt-3">
          <MainCollapsePanel />
        </div>
      </CardBody>
    </Card>
  );
}
