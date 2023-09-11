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
      <CardHeader title="Business Partner Basic Info">
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
          <button
            type="button"
            className="btn btn-primary ml-5"
            onClick={() =>
              history.push("/config/partner-management/partner-basic-info/bulk-upload")
            }
          >
            Bulk Upload
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <PartnerTable />
      </CardBody>
    </Card>
  );
}
