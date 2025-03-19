import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { SBUTable } from "./SbuTableCard";

export function SBULandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="SBU">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/financial-management/configuration/sbu/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <SBUTable />
      </CardBody>
    </Card>
  );
}
