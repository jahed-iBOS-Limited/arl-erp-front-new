import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { PartnerTable } from "./partnerTableCard";

export function PartnerLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <ModalProgressBar />
      <CardHeader title="Partner Information">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/partner-management/partner-basic-info/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <PartnerTable />
      </CardBody>
    </Card>
  );
}
