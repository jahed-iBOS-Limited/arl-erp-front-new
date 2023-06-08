import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { RoleExtensionTable } from "./businessUnitTableCard";

export function BusinessUnitLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Role Extension">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/domain-controll/role-extension/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <RoleExtensionTable />
      </CardBody>
    </Card>
  );
};
