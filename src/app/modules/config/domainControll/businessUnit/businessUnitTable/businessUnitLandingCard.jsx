import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { BusinessUnitTable } from "./businessUnitTableCard";

export function BusinessUnitLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Business Unit">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/domain-controll/business-unit/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <BusinessUnitTable />
      </CardBody>
    </Card>
  );
}
